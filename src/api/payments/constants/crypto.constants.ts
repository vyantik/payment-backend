import { IS_DEV_ENV } from 'src/common/utils'

export const CRYPTO_PAY_URL = IS_DEV_ENV
  ? 'https://testnet-pay.crypt.bot/api/'
  : 'https://pay.crypt.bot/api/'
