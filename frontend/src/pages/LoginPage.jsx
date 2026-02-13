import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

function LoginPage() {
  const [role, setRole] = useState('citizen')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    // Simulate login - navigate based on role
    if (role === 'citizen') {
      navigate('/report')
    } else if (role === 'admin') {
      navigate('/admin')
    }
  }

  return (
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <h1 className="login-brand-title">CivicSense</h1>
            <p className="login-brand-subtitle">
              AI-Powered Civic Intelligence Platform
            </p>
          </div>

          <div className="login-description">
            <p>
              Transform how cities respond to civic issues. Our platform uses
              advanced AI to prioritize, route, and manage reports efficiently,
              ensuring critical issues get immediate attention.
            </p>
          </div>

          <ul className="login-features">
            <li className="login-feature-item">
              <span className="login-feature-icon">✓</span>
              <span>Smart risk scoring</span>
            </li>
            <li className="login-feature-item">
              <span className="login-feature-icon">✓</span>
              <span>Context-aware prioritization</span>
            </li>
            <li className="login-feature-item">
              <span className="login-feature-icon">✓</span>
              <span>Automatic department routing</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-card-title">Sign In</h2>

          {/* Role Selector */}
          <div className="role-selector">
            <button
              type="button"
              className={`role-button ${role === 'citizen' ? 'role-active' : ''}`}
              onClick={() => setRole('citizen')}
            >
              Citizen
            </button>
            <button
              type="button"
              className={`role-button ${role === 'admin' ? 'role-active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-submit">
              Login as {role === 'citizen' ? 'Citizen' : 'Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
