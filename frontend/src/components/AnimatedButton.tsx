import { type ReactNode } from 'react'
import './AnimatedButton.css'

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary'
}

export default function AnimatedButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary'
}: AnimatedButtonProps) {
  return (
    <button 
      className={`animated-button ${variant} ${className}`}
      onClick={onClick}
    >
      <span className="button-content">{children}</span>
      <span className="button-shine"></span>
    </button>
  )
}
