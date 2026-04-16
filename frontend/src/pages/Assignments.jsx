import { useState, useEffect } from 'react'
import axios from 'axios'
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

  // Auto-clear messages after 3 seconds
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
      const token = localStorage.getItem('authToken')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [assignmentsRes, coursesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/assignments', config),
        axios.get('http://localhost:5000/api/courses', config)
      ])

      setAssignments(assignmentsRes.data.data || [])
      setCourses(coursesRes.data.data || [])
      setError('')
    } catch (error) {
      setError('❌ Failed to load assignments: ' + (error.response?.data?.message || error.message))
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
      setError('❌ Please fill in all required fields')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      if (editingId) {
        // Update existing assignment
        await axios.put(`http://localhost:5000/api/assignments/${editingId}`, formData, config)
        setSuccess('✅ Assignment updated successfully!')
      } else {
        // Create new assignment
        await axios.post('http://localhost:5000/api/assignments', formData, config)
        setSuccess('✅ Assignment created successfully!')
      }

      setFormData({ title: '', description: '', due_date: '', course_id: '', status: 'Pending' })
      setEditingId(null)
      setShowForm(false)
      fetchData()
    } catch (error) {
      setError('❌ ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEdit = (assignment) => {
    setFormData({
      title: assignment.title,
      description: assignment.description || '',
      due_date: assignment.due_date.split('T')[0], // Format date for input
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
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const token = localStorage.getItem('authToken')
        await axios.delete(`http://localhost:5000/api/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('✅ Assignment deleted successfully!')
        fetchData()
      } catch (error) {
        setError('❌ Failed to delete assignment: ' + (error.response?.data?.message || error.message))
      }
    }
  }

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.course_id === courseId)
    return course?.course_name || 'Unknown Course'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="assignments-container">
      <h1>📋 Assignments</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button onClick={() => setShowForm(!showForm)} className="btn-add">
        {showForm ? '❌ Cancel' : '➕ Add New Assignment'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="assignment-form">
          <h3>{editingId ? '✏️ Edit Assignment' : '📝 New Assignment'}</h3>
          
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
          
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
          
          <select name="course_id" value={formData.course_id} onChange={handleChange} required>
            <option value="">Select Course *</option>
            {courses.map(course => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_name} ({course.course_code})
              </option>
            ))}
          </select>
          
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editingId ? '💾 Update Assignment' : '➕ Create Assignment'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      <div className="assignments-grid">
        {loading ? (
          <p className="loading">⏳ Loading assignments...</p>
        ) : assignments.length > 0 ? (
          assignments.map(assignment => (
            <div key={assignment.assignment_id} className="assignment-card">
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
                <p className="due-date">📅 Due: {formatDate(assignment.due_date)}</p>
              </div>
              
              <div className="card-actions">
                <button 
                  onClick={() => handleEdit(assignment)} 
                  className="btn-edit"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDelete(assignment.assignment_id)} 
                  className="btn-delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-assignments">📭 No assignments yet. Create one to get started!</p>
        )}
      </div>
    </div>
  )
}

export default Assignments
