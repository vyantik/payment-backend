import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import {
  PaymentProvider,
  SubscriptionStatus,
  TransactionStatus,
} from '@prisma/client'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { MailService } from 'src/libs/mail/mail.service'

import { YoomoneyService } from '../provider/yoomoney/yoomoney.service'

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name)

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly yoomoneyService: YoomoneyService,
    private readonly mailService: MailService,
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handleAutoBilling() {
    const users = await this.prismaService.user.findMany({
      where: {
        subscription: {
          endDate: {
            lte: new Date(),
          },
          status: SubscriptionStatus.ACTIVE,
        },
        isAutoRenewal: true,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    })

    if (users.length === 0) {
      this.logger.log('⚠️ No users found for auto-renewal')
      return
    }

    this.logger.log(`⏳ Auto-renewing ${users.length} users`)

    for (const user of users) {
      const lastTrasaction =
        await this.prismaService.transactions.findFirst({
          where: {
            userId: user.id,
            transactionStatus: TransactionStatus.SUCCESS,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

      if (!lastTrasaction) {
        continue
      }

      if (lastTrasaction.paymentProvider === PaymentProvider.YOOKASSA) {
        const transaction =
          await this.prismaService.transactions.create({
            data: {
              amount: lastTrasaction.amount,
              paymentProvider: PaymentProvider.YOOKASSA,
              externalId: lastTrasaction.externalId,
              billingPeriod: lastTrasaction.billingPeriod,
              user: {
                connect: {
                  id: user.id,
                },
              },
              subscription: {
                connect: {
                  id: user.subscription?.id,
                },
              },
            },
          })

        try {
          await this.yoomoneyService.createBySavedCard(
            user.subscription?.plan!,
            user,
            transaction,
          )
        } catch (error) {
          await this.prismaService.transactions.update({
            where: {
              id: transaction.id,
            },

            data: {
              transactionStatus: TransactionStatus.FAILED,
            },
          })
          this.logger.error(
            `❌ Payment failed: ${user.email} - ${error.message}`,
          )
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async expireSubscriptions() {
    const now = new Date()

    const subscription = await this.prismaService.userSubscription.findMany(
      {
        where: {
          status: SubscriptionStatus.ACTIVE,
          endDate: {
            lte: now,
          },
        },
        include: {
          user: {
            include: {
              transactions: {
                where: {
                  transactionStatus:
                    TransactionStatus.SUCCESS,
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
              },
            },
          },
          plan: true,
        },
      },
    )

    const filteredSubscriptions = subscription.filter(sub => {
      const lastTrasaction = sub.user.transactions[0]
      if (!lastTrasaction) {
        return false
      }

      switch (lastTrasaction.paymentProvider) {
        case PaymentProvider.YOOKASSA:
        case PaymentProvider.STRIPE:
          return sub.user.isAutoRenewal === false
        case PaymentProvider.CRYPTOPAY:
          return true
        default:
          return false
      }
    })

    if (!filteredSubscriptions.length) {
      this.logger.log('✅ No subscriptions to expire')
      return
    }

    for (const subscription of filteredSubscriptions) {
      const user = subscription.user

      await this.prismaService.userSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      })

      await this.mailService.sendSubscriptionExpiredMail(user)

      this.logger.log(`⏳ Expiring subscription: ${user.email}`)
    }
  }
}
