import { Module } from '@nestjs/common'

import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { YoomoneyModule } from './provider/yoomoney/yoomoney.module'

@Module({
	controllers: [PaymentsController],
	providers: [PaymentsService],
	imports: [YoomoneyModule],
})
export class PaymentsModule { }
