import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import type { User } from '@prisma/client'
import { Authorized, Protected } from 'src/common/decorators'

import { PaymentsService } from './payments.service'

@Controller('payments')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) { }

	@ApiOperation({
		summary: 'Get payment history',
		description: 'Get payment history for a user',
	})
	@Protected()
	@Get()
	public async getHistory(@Authorized() user: User) {
		return await this.paymentsService.getHistory(user)
	}
}
