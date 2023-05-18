/* eslint-disable no-unused-vars */
import { Container, Row } from 'react-bootstrap'
import Sort from './Sort'
import Search from './Search'
import Filters from './Filters'

const FilterSection = ({ activeSort, setActiveSort }) => {
  return (
    <Container className='mt-3 mb-3'>
        <Row className='mb-3 pb-3 border-bottom'>
            <Sort activeSort={activeSort} setActiveSort={setActiveSort}/>
            <Search />
        </Row>
        <Row className='mb-3 pb-3 border-bottom'>
          <Filters/>
        </Row>
    </Container>
  )
  //     return (
  //         <Row className="mb-3">
  //             <InputGroup className="mt-3">
  //             <Col>
  //                 <Form.Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}
  //                 style={{ backgroundColor: '#F5F5F5', color: '#012840' }}
  //                 >
  //                 <option value="">Filtrar y ordenar por...</option>
  //                 <option value="title">Título</option>
  //                 <option value="description">Descripcion</option>
  //                 <option value="dueDateAsc" >Fecha de vencimiento (ascendente)</option>
  //                 <option value="dueDateDesc" >Fecha de vencimiento (descendente)</option>
  //                 <option value="category">Categoría</option>
  //                 <option value="state">Estado</option>
  //                 </Form.Select>
  //                 <Button variant="primary" className="my-custom-button" onClick={clearFilters}>Limpiar filtros</Button>

  //                 {filterBy === 'title' && (
  //                 <Form.Control
  //                     type="text"
  //                     placeholder="Filtrar por nombre"
  //                     value={filters.name}
  //                     onChange={(e) => handleFilterChange('name', e.target.value)}
  //                 />
  //                 )}
  //                 {filterBy === 'description' && (
  //                 <Form.Control
  //                     type="text"
  //                     placeholder="Filtrar por descripción"
  //                     value={filters.description}
  //                     onChange={(e) => handleFilterChange('description', e.target.value)}
  //                 />
  //                 )}
  //                 {filterBy === 'category' && (
  //                 <Form.Control
  //                     type="text"
  //                     placeholder="Filtrar por categoría"
  //                     value={filters.category}
  //                     onChange={(e) => handleFilterChange('category', e.target.value)}
  //                 />
  //                 )}
  //                 {filterBy === 'state' && (
  //                 <Form.Control
  //                     type="text"
  //                     placeholder="Filtrar por estado"
  //                     value={filters.status}
  //                     onChange={(e) => handleFilterChange('status', e.target.value)}
  //                 />
  //                 )}

//             </Col>
//             </InputGroup>
//         </Row>
//   )
}

export default FilterSection
