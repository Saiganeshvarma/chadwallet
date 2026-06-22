'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastData {
  id: string
  message: string
  type: ToastType
}

// Singleton event bus so any component can fire toasts
type ToastListener = (toast: ToastData) => void
const listeners: ToastListener[] = []

export function showToast(message: string, type: ToastType = 'info') {
  const toast: ToastData = { id: Math.random().toString(36).slice(2), message, type }
  listeners.forEach((l) => l(toast))
}

// Icons per type
const ICON = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle,
}

const COLOR = {
  success: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
  error: 'text-red-400 border-red-400/20 bg-red-400/10',
  info: 'text-[#9945FF] border-[#9945FF]/20 bg-[#9945FF]/10',
}

function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const Icon = ICON[toast.type]

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl glass shadow-2xl shadow-black/40 max-w-sm ${COLOR[toast.type]}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm text-white/90 flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/30 hover:text-white/70 transition-colors ml-1 flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    const listener: ToastListener = (t) => setToasts((prev) => [...prev, t])
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx !== -1) listeners.splice(idx, 1)
    }
  }, [])

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
