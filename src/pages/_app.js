/* eslint-disable no-unused-vars */
import '@/styles/globals.css'
import { UserProvider } from '@/context/auth-context.js'

export default function App ({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
