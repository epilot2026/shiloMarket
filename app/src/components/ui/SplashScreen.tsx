import { useEffect, useState } from 'react'
import { LogoMark } from './Logo'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setLeaving(true)
          setTimeout(onDone, 400)
          return 100
        }
        return p + 4
      })
    }, 30)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark transition-opacity duration-400 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="animate-[bounce_1s_ease-in-out_infinite]">
        <LogoMark size={72} />
      </div>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
        ShiloMarket
      </h1>
      <p className="mt-1 text-sm text-white/80">Votre marketplace de confiance</p>

      <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="mt-2 text-xs font-medium text-white/70">{progress}%</span>
    </div>
  )
}
