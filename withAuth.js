import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function withAuth (Component) {
  return function ProtectedRoute ({ ...props }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const token = localStorage.getItem('token')

      if (!token) {
        router.replace('/login') // redirige a la página de inicio de sesión si no hay token
      } else {
        setIsLoading(false) // Verificada la autenticación, se puede renderizar el componente
      }
    }, []) // se ejecuta sólo una vez al montar el componente

    // si aún se está verificando la autenticación, muestra un indicador de carga
    if (isLoading) {
      return (
        <div className="text-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner-border" style={{ width: '5rem', height: '5rem', borderWidth: '0.6rem' }} role="status">
          </div>
        </div>
      )
    }

    // si hay un token, renderiza el componente que se le pasa a este HOC
    return <Component {...props} />
  }
}
