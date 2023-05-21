/* eslint-disable no-unused-vars */
import { Navbar, Nav, Row, Button } from 'react-bootstrap'
import styles from './Header.module.css'
import { useState } from 'react'
import { useResourceContext } from '@/context/resourceContext.js'
import { CreateTaskModal, EditUserModal, EditPasswordModal } from '../Modals'
import NavDropdown from 'react-bootstrap/NavDropdown'

export default function Header () {
  const { tasks, setTasks } = useResourceContext()

  const handleLogout = () => {
    // Elimina la información del usuario del localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // Redirige al usuario a la ruta raíz
    window.location.href = '/'
  }

  // Profile editing modal
  const [showEditUserModal, setShowEditUserModal] = useState(false)

  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false)
  }

  // Task creation modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)

  const handleCloseCreateTaskModal = () => {
    setShowCreateTaskModal(false)
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

    let savedTask = await response.json()
    const savedTaskCreationDate = new Date(savedTask.creationDate)
    const savedtaskDueDate = new Date(savedTask.due_date)
    savedTask = { ...savedTask, creationDate: savedTaskCreationDate, due_date: savedtaskDueDate }

    // Aquí puedes añadir la tarea recién creada a tu lista de tareas.
    setTasks([...tasks, savedTask])
    setShowCreateTaskModal(false)
  }
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false)
  const handleOpenEditPasswordModal = () => {
    setShowEditPasswordModal(true)
  }
  const handleCloseEditPasswordModal = () => {
    setShowEditPasswordModal(false)
  }
  return (
    <Row style={{ margin: 0, padding: 0 }}>
      <Navbar className={styles['navbar-custom']}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand href="/">TaskNow</Navbar.Brand>

        {/* Profile editing modal */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={styles['navbar-nav']}>
            <Button
              variant="primary"
              onClick={() => setShowCreateTaskModal(true)}
            >
              Crear una nueva tarea
            </Button>

            <NavDropdown title="Opciones" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => setShowEditUserModal(true)}> Editar perfil </NavDropdown.Item>
              <NavDropdown.Item onClick={handleOpenEditPasswordModal}> Cambiar <br />contraseña </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}> Cerrar sesión </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <EditUserModal show={showEditUserModal} handleClose={handleCloseEditUserModal} />
      <EditPasswordModal show={showEditPasswordModal} handleClose={handleCloseEditPasswordModal} />
      <CreateTaskModal show={showCreateTaskModal} handleClose={handleCloseCreateTaskModal} handleSave={handleSaveTask} />
    </Row>
  )
}
