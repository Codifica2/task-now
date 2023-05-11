/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

export default function CreateTaskModal ({ show, handleClose, handleSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = () => {
    const task = { title, description, dueDate, category }
    handleSave(task)
  }

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
        <Button variant="primary" onClick={handleSubmit}>Guardar tarea</Button>
      </Modal.Footer>
    </Modal>
  )
}
