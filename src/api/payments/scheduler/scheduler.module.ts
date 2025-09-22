import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { YoomoneyModule } from '../provider/yoomoney/yoomoney.module'

import { SchedulerService } from './scheduler.service'

@Module({
	imports: [ScheduleModule.forRoot(), YoomoneyModule],
	providers: [SchedulerService],
})
export class SchedulerModule {}
