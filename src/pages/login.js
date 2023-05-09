/* eslint-disable no-unused-vars */
import React from 'react'
// Import Button, Container, Card, CardBody, CardImage, Row, Col, Icon, Input from react-bootstrap
import { Button, Container, Card, Row, Col, InputGroup } from 'react-bootstrap'
function LoginForm () {
  return (
        <>
            <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: '100vh', background: 'repeating-linear-gradient(-45deg, #b2b2e0 0, #b2b2e0 30px, #42275a 40px, #42275a 40px)' }}>

                <Container className='my-5' style={{ maxWidth: '38%', margin: '0 auto' }}>
                    <Card style={{ borderRadius: '20px' }}>
                        <Card.Body className='d-flex flex-column align-items-center justify-content-center'>
                            <div className='d-flex flex-column align-items-center'>
                                <img src='ant.svg' alt="logo" style={{ width: '40%', height: '40%' }} className='ms-2'/>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold', textShadow: '2px 2px 0px rgba(0,0,0,0.5)', marginTop: '1rem', marginBottom: '1rem' }}>TaskNow</span>
                            </div>

                            <InputGroup className="mb-4 mt-4" size="lg" style={{ width: '80%' }}>
                                <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
                            </InputGroup>

                            <InputGroup className="mb-4" size="lg" style={{ width: '80%' }}>
                                <input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1"/>
                            </InputGroup>

                            <Button variant='dark' size="lg" className="mb-4 px-5" style={{ width: '80%' }}>Login</Button>
                            <a className='small text-muted' href='#'>Forgot password?</a>
                            <p className="mb-5 pb-md-2" style={{ color: '#393f81' }}>Don't have an account? <a href="#!" style={{ color: '#393f81' }}>Register here</a></p>

                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </>
  )
}

export default LoginForm
