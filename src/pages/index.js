/* eslint-disable no-unused-vars */
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import 'bootstrap/dist/css/bootstrap.min.css'
// Import LoginForm from login.js
import LoginForm from '@/pages/login.js'

const inter = Inter({ subsets: ['latin'] })

export default function Home () {
  return (
    <>
      <LoginForm />
    </>
  )
}
