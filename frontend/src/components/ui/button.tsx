import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'primary', size = 'md', isLoading, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(
                    'rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                    {
                        'bg-primary text-background hover:bg-primary-dark': variant === 'primary',
                        'bg-surface text-white hover:bg-opacity-80': variant === 'secondary',
                        'border-2 border-primary text-primary hover:bg-primary hover:text-background': variant === 'outline',
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2': size === 'md',
                        'px-6 py-3': size === 'lg',
                        'opacity-50 cursor-not-allowed': disabled || isLoading,
                    },
                    className
                )}
                disabled={disabled || isLoading}
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    children
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }