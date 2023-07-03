/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Button, Container, Card, InputGroup } from 'react-bootstrap'
function RegisterForm () {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(false)

  const handleRegister = async () => {
    function isValidEmail (email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    }

    try {
      // Validar el correo electrónico ingresado
      if (!isValidEmail(email)) {
        setError('Please enter a valid email address')
        return
      }
      // Validar la contraseña ingresada
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      // Fetch to localhost:3001/api/register
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      })
      const data = await response.json()
      if (response.ok) {
        // Redirect to "/"
        window.location.href = '/'
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      setError('Error during registration')
      console.error('Error during registration:', error)
    }
  }

  return (
    <>
      <img src='background.jpg' alt="background" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '-1' }} />
      <Container id='register-container' className='my-5' style={{ maxWidth: '36%', margin: '0 auto' }}>
        <Card style={{ borderRadius: '20px' }}>
          <Card.Body className='d-flex flex-column align-items-center justify-content-center'>
            <div className='d-flex flex-column align-items-center'>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', textShadow: '2px 2px 0px rgba(0,0,0,0.5)', marginBottom: '1rem', marginTop: '1rem' }}>Easy Register</span>
            </div>

            {error && <div className="text-danger">{error}</div>}

            <InputGroup id='first-name-input' className="mb-4 mt-4" size="md" style={{ width: '80%' }}>
              <input type="text" className="form-control" placeholder="First Name" aria-label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </InputGroup>

            <InputGroup id='last-name-input' className="mb-4" size="md" style={{ width: '80%' }}>
                <input type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </InputGroup>

            <InputGroup id='email-input' className="mb-4" size="md" style={{ width: '80%' }}>
                <input type="email" className="form-control" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </InputGroup>

            <InputGroup id='password-input' className="mb-4" size="md" style={{ width: '80%' }}>
                <input type="password" className="form-control" placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </InputGroup>

            <InputGroup id='confirm-password-input' className="mb-4" size="md" style={{ width: '80%' }}>
                <input type="password" className="form-control" placeholder="Confirm Password" aria-label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </InputGroup>

            <Button id='register-button' variant='dark' size="md" className="mb-4 px-5" style={{ width: '80%' }} onClick={handleRegister} disabled={!firstName || !lastName || !email || !password || !confirmPassword}>Register</Button>

            <p className="mb-2 pb-md-2" style={{ color: '#393f81' }}>Already have an account? <a id='login-link' href="/login" style={{ color: '#393f81' }}>Login here</a></p>

            </Card.Body>
        </Card>
        </Container>
    </>
  )
}

export default RegisterForm
