/* eslint-disable no-unused-vars */
import { TaskProvider } from '@/context/taskContext.js'
import withAuth from '../../withAuth'

import Menu from './menu/Menu'
import Header from './header/Header'
import Dashboard from './dashboard/Dashboard'

function Home () {
  return (
    <>
      <TaskProvider>
        <Header></Header>
        <div>
          <Menu />
          <div>
            <Dashboard />
          </div>
        </div>
      </TaskProvider>
    </>
  )
}

export default withAuth(Home) // envuelve tu componente con el HOC antes de exportarlo
