import { useState, useEffect } from 'react'
import axios from 'axios'
import './Courses.css'

function Courses() {
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({ course_name: '', course_code: '', semester: '' })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = 'http://localhost:5000/api'

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_BASE}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(response.data.data || [])
    } catch (error) {
      setError('Failed to load courses')
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
    setError('')
    setSuccess('')

    // Validate required fields
    if (!formData.course_name || !formData.course_code) {
      setError('Course Name and Code are required!')
      return
    }

    try {
      const token = localStorage.getItem('authToken')

      if (editingId) {
        // UPDATE
        await axios.put(`${API_BASE}/courses/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('Course updated successfully!')
        setEditingId(null)
      } else {
        // CREATE
        await axios.post(`${API_BASE}/courses`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('Course created successfully!')
      }

      setFormData({ course_name: '', course_code: '', semester: '' })
      setShowForm(false)
      fetchCourses()
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving course')
    }
  }

  const handleEdit = (course) => {
    setFormData({
      course_name: course.course_name,
      course_code: course.course_code,
      semester: course.semester || ''
    })
    setEditingId(course.course_id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return

    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`${API_BASE}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Course deleted successfully!')
      fetchCourses()
    } catch (error) {
      setError('Error deleting course')
    }
  }

  const handleCancel = () => {
    setFormData({ course_name: '', course_code: '', semester: '' })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  return (
    <div className="courses-container">
      <h1>📚 Courses Management</h1>

      {error && <div className="error-message">❌ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}

      <button onClick={() => setShowForm(!showForm)} className="btn-add">
        {showForm ? '✕ Cancel' : '+ Add New Course'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="course-form">
          <h3>{editingId ? 'Edit Course' : 'Create New Course'}</h3>
          
          <input
            type="text"
            name="course_name"
            placeholder="Course Name (e.g., Web Development)"
            value={formData.course_name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course_code"
            placeholder="Course Code (e.g., CS101)"
            value={formData.course_code}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="semester"
            placeholder="Semester (e.g., Spring 2026)"
            value={formData.semester}
            onChange={handleChange}
          />

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editingId ? '✏️ Update Course' : '✨ Create Course'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="courses-grid">
        {loading ? (
          <p className="loading">Loading courses...</p>
        ) : courses.length > 0 ? (
          courses.map(course => (
            <div key={course.course_id} className="course-card">
              <div className="card-header">
                <h3>{course.course_name}</h3>
                <span className="course-code-badge">{course.course_code}</span>
              </div>

              <div className="card-body">
                {course.semester && (
                  <p className="semester">📅 <strong>Semester:</strong> {course.semester}</p>
                )}
                <p className="created-date">📆 Created: {new Date(course.created_at).toLocaleDateString()}</p>
              </div>

              <div className="card-actions">
                <button 
                  onClick={() => handleEdit(course)} 
                  className="btn-edit"
                  title="Edit course"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDelete(course.course_id)} 
                  className="btn-delete"
                  title="Delete course"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-courses">📭 No courses yet. Create one to get started!</p>
        )}
      </div>
    </div>
  )
}

export default Courses
