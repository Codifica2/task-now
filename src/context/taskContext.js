import { createContext, useState, useContext } from 'react'

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])

  return (
    <TaskContext.Provider value={{ tasks, setTasks, filteredTasks, setFilteredTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTaskContext = () => {
  return useContext(TaskContext)
}
