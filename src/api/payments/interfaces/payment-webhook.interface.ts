import { TransactionStatus } from '@prisma/client'

export interface PaymentWebhookResult {
	transactionId: string
	planId: string
	paymentId: string
	transactionStatus: TransactionStatus
	raw: object
}
