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
      }
    } else {
      window.location.reload()
    }
  }, [])
  return (
    <>
      <TaskProvider>
        <Header/>
        <div>
          <Dashboard />
        </div>
      </TaskProvider>
    </>
  )
}

export default withAuth(Home) // envuelve tu componente con el HOC antes de exportarlo
