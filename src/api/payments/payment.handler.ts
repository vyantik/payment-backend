import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import {
	BillingPeriod,
	SubscriptionStatus,
	TransactionStatus,
} from '@prisma/client'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { MailService } from 'src/libs/mail/mail.service'

import type { PaymentWebhookResult } from './interfaces'

@Injectable()
export class PaymentHandler {
	private readonly logger = new Logger(PaymentHandler.name)

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
	) {}

	public async processResult({
		transactionId,
		planId,
		paymentId,
		transactionStatus,
		raw,
	}: PaymentWebhookResult) {
		const transaction = await this.prismaService.transactions.findUnique({
			where: {
				id: transactionId,
			},
			include: {
				subscription: {
					include: {
						plan: true,
						user: true,
					},
				},
			},
		})

		if (!transaction) throw new NotFoundException('Transaction not found')

		await this.prismaService.transactions.update({
			where: {
				id: transaction.id,
			},
			data: {
				transactionStatus,
				externalId: paymentId,
				providerMeta: raw,
			},
		})

		const subscription = transaction.subscription

		if (transactionStatus === TransactionStatus.SUCCESS && subscription) {
			const now = new Date()
			const isPlanChanged = subscription.plan.id !== planId

			let baseDate: Date

			if (
				!subscription.endDate ||
				subscription.endDate < now ||
				isPlanChanged
			) {
				baseDate = new Date(now)
			} else {
				baseDate = new Date(subscription.endDate)
			}

			let newEndDate = new Date(baseDate)

			if (transaction.billingPeriod === BillingPeriod.YEARLY)
				newEndDate.setFullYear(newEndDate.getFullYear() + 1)
			else {
				const currentDay = newEndDate.getDate()
				newEndDate.setMonth(newEndDate.getMonth() + 1)

				if (newEndDate.getDate() !== currentDay) newEndDate.setDate(0)
			}

			await this.prismaService.userSubscription.update({
				where: {
					id: subscription.id,
				},
				data: {
					status: SubscriptionStatus.ACTIVE,
					startDate: now,
					endDate: newEndDate,
					plan: {
						connect: {
							id: planId,
						},
					},
				},
			})

			await this.mailService.sendPaymentSuccessMail(
				subscription.user,
				transaction,
			)

			this.logger.log(`✅ Payment succeeded: ${subscription.user.email}`)
		} else if (transactionStatus === TransactionStatus.FAILED) {
			await this.prismaService.userSubscription.update({
				where: {
					id: subscription.id,
				},
				data: {
					status: SubscriptionStatus.EXPIRED,
				},
			})

			this.logger.error(`❌ Payment failed: ${subscription.user.email}`)
		}

		return {
			ok: true,
		}
	}
}
