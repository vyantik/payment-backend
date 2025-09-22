import * as React from 'react'
import { Html, Body, Container, Head, Preview, Tailwind, Heading, Text, Font } from "@react-email/components";
import type { Transactions } from '@prisma/client';
import { formatTransactionDate, getProviderName } from 'src/common/utils';

export interface PaymentFailedTemplateProps {
	transaction: Transactions
}

export function PaymentFailedTemplate({
	transaction
}: PaymentFailedTemplateProps) {
	return (
		<Html>
			<Head>
				<Font
					fontFamily='Geist'
					fallbackFontFamily='Arial'
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
						format: 'woff2'
					}}
				/>
			</Head>
			<Tailwind>
				<Preview>Failed payment</Preview>

				<Body className='bg-gray-50 font-sans text-gray-700'>
					<Container className='max-w-2xl mx-auto bg-white rounded-md shadow-md'>
						<div className='relative px-8 py-16 overflow-hidden'>
							<div className='relative text-center'>
								<Heading className='mb-2 text-2xl font-bold text-slate-900'>
									Payment failed!
								</Heading>
								<Text className='text-base text-slate-500'>
									There was an error processing your payment. You can try paying again in your account.
								</Text>
							</div>

							<div className='p-8 mt-8 bg-gray-100 rounded-xl'>
								<Heading className='mb-6 text-xl font-semibold text-slate-900'>
									Payment details
								</Heading>

								<div className='mb-3 flex justify-between text-sm text-slate-500'>
									<span>Transaction ID:</span>{' '}
									<span className='font-mono text-slate-900'>{transaction.id}</span>
								</div>

								<div className='mb-3 flex justify-between text-sm text-slate-500'>
									<span>Date:</span>{' '}
									<span className='text-slate-900'>{formatTransactionDate(transaction.createdAt)}</span>
								</div>

								<div className='mb-6 flex justify-between text-sm text-slate-500'>
									<span>Payment method:</span>{' '}
									<span className='text-slate-900'>{getProviderName(transaction.paymentProvider)}</span>
								</div>

								<div className='flex justify-between pt-3 border-t border-gray-300'>
									<span className='text-lg font-semibold text-slate-900'>
										Amount:
									</span>{' '}
									<span className='text-lg font-bold text-slate-900'>
										{transaction.amount}$
									</span>
								</div>
							</div>

							<div className='mt-10 text-center'>
								<Text className='text-sm text-slate-500'>
									If the problem persists, please contact support or try the payment again in your personal account.
								</Text>
							</div>
						</div>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
