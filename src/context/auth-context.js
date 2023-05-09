/* eslint-disable no-unused-vars */
import React, { createContext, useState, useContext, useEffect } from 'react'

// Creamos un nuevo contexto para el usuario
export const UserContext = createContext()

// Creamos un componente de Proveedor que maneje el estado del usuario
export const UserProvider = ({ children }) => {
  // Inicializamos el estado con los valores almacenados en localStorage
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const localUser = localStorage.getItem('user')
      return localUser ? JSON.parse(localUser) : null
    }
    return null
  })
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  })

  // Cuando el usuario o el token cambien, actualizamos localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    }
  }, [user])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  }, [token])

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  )
}

// Creamos un hook personalizado que permita acceder fácilmente al contexto del usuario
export const useUserContext = () => {
  return useContext(UserContext)
}
