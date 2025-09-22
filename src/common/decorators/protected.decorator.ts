import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiUnauthorizedResponse } from '@nestjs/swagger'

import { JwtAuthGuard } from '../guards'

export const Protected = () =>
	applyDecorators(
		UseGuards(JwtAuthGuard),
		ApiUnauthorizedResponse({
			description: 'Unauthorized',
			example: { message: 'Unauthorized', statusCode: 401 },
		}),
	)
