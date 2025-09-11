import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

const planSelectOptions = {
	id: true,
	title: true,
	description: true,
	features: true,
	monthlyPrice: true,
	yearlyPrice: true,
	isFeatured: true,
}

@Injectable()
export class PlansService {
	public constructor(private readonly prismaService: PrismaService) { }

	public async getAll() {
		return await this.prismaService.plan.findMany({
			orderBy: {
				monthlyPrice: 'asc',
			},
			select: planSelectOptions,
		})
	}

	public async getById(id: string) {
		const plan = await this.prismaService.plan.findUnique({
			where: {
				id,
			},
			select: planSelectOptions,
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		return plan
	}
}
