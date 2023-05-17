/* eslint-disable no-unused-vars */
import { Button, Col } from 'react-bootstrap'

import { RiArrowUpDownFill } from 'react-icons/ri'
import { useTaskContext } from '@/context/taskContext.js'
import { useState } from 'react'

const Sort = ({ activeSort, setActiveSort }) => {
  const { tasks, setTasks } = useTaskContext()
  // On first sort button click, tasks should be sorted by descending date (newest first)
  const [descending, setDescending] = useState(false)

  const handleOrderTasks = () => {
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

  return (
    <Col>
        <Button
          variant={ activeSort === 'dueDate' ? 'dark' : 'light' }
          onClick={ handleOrderTasks }
        >
            <RiArrowUpDownFill/> Ordenar por fecha
        </Button>
    </Col>
  )
}

export default Sort
