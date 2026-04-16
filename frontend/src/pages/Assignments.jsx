import { useState, useEffect } from 'react'
import { coursesAPI, assignmentsAPI } from '../services/api'
import './Assignments.css'

function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({ title: '', description: '', due_date: '', course_id: '', status: 'Pending' })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 3000)
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
  }

  const handleCancel = () => {
    setFormData({ title: '', description: '', due_date: '', course_id: '', status: 'Pending' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return
    try {
      await assignmentsAPI.delete(id)
      setSuccess('Assignment deleted successfully!')
      fetchData()
    } catch (err) {
      setError('Failed to delete: ' + (err.response?.data?.message || err.message))
    }
  }

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.course_id === courseId)
    return course?.course_name || 'Unknown Course'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const isOverdue = (dueDate, status) => {
    return dueDate.split('T')[0] < new Date().toISOString().split('T')[0] && status !== 'Completed'
  }

  return (
    <div className="assignments-container">
      <div className="page-header">
        <h1>Assignments</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) handleCancel()
          }}
          className="btn-add"
        >
          {showForm ? '✕ Cancel' : '+ Add Assignment'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="assignment-form">
          <h3>{editingId ? 'Edit Assignment' : 'New Assignment'}</h3>

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

      <div className="assignments-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading assignments...</p>
          </div>
        ) : assignments.length > 0 ? (
          assignments.map(assignment => (
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
                  {isOverdue(assignment.due_date, assignment.status) && <span className="overdue-label"> · Overdue</span>}
                </p>
              </div>

              <div className="card-actions">
                <button onClick={() => handleEdit(assignment)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(assignment.assignment_id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>📭 No assignments yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Assignments
