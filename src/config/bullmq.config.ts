import { ConfigService } from '@nestjs/config'
import { QueueOptions } from 'bullmq'

import { getRedisConfig } from './redis.config'

export function getBullMQConfig(configService: ConfigService): QueueOptions {
  return {
    connection: {
      maxRetriesPerRequest: 5,
      retryStrategy: times => Math.min(times * 50, 2000),
      ...getRedisConfig(configService),
    },
    prefix: configService.getOrThrow<string>('QUEUE_PREFIX'),
  }
}
