import { createContext, useState, useContext } from 'react'

const ResourceContext = createContext()

export const ResourceProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [categories, setCategories] = useState([])

  return (
    <ResourceContext.Provider value={{ tasks, setTasks, filteredTasks, setFilteredTasks, categories, setCategories }}>
      {children}
    </ResourceContext.Provider>
  )
}

export const useResourceContext = () => {
  return useContext(ResourceContext)
}
