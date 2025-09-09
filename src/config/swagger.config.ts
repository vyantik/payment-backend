import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('Payment API')
		.setDescription('Payment API')
		.setVersion(process.env.npm_package_version ?? '1.0.0')
		.build()
}
