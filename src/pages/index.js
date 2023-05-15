/* eslint-disable no-unused-vars */
import withAuth from '../../withAuth'

import Menu from './menu/Menu'
import Header from './header/Header'
import Dashboard from './dashboard/Dashboard'

function Home () {
  return (
    <>
      <Header></Header>
      <div>
        <Menu />
        <div>
          <Dashboard />
        </div>
      </div>
    </>
  )
}

export default withAuth(Home) // envuelve tu componente con el HOC antes de exportarlo
