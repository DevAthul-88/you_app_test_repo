import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    className={cn(
                        'w-full bg-surface text-white p-4 rounded-lg transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-primary',
                        'placeholder:text-gray-400',
                        error && 'border-2 border-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }