import { Injectable, NotFoundException } from '@nestjs/common'
import { BillingPeriod, User } from '@prisma/client'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { InitPaymentsRequest } from './dto'

@Injectable()
export class PaymentsService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async getHistory(user: User) {
		const payments = await this.prismaService.transactions.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				subscription: {
					include: {
						plan: true,
					},
				},
			},
		})

		const formattedPayments = payments.map(payment => ({
			id: payment.id,
			createdAt: payment.createdAt,
			plan: payment.subscription.plan.title,
			amount: payment.amount,
			provider: payment.paymentProvider,
			status: payment.transactionStatus,
		}))

		return formattedPayments
	}

	public async init(dto: InitPaymentsRequest, user: User) {
		const { billingPeriod, provider, planId } = dto

		const plan = await this.prismaService.plan.findUnique({
			where: {
				id: planId,
			},
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		const amount =
			billingPeriod === BillingPeriod.MONTHLY
				? plan.monthlyPrice
				: plan.yearlyPrice

		return await this.prismaService.transactions.create({
			data: {
				amount,
				paymentProvider: provider,
				billingPeriod,
				user: {
					connect: {
						id: user.id,
					},
				},
				subscription: {
					create: {
						user: {
							connect: {
								id: user.id,
							},
						},
						plan: {
							connect: {
								id: plan.id,
							},
						},
					},
				},
			},
		})
	}
}
