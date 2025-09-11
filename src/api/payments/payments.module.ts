import { Module } from '@nestjs/common'

import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { YoomoneyModule } from './provider/yoomoney/yoomoney.module'
import { WebhookModule } from './webhook/webhook.module';
import { CryptoModule } from './provider/crypto/crypto.module';

@Module({
	controllers: [PaymentsController],
	providers: [PaymentsService],
	imports: [YoomoneyModule, WebhookModule, CryptoModule],
})
export class PaymentsModule { }
