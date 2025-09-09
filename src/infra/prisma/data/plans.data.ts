import { Plan } from '@prisma/client'

export const plans: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>[] = [
	{
		title: 'Basic',
		monthlyPrice: 100,
		yearlyPrice: 1000,
		description: 'Basic plan',
		features: ['Email', 'SMS'],
		isFeatured: false,
	},
	{
		title: 'Premium',
		monthlyPrice: 200,
		yearlyPrice: 2000,
		description: 'Premium plan',
		features: ['Email', 'SMS', 'Invoices'],
		isFeatured: true,
	},
	{
		title: 'Enterprise',
		monthlyPrice: 300,
		yearlyPrice: 3000,
		description: 'Enterprise plan',
		features: ['Email', 'SMS', 'Invoices', 'Payments'],
		isFeatured: false,
	},
]
