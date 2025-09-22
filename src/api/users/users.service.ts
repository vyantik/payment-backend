import { Injectable, NotFoundException } from '@nestjs/common'
import { TransactionStatus, User } from '@prisma/client'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { UpdateAutoRenewalRequest } from './dto'

@Injectable()
export class UsersService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async updateAutoRenewal(user: User, dto: UpdateAutoRenewalRequest) {
		const { isAutoRenewal } = dto

		const subsctiption =
			await this.prismaService.userSubscription.findFirst({
				where: {
					userId: user.id,
				},
				include: {
					user: {
						include: {
							transactions: {
								where: {
									transactionStatus:
										TransactionStatus.SUCCESS,
								},
								orderBy: {
									createdAt: 'desc',
								},
								take: 1,
							},
						},
					},
				},
			})
		if (!subsctiption) throw new NotFoundException('Subscription not found')

		const lastTrasaction = subsctiption.user.transactions[0]
		if (!lastTrasaction)
			throw new NotFoundException('Transaction not found')

		return await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				isAutoRenewal,
			},
		})
	}
}
