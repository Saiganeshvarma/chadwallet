import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white shadow-lg hover:shadow-[0_0_20px_rgba(153,69,255,0.4)] hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm',
        ghost: 'text-white/70 hover:text-white hover:bg-white/5',
        secondary: 'bg-white/10 text-white hover:bg-white/20',
        destructive: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30',
        neon: 'bg-transparent border border-[#9945FF]/50 text-[#9945FF] hover:bg-[#9945FF]/10 hover:border-[#9945FF] hover:shadow-[0_0_15px_rgba(153,69,255,0.3)]',
        'neon-green':
          'bg-transparent border border-[#14F195]/50 text-[#14F195] hover:bg-[#14F195]/10 hover:border-[#14F195] hover:shadow-[0_0_15px_rgba(20,241,149,0.3)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
