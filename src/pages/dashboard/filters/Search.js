/* eslint-disable no-unused-vars */
import InputGroup from 'react-bootstrap/InputGroup'
import { RiSearchLine } from 'react-icons/ri'
import { Col, Form } from 'react-bootstrap'
import { useResourceContext } from '@/context/resourceContext'

const Search = () => {
  const { search, setSearch } = useResourceContext()

  const handleSearchTasks = (event) => {
    setSearch(event.target.value)
  }

  return (
        <Col lg={{ offset: 1 }}>
            <InputGroup>
                <InputGroup.Text id='basic-addon1'>
                    <RiSearchLine/>
                </InputGroup.Text>
                <Form.Control
                    placeholder='Buscar por título'
                    aria-label='Busqueda'
                    aria-describedby='Barra de busqueda por título'
                    onChange={handleSearchTasks}
                    value={search}
                />
            </InputGroup>
        </Col>
  )
}

export default Search
