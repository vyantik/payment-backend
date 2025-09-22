import { BadRequestException, Injectable } from '@nestjs/common'

import { PaymentHandler } from '../payment.handler'
import { CryptoService } from '../provider/crypto/crypto.service'
import { YoomoneyService } from '../provider/yoomoney/yoomoney.service'

import { CryptoWebhookDto, YookassaWebhookDto } from './dto'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly paymentHandler: PaymentHandler,
		private readonly yoomoneyService: YoomoneyService,
		private readonly cryptoService: CryptoService,
	) {}

	public async handleCrypto(rawBody: Buffer<ArrayBufferLike>, sig: string) {
		this.cryptoService.verifyWebhook(rawBody, sig)

		const body: CryptoWebhookDto = JSON.parse(rawBody.toString())

		if (!this.cryptoService.isFreshRequest(body))
			throw new BadRequestException('Request is too old')

		const result = await this.cryptoService.handleWebhook(body)

		return await this.paymentHandler.processResult(result)
	}

	public async handleYookassa(body: YookassaWebhookDto, ip: string) {
		this.yoomoneyService.verifyWebhook(ip)
		const result = await this.yoomoneyService.handleWebhook(body)

		return await this.paymentHandler.processResult(result)
	}
}
