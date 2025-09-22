import { Module } from '@nestjs/common'

import { PaymentHandler } from '../payment.handler'
import { CryptoModule } from '../provider/crypto/crypto.module'
import { YoomoneyModule } from '../provider/yoomoney/yoomoney.module'

import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'

@Module({
	imports: [CryptoModule, YoomoneyModule],
	controllers: [WebhookController],
	providers: [WebhookService, PaymentHandler],
})
export class WebhookModule {}
