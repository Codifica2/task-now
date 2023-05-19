/* eslint-disable */
import React from 'react'
import { expect } from 'chai'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import Home from '@/pages/index.js'
import { UserProvider } from '@/context/auth-context.js'
import { TaskProvider } from '@/context/taskContext'

describe('<Home />', () => {
  beforeEach(() => {
    // Mock de LocalStorage, token de prueba que expira el 2030
    window.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4ODg2NzE2MDB9.uh4G4R_qys9B8vVOd2VM3owHYkNZjIhpSCooG9z5UOs')
  })

  afterEach(() => {
    // Clear all instances and calls to constructor and all methods:
    window.localStorage.removeItem('token')
  })

  it('renders without crashing', () => {
    const { unmount } = render(
            <UserProvider>
                <Home />
            </UserProvider>
    )
    unmount()
  })
  it('renders all the expected elements', () => {
    render(
            <UserProvider>
                <TaskProvider>
                    <Home />
                </TaskProvider>
            </UserProvider>
    )
    expect(screen.getByText('TaskNow')).to.exist
    // Boton "Crear una nueva tarea" debe existir
    expect(screen.getByText('Crear una nueva tarea')).to.exist
    expect(screen.getByText('Opciones')).to.exist
    expect(screen.getByText('Ordenar')).to.exist
    expect(screen.getByText('Filter')).to.exist
    expect(screen.getByText('Search')).to.exist
  })
  it('open CreateTaskModal when button is clicked', async () => {
    render(
            <UserProvider>
                <TaskProvider>
                    <Home />
                </TaskProvider>
            </UserProvider>
    )
    // Verificar que el modal no esté presente inicialmente
    expect(screen.queryByTestId('create-task-modal')).to.not.exist
    // Hacer click en el botón de crear tarea
    fireEvent.click(screen.getByText('Crear una nueva tarea'))
    // Esperar a que aparezca el modal
    await waitFor(() =>
      expect(screen.queryByTestId('create-task-modal')).to.exist
    )
  })
  it('open EditUserModal when button is clicked', async () => {
    render(
            <UserProvider>
                <TaskProvider>
                    <Home />
                </TaskProvider>
            </UserProvider>
    )
    // Verificar que el modal no esté presente inicialmente
    expect(screen.queryByTestId('edit-user-modal')).to.not.exist
    // Hacer click en el dropdown "Opciones", luego en "Editar perfil"
    fireEvent.click(screen.getByText('Opciones'))
    fireEvent.click(screen.getByText('Editar perfil'))
    // Esperar a que aparezca el modal
    await waitFor(() =>
      expect(screen.queryByTestId('edit-user-modal')).to.exist
    )
  }
  )
  it('open EditPasswordModal when button is clicked', async () => {
    render(
            <UserProvider>
                <TaskProvider>
                    <Home />
                </TaskProvider>
            </UserProvider>
    )
    // Verificar que el modal no esté presente inicialmente
    expect(screen.queryByTestId('edit-password-modal')).to.not.exist
    // Hacer click en el dropdown "Opciones", luego en "Cambiar contraseña"
    fireEvent.click(screen.getByText('Opciones'))
    fireEvent.click(screen.getByText('Cambiar contraseña'))
    // Esperar a que aparezca el modal
    await waitFor(() =>
      expect(screen.queryByTestId('edit-password-modal')).to.exist
    )
  }
  )
})
