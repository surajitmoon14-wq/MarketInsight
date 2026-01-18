import { useNavigate } from 'react-router-dom'
import AnimatedButton from '../components/AnimatedButton'
import FeatureCard from '../components/FeatureCard'
import GradientText from '../components/GradientText'
import './Home.css'

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-time Stock Analysis',
    description: 'Get instant insights on stock prices, movements, and market trends as they happen.'
  },
  {
    icon: '🤖',
    title: 'AI-Powered Insights',
    description: 'Advanced AI analyzes market data to provide intelligent recommendations and predictions.'
  },
  {
    icon: '📊',
    title: 'Market Intelligence',
    description: 'Comprehensive financial data, news, and analyst ratings at your fingertips.'
  },
  {
    icon: '🌍',
    title: 'Global Coverage',
    description: 'Track stocks from major markets worldwide including US, India, and international exchanges.'
  }
]

export default function Home() {
  const navigate = useNavigate()

  const handleLaunchChat = () => {
    navigate('/chat')
  }

  return (
    <div className="home-page">
      <div className="animated-background"></div>
      
      <div className="home-content">
        {/* Header */}
        <header className="home-header">
          <div className="logo-container">
            <span className="logo-icon">📈</span>
            <GradientText>
              <h1 className="logo-title">Market Insight</h1>
            </GradientText>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <h2 className="hero-title">
            Your <GradientText>AI-Powered</GradientText><br />
            Stock Market Analyst
          </h2>
          <p className="hero-subtitle">
            Harness the power of artificial intelligence to make smarter investment decisions.
            Get real-time market analysis, insights, and recommendations in seconds.
          </p>
          <div className="hero-cta">
            <AnimatedButton onClick={handleLaunchChat} variant="primary">
              🚀 Launch AI Chat
            </AnimatedButton>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <h3 className="features-heading">
            <GradientText>Powerful Features</GradientText>
          </h3>
          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          <div className="footer-divider"></div>
          <p className="footer-text">
            Powered by TheSys AI • Market data updated in real-time
          </p>
        </footer>
      </div>
    </div>
  )
}
