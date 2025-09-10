import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import type { User } from '@prisma/client'
import { Authorized, Protected } from 'src/common/decorators'

import { PaymentHistoryResponse } from './dto/payment-history.dto'
import { PaymentsService } from './payments.service'

@Controller('payments')
export class PaymentsController {
	public constructor(private readonly paymentsService: PaymentsService) { }

	@ApiOperation({
		summary: 'Get payment history',
		description: 'Get payment history for a user',
	})
	@ApiOkResponse({
		description: 'Payment history',
		type: PaymentHistoryResponse,
	})
	@Protected()
	@HttpCode(HttpStatus.OK)
	@Get()
	public async getHistory(@Authorized() user: User) {
		return await this.paymentsService.getHistory(user)
	}
}
