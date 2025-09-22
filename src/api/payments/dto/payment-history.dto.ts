import { ApiProperty } from '@nestjs/swagger'
import { PaymentProvider, TransactionStatus } from '@prisma/client'

export class PaymentHistoryResponse {
	@ApiProperty({
		description: 'Unique identifier',
		example: 'jUelh_-OTkcyBdPeVXwHK',
	})
	id: string

	@ApiProperty({
		description: 'Date and time of payment',
		example: '2023-01-01T00:00:00.000Z',
	})
	createdAt: string

	@ApiProperty({
		description: 'Plan title',
		example: 'Basic',
	})
	plan: string

	@ApiProperty({
		description: 'Amount of payment',
		example: 10,
	})
	amount: number

	@ApiProperty({
		description: 'Payment provider',
		example: PaymentProvider.YOOKASSA,
		enum: PaymentProvider,
	})
	provider: PaymentProvider

	@ApiProperty({
		description: 'Payment status',
		example: TransactionStatus.SUCCESS,
		enum: TransactionStatus,
	})
	status: TransactionStatus
}
