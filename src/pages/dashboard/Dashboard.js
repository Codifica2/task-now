import styles from "./Dashboard.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  FormControl,
  Button,
  Modal,
  ListGroup,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  CreateTaskModal,
  ConfirmDeleteTaskModal,
  EditTaskModal,
} from "./Modals";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filterBy, setFilterBy] = useState(""); //seleccion de filtrar por
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleCreateTask = () => {
    setShowCreateTaskModal(true);
  };

  const handleCloseCreateTaskModal = () => {
    setShowCreateTaskModal(false);
  };

  const handleDeleteTaskClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteTaskModal(true);
  };

  const handleEditTaskClick = (task) => {
    setTaskToEdit(task);
    setShowEditTaskModal(true);
  };

  const handleSaveTask = async (task) => {
    const response = await fetch("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const savedTask = await response.json();
    console.log(savedTask);

    // Aquí puedes añadir la tarea recién creada a tu lista de tareas.
    setTasks([...tasks, savedTask]);
    setShowCreateTaskModal(false);
  };

  const handleConfirmDeleteTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/tasks/${taskToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      // Actualizar la lista de tareas después de eliminar una
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));

      console.log(`Tarea ${taskToDelete.id} eliminada`);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }

    setShowDeleteTaskModal(false);
  };

  const handleSaveEditedTask = async (updatedTask) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/tasks/${taskToEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      // Filter que agrega todas las tareas que existen y reemplaza la tarea que se editó
      setTasks(
        tasks
          .filter((task) => task.id !== taskToEdit.id)
          .concat({ ...updatedTask, id: taskToEdit.id })
      );

      console.log(`Tarea ${taskToEdit.id} actualizada`);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }

    setShowEditTaskModal(false);
  };

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch("http://localhost:3001/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setTasks(data);
      console.log(data);
    };
    getTasks();
  }, []);

  //INICIO FILTRO TITULO
  const [queryTitle, setQueryTitle] = useState("");

  let filteredTasksTitle = tasks.filter((task) =>
    task.title.toLowerCase().includes(queryTitle.toLowerCase())
  );
  const handleClearFilterTitle = () => {
    setQueryTitle("");
  };
  //FIN FILTRO TITULO
  //inicio filtro descripcion
  const [queryDescription, setQueryDescription] = useState("");
  let filteredTasksDescription = tasks.filter((task) =>
    task.description.toLowerCase().includes(queryDescription.toLowerCase())
  );
  const handleClearFilterDescription = () => {
    setQueryDescription("");
  };
  //fin filtro descripcion
  //inicio filtro estado
  let estados = ["Pendiente", "En progreso", "Finalizada"];
  const [selectedStates, setSelectedStates] = useState([
    "Pendiente",
    "En progreso",
  ]);
  const handleStateChange = (state) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter((s) => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };
  const [filteredTasksState, setFilteredTasksState] = useState([]);
  const handleSearchState = () => {
    const filteredTasksState = tasks.filter((task) =>
      selectedStates.some((state) => task.status.includes(state))
    );
    setFilteredTasksState(filteredTasksState);
  };
  const handleClearFilterState = () => {
    setSelectedStates(["Pendiente", "En progreso"]);
    handleSearchState();
  };
  //fin filtro estado
  //inicio filtro categoria
  const categories = tasks.map((task) => task.category);
  const uniqueCategories = categories
    .filter((category, index) => categories.indexOf(category) === index)
    .sort((a, b) => a.localeCompare(b));

  const [page, setPage] = useState(1);
  const categoriesPerPage = 6;
  const numCols = 3;
  const totalPages = Math.ceil(uniqueCategories.length / categoriesPerPage);
  const startIndex = (page - 1) * categoriesPerPage;
  const endIndex = startIndex + categoriesPerPage;
  const categoriesToShow = uniqueCategories.slice(startIndex, endIndex);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((s) => s !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  const [filteredTasksCategory, setFilteredTasksCategory] = useState([]);
  const handleSearchCategory = () => {
    let filteredTasksCategory = tasks; //si está vacío se incluyen todos
    if (selectedCategories.length > 0) {
      filteredTasksCategory = tasks.filter((task) =>
        selectedCategories.some((category) => task.category.includes(category))
      );
    }
    setFilteredTasksCategory(filteredTasksCategory);
  };
  const handleClearFilterCategory = () => {
    setSelectedCategories([]);
    handleSearchCategory();
  };
  const renderCategories = (categories) => {
    const rows = [];
    for (let i = 0; i < categories.length; i += numCols) {
      const cols = [];
      for (let j = 0; j < numCols && i + j < categories.length; j++) {
        const category = categories[i + j];
        cols.push(
          <Col key={category}>
            <Form.Check
              type="checkbox"
              checked={selectedCategories.includes(category)}
              label={category}
              onChange={() => handleCategoryChange(category)}
            />
          </Col>
        );
      }
      rows.push(<Row key={i}>{cols}</Row>);
    }
    return rows;
  };
  //fin filtro categoria
  //INIICIO FILTRO FECHAS
  function convertToDate(dateString) {
    const parts = dateString.split("/");
    const year = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[0], 10);
    return new Date(year, month, day);
  }
  function compareDates(date1, date2) {
    //fechaaa
    if (date1.getTime() > date2.getTime()) {
      return 1; //date1 > date2
    } else if (date1.getTime() < date2.getTime()) {
      return -1; //date1 < date2
    } else {
      return 0; //date1=date2
    }
  }
  function convertToString(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  let maxDate = convertToDate(tasks[0].due_date);
  for (let i = 1; i < tasks.length; i++) {
    const currentD = convertToDate(tasks[i].due_date);
    if (compareDates(currentD, maxDate) === 1) {
      maxDate = currentD;
    }
  }
  let minDate = convertToDate(tasks[0].due_date);
  for (let i = 1; i < tasks.length; i++) {
    const currentD = convertToDate(tasks[i].due_date);
    if (compareDates(currentD, minDate) === -1) {
      minDate = currentD;
    }
  }
  const currentDate = new Date();
  const [showI, setShowI] = useState(false);
  const handleCloseI = () => setShowI(false);
  const handleShowI = () => setShowI(true);
  const [selectedDateI, setSelectedDateI] = useState(minDate);
  const [modalTitleI, setModalTitleI] = useState(
    convertToString(selectedDateI)
  );
  const [showF, setShowF] = useState(false);
  const handleCloseF = () => setShowF(false);
  const handleShowF = () => setShowF(true);
  const [selectedDateF, setSelectedDateF] = useState(maxDate);
  const [modalTitleF, setModalTitleF] = useState(
    convertToString(selectedDateF)
  );
  const handleClearFilterDate = () => {
    setSelectedDateI(minDate);
    setModalTitleI(convertToString(minDate));
    setSelectedDateF(maxDate);
    setModalTitleF(convertToString(maxDate));
  };
  let filteredTaskDate = tasks.filter((task) => {
    const taskDate = convertToDate(task.due_date);
    return taskDate >= selectedDateI && taskDate <= selectedDateF;
  });

  //FIN FILTRO FECHAS

  //FILTROS DE ORDEN ASCENDENTES Y DESCENDENTES
  const [ascendingTitle, setAscendingTitle] = useState(false);
  const [descendingTitle, setDescendingTitle] = useState(false);
  const [ascendingDescription, setAscendingDescription] = useState(false);
  const [descendingDescription, setDescendingDescription] = useState(false);
  const [ascendingDate, setAscendingDate] = useState(false);
  const [descendingDate, setDescendingDate] = useState(true); //POR DEFECTO
  const [ascendingCategory, setAscendingCategory] = useState(false);
  const [descendingCategory, setDescendingCategory] = useState(false);
  const [ascendingState, setAscendingState] = useState(false);
  const [descendingState, setDescendingState] = useState(false);

  const handleAscendingChangeTitle = () => {
    setAscendingTitle(!ascendingTitle);
    setDescendingTitle(false);
    setAscendingDescription(false);
    setDescendingDescription(false);
    setAscendingDate(false);
    setDescendingDate(false);
    setAscendingCategory(false);
    setDescendingCategory(false);
    setAscendingState(false);
    setDescendingState(false);
  };
  const handleDescendingChangeTitle = () => {
    setDescendingTitle(!descendingTitle);
    setAscendingTitle(false);
    setAscendingDescription(false);
    setDescendingDescription(false);
    setAscendingDate(false);
    setDescendingDate(false);
    setAscendingCategory(false);
    setDescendingCategory(false);
    setAscendingState(false);
    setDescendingState(false);
  };
  const handleAscendingChangeDescription = () => {
    setAscendingDescription(!ascendingDescription);
    setDescendingDescription(false);
    setAscendingTitle(false);
    setDescendingTitle(false);
    setAscendingDate(false);
    setDescendingDate(false);
    setAscendingCategory(false);
    setDescendingCategory(false);
    setAscendingState(false);
    setDescendingState(false);
  };

  const handleDescendingChangeDescription = () => {
    setDescendingDescription(!descendingDescription);
    setAscendingDescription(false);
    setAscendingTitle(false);
    setDescendingTitle(false);
    setAscendingDate(false);
    setDescendingDate(false);
    setAscendingCategory(false);
    setDescendingCategory(false);
    setAscendingState(false);
    setDescendingState(false);
  };

  const handleAscendingChangeDate = () => {
    setAscendingDate(!ascendingDate);
    setDescendingDate(false);
    setAscendingDescription(false);
    setDescendingDescription(false);
    setAscendingTitle(false);
    setDescendingTitle(false);
    setAscendingCategory(false);
    setDescendingCategory(false);
    setAscendingState(false);
    setDescendingState(false);
  };
  const handleDescendingChangeDate = () => {
    setDescendingDate(!descendingDate);
    setAscendingDate(false);
    setAscendingDescription(false);
    setDescendingDescription(false);
    setAscendingTitle(false);
    setDescendingTitle(false);
    setAscendingCategory(false);
    setDescendingCategory(false);
    setAscendingState(false);
    setDescendingState(false);
  };
  const handleAscendingChangeCategory = () => {
    setAscendingCategory(!ascendingCategory);
    setDescendingCategory(false);
    setAscendingDescription(false);
    setDescendingDescription(false);
    setAscendingDate(false);
    setDescendingDate(false);
    setAscendingTitle(false);
    setDescendingTitle(false);
    setAscendingState(false);
    setDescendingState(false);
  };
  const handleDescendingChangeCategory = () => {
    setDescendingCategory(!descendingCategory);
    setAscendingCategory(false);
    setAscendingDescription(false);
    setDescendingDescription(false);
    setAscendingDate(false);
    setDescendingDate(false);
    setAscendingTitle(false);
    setDescendingTitle(false);
    setAscendingState(false);
    setDescendingState(false);
  };
  const handleAscendingChangeState = () => {
    setAscendingState(!ascendingState);
    setDescendingState(false);
    setAscendingDescription(false);
    setDescendingDescription(false);
    setAscendingDate(false);
    setDescendingDate(false);
    setAscendingCategory(false);
    setDescendingCategory(false);
    setAscendingTitle(false);
    setDescendingTitle(false);
  };
  const handleDescendingChangeState = () => {
    setDescendingState(!descendingState);
    setAscendingState(false);
    setAscendingDescription(false);
    setDescendingDescription(false);
    setAscendingDate(false);
    setDescendingDate(false);
    setAscendingCategory(false);
    setDescendingCategory(false);
    setAscendingTitle(false);
    setDescendingTitle(false);
  };

  //FIN FILTROS ORDEN

  let filteredTasks = tasks.filter(
    (task) =>
      filteredTasksTitle.includes(task) &&
      filteredTasksDescription.includes(task) &&
      filteredTasksState.includes(task) &&
      filteredTasksCategory.includes(task) &&
      filteredTaskDate.includes(task)
  );
  let orderedTasks = filteredTasks.sort((a, b) => {
    if (ascendingTitle) {
      return a.title.localeCompare(b.title);
    } else if (descendingTitle) {
      return b.title.localeCompare(a.title);
    } else if (ascendingDescription) {
      return a.description.localeCompare(b.description);
    } else if (descendingDescription) {
      return b.description.localeCompare(a.description);
    } else if (ascendingCategory) {
      return a.category.localeCompare(b.category);
    } else if (descendingCategory) {
      return b.category.localeCompare(a.category);
    } else if (ascendingState) {
      return a.status.localeCompare(b.status);
    } else if (descendingState) {
      return b.status.localeCompare(a.status);
    } else if (ascendingDate) {
      //FECHAAA
      return compareDates(convertToDate(a.due_date), convertToDate(b.due_date));
    } else if (descendingDate) {
      return compareDates(convertToDate(b.due_date), convertToDate(a.due_date));
    }
  });

  useEffect(() => {
    handleSearchCategory();
    handleSearchState();
    setSelectedDateI(minDate);
    setSelectedDateF(maxDate);
  }, [selectedStates, selectedCategories]);

  orderedTasks = Object.values(orderedTasks);
  return (
    <Container>
      <Row>
        <InputGroup className="mt-3">
          <Col xs={12} className="my-col-button text-center">
            <Button
              variant="primary"
              className="my-custom-button"
              onClick={handleCreateTask}
            >
              Crear tarea
            </Button>
          </Col>
          <Col xs={10}>
            <Form.Select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={{ backgroundColor: "#F5F5F5", color: "#012840" }}
            >
              <option value="">Filtrar y ordenar por...</option>
              <option value="title">Título</option>
              <option value="description">Descripcion</option>
              <option value="date">Fecha de vencimiento</option>
              <option value="category">Categoría</option>
              <option value="state">Estado</option>
            </Form.Select>
          </Col>
          <Col xs={2} className="my-col-button">
            <Button
              variant="primary"
              className="my-custom-button"
              onClick={handleClearFilterDescription}
            >
              Limpiar filtros
            </Button>
          </Col>
        </InputGroup>
      </Row>
      <InputGroup className="mt-3">
        {filterBy === "title" && (
          <InputGroup className="mt-3">
            <Col xs={10} className="my-col">
              <Form>
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Buscar tarea por título"
                    value={queryTitle}
                    onChange={(e) => setQueryTitle(e.target.value)}
                  />
                </InputGroup>
              </Form>
            </Col>
            <Col xs={2} className="my-col-button">
              <Button
                variant="primary"
                className="my-custom-button"
                onClick={handleClearFilterTitle}
              >
                Limpiar filtro
              </Button>
            </Col>
            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Ascendente"
                checked={ascendingTitle}
                onChange={handleAscendingChangeTitle}
              />
            </Col>

            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Descendente"
                checked={descendingTitle}
                onChange={handleDescendingChangeTitle}
              />
            </Col>
          </InputGroup>
        )}
        {filterBy === "description" && (
          <InputGroup className="mt-3">
            <Col xs={10} className="my-col">
              <Form>
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Buscar tarea por descripcion"
                    value={queryDescription}
                    onChange={(e) => {
                      setQueryDescription(e.target.value);
                    }}
                  />
                </InputGroup>
              </Form>
            </Col>
            <Col xs={2} className="my-col-button">
              <Button
                variant="primary"
                className="my-custom-button"
                onClick={handleClearFilterDescription}
              >
                Limpiar filtro
              </Button>
            </Col>
            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Ascendente"
                checked={ascendingDescription}
                onChange={handleAscendingChangeDescription}
              />
            </Col>

            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Descendente"
                checked={descendingDescription}
                onChange={handleDescendingChangeDescription}
              />
            </Col>
          </InputGroup>
        )}
        {filterBy === "category" && (
          <>
            <InputGroup className="mt-3">
              <Col xs={10} className="my-col">
                {renderCategories(categoriesToShow)}
              </Col>
              <Col xs={2} className="my-col">
                <Button
                  variant="primary"
                  className="my-custom-button"
                  onClick={handleClearFilterCategory}
                >
                  Limpiar filtro
                </Button>
              </Col>
            </InputGroup>
            <Col xs={10} className="my-col">
              <div className="pagination">
                <Button
                  variant="primary"
                  className="my-custom-button"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  className="my-custom-button"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </Col>
            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Ascendente"
                checked={ascendingDescription}
                onChange={handleAscendingChangeCategory}
              />
            </Col>

            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Descendente"
                checked={descendingDescription}
                onChange={handleDescendingChangeCategory}
              />
            </Col>
          </>
        )}
        {filterBy === "state" && (
          <InputGroup className="mt-3">
            <Col xs={8} className="my-col">
              {estados.map((estado) => (
                <Form.Check
                  type="checkbox"
                  key={estado}
                  checked={selectedStates.includes(estado)}
                  label={estado}
                  onChange={() => handleStateChange(estado)}
                />
              ))}
            </Col>
            <Col xs={2} className="my-col-button">
              <Button
                variant="primary"
                className="my-custom-button"
                onClick={handleClearFilterState}
              >
                Limpiar filtro
              </Button>
            </Col>
            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Ascendente"
                checked={ascendingTitle}
                onChange={handleAscendingChangeState}
              />
            </Col>

            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Descendente"
                checked={descendingTitle}
                onChange={handleDescendingChangeState}
              />
            </Col>
          </InputGroup>
        )}
        {filterBy === "date" && (
          <InputGroup className="mt-3">
            <Col xs={12}>
              <Row>
                <Col xs={5} className="my-col">
                  Desde:
                </Col>
                <Col xs={5} className="my-col">
                  Hasta:
                </Col>
                <Col xs={2} className="my-col"></Col>
              </Row>
            </Col>
            <Col xs={5} className="my-col">
              <Button variant="primary" onClick={handleShowI}>
                {modalTitleI}
              </Button>
              <Modal show={showI} onHide={handleCloseI}>
                <Modal.Header closeButton>
                  <Modal.Title>Seleccionar Fecha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <DatePicker
                    selected={selectedDateI}
                    onSelect={(date) => {
                      setSelectedDateI(date);
                      setModalTitleI(convertToString(date));
                      handleCloseI();
                    }}
                    dateFormat="dd/MM/yyyy"
                  />
                </Modal.Body>
              </Modal>
            </Col>
            <Col xs={5} className="my-col">
              <Button variant="primary" onClick={handleShowF}>
                {modalTitleF}
              </Button>
              <Modal show={showF} onHide={handleCloseF}>
                <Modal.Header closeButton>
                  <Modal.Title>Seleccionar Fecha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <DatePicker
                    selected={selectedDateF}
                    onSelect={(date) => {
                      setSelectedDateF(date);
                      setModalTitleF(convertToString(date));
                      handleCloseF();
                    }}
                    dateFormat="dd/MM/yyyy"
                  />
                </Modal.Body>
              </Modal>
            </Col>
            <Col xs={2} className="my-col-button">
              <Button
                variant="primary"
                className="my-custom-button"
                onClick={handleClearFilterDate}
              >
                Limpiar filtro
              </Button>
            </Col>

            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Ascendente"
                checked={ascendingDate}
                onChange={handleAscendingChangeDate}
              />
            </Col>

            <Col xs={4} className="my-col-button">
              <br></br>
              <Form.Check
                type="checkbox"
                label="Descendente"
                checked={descendingDate}
                onChange={handleDescendingChangeDate}
              />
            </Col>
          </InputGroup>
        )}
      </InputGroup>

      <Row className="card-columns">
        {orderedTasks.map((task) => (
          <Col xs={12} sm={6} md={4} key={task.id}>
            <br />
            <Card>
              <Card.Body>
                <Card.Title>{task.title}</Card.Title>
                <Card.Text>{task.description}</Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Fecha de vencimiento:</strong> {task.due_date}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Categoría:</strong> {task.category}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Grupo:</strong> {task.group}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <div className="mr-auto">{task.status}</div>
                <div>
                  <Button
                    variant="primary"
                    onClick={() => handleEditTaskClick(task)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTaskClick(task)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card.Footer>
            </Card>
            <br />
          </Col>
        ))}
      </Row>
      <CreateTaskModal
        show={showCreateTaskModal}
        handleClose={handleCloseCreateTaskModal}
        handleSave={handleSaveTask}
      />
      <ConfirmDeleteTaskModal
        show={showDeleteTaskModal}
        handleClose={() => setShowDeleteTaskModal(false)}
        handleConfirm={handleConfirmDeleteTask}
      />
      <EditTaskModal
        show={showEditTaskModal}
        taskToEdit={taskToEdit}
        handleClose={() => setShowEditTaskModal(false)}
        handleSave={handleSaveEditedTask}
      />
    </Container>
  );
}
