import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class UpdateAutoRenewalRequest {
	@ApiProperty({
		example: true,
		description: 'Enable/disable auto renewal',
	})
	@IsBoolean()
	public isAutoRenewal: boolean
}
