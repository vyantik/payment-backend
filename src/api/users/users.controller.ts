import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import type { User } from '@prisma/client'
import { Authorized, Protected } from 'src/common/decorators'

import { UserResponse } from './dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Get user details' })
	@ApiOkResponse({ description: 'User details', type: UserResponse })
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Get('@me')
	public async getMe(@Authorized() user: User) {
		return { ...user, password: undefined }
	}
}
