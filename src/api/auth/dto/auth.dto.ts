import { ApiProperty } from '@nestjs/swagger'

export class AuthResponse {
	@ApiProperty({
		description: 'Access token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	public accessToken: string

	@ApiProperty({
		description: 'Refresh token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	public refreshToken: string

	@ApiProperty({
		description: 'Refresh token expiration date',
		example: '2023-01-01T00:00:00.000Z',
	})
	public refreshTokenExpires: Date
}
