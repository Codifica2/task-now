/* eslint-disable no-unused-vars */
import { Inter } from 'next/font/google'
// Import LoginForm from login.js
import Dashboard from './dashboard'

const inter = Inter({ subsets: ['latin'] })

export default function Home () {
  return (
    <>
      <Dashboard />
    </>
  )
}
