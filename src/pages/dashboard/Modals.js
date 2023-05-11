/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

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
    <Modal show={show} onHide={handleClose}>
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
