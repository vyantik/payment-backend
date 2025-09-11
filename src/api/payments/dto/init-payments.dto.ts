import { ApiProperty } from '@nestjs/swagger'
import {
	BillingPeriod,
	PaymentProvider,
	TransactionStatus,
	type UserSubscription,
} from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { UserResponse } from 'src/api/users/dto'

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

export class InitPaymentsResponse {
	@ApiProperty({
		description: 'Transaction id',
		example: 'jUelh_-OTkcyBdPeVXwHK',
	})
	id: string

	@ApiProperty({
		description: 'Transaction amount',
		example: 10,
	})
	amount: number
	@ApiProperty({
		description: 'Transaction payment provider',
		example: PaymentProvider.Stripe,
		enum: PaymentProvider,
	})
	paymentProvider: PaymentProvider

	@ApiProperty({
		description: 'Transaction status',
		example: TransactionStatus.PENDING,
		enum: TransactionStatus,
	})
	transactionStatus: TransactionStatus

	@ApiProperty({
		description: 'Transaction external id',
		example: 'jUelh_-OTkcyBdPeVXwHK',
	})
	externalId: string

	@ApiProperty({
		description: 'Transaction provider meta',
	})
	providerMeta: string

	@ApiProperty({
		description: 'Transaction billing period',
		example: BillingPeriod.MONTHLY,
		enum: BillingPeriod,
	})
	billingPeriod: BillingPeriod

	@ApiProperty({
		description: 'Transaction user',
		example: {
			id: 'jUelh_-OTkcyBdPeVXwHK',
			name: 'John Doe',
			email: 'john@example.com',
		},
	})
	user: UserResponse

	@ApiProperty({
		description: 'Transaction subscription',
	})
	subscription: UserSubscription

	@ApiProperty({
		description: 'Transaction created at',
		example: '2023-01-01T00:00:00.000Z',
	})
	createdAt: Date

	@ApiProperty({
		description: 'Transaction updated at',
		example: '2023-01-01T00:00:00.000Z',
	})
	updatedAt: Date
}
