import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import type { User } from '@prisma/client'
import { Authorized, Protected } from 'src/common/decorators'

import { InitPaymentsRequest, PaymentHistoryResponse } from './dto'
import { PaymentsService } from './payments.service'

@Controller('payments')
export class PaymentsController {
	public constructor(private readonly paymentsService: PaymentsService) {}

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

	@ApiOperation({
		summary: 'Init payment',
		description: 'Init payment',
	})
	@ApiOkResponse({
		description: 'Payment inited',
	})
	@HttpCode(HttpStatus.CREATED)
	@Protected()
	@Post('init')
	public async init(
		@Authorized() user: User,
		@Body() dto: InitPaymentsRequest,
	) {
		return await this.paymentsService.init(dto, user)
	}

	@HttpCode(HttpStatus.OK)
	@Post('webhook')
	public async webhook(@Body() body: any) {}
}
