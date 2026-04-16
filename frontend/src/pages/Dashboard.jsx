import { useState, useEffect } from 'react'
import { coursesAPI, assignmentsAPI } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({ totalCourses: 0, totalAssignments: 0, dueToday: 0, overdue: 0 })
  const [recentAssignments, setRecentAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, assignmentsRes] = await Promise.all([
        coursesAPI.getAll(),
        assignmentsAPI.getAll()
      ])

      const today = new Date().toISOString().split('T')[0]
      const assignments = assignmentsRes.data.data || []

      setStats({
        totalCourses: coursesRes.data.count || 0,
        totalAssignments: assignmentsRes.data.count || 0,
        dueToday: assignments.filter(a => a.due_date?.split('T')[0] === today).length,
        overdue: assignments.filter(a => a.due_date?.split('T')[0] < today && a.status !== 'Completed').length
      })

      setRecentAssignments(assignments.slice(0, 5))
    } catch (err) {
      setError('Failed to load dashboard data. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here&apos;s your study overview.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Total Courses</h3>
            <p className="stat-number">{stats.totalCourses}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Total Assignments</h3>
            <p className="stat-number">{stats.totalAssignments}</p>
          </div>
        </div>
        <div className="stat-card today-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Due Today</h3>
            <p className="stat-number">{stats.dueToday}</p>
          </div>
        </div>
        <div className="stat-card overdue-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Overdue</h3>
            <p className="stat-number">{stats.overdue}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Assignments</h2>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : recentAssignments.length > 0 ? (
          <div className="assignment-list">
            {recentAssignments.map(assignment => (
              <div key={assignment.assignment_id} className="assignment-item">
                <div className="assignment-item-left">
                  <h4>{assignment.title}</h4>
                  <p className="course-label">📚 {assignment.course_name || 'Unknown Course'}</p>
                  <p className="due-label">
                    📅 Due: {new Date(assignment.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <span className={`status-pill ${assignment.status.toLowerCase()}`}>
                  {assignment.status === 'Completed' ? '✅' : '⏱️'} {assignment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>📭 No assignments yet. <a href="/assignments">Create one</a> to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
