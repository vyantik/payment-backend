import { Injectable, NotFoundException } from '@nestjs/common'
import { BillingPeriod, PaymentProvider, User } from '@prisma/client'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { InitPaymentsRequest } from './dto'
import { CryptoService } from './provider/crypto/crypto.service'
import { YoomoneyService } from './provider/yoomoney/yoomoney.service'

@Injectable()
export class PaymentsService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly yoomoneyService: YoomoneyService,
		private readonly cryptoService: CryptoService,
	) { }

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

		const transaction = await this.prismaService.transactions.create({
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
					connectOrCreate: {
						where: {
							userId: user.id,
						},
						create: {
							plan: {
								connect: {
									id: plan.id,
								},
							},
							user: {
								connect: {
									id: user.id,
								},
							},
						},
					},
				},
			},
		})

		let payment

		switch (provider) {
			case PaymentProvider.YOOKASSA:
				payment = await this.yoomoneyService.create(plan, transaction)
			case PaymentProvider.CryptoPay:
				payment = await this.cryptoService.create(plan, transaction)
		}

		await this.prismaService.transactions.update({
			where: {
				id: transaction.id,
			},
			data: {
				providerMeta: payment,
			},
		})

		return payment
	}
}
