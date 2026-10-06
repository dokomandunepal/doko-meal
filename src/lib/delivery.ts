export type DeliveryTier = {
  // Upper bound in km, inclusive
  maxKm: number
  fee: number
  // Order subtotal at or above which the fee is waived
  freeAbove: number
}

// Charged against the estimated road distance, not the straight line
export const DELIVERY_TIERS: DeliveryTier[] = [
  { maxKm: 3, fee: 150, freeAbove: 10000 },
  { maxKm: 7, fee: 200, freeAbove: 10000 },
  { maxKm: 10, fee: 250, freeAbove: 10000 },
  { maxKm: 12, fee: 350, freeAbove: 10000 },
]

export const MAX_DELIVERY_KM = DELIVERY_TIERS[DELIVERY_TIERS.length - 1].maxKm

export type DeliveryQuote =
  // No location pinned yet, so there is nothing to price
  | { status: "unknown" }
  | { status: "out-of-range" }
  | {
      status: "ok"
      fee: number
      freeAbove: number
      isFree: boolean
    }

export const getDeliveryQuote = (
  distanceKm: number | null,
  subtotal: number
): DeliveryQuote => {
  if (distanceKm === null) return { status: "unknown" }

  const tier = DELIVERY_TIERS.find((candidate) => distanceKm <= candidate.maxKm)

  if (!tier) return { status: "out-of-range" }

  const isFree = subtotal >= tier.freeAbove

  return {
    status: "ok",
    fee: isFree ? 0 : tier.fee,
    freeAbove: tier.freeAbove,
    isFree,
  }
}
