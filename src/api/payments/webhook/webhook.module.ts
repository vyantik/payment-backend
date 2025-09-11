import { Module } from '@nestjs/common'

import { CryptoModule } from '../provider/crypto/crypto.module'

import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'

@Module({
  imports: [CryptoModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule { }
