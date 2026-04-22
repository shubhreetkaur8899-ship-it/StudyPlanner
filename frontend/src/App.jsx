import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Assignments from './pages/Assignments'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const name = localStorage.getItem('userName')
    if (token) {
      setIsAuthenticated(true)
      setUserName(name || '')
    }
  }, [])

  const handleLogin = (token, name = '') => {
    localStorage.setItem('authToken', token)
    if (name) localStorage.setItem('userName', name)
    setIsAuthenticated(true)
    setUserName(name)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    setIsAuthenticated(false)
    setUserName('')
  }

  // Wrap protected routes so unauthenticated users are redirected
  const Protected = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" replace />

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} userName={userName} />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route path="/" element={<Protected><Dashboard userName={userName} /></Protected>} />
        <Route path="/courses" element={<Protected><Courses /></Protected>} />
        <Route path="/assignments" element={<Protected><Assignments /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
