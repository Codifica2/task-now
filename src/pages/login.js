/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
// Import Button, Container, Card, CardBody, CardImage, Row, Col, Icon, Input from react-bootstrap
import { Button, Container, Card, InputGroup } from 'react-bootstrap'
import { useUserContext } from '@/context/auth-context.js'

function LoginForm () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const { setUser, setToken } = useUserContext()

  const handleLogin = async () => {
    function isValidEmail (email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    }

    try {
      // Validar el correo electrónico ingresado
      if (!isValidEmail(username)) {
        setError('Please enter a valid email address')
        return
      }
      // Fetch to localhost:3001/api/login
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      })
      const data = await response.json()
      if (response.ok) {
        setUser({ id: data.id, name: data.name, email: data.email })
        setToken(data.auth_token)
        // Set in localstorage
        localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email }))
        localStorage.setItem('token', data.auth_token)
        // Redirect to "/"
        window.location.href = '/'
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      setError('Invalid credentials')
      console.error('Error during login:', error)
    }
  }
  return (
        <>
            <img src='background.jpg' alt="background" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '-1' }} />
            <Container className='my-5' style={{ maxWidth: '36%', margin: '0 auto' }}>
                <Card style={{ borderRadius: '20px' }}>
                    <Card.Body className='d-flex flex-column align-items-center justify-content-center'>
                        <div className='d-flex flex-column align-items-center'>
                            <img src='logo.svg' alt="logo" style={{ width: '50%', height: '50%' }} className='ms-2'/>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', textShadow: '2px 2px 0px rgba(0,0,0,0.5)', marginBottom: '1rem' }}>TaskNow</span>
                        </div>

                        {error && <div className="text-danger">{error}</div>}

                        <InputGroup className="mb-4 mt-4" size="lg" style={{ width: '80%' }}>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </InputGroup>

                        <InputGroup className="mb-4" size="lg" style={{ width: '80%' }}>
                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </InputGroup>

                        <Button variant='dark' size="lg" className="mb-4 px-5" style={{ width: '80%' }} onClick={handleLogin} disabled={!username || !password}>Login</Button>
                        <a className='small text-muted' href='#'>Forgot password?</a>
                        <p className="mb-5 pb-md-2" style={{ color: '#393f81' }}>Don't have an account? <a href="/register" style={{ color: '#393f81' }}>Register here</a></p>

                    </Card.Body>
                </Card>
            </Container>
        </>
  )
}

export default LoginForm
