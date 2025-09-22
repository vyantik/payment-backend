import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Ip,
	Logger,
	Post,
	type RawBodyRequest,
	Req,
	UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

import { YookassaWebhookDto } from './dto'
import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
	private readonly logger = new Logger(WebhookController.name)

	public constructor(private readonly webhookService: WebhookService) {}

	@HttpCode(HttpStatus.OK)
	@Post('yookassa')
	public async handleYookassa(
		@Body() dto: YookassaWebhookDto,
		@Ip() ip: string,
	) {
		this.logger.log(
			`WebhookController.handleYookassa ${JSON.stringify(dto)}`,
		)
		await this.webhookService.handleYookassa(dto, ip)
	}

	@HttpCode(HttpStatus.OK)
	@Post('crypto')
	public async handleCrypto(
		@Req() req: RawBodyRequest<Request>,
		@Headers('crypto-pay-api-signature') sig: string,
	) {
		this.logger.log(`WebhookController.handleCrypto ${sig} ${req.rawBody}`)

		if (!sig) {
			throw new UnauthorizedException('Signature is missing')
		}

		if (!req.rawBody) {
			throw new UnauthorizedException('Raw body is missing')
		}

		return await this.webhookService.handleCrypto(req.rawBody, sig)
	}
}
