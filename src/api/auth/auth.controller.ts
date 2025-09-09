import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common'
import {
	ApiBody,
	ApiConflictResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import type { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { AuthResponse, LoginRequest, RegisterRequest } from './dto'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Register a new user' })
	@ApiBody({ type: RegisterRequest })
	@ApiOkResponse({ description: 'User details', type: AuthResponse })
	@ApiConflictResponse({ description: 'User already exists' })
	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	public async register(
		@Body() dto: RegisterRequest,
		@Res({ passthrough: true }) res: Response,
	) {
		return await this.authService.register(res, dto)
	}

	@ApiOperation({ summary: 'Login user' })
	@ApiBody({ type: LoginRequest })
	@ApiOkResponse({ description: 'User details', type: AuthResponse })
	@HttpCode(HttpStatus.OK)
	@Post('login')
	public async login(
		@Body() dto: LoginRequest,
		@Res({ passthrough: true }) res: Response,
	) {
		return await this.authService.login(res, dto)
	}

	@ApiOperation({ summary: 'Logout user' })
	@ApiOkResponse({ description: 'No content' })
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('logout')
	public async logout(@Res({ passthrough: true }) res: Response) {
		return await this.authService.logout(res)
	}

	@ApiOperation({ summary: 'Refresh user access token' })
	@ApiOkResponse({ description: 'User details', type: AuthResponse })
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	public async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return await this.authService.refresh(req, res)
	}
}
