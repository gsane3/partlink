import { VehicleDetailScreen } from '@/components/inventory/vehicle-detail/vehicle-detail-screen'

export default async function Page({
  params,
}: {
  params: Promise<{ vehicleCode: string }>
}) {
  const { vehicleCode } = await params
  return <VehicleDetailScreen vehicleCode={vehicleCode} />
}
