import { ConfigService } from '@nestjs/config'
import { YookassaOptions } from 'nestjs-yookassa'

export function getYoomoneyConfig(
	configService: ConfigService,
): YookassaOptions {
	return {
		apiKey: configService.getOrThrow<string>('YOOMONEY_API_KEY'),
		shopId: configService.getOrThrow<string>('YOOMONEY_SHOP_ID'),
	}
}
