import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { YookassaModule } from 'nestjs-yookassa'
import { getYoomoneyConfig } from 'src/config'

import { YoomoneyService } from './yoomoney.service'

@Module({
	imports: [
		YookassaModule.forRootAsync({
			useFactory: getYoomoneyConfig,
			inject: [ConfigService],
		}),
	],
	providers: [YoomoneyService],
	exports: [YoomoneyService],
})
export class YoomoneyModule {}
