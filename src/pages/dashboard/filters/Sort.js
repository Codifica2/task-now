/* eslint-disable no-unused-vars */
import { Button, Col, Dropdown } from 'react-bootstrap'

import { RiArrowUpDownFill, RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri'
import { useTaskContext } from '@/context/taskContext.js'
import { useState } from 'react'

const Sort = ({ activeSort, setActiveSort }) => {
  const { tasks, setTasks } = useTaskContext()
  // On first sort button click, tasks should be sorted by descending date (newest first)
  const [descending, setDescending] = useState(false)

  const handleOrderTasksByDueDate = () => {
    let orderedTasks

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

    for (let i = 0; i < orderedTasks.length; i++) {
      console.log(orderedTasks[i])
    }

    setActiveSort('creationDate')
    setTasks([...orderedTasks])
    setDescending(!descending)
  }

  return (
    <Col>
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
