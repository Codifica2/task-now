/* eslint-disable no-unused-vars */
import styles from './Filters.module.css'
import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import { useResourceContext } from '@/context/resourceContext.js'
const { Col, Row } = require('react-bootstrap')

const Filters = () => {
  const contextValue = useResourceContext()
  // Verificar si contextValue está definido
  if (!contextValue) {
    return <div>Error: Contexto no disponible</div>
  }
  const { tasks, setFilteredTasks } = contextValue
  const [statusFilter, setStatusFilter] = useState([])
  const [categoriesFilter, setCategoriesFilter] = useState([])

  const options = [...new Set(tasks.map(task => task.category))].map(category => {
    return ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    })
  })

  const handleSelectOption = (selected) => {
    setCategoriesFilter(selected)
  }

  const handleToggleStatus = (status) => {
    if (statusFilter.includes(status)) {
      setStatusFilter([...statusFilter].filter(stat => stat !== status))
    } else {
      setStatusFilter([...statusFilter].concat(status))
    }
  }

  useEffect(() => {
    const categoriesFilterValues = categoriesFilter.map(task => task.value)

    const filteredTasks = tasks.filter(
      (task) => {
        if (categoriesFilter.length !== 0 && statusFilter.length !== 0) {
          return (categoriesFilterValues.includes(task.category) && statusFilter.includes(task.status))
        } else if (categoriesFilter.length !== 0) {
          return (categoriesFilterValues.includes(task.category))
        } else if (statusFilter.length !== 0) {
          return (statusFilter.includes(task.status))
        } else {
          return true
        }
      }
    )

    if (filteredTasks.length === 0) {
      setFilteredTasks(['empty'])
    } else {
      setFilteredTasks(filteredTasks)
    }
  }, [statusFilter, categoriesFilter, tasks])

  return (
    <>
        <Row>
            <h4 className={styles['filter-section-title']}> Filtros </h4>
        </Row>
        <Row>
            <Col lg={2}>
                <h4 className={styles['filter-title']}> Categoria </h4>
                <Select
                  options={options}
                  isMulti
                  onChange={handleSelectOption}
                  closeMenuOnSelect={false}
                />
            </Col>
            <Col>
                <h4 className={styles['filter-title']}> Estado </h4>
                <Form>
                  <Form.Check
                    inline
                    label='Pendiente'
                    onChange={() => handleToggleStatus('pending')}
                  />
                  <Form.Check
                    inline
                    label='En progreso'
                    onChange={() => handleToggleStatus('En progreso')}
                  />
                  <Form.Check
                    inline
                    label='Terminada'
                    onChange={() => handleToggleStatus('Terminada')}
                  />
                </Form>
            </Col>
        </Row>
    </>
  )
}

export default Filters
