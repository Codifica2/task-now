/* eslint-disable no-unused-vars */
import styles from './Dashboard.module.css'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, InputGroup, FormControl, Button, Modal, ListGroup } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { CreateTaskModal, ConfirmDeleteTaskModal } from './Modals'

export default function ListTasks () {
  const [tasks, setTasks] = useState([])
  const [filterBy, setFilterBy] = useState('')
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const handleCreateTask = () => {
    setShowCreateTaskModal(true)
  }

  const handleCloseCreateTaskModal = () => {
    setShowCreateTaskModal(false)
  }

  const handleDeleteTaskClick = (task) => {
    setTaskToDelete(task)
    setShowDeleteTaskModal(true)
  }

  const handleSaveTask = async (task) => {
    const response = await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(task)
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`
      throw new Error(message)
    }

    const savedTask = await response.json()
    console.log(savedTask)

    // Aquí puedes añadir la tarea recién creada a tu lista de tareas.
    setTasks([...tasks, savedTask])
    setShowCreateTaskModal(false)
  }

  const handleConfirmDeleteTask = async () => {
    console.log(`Eliminando tarea ${taskToDelete.id}`)
    setShowDeleteTaskModal(false)
  }

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch('http://localhost:3001/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setTasks(data)
      console.log(data)
    }
    getTasks()
  }, [])

  const filteredTasks = tasks

  return (
    <Container>

      <Row>
        <InputGroup className="mt-3">
          <Col xs={12} className="my-col-button text-center">
            <Button variant="primary" className="my-custom-button" onClick={handleCreateTask}>Crear tarea</Button>
          </Col>
          <Col xs={10}>
            <br></br>

            <Form.Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}
              style={{ backgroundColor: '#F5F5F5', color: '#012840' }}
            >
              <option value="">Filtrar y ordenar por...</option>
              <option value="title">Título</option>
              <option value="description">Descripcion</option>
              <option value="date" >Fecha de vencimiento</option>
              <option value="category">Categoría</option>
              <option value="state">Estado</option>
            </Form.Select>

          </Col>
        </InputGroup>
      </Row>
      <Row className="card-columns">
        {tasks.map((task) => (
          <Col xs={12} sm={6} md={4} key={task.id}>
            <br />
            <Card>
              <Card.Body>
                <Card.Title>{task.title}</Card.Title>
                <Card.Text>{task.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <div className="mr-auto">{task.status}</div>
                <div>
                  <Button variant="primary"><FaEdit /></Button>
                  <Button variant="danger" onClick={() => handleDeleteTaskClick(task)}><FaTrash /></Button>
                </div>
              </Card.Footer>
            </Card>
            <br />
          </Col>
        ))}
      </Row>
      <CreateTaskModal show={showCreateTaskModal} handleClose={handleCloseCreateTaskModal} handleSave={handleSaveTask} />
      <ConfirmDeleteTaskModal show={showDeleteTaskModal} handleClose={() => setShowDeleteTaskModal(false)} handleConfirm={handleConfirmDeleteTask} />
    </Container>
  )
}
