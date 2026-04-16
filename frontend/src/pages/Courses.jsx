import { useState, useEffect } from 'react'
import { coursesAPI } from '../services/api'
import './Courses.css'

function Courses() {
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({ course_name: '', course_code: '', semester: '' })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll()
      setCourses(response.data.data || [])
    } catch (err) {
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

    if (!formData.course_name || !formData.course_code) {
      setError('Course Name and Code are required!')
      return
    }

    try {
      if (editingId) {
        await coursesAPI.update(editingId, formData)
        setSuccess('Course updated successfully!')
        setEditingId(null)
      } else {
        await coursesAPI.create(formData)
        setSuccess('Course created successfully!')
      }

      setFormData({ course_name: '', course_code: '', semester: '' })
      setShowForm(false)
      fetchCourses()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving course')
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
      await coursesAPI.delete(id)
      setSuccess('Course deleted successfully!')
      fetchCourses()
    } catch (err) {
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
      <div className="page-header">
        <h1>Courses</h1>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) handleCancel() }}
          className="btn-add"
        >
          {showForm ? '✕ Cancel' : '+ Add Course'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="course-form">
          <h3>{editingId ? 'Edit Course' : 'Create New Course'}</h3>

          <input
            type="text"
            name="course_name"
            placeholder="Course Name (e.g., Web Development) *"
            value={formData.course_name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course_code"
            placeholder="Course Code (e.g., CS101) *"
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
              {editingId ? 'Update Course' : 'Create Course'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="courses-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : courses.length > 0 ? (
          courses.map(course => (
            <div key={course.course_id} className="course-card">
              <div className="card-header">
                <h3>{course.course_name}</h3>
                <span className="course-code-badge">{course.course_code}</span>
              </div>

              <div className="card-body">
                {course.semester && (
                  <p className="semester">📅 {course.semester}</p>
                )}
                <p className="created-date">Created: {new Date(course.created_at).toLocaleDateString()}</p>
              </div>

              <div className="card-actions">
                <button onClick={() => handleEdit(course)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(course.course_id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>📭 No courses yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
