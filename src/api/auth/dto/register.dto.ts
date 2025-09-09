import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'

export class RegisterRequest {
	@ApiProperty({
		description: 'User name',
		example: 'John Doe',
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(4)
	@MaxLength(16)
	public name: string

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
