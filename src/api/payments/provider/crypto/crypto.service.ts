import { HttpService } from '@nestjs/axios'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Plan, Transactions, TransactionStatus } from '@prisma/client'
import { createHash, createHmac } from 'crypto'
import { firstValueFrom } from 'rxjs'

import { CRYPTO_PAY_URL } from '../../constants'
import { PaymentWebhookResult } from '../../interfaces'
import { CryptoWebhookDto } from '../../webhook/dto'

import { CryptoResponse, FiatCurrency } from './interfaces/common.interface'
import {
  CreateInvoiceRequest,
  Currency,
  InvoiceStatus,
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
    this.CRYPTO_PAY_INVOICE_URL = this.configService.getOrThrow<string>(
      'CRYPTO_PAY_INVOICE_URL',
    )
  }

  public verifyWebhook(rawBody: Buffer<ArrayBufferLike>, sig: string) {
    const secret = createHash('sha256')
      .update(this.CRYPTO_PAY_TOKEN)
      .digest()

    const hmac = createHmac('sha256', secret).update(rawBody).digest('hex')

    if (hmac !== sig) throw new UnauthorizedException('Invalid signature')

    return true
  }

  public async handleWebhook(
    dto: CryptoWebhookDto,
  ): Promise<PaymentWebhookResult> {
    const payload = JSON.parse(
      Buffer.from(dto.payload.payload ?? '', 'base64').toString('utf-8'),
    )

    const transactionId = payload?.transactionId
    const planId = payload?.planId
    const paymentId = dto.payload.invoice_id.toString()

    let status: TransactionStatus = TransactionStatus.PENDING

    switch (dto.payload.status) {
      case InvoiceStatus.PAID:
        status = TransactionStatus.SUCCESS
        break
      case InvoiceStatus.EXPIRED:
        status = TransactionStatus.FAILED
        break
    }

    return {
      transactionId,
      planId,
      paymentId,
      transactionStatus: status,
      raw: dto,
    }
  }

  public isFreshRequest(body: any, maxAgeSeconds: number = 300) {
    const requestDate = new Date(body.request_date).getTime()

    const now = new Date().getTime()

    return now - requestDate <= maxAgeSeconds * 1000
  }

  public async create(plan: Plan, transaction: Transactions) {
    const payload: CreateInvoiceRequest = {
      amount: transaction.amount,
      currency_type: Currency.FIAT,
      fiat: FiatCurrency.RUB,
      description: `Payment for subscription on \"${plan.title}\"`,
      hidden_message: `Thank you for your support!`,
      paid_btn_name: PaidButtonName.CALLBACK,
      paid_btn_url: this.CRYPTO_PAY_INVOICE_URL,
      payload: Buffer.from(
        JSON.stringify({
          transactionId: transaction.id,
          planId: plan.id,
        }),
      ).toString('base64url'),
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
