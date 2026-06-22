'use client'

import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { showToast } from '@/components/ui/toast'

interface LogoutButtonProps {
  /** Extra classes for the button element */
  className?: string
  /** Called after a successful logout */
  onLogout?: () => void
}

export function LogoutButton({ className, onLogout }: LogoutButtonProps) {
  const { logout } = useAuthContext()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (loading) return
    setLoading(true)
    try {
      await logout()
      showToast('Logged out successfully.', 'success')
      onLogout?.()
    } catch {
      showToast('Logout failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      aria-label="Log out"
      className={
        className ??
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors disabled:opacity-40'
      }
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <LogOut className="w-4 h-4" />
      }
      {loading ? 'Logging out...' : 'Log out'}
    </button>
  )
}
