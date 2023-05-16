/* eslint-disable no-unused-vars */
import { TaskProvider } from '@/context/taskContext.js'
import withAuth from '../../withAuth'
import { useUserContext } from '@/context/auth-context.js'

import Header from './header/Header'
import Dashboard from './dashboard/Dashboard'
import React, { useEffect, useState } from 'react'
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

function Home () {
  const [isLoading, setIsLoading] = useState(true)
  const { setUser, setToken } = useUserContext()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwt_decode(token)
      const currentTime = Date.now() / 1000
      if (decodedToken.exp < currentTime) {
        setUser(null)
        setToken(null)
        window.location.reload()
      } else {
        setIsLoading(false)
      }
    } else {
      window.location.reload()
    }
  }, [])
  if (isLoading) {
    return (
      <div className="text-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border" style={{ width: '5rem', height: '5rem', borderWidth: '0.6rem' }} role="status">
        </div>
      </div>
    )
  } else {
    return (
      <TaskProvider>
        <Header />
        <Dashboard />
      </TaskProvider>
    )
  }
}

export default withAuth(Home) // envuelve tu componente con el HOC antes de exportarlo
