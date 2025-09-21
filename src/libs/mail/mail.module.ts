import { MailerModule } from '@nestjs-modules/mailer'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getMailerConfig } from 'src/config'

import { MailProcessor } from './mail.processor'
import { MailService } from './mail.service'

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: getMailerConfig,
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule { }
