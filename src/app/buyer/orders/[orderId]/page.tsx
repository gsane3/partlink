import { BuyerRequestDetail } from '@/components/orders/buyer-request-detail'

export default async function BuyerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  return <BuyerRequestDetail requestId={orderId} />
}
