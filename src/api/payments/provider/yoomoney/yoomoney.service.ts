import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
	Plan,
	Transactions,
	TransactionStatus,
	type User,
} from '@prisma/client'
import CIDR from 'ip-cidr'
import {
	ConfirmationEnum,
	CurrencyEnum,
	PaymentMethodsEnum,
	YookassaService,
} from 'nestjs-yookassa'
import { VatCodesEnum } from 'nestjs-yookassa/dist/interfaces/receipt-details.interface'

import type { PaymentWebhookResult } from '../../interfaces'
import { YookassaWebhookDto } from '../../webhook/dto'

@Injectable()
export class YoomoneyService {
	private readonly REDIRECT_URL: string
	private readonly ALLOWED_IPS: string[]

	public constructor(
		private readonly yookassaService: YookassaService,
		configService: ConfigService,
	) {
		this.REDIRECT_URL = configService.getOrThrow<string>(
			'YOOMONEY_REDIRECT_URL',
		)
		this.ALLOWED_IPS = [
			'185.71.76.0/27',
			'185.71.77.0/27',
			'77.75.153.0/25',
			'77.75.156.11',
			'77.75.156.35',
			'77.75.154.128/25',
			'2a02:5180::/32',
		]
	}

	public async create(plan: Plan, transaction: Transactions) {
		const payment = await this.yookassaService.createPayment({
			amount: {
				value: transaction.amount,
				currency: CurrencyEnum.RUB,
			},
			description: `Payment for subscription on ${plan.title}`,
			payment_method_data: {
				type: PaymentMethodsEnum.bank_card,
			},
			confirmation: {
				type: ConfirmationEnum.redirect,
				return_url: this.REDIRECT_URL,
			},
			save_payment_method: true,
			metadata: {
				transactionId: transaction.id,
				planId: plan.id,
			},
		})

		return payment
	}

	public async createBySavedCard(
		plan: Plan,
		user: User,
		transaction: Transactions,
	) {
		const payment = await this.yookassaService.createPayment({
			amount: {
				value: transaction.amount,
				currency: CurrencyEnum.RUB,
			},
			description: `Payment for subscription on ${plan.title}`,
			receipt: {
				customer: {
					email: user.email,
				},
				items: [
					{
						description: `Payment for subscription on ${plan.title}`,
						quantity: 1,
						amount: {
							value: transaction.amount,
							currency: CurrencyEnum.RUB,
						},
						vat_code: VatCodesEnum.ndsNone,
					},
				],
			},
			payment_method_id: transaction.externalId ?? '',
			capture: true,
			save_payment_method: true,
			metadata: {
				transactionId: transaction.id,
				planId: plan.id,
			},
		})

		return payment
	}

	public verifyWebhook(ip: string) {
		for (const allowedIp of this.ALLOWED_IPS) {
			if (allowedIp.includes('/')) {
				const cidr = new CIDR(allowedIp)
				if (cidr.contains(ip)) return
			} else if (ip === allowedIp) {
				return
			}
		}
		throw new UnauthorizedException(`Invalid IP: ${ip}`)
	}

	public async handleWebhook(
		dto: YookassaWebhookDto,
	): Promise<PaymentWebhookResult> {
		const transactionId = dto.object.metadata?.transactionId
		const planId = dto.object.metadata?.planId
		const paymentId = dto.object.id

		let status: TransactionStatus = TransactionStatus.PENDING
		switch (dto.event) {
			case 'payment.waiting_for_capture':
				await this.yookassaService.capturePayment(paymentId)
				break
			case 'payment.succeeded':
				status = TransactionStatus.SUCCESS
				break
			case 'payment.canceled':
				status = TransactionStatus.FAILED
				break
		}
		return {
			transactionId,
			planId,
			paymentId,
			transactionStatus: status,
			raw: dto,
		}
	}
}
