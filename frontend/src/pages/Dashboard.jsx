import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { coursesAPI, assignmentsAPI } from '../services/api'
import './Dashboard.css'

function Dashboard({ userName }) {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalAssignments: 0,
    completed: 0,
    dueToday: 0,
    overdue: 0
  })
  const [upcomingAssignments, setUpcomingAssignments] = useState([])
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
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const assignments = assignmentsRes.data.data || []

      setStats({
        totalCourses: coursesRes.data.count || 0,
        totalAssignments: assignmentsRes.data.count || 0,
        completed: assignments.filter(a => a.status === 'Completed').length,
        dueToday: assignments.filter(a => a.due_date?.split('T')[0] === today).length,
        overdue: assignments.filter(
          a => a.due_date?.split('T')[0] < today && a.status !== 'Completed'
        ).length
      })

      // Show upcoming: pending assignments due within the next 7 days
      const upcoming = assignments
        .filter(a => {
          const d = a.due_date?.split('T')[0]
          return a.status !== 'Completed' && d >= today && d <= nextWeek
        })
        .slice(0, 6)
      setUpcomingAssignments(upcoming)
    } catch (err) {
      setError('Failed to load dashboard data. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  const firstName = userName ? userName.split(' ')[0] : 'there'

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Hello, {firstName}! 👋</h1>
          <p className="dashboard-subtitle">Here&apos;s your study overview for today.</p>
        </div>
        <div className="header-actions">
          <Link to="/assignments" className="quick-link">+ New Assignment</Link>
          <Link to="/courses" className="quick-link secondary">+ New Course</Link>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Courses</h3>
            <p className="stat-number">{stats.totalCourses}</p>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Assignments</h3>
            <p className="stat-number">{stats.totalAssignments}</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p className="stat-number">{stats.completed}</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Due Today</h3>
            <p className="stat-number">{stats.dueToday}</p>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Overdue</h3>
            <p className="stat-number">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Upcoming assignments section */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Upcoming This Week</h2>
          <Link to="/assignments" className="view-all-link">View all →</Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : upcomingAssignments.length > 0 ? (
          <div className="assignment-list">
            {upcomingAssignments.map(assignment => (
              <div key={assignment.assignment_id} className="assignment-item">
                <div className="assignment-item-left">
                  <h4>{assignment.title}</h4>
                  <p className="course-label">📚 {assignment.course_name || 'Unknown Course'}</p>
                  <p className="due-label">
                    📅 Due: {formatDate(assignment.due_date)}
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
            <p>
              🎉 No pending assignments this week!{' '}
              <Link to="/assignments">Add one</Link> to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
