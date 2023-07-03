/* eslint-disable no-unused-vars */
import styles from './Dashboard.module.css'
import { useResourceContext } from '@/context/resourceContext'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, InputGroup, FormControl, Button, Modal, ListGroup } from 'react-bootstrap'
import { FaPen, FaTrash } from 'react-icons/fa'
import { ConfirmDeleteTaskModal, EditTaskModal, TaskDetailModal } from '../../components/Modals'
import FilterSection from './filters/FilterSection'

export default function ListTasks () {
  const contextValue = useResourceContext()
  if (!contextValue) {
    return <div>Error: Contexto no disponible</div>
  }
  const { tasks, setTasks, filteredTasks, search } = contextValue
  const [tasksToShow, setTasksToShow] = useState([])

  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false)
  const [taskToShow, setTaskToShow] = useState(null)

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
        const creationDateObject = new Date(task.creationDate)

        return ({ ...task, due_date: dueDateObject, creationDate: creationDateObject })
      })

      setTasks(tasksWithDate)
      setTasksToShow(tasksWithDate)
    }
    getTasks()
  }, [])

  useEffect(() => {
    const filteredTasksIds = filteredTasks.map(task => task.id)

    setTasksToShow(
      tasks
        .filter(task => {
          if (search !== '' && filteredTasks.length !== 0) {
            return (task.title.toLowerCase().includes(search.toLowerCase()) && filteredTasksIds.includes(task.id))
          } else if (search !== '') {
            return (task.title.toLowerCase().includes(search.toLowerCase()))
          } else if (filteredTasks.length !== 0) {
            return (filteredTasksIds.includes(task.id))
          } else {
            return (true)
          }
        })
    )
  }, [search, filteredTasks])

  return (
    <Row style={{ margin: 0, padding: 0 }}>
      <Container className={styles['dashboard-container']}>
        <FilterSection/>
        <Row className={styles['card-container']}>
          {tasksToShow.map((task) => (
            <Col md={3} key={task.id}>
              <Card onClick={() => handleTaskClick(task)} className={styles.card}>
                <Card.Body>
                  <Card.Title className={styles['card-title']}>{task.title}</Card.Title>
                  <Card.Text>
                    {task.description}
                  </Card.Text>
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
      </Container>
    </Row>
  )
}
