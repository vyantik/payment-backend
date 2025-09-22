import * as React from 'react'
import { Html, Body, Container, Head, Preview, Tailwind, Heading, Text, Font, Button } from "@react-email/components";

export interface SubscriptionExpiredTemplateProps {
	accountUrl: string
}

export function SubscriptionExpiredTemplate({
	accountUrl
}: SubscriptionExpiredTemplateProps) {
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
				<Preview>Your subscription has expired</Preview>

				<Body className='bg-gray-50 font-sans text-gray-700'>
					<Container className='max-w-2xl mx-auto bg-white rounded-md shadow-md'>
						<div className='relative px-8 py-16 overflow-hidden'>
							<div className='absolute inset-0 bg-gradient-radial from-red-100 via-red-50 to-transparent pointer-events-none' />
							<div className='relative text-center'>
								<Heading className='mb-2 text-2xl font-bold text-slate-900'>
									Subscription expired
								</Heading>
								<Text className='text-base text-slate-500'>
									Your subscription has expired. To continue using all features, renew it in your personal account.
								</Text>
							</div>

							<div className='mt-10 text-center'>
								<Button
									href={accountUrl}
									className='inline-block px-6 py-4 rounded-xl font-medium bg-slate-900 text-white'
								>
									Renew subscription
								</Button>
							</div>
						</div>

						<div className='relative mt-8 text-center text-xs text-slate-500'>
							If button above is not working, copy and paste this link to your browser:
							<br />
							<span className='break-all'>{accountUrl}</span>
						</div>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
