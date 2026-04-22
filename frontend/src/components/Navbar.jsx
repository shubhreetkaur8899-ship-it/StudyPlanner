import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar({ onLogout, userName }) {
  const navigate = useNavigate()
  const firstName = userName ? userName.split(' ')[0] : ''

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  // NavLink className helper — adds "active" when route matches
  const linkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className="navbar-brand" onClick={() => navigate('/')}>
          📚 StudyPlanner
        </span>
        <ul className="nav-links">
          <li><NavLink to="/" end className={linkClass}>Dashboard</NavLink></li>
          <li><NavLink to="/courses" className={linkClass}>Courses</NavLink></li>
          <li><NavLink to="/assignments" className={linkClass}>Assignments</NavLink></li>
          {firstName && <li className="nav-greeting">Hi, {firstName}</li>}
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
