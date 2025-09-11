import {
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  type RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name)

  public constructor(private readonly webhookService: WebhookService) { }

  @Post('yookassa')
  public async handleYookassa(
    @Req() req: RawBodyRequest<Request>,
    @Headers('crypto-pay-api-signature') sig: string,
  ) {
    this.logger.log(`WebhookController.handleYookassa`)
  }

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
