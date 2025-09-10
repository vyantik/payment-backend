import { PaymentProvider, TransactionStatus } from "@prisma/client"

export class PaymentHistoryResponse {
  id: string
  createdAt: string
  plan: string
  amount: number
  provider: PaymentProvider
  status: TransactionStatus
}
