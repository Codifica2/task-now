/* eslint-disable no-unused-vars */
import styles from './Filters.module.css'
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import { useResourceContext } from '@/context/resourceContext.js'
const { Button, Container, Col, Row, Dropdown } = require('react-bootstrap')

const Filters = () => {
  const { tasks, setFilteredTasks } = useResourceContext()

  const options = [...new Set(tasks.map(task => task.category))].map(category => {
    return ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    })
  })

  const handleSelectOption = (selected) => {
    setFilteredTasks(selected)
  }

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
                />
            </Col>
            <Col>
                <h4 className={styles['filter-title']}> Estado </h4>
                <Form>
                  <Form.Check
                    inline
                    label='Pendiente'
                  />
                  <Form.Check
                    inline
                    label='En progreso'
                  />
                  <Form.Check
                    inline
                    label='Terminada'
                  />
                </Form>
            </Col>
        </Row>
    </>
  )
}

export default Filters
