import { useState, useEffect } from 'react'
import { coursesAPI, assignmentsAPI } from '../services/api'
import './Assignments.css'

function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({
    title: '', description: '', due_date: '', course_id: '', status: 'Pending'
  })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => { setError(''); setSuccess('') }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [assignmentsRes, coursesRes] = await Promise.all([
        assignmentsAPI.getAll(),
        coursesAPI.getAll()
      ])
      setAssignments(assignmentsRes.data.data || [])
      setCourses(coursesRes.data.data || [])
      setError('')
    } catch (err) {
      setError('Failed to load data: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.due_date || !formData.course_id) {
      setError('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        await assignmentsAPI.update(editingId, formData)
        setSuccess('Assignment updated successfully!')
      } else {
        await assignmentsAPI.create(formData)
        setSuccess('Assignment created successfully!')
      }

      setFormData({ title: '', description: '', due_date: '', course_id: '', status: 'Pending' })
      setEditingId(null)
      setShowForm(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const handleEdit = (assignment) => {
    setFormData({
      title: assignment.title,
      description: assignment.description || '',
      due_date: assignment.due_date.split('T')[0],
      course_id: assignment.course_id,
      status: assignment.status
    })
    setEditingId(assignment.assignment_id)
    setShowForm(true)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setFormData({ title: '', description: '', due_date: '', course_id: '', status: 'Pending' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return
    try {
      await assignmentsAPI.delete(id)
      setSuccess('Assignment deleted successfully!')
      // Optimistic update — remove from list immediately
      setAssignments(prev => prev.filter(a => a.assignment_id !== id))
    } catch (err) {
      setError('Failed to delete: ' + (err.response?.data?.message || err.message))
    }
  }

  // Toggle between Pending and Completed without opening the edit form
  const handleToggleStatus = async (assignment) => {
    const newStatus = assignment.status === 'Completed' ? 'Pending' : 'Completed'
    try {
      await assignmentsAPI.update(assignment.assignment_id, { ...assignment, status: newStatus })
      setAssignments(prev =>
        prev.map(a =>
          a.assignment_id === assignment.assignment_id ? { ...a, status: newStatus } : a
        )
      )
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.course_id === courseId)
    return course?.course_name || 'Unknown Course'
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })

  const isOverdue = (dueDate, status) =>
    dueDate.split('T')[0] < new Date().toISOString().split('T')[0] && status !== 'Completed'

  // Client-side filtering by status tab
  const filtered = filter === 'all'
    ? assignments
    : assignments.filter(a => a.status.toLowerCase() === filter)

  const counts = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'Pending').length,
    completed: assignments.filter(a => a.status === 'Completed').length
  }

  return (
    <div className="assignments-container">
      <div className="page-header">
        <div>
          <h1>Assignments</h1>
          <p className="page-subtitle">{assignments.length} total assignment{assignments.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) handleCancel() }}
          className="btn-add"
        >
          {showForm ? '✕ Cancel' : '+ Add Assignment'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="assignment-form">
          <h3>{editingId ? '✏️ Edit Assignment' : '📋 New Assignment'}</h3>

          <input
            type="text"
            name="title"
            placeholder="Assignment Title *"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />

          <div className="form-row">
            <div className="form-field">
              <label>Due Date *</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <select name="course_id" value={formData.course_id} onChange={handleChange} required>
            <option value="">Select Course *</option>
            {courses.map(course => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_name} ({course.course_code})
              </option>
            ))}
          </select>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editingId ? 'Update Assignment' : 'Create Assignment'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div className="filter-tabs">
        {['all', 'pending', 'completed'].map(tab => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="assignments-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading assignments...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(assignment => (
            <div
              key={assignment.assignment_id}
              className={`assignment-card${isOverdue(assignment.due_date, assignment.status) ? ' overdue-card' : ''}`}
            >
              <div className="card-header">
                <h3>{assignment.title}</h3>
                <span className={`status-badge ${assignment.status.toLowerCase()}`}>
                  {assignment.status === 'Completed' ? '✅' : '⏱️'} {assignment.status}
                </span>
              </div>

              <div className="card-body">
                {assignment.description && (
                  <p className="description">{assignment.description}</p>
                )}
                <p className="course">📚 {getCourseName(assignment.course_id)}</p>
                <p className={`due-date${isOverdue(assignment.due_date, assignment.status) ? ' overdue-text' : ''}`}>
                  📅 Due: {formatDate(assignment.due_date)}
                  {isOverdue(assignment.due_date, assignment.status) && (
                    <span className="overdue-label"> · Overdue</span>
                  )}
                </p>
              </div>

              <div className="card-actions">
                {/* Quick status toggle */}
                <button
                  onClick={() => handleToggleStatus(assignment)}
                  className={`btn-toggle ${assignment.status === 'Completed' ? 'undo' : 'done'}`}
                >
                  {assignment.status === 'Completed' ? '↩ Undo' : '✓ Done'}
                </button>
                <button onClick={() => handleEdit(assignment)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(assignment.assignment_id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>
              {filter === 'all'
                ? '📭 No assignments yet. Create one to get started!'
                : `📭 No ${filter} assignments.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Assignments
