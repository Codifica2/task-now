/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { useUserContext } from '@/context/auth-context'
import Alert from 'react-bootstrap/Alert'

export function EditUserModal ({ show, handleClose }) {
  const [newName, setNewName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const { user, setUser, token } = useUserContext()

  const handleCleanUpdateProfile = () => {
    setNewName('')
    setNewLastName('')

    handleClose()
  }

  const handleUpdateProfile = async () => {
    // No hacer nada si no se quiere cambiar nada y se presionó guardar
    if (newName === '' && newLastName === '') {
      handleClose()
    } else {
      const updatedFields = {
        name: newName,
        lastname: newLastName
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      })

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`
        throw new Error(message)
      }

      const updatedUser = await response.json()

      // Aquí puedes añadir la tarea recién creada a tu lista de tareas.
      if (newName) {
        setUser({ ...user, name: newName })
      }

      handleCleanUpdateProfile()
    }
  }

  return (
    <Modal show={show} onHide={handleCleanUpdateProfile} data-testid="edit-user-modal">
      <Modal.Header style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Modal.Title>Actualizar datos del perfil</Modal.Title>

        <p style={{ color: 'grey' }}> Ingrese solo los campos que desea actualizar </p>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Form.Group className='mb-3' as={Col}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3' as={Col}>
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCleanUpdateProfile}>Cancelar</Button>
        <Button variant="primary" onClick={handleUpdateProfile}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  )
}

export function CreateTaskModal ({ show, handleClose, handleSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = () => {
    // date en tipo Date
    const date = new Date(dueDate)
    // Convierte la fecha al formato de cadena ISO y usa slice para obtener solo la parte de la fecha.
    const formattedDate = date.toISOString().slice(0, 10)
    // Obtain user.id from localStorage
    const user = JSON.parse(localStorage.getItem('user'))
    const task = { title, description, due_date: formattedDate, category, creator: user.id }
    handleSave(task)
  }

  // Validar que todos los campos tienen un valor
  const isFormValid = title && description && dueDate && category

  return (
    <Modal show={show} onHide={handleClose} data-testid="create-task-modal">
      <Modal.Header closeButton>
        <Modal.Title>Crear tarea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Título</Form.Label>
            <Form.Control type="text" placeholder="Ingrese el título" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label className='mt-3'>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className='mt-3'>Fecha de Vencimiento</Form.Label>
                <DatePicker selected={dueDate} onChange={date => setDueDate(date)} dateFormat="dd/MM/yyyy" minDate={new Date()} isClearable showYearDropdown scrollableMonthYearDropdown
                  customInput={
                    <Form.Control
                      as="input"
                      style={{
                        width: '100%', // Cambia el ancho a 100% para que llene la columna
                        color: 'black',
                        height: '38px' // Aquí puedes ajustar el alto según sea necesario
                      }}
                    />
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className='mt-3'>Categoría</Form.Label>
                <Form.Control type="text" placeholder="Ingrese la categoría" value={category} style={{ width: '100%' }} onChange={(e) => setCategory(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isFormValid}>Guardar tarea</Button>
      </Modal.Footer>
    </Modal>
  )
}

export function ConfirmDeleteTaskModal ({ show, handleClose, handleConfirm }) {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro que quieres eliminar esta tarea?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function EditTaskModal ({ show, handleClose, handleSave, taskToEdit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  // Para precargar los contenidos existentes de la tarea en los campos:
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description)
      setDueDate(new Date(taskToEdit.due_date))
      setCategory(taskToEdit.category)
      setStatus(taskToEdit.status)
    }
  }, [taskToEdit])

  const handleSubmit = () => {
    // date en tipo Date
    const date = new Date(dueDate)
    // Convierte la fecha al formato de cadena ISO y usa slice para obtener solo la parte de la fecha.
    const formattedDate = date.toISOString().slice(0, 10)
    const task = { title, description, due_date: formattedDate, category, status }
    handleSave(task)
  }

  const isFormValid = title && description && dueDate && category && status

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Tarea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Título</Form.Label>
            <Form.Control type="text" placeholder="Ingrese el título" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label className='mt-3'>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className='mt-3'>Fecha de Vencimiento</Form.Label>
                <DatePicker selected={dueDate} onChange={date => setDueDate(date)} dateFormat="dd/MM/yyyy" minDate={new Date()} isClearable showYearDropdown scrollableMonthYearDropdown
                  customInput={
                    <Form.Control
                      as="input"
                      style={{
                        width: '100%',
                        color: 'black',
                        height: '38px'
                      }}
                    />
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className='mt-3'>Categoría</Form.Label>
                <Form.Control type="text" placeholder="Ingrese la categoría" value={category} style={{ width: '100%' }} onChange={(e) => setCategory(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label className='mt-3'>Status</Form.Label>
            <Form.Select value={status} style={{ width: '100%' }} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Seleccione el estado de la tarea</option>
              <option value="En progreso">En progreso</option>
              <option value="Terminada">Terminada</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isFormValid}>Guardar cambios</Button>
      </Modal.Footer>
    </Modal>
  )
}

export function TaskDetailModal ({ show, handleClose, task }) {
  if (!task) return null

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{task.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Description</h5>
        <p>{task.description}</p>
        <h5>Due Date</h5>
        <p>{task.due_date.toString()}</p>
        <h5>Status</h5>
        <p>{task.status}</p>
        <h5>Category</h5>
        <p>{task.category}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function EditPasswordModal ({ show, handleClose }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [validated, setValidated] = useState(false)
  const { user, token } = useUserContext()

  const handlePasswordChange = async (event) => {
    event.preventDefault() // Evitar el envío de formularios por defecto
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
      setErrorMessage('Por favor, rellene todos los campos correctamente.')
      setValidated(true)
      return
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Por favor, rellene todos los campos de contraseña.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las nuevas contraseñas no coinciden.')
      return
    }

    // Compruebe si la contraseña antigua es correcta
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: user.email, password: oldPassword })
    })

    if (!response.ok) {
      setErrorMessage('La contraseña antigua es incorrecta.')
      return
    }

    // Si la contraseña antigua es correcta, cambie a la nueva contraseña
    const updatedFields = {
      password: newPassword
    }

    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedFields)
    })

    if (!updateResponse.ok) {
      const message = `An error has occured: ${updateResponse.status}`
      throw new Error(message)
    }

    handleClose()
  }

  const handleCloseReset = () => {
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setErrorMessage('')
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleCloseReset} data-testid="edit-password-modal">
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
        <Form noValidate validated={validated} onSubmit={handlePasswordChange}>
          <Form.Group>
            <Form.Label>Contraseña Antigua</Form.Label>
            <Form.Control type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            <Form.Control.Feedback type="invalid">
              Por favor, introduzca su contraseña antigua.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Form.Control.Feedback type="invalid">
              Por favor, introduzca su nueva contraseña.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
            <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <Form.Control.Feedback type="invalid">
              Por favor, confirme su nueva contraseña.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseReset}>Cancelar</Button>
        <Button variant="primary" onClick={handlePasswordChange} type="submit">Guardar</Button>
      </Modal.Footer>
    </Modal>
  )
}
