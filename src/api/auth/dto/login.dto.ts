import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'

export class LoginRequest {
	@ApiProperty({
		description: 'User email',
		example: 'john.doe@example.com',
	})
	@IsNotEmpty()
	@IsEmail()
	public email: string

	@ApiProperty({
		description: 'User password',
		example: 'password',
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(32)
	public password: string
}
