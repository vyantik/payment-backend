import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BillingPeriod, Plan, Transactions } from '@prisma/client'
import {
  ConfirmationEnum,
  CurrencyEnum,
  PaymentMethodsEnum,
  YookassaService,
} from 'nestjs-yookassa'

@Injectable()
export class YoomoneyService {
  private readonly redirectUrl: string
  public constructor(
    private readonly yookassaService: YookassaService,
    configService: ConfigService,
  ) {
    this.redirectUrl = configService.getOrThrow<string>(
      'YOOMONEY_REDIRECT_URL',
    )
  }

  public async create(plan: Plan, transaction: Transactions) {
    const payment = await this.yookassaService.createPayment({
      amount: {
        value: transaction.amount,
        currency: CurrencyEnum.RUB,
      },
      description: `Payment for subscription on ${plan.title}`,
      payment_method_data: {
        type: PaymentMethodsEnum.bank_card,
      },
      confirmation: {
        type: ConfirmationEnum.redirect,
        return_url: this.redirectUrl,
      },
      save_payment_method: true,
    })

    return payment
  }
}
