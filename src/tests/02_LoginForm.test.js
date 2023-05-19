/* eslint-disable */
import React from 'react'
import { expect } from 'chai'
import { render, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '@/pages/login.js'
import { UserProvider } from '@/context/auth-context.js'

describe('<LoginForm />', () => {
  it('renders without crashing', () => {
    const { unmount } = render(
            <UserProvider>
                <LoginForm />
            </UserProvider>
    )
    unmount()
  })

  it('renders all the expected inputs and button', () => {
    const { getByPlaceholderText, getByText } = render(
            <UserProvider>
                <LoginForm />
            </UserProvider>
    )

    expect(getByPlaceholderText('Username')).to.exist
    expect(getByPlaceholderText('Password')).to.exist
    expect(getByText('Login')).to.exist
  })

  it('disables the login button when inputs are empty', () => {
    const { getByText } = render(
            <UserProvider>
                <LoginForm />
            </UserProvider>
    )

    const loginButton = getByText('Login')
    expect(loginButton).to.have.attr('disabled')
  })

  it('enables the login button when inputs are filled', async () => {
    const { getByPlaceholderText, getByText } = render(
            <UserProvider>
                <LoginForm />
            </UserProvider>
    )

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'test@example.com' } })
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } })

    await waitFor(() => {
      const loginButton = getByText('Login')
      expect(loginButton).to.not.have.attr('disabled')
    })
  })
  it('displays an error message when the username is invalid', async () => {
    const { getByText, getByPlaceholderText } = render(
            <UserProvider>
                <LoginForm />
            </UserProvider>
    )

    // Simula el cambio en el campo de texto del correo electrónico introduciendo un correo electrónico no válido
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'invalidEmail' } })
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } })

    // Simula el click en el botón de inicio de sesión
    fireEvent.click(getByText('Login'))

    // Espera a que el mensaje de error sea visible en el documento
    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).to.be.visible
    })
  })
  it('redirects to home page after successful login', async () => {
    // Render el componente LoginForm dentro de UserProvider
    const { getByText, getByPlaceholderText } = render(
            <UserProvider>
                <LoginForm />
            </UserProvider>
    )
    // Simula el cambio en los campos del formulario
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'test@example.com' } })
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } })

    // Simula el click en el botón de inicio de sesión
    fireEvent.click(getByText('Login'))

    // Espera para asegurarse de que el usuario ha sido redirigido a la página de inicio
    await waitFor(() => {
      expect(window.location.href).to.equal('http://localhost/')
    })
  })
})
