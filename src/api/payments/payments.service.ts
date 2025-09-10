import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/infra/prisma/prisma.service'

@Injectable()
export class PaymentsService {
	public constructor(private readonly prismaService: PrismaService) { }

	public async getHistory(user: User) {
		const payments = await this.prismaService.transactions.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				subscription: {
					include: {
						plan: true,
					},
				},
			},
		})

		const formattedPayments = payments.map(payment => ({
			id: payment.id,
			createdAt: payment.createdAt,
			plan: payment.subscription.plan.title,
			amount: payment.amount,
			provider: payment.PaymentProvider,
			status: payment.TransactionStatus,
		}))

		return formattedPayments
	}
}
