'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { estaAutenticado } from '@/lib/auth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace('/login')
    } else {
      setOk(true)
    }
  }, [router])

  if (!ok) return null
  return <>{children}</>
}
