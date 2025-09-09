import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { plans } from './data'

const prisma = new PrismaClient()

async function main() {
	const logger = new Logger('DatabaseSeeder')

	logger.log('Seeding database...')

	try {
		await prisma.plan.deleteMany()
		await prisma.plan.createMany({
			data: plans,
		})
		logger.log('Database seeded successfully')
	} catch (e) {
		logger.error(e)
		throw new Error('Error seeding database')
	}
}

main()
