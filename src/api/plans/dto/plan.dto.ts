import { ApiProperty } from '@nestjs/swagger'

export class PlanResponse {
	@ApiProperty({
		description: 'Unique identifier',
		example: 'jUelh_-OTkcyBdPeVXwHK',
	})
	public id: string

	@ApiProperty({
		description: 'Plan title',
		example: 'Basic',
	})
	public title: string

	@ApiProperty({
		description: 'Plan description',
		example: 'Basic plan',
	})
	public description: string

	@ApiProperty({
		description: 'Plan features',
		example: ['Email', 'SMS'],
		isArray: true,
	})
	public features: string[]

	@ApiProperty({
		description: 'Monthly price',
		example: 10,
	})
	public monthlyPrice: number

	@ApiProperty({
		description: 'Yearly price',
		example: 100,
	})
	public yearlyPrice: number
}
