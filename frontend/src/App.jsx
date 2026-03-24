import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Assignments from './pages/Assignments'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userToken, setUserToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setUserToken(token)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token)
    setUserToken(token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setUserToken(null)
    setIsAuthenticated(false)
  }

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login onLogin={handleLogin} />} />
        <Route path="/courses" element={isAuthenticated ? <Courses /> : <Login onLogin={handleLogin} />} />
        <Route path="/assignments" element={isAuthenticated ? <Assignments /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  )
}

export default App
