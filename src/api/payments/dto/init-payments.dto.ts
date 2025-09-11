import { ApiProperty } from '@nestjs/swagger'
import { BillingPeriod, PaymentProvider } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class InitPaymentsRequest {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: 'Transaction plan id',
		example: 'jUelh_-OTkcyBdPeVXwHK',
	})
	public planId: string

	@IsEnum(BillingPeriod)
	@ApiProperty({
		description: 'Transaction billing period',
		example: BillingPeriod.MONTHLY,
		enum: BillingPeriod,
	})
	public billingPeriod: BillingPeriod

	@IsEnum(PaymentProvider)
	@ApiProperty({
		description: 'Transaction payment provider',
		example: PaymentProvider.Stripe,
		enum: PaymentProvider,
	})
	public provider: PaymentProvider
}
