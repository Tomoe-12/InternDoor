import { RestApplicationClient } from '@/models/backend'
import Axios from 'axios'
require('dotenv').config()

const httpClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!, 
  headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  withXSRFToken: true,
})

// Request interceptor to add JWT token to headers
httpClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

const backendClient =  Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!, 
  headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  withXSRFToken: true
})

// Request interceptor to add JWT token to headers
backendClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor to extract and store token from login response
backendClient.interceptors.response.use((response) => {
  const url = response.config.url ?? ''

  // Store token if the response is from the login endpoint
  if ((url.includes('api/auth/login')) && response.data?.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.data.token)
    }
  }

  // Clear token on logout
  if (url.includes('api/auth/logout')) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  return response.data
})

export const restClient = new RestApplicationClient(backendClient)

export default httpClient