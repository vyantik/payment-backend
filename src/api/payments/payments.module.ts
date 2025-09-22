import { Module } from '@nestjs/common'

import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { CryptoModule } from './provider/crypto/crypto.module'
import { YoomoneyModule } from './provider/yoomoney/yoomoney.module'
import { WebhookModule } from './webhook/webhook.module'
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
	controllers: [PaymentsController],
	providers: [PaymentsService],
	imports: [YoomoneyModule, WebhookModule, CryptoModule, SchedulerModule],
})
export class PaymentsModule { }
