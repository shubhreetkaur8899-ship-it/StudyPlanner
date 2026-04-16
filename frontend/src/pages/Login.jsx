import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Login.css'

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
    
    // Check if passwords match when confirm password changes
    if (name === 'confirmPassword' || name === 'password') {
      if (isSignup) {
        setPasswordMatch(
          name === 'password' 
            ? value === (formData.confirmPassword || '') 
            : value === (formData.password || '')
        )
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate passwords match for signup
    if (isSignup && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }

    setLoading(true)

    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login'
      const payload = isSignup 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password }
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload)
      
      if (response.data.success) {
        onLogin(response.data.data.token)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>📚 StudyPlanner</h1>
        <h2>{isSignup ? 'Create Account' : 'Login'}</h2>
        
        {error && <div className="error-message">❌ {error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <small className="password-hint">Password must be at least 6 characters</small>
          </div>
          
          {isSignup && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
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
            {loading ? '⏳ Loading...' : (isSignup ? '✨ Sign Up' : '🔓 Login')}
          </button>
        </form>
        
        <p className="toggle-auth">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup)
              setFormData({ email: '', password: '', confirmPassword: '', name: '' })
              setError('')
              setPasswordMatch(true)
            }}
            className="link-button"
          >
            {isSignup ? '🔓 Login' : '✨ Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
