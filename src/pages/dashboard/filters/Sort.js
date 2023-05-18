/* eslint-disable no-unused-vars */
import { Button, Col, Dropdown } from 'react-bootstrap'

import { RiArrowUpDownFill, RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri'
import { useResourceContext } from '@/context/resourceContext.js'
import { useState } from 'react'

const Sort = ({ activeSort, setActiveSort }) => {
  const { filteredTasks, setFilteredTasks } = useResourceContext()
  // On first sort button click, tasks should be sorted by descending date (newest first)
  const [descending, setDescending] = useState(false)

  const handleOrderTasksByDueDate = () => {
    let orderedTasks

    if (descending) {
      orderedTasks = filteredTasks.sort((a, b) => a.due_date - b.due_date)
    } else {
      orderedTasks = filteredTasks.sort((a, b) => b.due_date - a.due_date)
    }

    setActiveSort('dueDate')
    setFilteredTasks([...orderedTasks])
    setDescending(!descending)
  }

  const handleOrderTasksByCreationDate = () => {
    let orderedTasks

    if (activeSort === 'dueDate') {
      setDescending(true)
    }

    if (descending) {
      orderedTasks = filteredTasks.sort((a, b) => a.creationDate - b.creationDate)
    } else {
      orderedTasks = filteredTasks.sort((a, b) => b.creationDate - a.creationDate)
    }

    setActiveSort('creationDate')
    setFilteredTasks([...orderedTasks])
    setDescending(!descending)
  }

  return (
    <Col lg={1}>
        <Dropdown>
          <Dropdown.Toggle variant='light'>
            <RiArrowUpDownFill/> Ordenar
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Button} onClick={ handleOrderTasksByCreationDate }>
              Fecha de Creación{ activeSort === 'creationDate' ? (descending ? <RiArrowDownLine /> : <RiArrowUpLine/>) : '' }
            </Dropdown.Item>
            <Dropdown.Item as={Button} onClick={ handleOrderTasksByDueDate }>
              Fecha de Vencimiento{ activeSort === 'dueDate' ? (descending ? <RiArrowDownLine /> : <RiArrowUpLine/>) : '' }
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    </Col>
  )
}

export default Sort
