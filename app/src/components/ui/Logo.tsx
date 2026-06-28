import { Store } from 'lucide-react'

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl bg-primary text-white"
      style={{ width: size, height: size }}
    >
      <Store size={size * 0.55} strokeWidth={2.4} />
    </div>
  )
}

export function LogoText() {
  return (
    <span className="text-xl font-extrabold tracking-tight text-primary">
      ShiloMarket
    </span>
  )
}
