import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
} from '@nestjs/swagger'

import { PlanResponse } from './dto'
import { PlansService } from './plans.service'

@Controller('plans')
export class PlansController {
	public constructor(private readonly plansService: PlansService) { }

	@ApiOperation({
		summary: 'Get all plans',
		description: 'Get all plans',
	})
	@ApiOkResponse({
		description: 'List of plans',
		type: PlanResponse,
		isArray: true,
	})
	@Get()
	async getAll() {
		return await this.plansService.getAll()
	}

	@ApiOperation({
		summary: 'Get plan by id',
		description: 'Get plan by id',
	})
	@ApiOkResponse({
		description: 'Plan',
		type: PlanResponse,
	})
	@ApiNotFoundResponse({
		description: 'Plan not found',
	})
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.plansService.getById(id)
	}
}
