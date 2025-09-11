import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BillingPeriod, Plan, Transactions } from '@prisma/client'
import { firstValueFrom } from 'rxjs'

import { CRYPTO_PAY_URL } from '../../constants'

import { CryptoResponse, FiatCurrency } from './interfaces/common.interface'
import {
  CreateInvoiceRequest,
  Currency,
  PaidButtonName,
} from './interfaces/create-invoice.interface'

@Injectable()
export class CryptoService {
  private readonly CRYPTO_PAY_TOKEN: string
  private readonly CRYPTO_PAY_URL: string
  private readonly CRYPTO_PAY_INVOICE_URL: string

  public constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.CRYPTO_PAY_TOKEN =
      this.configService.getOrThrow<string>('CRYPTO_PAY_TOKEN')
    this.CRYPTO_PAY_URL = CRYPTO_PAY_URL
    // this.CRYPTO_PAY_INVOICE_URL = this.configService.getOrThrow<string>(
    //   'CRYPTO_PAY_INVOICE_URL',
    // )
    this.CRYPTO_PAY_INVOICE_URL = 'https://sitetrialbox.ru/'
  }

  public async create(plan: Plan, transaction: Transactions) {
    const payload: CreateInvoiceRequest = {
      amount: transaction.amount,
      currency_type: Currency.FIAT,
      fiat: FiatCurrency.RUB,
      description: `Payment for subscription on "${plan.title}"`,
      hidden_message: `Thank you for your support!`,
      paid_btn_name: PaidButtonName.CALLBACK,
      paid_btn_url: this.CRYPTO_PAY_INVOICE_URL,
    }

    const response = await this.makeRequest(
      'POST',
      '/createInvoice',
      payload,
    )
    return response.result
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any,
  ) {
    const observable = this.httpService.request<CryptoResponse<T>>({
      method,
      baseURL: this.CRYPTO_PAY_URL,
      url: endpoint,
      headers: {
        'Crypto-Pay-API-Token': this.CRYPTO_PAY_TOKEN,
      },
      data,
    })

    const { data: response } = await firstValueFrom(observable)

    return response
  }
}
