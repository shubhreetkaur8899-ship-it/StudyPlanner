import { useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand" onClick={() => navigate('/')}>StudyPlanner</h1>
        <ul className="nav-links">
          <li><a onClick={() => navigate('/')}>Dashboard</a></li>
          <li><a onClick={() => navigate('/courses')}>Courses</a></li>
          <li><a onClick={() => navigate('/assignments')}>Assignments</a></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
