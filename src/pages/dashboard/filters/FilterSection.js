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
}

export default FilterSection
