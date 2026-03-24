import { useState, useEffect } from 'react'
import axios from 'axios'
import CourseCard from '../components/CourseCard'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({ totalCourses: 0, totalAssignments: 0, dueToday: 0, overdue: 0 })
  const [recentAssignments, setRecentAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [coursesRes, assignmentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/courses', config),
        axios.get('http://localhost:5000/api/assignments', config)
      ])

      setStats({
        totalCourses: coursesRes.data.count || 0,
        totalAssignments: assignmentsRes.data.count || 0,
        dueToday: assignmentsRes.data.data?.filter(a => a.due_date === new Date().toISOString().split('T')[0]).length || 0,
        overdue: assignmentsRes.data.data?.filter(a => a.due_date < new Date().toISOString().split('T')[0] && a.status !== 'completed').length || 0
      })

      setRecentAssignments(assignmentsRes.data.data?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p className="stat-number">{stats.totalCourses}</p>
        </div>
        <div className="stat-card">
          <h3>Total Assignments</h3>
          <p className="stat-number">{stats.totalAssignments}</p>
        </div>
        <div className="stat-card">
          <h3>Due Today</h3>
          <p className="stat-number">{stats.dueToday}</p>
        </div>
        <div className="stat-card overdue">
          <h3>Overdue</h3>
          <p className="stat-number">{stats.overdue}</p>
        </div>
      </div>

      <div className="recent-assignments">
        <h2>Recent Assignments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentAssignments.length > 0 ? (
          <div className="assignment-list">
            {recentAssignments.map(assignment => (
              <div key={assignment.id} className="assignment-item">
                <h4>{assignment.title}</h4>
                <p>Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                <p>Status: <span className={`status ${assignment.status}`}>{assignment.status}</span></p>
              </div>
            ))}
          </div>
        ) : (
          <p>No assignments yet</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
