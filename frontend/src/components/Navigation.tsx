import { useNavigate } from 'react-router-dom'
import './Navigation.css'

interface NavigationProps {
  showBackButton?: boolean
}

export default function Navigation({ showBackButton = false }: NavigationProps) {
  const navigate = useNavigate()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">📈</span>
          <span className="logo-text gradient-text">Market Insight</span>
        </div>
        {showBackButton && (
          <button className="back-button" onClick={() => navigate('/')}>
            <span className="back-arrow">←</span>
            <span className="back-text">Back to Home</span>
          </button>
        )}
      </div>
    </nav>
  )
}
