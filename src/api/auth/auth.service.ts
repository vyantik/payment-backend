import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import type { Request, Response } from 'express'
import { IS_DEV_ENV, ms, type StringValue } from 'src/common/utils'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import type { LoginRequest, RegisterRequest } from './dto'
import { JwtPayload } from './interfaces'

@Injectable()
export class AuthService {
	private readonly ACCESS_TOKEN_TTL: StringValue
	private readonly REFRESH_TOKEN_TTL: StringValue
	private readonly COOKIES_DOMAIN: string

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
		this.ACCESS_TOKEN_TTL = this.configService.getOrThrow<StringValue>(
			'JWT_ACCESS_TOKEN_TTL',
		)
		this.REFRESH_TOKEN_TTL = this.configService.getOrThrow<StringValue>(
			'JWT_REFRESH_TOKEN_TTL',
		)
		this.COOKIES_DOMAIN =
			this.configService.getOrThrow<string>('COOKIES_DOMAIN')
	}

	public async login(res: Response, loginDto: LoginRequest) {
		const { email, password } = loginDto

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [{ email }, { name: email }],
			},
		})

		if (!user) {
			throw new UnauthorizedException('Incorrect email or password')
		}

		const isPasswordCorrect = await verify(user.password, password)

		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Incorrect email or password')
		}

		return await this.auth(res, user)
	}

	public async register(res: Response, registerDto: RegisterRequest) {
		const { name, email, password } = registerDto

		const existingUser = await this.prismaService.user.findFirst({
			where: {
				OR: [{ name }, { email }],
			},
		})

		if (existingUser) {
			throw new ConflictException('User already exists')
		}

		const hashedPassword = await hash(password)

		const user = await this.prismaService.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})

		return await this.auth(res, user)
	}

	public async logout(res: Response) {
		await this.setCookies(res, 'refreshToken', new Date(0))
	}

	public async refresh(req: Request, res: Response) {
		if (!req || !req.cookies || !req.cookies['refreshToken']) {
			throw new UnauthorizedException('No token provided')
		}

		const refreshToken = req.cookies['refreshToken']
		const payload = await this.jwtService.verifyAsync(refreshToken)

		if (payload) {
			const user = await this.prismaService.user.findFirst({
				where: {
					id: payload.id,
				},
			})

			if (user) {
				return await this.auth(res, user)
			} else {
				throw new UnauthorizedException('Invalid token')
			}
		} else {
			throw new UnauthorizedException('Invalid token')
		}
	}

	private async auth(res: Response, user: User) {
		const { accessToken, refreshToken, refreshTokenExpires } =
			await this.generateToken(user)

		await this.setCookies(res, refreshToken, refreshTokenExpires)

		return { accessToken }
	}

	private async generateToken(user: User) {
		const payload: JwtPayload = {
			id: user.id,
		}

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.ACCESS_TOKEN_TTL,
		})
		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.REFRESH_TOKEN_TTL,
		})

		const refreshTokenExpires = new Date(
			Date.now() + ms(this.REFRESH_TOKEN_TTL),
		)

		return {
			accessToken,
			refreshToken,
			refreshTokenExpires: refreshTokenExpires,
		}
	}

	private async setCookies(res: Response, value: string, expires: Date) {
		res.cookie('refreshToken', value, {
			httpOnly: true,
			domain: this.COOKIES_DOMAIN,
			expires,
			secure: !IS_DEV_ENV,
		})
	}
}
