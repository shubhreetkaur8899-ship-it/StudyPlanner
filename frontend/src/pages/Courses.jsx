import { useState, useEffect } from 'react'
import axios from 'axios'
import './Courses.css'

function Courses() {
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({ name: '', code: '', description: '' })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(response.data.data || [])
    } catch (error) {
      // Handle error silently
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
    try {
      const token = localStorage.getItem('authToken')
      await axios.post('http://localhost:5000/api/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFormData({ name: '', code: '', description: '' })
      setShowForm(false)
      fetchCourses()
    } catch (error) {
      // Handle error silently
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCourses()
    } catch (error) {
      // Handle error silently
    }
  }

  return (
    <div className="courses-container">
      <h1>Courses</h1>
      
      <button onClick={() => setShowForm(!showForm)} className="btn-add">
        {showForm ? 'Cancel' : 'Add New Course'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="course-form">
          <input
            type="text"
            name="name"
            placeholder="Course Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="code"
            placeholder="Course Code"
            value={formData.code}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <button type="submit" className="btn-submit">Create Course</button>
        </form>
      )}

      <div className="courses-grid">
        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.name}</h3>
              <p className="course-code">{course.code}</p>
              <p>{course.description}</p>
              <button onClick={() => handleDelete(course.id)} className="btn-delete">Delete</button>
            </div>
          ))
        ) : (
          <p>No courses yet. Create one to get started!</p>
        )}
      </div>
    </div>
  )
}

export default Courses
