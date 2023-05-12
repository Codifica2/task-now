/* eslint-disable no-unused-vars */
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import withAuth from '../../withAuth'

import Menu from './menu/Menu'
import Header from './header/Header'
import Dashboard from './dashboard/Dashboard'

const inter = Inter({ subsets: ['latin'] })

function Home () {
  return (
    <>
      <Header></Header>
      <div className={styles.container} style={{ paddingTop: '40px' }}>
        <Menu />
        <div className={styles.content} style={{ marginLeft: '200px', marginTop: '0px' }}>
          <Dashboard />
        </div>
      </div>

    </>
  )
}

export default withAuth(Home) // envuelve tu componente con el HOC antes de exportarlo
