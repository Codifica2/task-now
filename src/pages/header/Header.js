/* eslint-disable no-unused-vars */
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { Navbar, Nav, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './Header.module.css'
import perfil from './perfil.png'

const inter = Inter({ subsets: ['latin'] })

export default function Header () {
  const handleLogout = () => {
    // Elimina la información del usuario del localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // Redirige al usuario a la ruta raíz
    window.location.href = '/'
  }

  return (
    <Navbar className={styles['navbar-custom']}>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-auto" />
        <Navbar.Brand className={styles['nav-link']} href="/">TaskNow</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`ml-auto ${styles['nav-links-right']} justify-content-end`}>
            <Nav.Link className={styles['nav-link']}>
              <Image src={perfil} width={32} height={32} alt="Perfil" />
            </Nav.Link>
            <Nav.Link className={styles['nav-link']} onClick={handleLogout}>Cerrar Sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
