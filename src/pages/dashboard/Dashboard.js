/* eslint-disable no-unused-vars */
import styles from './Dashboard.module.css'
import { useTaskContext } from '@/context/taskContext.js'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, InputGroup, FormControl, Button, Modal, ListGroup } from 'react-bootstrap'
import { FaPen, FaTrash } from 'react-icons/fa'
import { ConfirmDeleteTaskModal, EditTaskModal, TaskDetailModal } from '../Modals'
import Filters from './filters/Filters'

export default function ListTasks () {
  const { tasks, setTasks } = useTaskContext()
  const [filterBy, setFilterBy] = useState('')
  const [filters, setFilters] = useState({
    name: '',
    dueDate: '',
    description: '',
    status: '',
    category: ''
  })

  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false)
  const [taskToShow, setTaskToShow] = useState(null)

  const handleFilterChange = (filter, value) => {
    setFilters({
      ...filters,
      [filter]: value
    })
  }

  const clearFilters = () => {
    setFilters({
      name: '',
      dueDate: '',
      description: '',
      status: '',
      category: ''
    })
  }

  const handleDeleteTaskClick = (task) => {
    setTaskToDelete(task)
    setShowDeleteTaskModal(true)
  }

  const handleEditTaskClick = (task) => {
    setTaskToEdit(task)
    setShowEditTaskModal(true)
  }

  const handleTaskClick = async (task) => {
    setTaskToShow(task)
    setShowTaskDetailModal(true)
  }

  const handleCloseTaskDetailModal = () => {
    setShowTaskDetailModal(false)
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterBy === 'title' && filters.name && !task.title.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filterBy === 'description' && filters.description && !task.description.toLowerCase().includes(filters.description.toLowerCase())) return false
    if (filterBy === 'dueDateAsc' && filters.due_date && new Date(task.due_date) !== new Date(filters.due_date)) return false
    if (filterBy === 'dueDateDesc' && filters.due_date && new Date(task.due_date) !== new Date(filters.due_date)) return false
    if (filterBy === 'category' && filters.category && !task.category.toLowerCase().includes(filters.category.toLowerCase())) return false
    if (filterBy === 'state' && filters.status && !task.status.toLowerCase().includes(filters.status.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (filterBy === 'dueDateAsc') {
      return new Date(a.due_date) - new Date(b.due_date)
    } else if (filterBy === 'dueDateDesc') {
      return new Date(b.due_date) - new Date(a.due_date)
    }
    return 0
  })

  const handleConfirmDeleteTask = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`
        throw new Error(message)
      }

      // Actualizar la lista de tareas después de eliminar una
      setTasks(tasks.filter(task => task.id !== taskToDelete.id))

      console.log(`Tarea ${taskToDelete.id} eliminada`)
    } catch (error) {
      console.error('Error al eliminar la tarea:', error)
    }

    setShowDeleteTaskModal(false)
  }

  const handleSaveEditedTask = async (updatedTask) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedTask)
      })

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`
        throw new Error(message)
      }

      // Filter que agrega todas las tareas que existen y reemplaza la tarea que se editó
      setTasks(tasks.filter(task => task.id !== taskToEdit.id).concat({ ...updatedTask, id: taskToEdit.id }))

      console.log(`Tarea ${taskToEdit.id} actualizada`)
    } catch (error) {
      console.error('Error al actualizar la tarea:', error)
    }

    setShowEditTaskModal(false)
  }

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch('http://localhost:3001/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      const data = await response.json()

      // Filtrar las tareas para que se incluyan las creadas por el usuario actual, es decir, usando el user id en localStorage
      const userTasks = data.filter(task => task.creator === JSON.parse(localStorage.getItem('user')).id)

      // Cast due date string to date object to perform sorts and filters later
      const tasksWithDate = userTasks.map(task => {
        const dueDateObject = new Date(task.due_date)

        return ({ ...task, due_date: dueDateObject })
      })

      setTasks(tasksWithDate)
    }
    getTasks()
  }, [])

  return (
    <div className={styles['dashboard-container']}>
      <Filters/>
      <Row className={styles['card-container']}>
        {filteredTasks.map((task) => (
          <Col md={3} key={task.id}>
            <Card onClick={() => handleTaskClick(task)} className={styles.card}>
              <Card.Body>
                <Card.Title className={styles['card-title']}>{task.title}</Card.Title>
                <Card.Text>{task.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <div className="mr-auto">
                  {
                    task.status === 'pending'
                      ? 'Pendiente'
                      : task.status
                  }
                </div>
                <div className={styles.buttons}>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditTaskClick(task)
                    }}
                    className={styles['icon-button']}
                  >
                    <FaPen size={12}/>
                  </Button>

                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTaskClick(task)
                    }}
                    className={styles['icon-button']}
                  >
                    <FaTrash size={12}/>
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <ConfirmDeleteTaskModal show={showDeleteTaskModal} handleClose={() => setShowDeleteTaskModal(false)} handleConfirm={handleConfirmDeleteTask} />
      <EditTaskModal show={showEditTaskModal} taskToEdit={taskToEdit} handleClose={() => setShowEditTaskModal(false)} handleSave={handleSaveEditedTask} />
      <TaskDetailModal show={showTaskDetailModal} handleClose={handleCloseTaskDetailModal} task={taskToShow} />
    </div>
  )
}
