import { C1Chat, ThemeProvider } from '@thesysai/genui-sdk'
import '@crayonai/react-ui/styles/index.css'
import { useState, useCallback, useRef, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ErrorBoundary from '../components/ErrorBoundary'
import './Chat.css'

// Recommendation data
const RECOMMENDATIONS = [
  {
    icon: '📊',
    text: "Analyze the Indian stock market with today's key signals"
  },
  {
    icon: '🧭',
    text: "Analyse Conditions of Large, Mid and Small Cap in Indian Market"
  },
  {
    icon: '📰',
    text: 'Track major stock market events shaping investor sentiment'
  },
  {
    icon: '🌍',
    text: 'How global news connects with Indian market movements'
  }
]

// Custom hook for sending messages programmatically
function useMessageSender() {
  const sendMessage = useCallback((text: string) => {
    document.body.setAttribute('data-programmatic-interaction', 'true')

    setTimeout(() => {
      const inputElement = document.querySelector(
        'textarea, input[type="text"], [contenteditable="true"]'
      ) as HTMLTextAreaElement | HTMLInputElement | HTMLElement

      if (inputElement) {
        if ('value' in inputElement) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            inputElement instanceof HTMLTextAreaElement
              ? window.HTMLTextAreaElement.prototype
              : window.HTMLInputElement.prototype,
            'value'
          )?.set

          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(inputElement, text)
          }

          inputElement.dispatchEvent(new Event('input', { bubbles: true }))
          inputElement.dispatchEvent(new Event('change', { bubbles: true }))
        } else if (inputElement.isContentEditable) {
          inputElement.textContent = text
          inputElement.dispatchEvent(new Event('input', { bubbles: true }))
        }

        setTimeout(() => {
          const sendButton = document.querySelector(
            'button[type="submit"], button[aria-label*="send" i]'
          ) as HTMLButtonElement

          if (sendButton) {
            sendButton.click()
          } else {
            const form = inputElement.closest('form')
            if (form) {
              form.requestSubmit()
            }
          }

          setTimeout(() => {
            document.body.removeAttribute('data-programmatic-interaction')
          }, 100)
        }, 300)
      } else {
        document.body.removeAttribute('data-programmatic-interaction')
      }
    }, 100)
  }, [])

  return sendMessage
}

export default function Chat() {
  const [showRecommendations, setShowRecommendations] = useState(true)
  const [hasMessages, setHasMessages] = useState(false)
  const sendMessage = useMessageSender()
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const handleRecommendationClick = useCallback((text: string) => {
    setShowRecommendations(false)
    setHasMessages(true)
    sendMessage(text)
  }, [sendMessage])

  useEffect(() => {
    const handleInput = () => {
      if (showRecommendations) {
        setHasMessages(true)
        setShowRecommendations(false)
      }
    }

    const handleSubmit = () => {
      setHasMessages(true)
      setShowRecommendations(false)
    }

    const timeout = setTimeout(() => {
      const inputElement = document.querySelector('textarea, input[type="text"]')
      if (inputElement) {
        inputElement.addEventListener('input', handleInput)
        inputElement.addEventListener('keydown', handleInput)
      }

      const form = document.querySelector('form')
      if (form) {
        form.addEventListener('submit', handleSubmit)
      }

      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (
          target.matches('button[type="submit"], button[aria-label*="send" i]') ||
          target.closest('button[type="submit"], button[aria-label*="send" i]')
        ) {
          handleSubmit()
        }
      })
    }, 500)

    return () => {
      clearTimeout(timeout)
      const inputElement = document.querySelector('textarea, input[type="text"]')
      if (inputElement) {
        inputElement.removeEventListener('input', handleInput)
        inputElement.removeEventListener('keydown', handleInput)
      }
      const form = document.querySelector('form')
      if (form) {
        form.removeEventListener('submit', handleSubmit)
      }
    }
  }, [showRecommendations])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.textContent?.toLowerCase().includes('new chat') ||
        target.getAttribute('aria-label')?.toLowerCase().includes('new chat')
      ) {
        setHasMessages(false)
        setTimeout(() => setShowRecommendations(true), 100)

        setTimeout(() => {
          const menuButton = document.querySelector('[aria-label*="menu" i], [aria-label*="close" i]') as HTMLElement
          const backdrop = document.querySelector('[class*="backdrop" i], [class*="overlay" i]') as HTMLElement

          if (menuButton && window.innerWidth < 768) {
            menuButton.click()
          } else if (backdrop && window.innerWidth < 768) {
            backdrop.click()
          }
        }, 200)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    if (!showRecommendations || hasMessages) {
      const injected = document.querySelector('.recommendations-overlay')
      if (injected) {
        injected.remove()
      }
      return
    }

    const injectRecommendations = () => {
      if (document.querySelector('.recommendations-overlay')) {
        return
      }

      const inputElement = document.querySelector('textarea, input[type="text"]')
      if (!inputElement) {
        return
      }

      const targetContainer = inputElement.closest('[class*="container"], [class*="wrapper"], form, div') as HTMLElement
      if (!targetContainer) {
        return
      }

      const overlay = document.createElement('div')
      overlay.className = 'recommendations-overlay'

      const container = document.createElement('div')
      container.className = 'recommendations-container'

      RECOMMENDATIONS.forEach((rec) => {
        const box = document.createElement('div')
        box.className = 'recommendation-box'
        box.setAttribute('role', 'button')
        box.setAttribute('tabindex', '0')

        const icon = document.createElement('span')
        icon.className = 'recommendation-icon'
        icon.textContent = rec.icon

        const text = document.createElement('p')
        text.className = 'recommendation-text'
        text.textContent = rec.text

        box.appendChild(icon)
        box.appendChild(text)

        box.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          handleRecommendationClick(rec.text)
        }, { capture: true })

        container.appendChild(box)
      })

      overlay.appendChild(container)
      targetContainer.insertAdjacentElement('beforebegin', overlay)
    }

    const timeout1 = setTimeout(injectRecommendations, 500)
    const timeout2 = setTimeout(injectRecommendations, 1000)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      const injected = document.querySelector('.recommendations-overlay')
      if (injected) {
        injected.remove()
      }
    }
  }, [showRecommendations, hasMessages, handleRecommendationClick])

  return (
    <div className="chat-page">
      <div className="animated-background"></div>
      <Navigation showBackButton={true} />
      <div className="chat-container" ref={chatContainerRef}>
        <ErrorBoundary fallback={<div className="chat-error-state">
          <h3>Chat Initialization Failed</h3>
          <p>We're having trouble connecting to the AI assistant. Please check your internet connection and try again.</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>}>
          <ThemeProvider mode="dark">
            <C1Chat
              apiUrl={import.meta.env.VITE_API_URL || "https://marketinsight-skgl.onrender.com/api/chat"}
              agentName="Market Insight"
              logoUrl="/icon.png"
              formFactor="full-page"
            />
          </ThemeProvider>
        </ErrorBoundary>
      </div>
    </div>
  )
}
