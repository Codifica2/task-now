import { Inter } from 'next/font/google';
import Image from 'next/image';
import { Navbar, Nav, Container, Modal, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Header.module.css';
import perfil from './perfil.png';
import { useState} from 'react'


const inter = Inter({ subsets: ['latin'] });

export default function Header() {
  const [showModalEditUser, setShowModalEditUser] = useState(false);
  const [newName, setNewName] = useState("")
  const [newLastName, setNewLastName] = useState("")
  const [newPassword, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordEmpty, setPasswordEmpty] = useState(true);
  const [nameEmpty, setNameEmpty] = useState(true);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setNewLastName(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  
  const handlePasswordConfirmationChange = (event) => {
    setPasswordConfirmation(event.target.value);
  };
  const handleConfirmFields = async () => { 
    if ((newPassword === passwordConfirmation) && (newPassword.length!=0) && (newName.length!=0) && (newLastName.length!=0)){
      setPasswordsMatch(true);
      setPasswordEmpty(false);
      setNameEmpty(false);
      setShowModalEditUser(false);

      const loggedUser = JSON.parse(localStorage.getItem('user'))

      console.log(loggedUser)
      console.log(loggedUser.id)

      const response = await fetch(`http://localhost:3001/api/users/${loggedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          password:newPassword,
        }),
      })
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`
        throw new Error(message)
      } else {
        console.log(response)
      }
      const savedTask = response.json()
      console.log(savedTask)

    } else {
      if (newPassword != passwordConfirmation){
        setPasswordsMatch(false);
      } else {setPasswordsMatch(true);}
      if (newPassword.length==0) {
        setPasswordEmpty(true);
      }else{setPasswordEmpty(false);}
      if (newName.length==0){
        setNameEmpty(true);
      }else{setNameEmpty(false);}
      if (newLastName.length==0){
        setLastNameEmpty(true);
      }else{setNameLastEmpty(false);}      
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <Navbar className={styles['navbar-custom']} expand="lg">
      <Container fluid className={styles['container-custom']}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-auto" />
        <Navbar.Brand className={styles['nav-link']} href="/">TaskNow</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`ml-auto ${styles['nav-links-right']} justify-content-end`}>
            <button className={styles['profile-button']} onClick={() => setShowModalEditUser(true)}>
              <Image src={perfil} width={32} height={32} alt="Perfil" />
            </button>
            <Modal show={showModalEditUser} onHide={() => setShowModalEditUser(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Editar Nombre y Contraseña</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Group >
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre"
                  value={newName}
                  onChange={handleNameChange}
                />
            </Form.Group>
            <Form.Group >
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su apellido"
                  value={newLastName}
                  onChange={handleLastNameChange}
                />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
            </Form.Group>
            <Form.Group controlId="formBasicPasswordConfirmation">
                <Form.Label>Confirmar contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={passwordConfirmation}
                  onChange={handlePasswordConfirmationChange}
                />
                {!passwordsMatch && (
                <div style={{ color: "red", display: "block" }}>
                  Las contraseñas no coinciden
                  </div>
                )}
                {passwordEmpty && (
                  <div style={{ color: "red", display: "block" }}>
                    La contraseña no puede ser vacia
                  </div>
                )}
                {nameEmpty && (
                  <div style={{ color: "red", display: "block" }}>
                    El nombre no puede estar vacio
                  </div>
                )}
                {nameEmpty && (
                  <div style={{ color: "red", display: "block" }}>
                    El apellido no puede estar vacio
                  </div>
                )}
                
            </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModalEditUser(false)}>Cancelar</Button>
              <Button variant="primary" onClick={(handleConfirmFields)}>Guardar</Button>
          </Modal.Footer>
      </Modal>
      <Nav.Link className={styles['nav-link']} onClick={handleLogOut}>Cerrar Sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}