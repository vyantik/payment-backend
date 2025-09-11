import { Body, Controller, Logger, Post } from '@nestjs/common'

import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name)

  public constructor(private readonly webhookService: WebhookService) { }

  @Post('yookassa')
  public async handleYookassa(@Body() dto: any) {
    this.logger.log(`WebhookController.handleYookassa`, dto)
  }

  @Post('crypto')
  public async handleCrypto(@Body() dto: any) {
    this.logger.log(`WebhookController.handleCrypto`, dto)
  }
}
