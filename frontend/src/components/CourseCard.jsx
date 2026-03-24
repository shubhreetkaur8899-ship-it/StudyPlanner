function CourseCard({ course, onDelete }) {
  return (
    <div className="course-card">
      <h3>{course.name}</h3>
      <p className="course-code">{course.code}</p>
      <p>{course.description}</p>
      <button onClick={() => onDelete(course.id)} className="btn-delete">Delete</button>
    </div>
  )
}

export default CourseCard
