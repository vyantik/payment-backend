import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { getCorsConfig, getSwaggerConfig } from './config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const logger = new Logger(AppModule.name)

	const port = config.getOrThrow<number>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')

	app.enableCors(getCorsConfig(config))
	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
	app.useGlobalPipes(new ValidationPipe())
	app.setGlobalPrefix('api/v1')

	const swaggerDocument = SwaggerModule.createDocument(
		app,
		getSwaggerConfig(),
	)
	SwaggerModule.setup('api/v1/docs', app, swaggerDocument, {
		jsonDocumentUrl: 'openapi.json',
	})

	try {
		await app.listen(port)

		logger.log(`Server started on ${host}`)
	} catch (err) {
		logger.error(`Failed to start server: ${err.message}`)
		process.exit(1)
	}
}

bootstrap()
