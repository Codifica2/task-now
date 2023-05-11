import styles from './Dashboard.module.css';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, FormControl, Button, Modal, ListGroup } from "react-bootstrap";
import { FaEdit, FaTrash } from 'react-icons/fa';
let tasks = [
    {
      id: 1,
      title: "Entregar documentos a gerente.",
      description: "Entregar documentos que me solicitaron en la mañana.",
      due_date: "24/07/2023",
      category: "Oficina",
      status: "Pendiente",
      group: "personal"
    },
    {
      id: 2,
      title: "Realizar compras en supermercado222.",
      description: "Comprar azúcar y té.",
      due_date: "10/08/2023",
      category: "Hogar",
      status: "Pendiente",
      group: "Equipo 2" 
    },
    {
      id: 3,
      title: "Entregar documentos a gerente11111",
      description: "Entreegar documentos que me solicitaron en la mañana.",
      due_date: "24/05/2023",
      category: "Categoria3",
      status: "Finalizada",
      group: "Equipo 1"
    },
    {
      id: 4,
      title: "Entregar documentos a gerente3333.",
      description: "Entreegar documentos que me solicitaron en la mañana.",
      due_date: "15/06/2023",
      category: "Categoria4",
      status: "Pendiente",
      group: "Equipo 3"
    },
    {
      id: 5,
      title: "AAAAAAAAAAAAAAAAAAAAAAAAAA",
      description: "BBBBBBBBBBBBBBBBBB.",
      due_date: "29/05/2023",
      category: "Categoria5",
      status: "En progreso",
      group: "Equipo 1"
    },
    {
      id: 6,
      title: "HHHHHHHHH",
      description: "BBBBBBBBBBBBBBBBBB.",
      due_date: "29/05/2023",
      category: "Categoria6",
      status: "En progreso",
      group: "Equipo 1"
    },
    {
      id: 7,
      title: "KKKKKKKKKK",
      description: "BBBBBBBBBBBBBBBBBB.",
      due_date: "29/05/2023",
      category: "Categoria7",
      status: "En progreso",
      group: "Equipo 1"
    }
  ];
  export default function ListTasks() {
    const [filterBy, setFilterBy] = useState("");
  
    let filteredTasks = tasks
    const handleCreateTask = () => {
        console.log("crear tarea")
        };
  
  filteredTasks = Object.values(filteredTasks);
      return (
        <Container>
        
        <Row>
        <InputGroup className="mt-3">
        <Col xs={12} className="my-col-button text-center">
        <Button variant="primary" className="my-custom-button" onClick={handleCreateTask}>Crear tarea</Button>
    </Col>
          <Col xs={10}>
          <br></br>
            
            <Form.Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}
            style={{ backgroundColor: '#F5F5F5', color: '#012840' }}
            >
    <option value="">Filtrar y ordenar por...</option>
    <option value="title">Título</option>
    <option value="description">Descripcion</option>
    <option value="date" >Fecha de vencimiento</option>
    <option value="category">Categoría</option>
    <option value="state">Estado</option>
  </Form.Select>
            
          </Col>
      </InputGroup>
        </Row>
        <Row className="card-columns">
          {filteredTasks.map((task) => (
            <Col xs={12} sm={6} md={4} key={task.id}>
              <br />
              <Card>
              <Card.Body>
      <Card.Title>{task.title}</Card.Title>
      <Card.Text>{task.description}</Card.Text>
      <ListGroup variant="flush">
        <ListGroup.Item><strong>Fecha de vencimiento:</strong> {task.due_date}</ListGroup.Item>
        <ListGroup.Item><strong>Categoría:</strong> {task.category}</ListGroup.Item>
        <ListGroup.Item><strong>Grupo:</strong> {task.group}</ListGroup.Item>
      </ListGroup>
    </Card.Body>
    <Card.Footer className="d-flex justify-content-between">
      <div className="mr-auto">{task.status}</div>
      <div>
        <Button variant="primary"><FaEdit /></Button>
        <Button variant="danger"><FaTrash /></Button>
      </div>
    </Card.Footer>
  </Card>
  <br />
            </Col>
          ))}
        </Row>
      </Container>
      );
    }