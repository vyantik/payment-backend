import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from 'src/common/strategies'
import { getJwtConfig } from 'src/config'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			useFactory: getJwtConfig,
			inject: [ConfigService],
		}),
	],
})
export class AuthModule {}
