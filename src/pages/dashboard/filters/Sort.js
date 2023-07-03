/* eslint-disable no-unused-vars */
import { Button, Col, Dropdown } from 'react-bootstrap'

import { RiArrowUpDownFill, RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri'
import { useResourceContext } from '@/context/resourceContext.js'
import { useEffect, useState } from 'react'

const Sort = () => {
  const contextValue = useResourceContext()
  if (!contextValue) {
    return <div>Error: Contexto no disponible</div>
  }
  const { tasks, setTasks } = contextValue
  // On first sort button click, tasks should be sorted by descending date (newest first)
  const [descending, setDescending] = useState(true)
  const [activeSort, setActiveSort] = useState('creationDate')

  const handleOrderTasksByDueDate = () => {
    let orderedTasks

    if (activeSort === 'creationDate') {
      setDescending(true)
    }

    if (descending) {
      orderedTasks = tasks.sort((a, b) => a.due_date - b.due_date)
    } else {
      orderedTasks = tasks.sort((a, b) => b.due_date - a.due_date)
    }

    setActiveSort('dueDate')
    setTasks([...orderedTasks])
    setDescending(!descending)
  }

  const handleOrderTasksByCreationDate = () => {
    let orderedTasks

    if (activeSort === 'dueDate') {
      setDescending(true)
    }

    if (descending) {
      orderedTasks = tasks.sort((a, b) => a.creationDate - b.creationDate)
    } else {
      orderedTasks = tasks.sort((a, b) => b.creationDate - a.creationDate)
    }

    setActiveSort('creationDate')
    setTasks([...orderedTasks])
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
