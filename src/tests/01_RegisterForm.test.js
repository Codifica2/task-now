/* eslint-disable */
import React from 'react'
import { expect } from 'chai'
import { render, fireEvent, waitFor } from '@testing-library/react'
import RegisterForm from '@/pages/register.js'
import { UserProvider } from '@/context/auth-context.js'

describe('<RegisterForm />', () => {
  it('renders without crashing', () => {
    const { unmount } = render(
      <UserProvider>
        <RegisterForm />
      </UserProvider>
    )
    unmount()
  })

  it('renders all the expected inputs and button', () => {
    const { getByPlaceholderText, getByText } = render(
      <UserProvider>
        <RegisterForm />
      </UserProvider>
    )

    expect(getByPlaceholderText('First Name')).to.exist
    expect(getByPlaceholderText('Last Name')).to.exist
    expect(getByPlaceholderText('Email')).to.exist
    expect(getByPlaceholderText('Password')).to.exist
    expect(getByPlaceholderText('Confirm Password')).to.exist
    expect(getByText('Register')).to.exist
  })

  it('disables the register button when inputs are empty', () => {
    const { getByText } = render(
      <UserProvider>
        <RegisterForm />
      </UserProvider>
    )

    const registerButton = getByText('Register')
    expect(registerButton).to.have.attr('disabled')
  })

  it('enables the register button when inputs are filled', async () => {
    const { getByPlaceholderText, getByText } = render(
      <UserProvider>
        <RegisterForm />
      </UserProvider>
    )

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } })
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } })
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } })
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'testPassword' } })

    await waitFor(() => {
      const registerButton = getByText('Register')
      expect(registerButton).to.not.have.attr('disabled')
    })
  })

  it('displays an error message when the email is invalid', async () => {
    const { getByText, getByPlaceholderText } = render(
      <UserProvider>
        <RegisterForm />
      </UserProvider>
    )

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } })
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } })
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'invalidEmail' } })
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } })
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'testPassword' } })

    fireEvent.click(getByText('Register'))

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).to.be.visible
    })
  })

  it('displays an error message when passwords do not match', async () => {
    const { getByText, getByPlaceholderText } = render(
      <UserProvider>
        <RegisterForm />
      </UserProvider>
    )

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } })
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } })
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } })
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'mismatchedPassword' } })

    fireEvent.click(getByText('Register'))

    await waitFor(() => {
      expect(getByText('Passwords do not match')).to.be.visible
    })
  })

  it('redirects to home page after successful registration', async () => {
    const { getByText, getByPlaceholderText } = render(
      <UserProvider>
        <RegisterForm />
      </UserProvider>
    )

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } })
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } })
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } })
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'testPassword' } })

    fireEvent.click(getByText('Register'))

    await waitFor(() => {
      expect(window.location.href).to.equal('http://localhost/')
    })
  })
})
