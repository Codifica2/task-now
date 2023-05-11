/* eslint-disable no-unused-vars */
import '@/styles/globals.css'
import { UserProvider } from '@/context/auth-context.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'

export default function App ({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
