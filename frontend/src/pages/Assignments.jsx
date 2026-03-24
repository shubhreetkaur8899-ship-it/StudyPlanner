import { useState, useEffect } from 'react'
import axios from 'axios'
import './Assignments.css'

function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({ title: '', description: '', due_date: '', course_id: '', status: 'pending' })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [assignmentsRes, coursesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/assignments', config),
        axios.get('http://localhost:5000/api/courses', config)
      ])

      setAssignments(assignmentsRes.data.data || [])
      setCourses(coursesRes.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
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
      await axios.post('http://localhost:5000/api/assignments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFormData({ title: '', description: '', due_date: '', course_id: '', status: 'pending' })
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating assignment:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`http://localhost:5000/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (error) {
      console.error('Error deleting assignment:', error)
    }
  }

  return (
    <div className="assignments-container">
      <h1>Assignments</h1>
      
      <button onClick={() => setShowForm(!showForm)} className="btn-add">
        {showForm ? 'Cancel' : 'Add New Assignment'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="assignment-form">
          <input
            type="text"
            name="title"
            placeholder="Assignment Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
          <select name="course_id" value={formData.course_id} onChange={handleChange} required>
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className="btn-submit">Create Assignment</button>
        </form>
      )}

      <div className="assignments-list">
        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length > 0 ? (
          assignments.map(assignment => (
            <div key={assignment.id} className="assignment-card">
              <h3>{assignment.title}</h3>
              <p className="description">{assignment.description}</p>
              <p className="due-date">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
              <p className={`status ${assignment.status}`}>Status: {assignment.status}</p>
              <button onClick={() => handleDelete(assignment.id)} className="btn-delete">Delete</button>
            </div>
          ))
        ) : (
          <p>No assignments yet. Create one to get started!</p>
        )}
      </div>
    </div>
  )
}

export default Assignments
