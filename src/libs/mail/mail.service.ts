import { type ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Transactions, User } from '@prisma/client'
import { render } from '@react-email/components'
import { Queue } from 'bullmq'

import {
	PaymentFailedTemplate,
	PaymentSuccessTemplate,
	SubscriptionExpiredTemplate,
} from './templates'

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name)

	private readonly APP_URL: string

	public constructor(
		private readonly mailerService: MailerService,
		@InjectQueue('mail') private readonly mailQueue: Queue,
		configService: ConfigService,
	) {
		this.APP_URL = configService.getOrThrow<string>('HTTP_CORS')
	}

	public async sendPaymentFailedMail(user: User, transaction: Transactions) {
		const html = await render(PaymentFailedTemplate({ transaction }))
		this.logger.log(`📧 Sending payment failed mail to ${user.email}`)

		await this.mailQueue.add(
			'send-mail',
			{
				email: user.email,
				subject: 'Payment failed',
				html,
			},
			{
				removeOnComplete: true,
			},
		)
	}

	public async sendSubscriptionExpiredMail(user: User) {
		const accountUrl = `${this.APP_URL}/dashboard`

		const html = await render(SubscriptionExpiredTemplate({ accountUrl }))
		this.logger.log(`📧 Sending payment failed mail to ${user.email}`)

		await this.mailQueue.add(
			'send-mail',
			{
				email: user.email,
				subject: 'Subscription expired',
				html,
			},
			{
				removeOnComplete: true,
			},
		)
	}

	public async sendPaymentSuccessMail(user: User, transaction: Transactions) {
		const html = await render(PaymentSuccessTemplate({ transaction }))
		this.logger.log(`📧 Sending payment success mail to ${user.email}`)

		await this.mailQueue.add(
			'send-mail',
			{
				email: user.email,
				subject: 'Payment success',
				html,
			},
			{
				removeOnComplete: true,
			},
		)
	}

	public async sendMail(options: ISendMailOptions) {
		try {
			await this.mailerService.sendMail(options)
		} catch (error) {
			this.logger.error(`Failed to send mail: `, error)
			throw error
		}
	}
}
