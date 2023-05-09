/* eslint-disable no-unused-vars */
import React, { createContext, useState, useContext } from 'react'

// Creamos un nuevo contexto para el usuario
export const UserContext = createContext()

// Creamos un componente de Proveedor que maneje el estado del usuario
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

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
