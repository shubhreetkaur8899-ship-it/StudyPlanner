import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`
  }
})

export const authAPI = {
  login: (email, password) => 
    axios.post(`${API_BASE}/auth/login`, { email, password }),
  
  register: (email, password, name) => 
    axios.post(`${API_BASE}/auth/register`, { email, password, name })
}

export const coursesAPI = {
  getAll: () => 
    axios.get(`${API_BASE}/courses`, getConfig()),
  
  getOne: (id) => 
    axios.get(`${API_BASE}/courses/${id}`, getConfig()),
  
  create: (data) => 
    axios.post(`${API_BASE}/courses`, data, getConfig()),
  
  update: (id, data) => 
    axios.put(`${API_BASE}/courses/${id}`, data, getConfig()),
  
  delete: (id) => 
    axios.delete(`${API_BASE}/courses/${id}`, getConfig())
}

export const assignmentsAPI = {
  getAll: () => 
    axios.get(`${API_BASE}/assignments`, getConfig()),
  
  getOne: (id) => 
    axios.get(`${API_BASE}/assignments/${id}`, getConfig()),
  
  create: (data) => 
    axios.post(`${API_BASE}/assignments`, data, getConfig()),
  
  update: (id, data) => 
    axios.put(`${API_BASE}/assignments/${id}`, data, getConfig()),
  
  delete: (id) => 
    axios.delete(`${API_BASE}/assignments/${id}`, getConfig())
}
