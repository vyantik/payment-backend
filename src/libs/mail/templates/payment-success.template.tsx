import type { Transactions } from '@prisma/client'
import { Body, Head, Html, Preview, Text } from '@react-email/components'
import * as React from 'react'

interface PaymentSuccessTemplateProps {
  transaction: Transactions
}

export function PaymentSuccessTemplate({ transaction }: PaymentSuccessTemplateProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Preview>
          Payment Successful
        </Preview>
        <Text>ID: {transaction.id}</Text>
      </Body>
    </Html>
  )
}
