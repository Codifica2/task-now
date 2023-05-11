/* eslint-disable no-unused-vars */
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import withAuth from '../../withAuth'

import Menu from './menu/Menu'
import Header from './header/Header'
import Dashboard from './dashboard/Dashboard';

const inter = Inter({ subsets: ['latin'] })

function Home () {
  return (
    <>
      
      <Header></Header>
      <div className={styles.container} style={{ display: 'flex', flexDirection: 'row' }}>
  <Menu />
  <div className={styles.content}>
    <Dashboard />
  </div>
</div>

      
    </>
  )
}

export default withAuth(Home) // envuelve tu componente con el HOC antes de exportarlo
