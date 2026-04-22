import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (isSignup && (name === 'confirmPassword' || name === 'password')) {
      setPasswordMatch(
        name === 'password'
          ? value === formData.confirmPassword
          : value === formData.password
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isSignup && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }

    setLoading(true)

    try {
      const endpoint = isSignup ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`
      const payload = isSignup
        ? { name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword }
        : { email: formData.email, password: formData.password }

      const response = await axios.post(endpoint, payload)

      if (response.data.success) {
        const { token, user } = response.data.data
        onLogin(token, user?.name || '')
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsSignup(!isSignup)
    setFormData({ email: '', password: '', confirmPassword: '', name: '' })
    setError('')
    setPasswordMatch(true)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">📚</span>
          <h1>StudyPlanner</h1>
        </div>
        <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="login-subtitle">
          {isSignup ? 'Start tracking your assignments today' : 'Sign in to your account'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={!passwordMatch && formData.confirmPassword ? 'input-error' : ''}
              />
              {formData.confirmPassword && (
                <small className={passwordMatch ? 'match-success' : 'match-error'}>
                  {passwordMatch ? '✅ Passwords match' : '❌ Passwords do not match'}
                </small>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (isSignup && !passwordMatch)}
            className="btn-primary"
          >
            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="toggle-auth">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={switchMode} className="link-button">
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
