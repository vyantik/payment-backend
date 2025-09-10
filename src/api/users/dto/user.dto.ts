import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'

export class UserResponse {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'jUelh_-OTkcyBdPeVXwHK',
  })
  id: string

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'User created at',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'User updated at',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date
}
