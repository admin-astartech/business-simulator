interface ButtonProps {
    onClick: () => void
    children: React.ReactNode
    disabled?: boolean
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

export default function Button({ onClick, children, className, disabled, type }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={className || "inline-flex items-center gap-2 px-4 py-2 bg-[--color-primary] text-white text-sm font-medium rounded-lg hover:bg-[--color-primary-hover] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"}
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    )
}