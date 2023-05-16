/* eslint-disable no-unused-vars */
import { Inter } from 'next/font/google'
import { Navbar, Nav, Container, Modal, Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './Header.module.css'
import { useState } from 'react'
import { useTaskContext } from '@/context/taskContext.js'
import { CreateTaskModal, EditUserModal, EditPasswordModal } from '../Modals'
import NavDropdown from 'react-bootstrap/NavDropdown'

const inter = Inter({ subsets: ['latin'] })

export default function Header () {
  const { tasks, setTasks } = useTaskContext()

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

  const handleUpdateProfile = () => {
    console.log('update profile')
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

    const savedTask = await response.json()
    console.log(savedTask)

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
    <>
      <Navbar className={styles['navbar-custom']}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Brand className={styles['nav-link']} href="/">TaskNow</Navbar.Brand>

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
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}> Cerrar sesión </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
      </Navbar>
      <EditUserModal show={showEditUserModal} handleClose={handleCloseEditUserModal} />
      <CreateTaskModal show={showCreateTaskModal} handleClose={handleCloseCreateTaskModal} handleSave={handleSaveTask} />
    </>
  )
}
