import { BadRequestException, Injectable } from '@nestjs/common'

import { CryptoService } from '../provider/crypto/crypto.service'

@Injectable()
export class WebhookService {
  public constructor(private readonly cryptoService: CryptoService) { }

  public async handleCrypto(rawBody: Buffer<ArrayBufferLike>, sig: string) {
    this.cryptoService.verifyWebhook(rawBody, sig)

    const body = JSON.parse(rawBody.toString())

    if (!this.cryptoService.isFreshRequest(body))
      throw new BadRequestException('Request is too old')

    console.log(`CRYPTO PAY WEBHOOK: ${body}`)
  }
}
