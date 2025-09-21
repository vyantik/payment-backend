import { type ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import type { Transactions, User } from '@prisma/client'
import { render } from '@react-email/components'
import { Queue } from 'bullmq'

import { PaymentSuccessTemplate } from './templates'

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name)

	public constructor(
		private readonly mailerService: MailerService,
		@InjectQueue('mail') private readonly mailQueue: Queue,
	) { }

	public async sendPaymentSuccessMail(user: User, transaction: Transactions) {
		const html = await render(PaymentSuccessTemplate({ transaction }))
		this.logger.log(`Sending payment success mail to ${user.email}`)

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
