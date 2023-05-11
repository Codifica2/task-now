// Implementar Dashboard aquí.
// Import withAuth from withAuth.js, necesario para proteger la ruta
import withAuth from '../../withAuth'

function Dashboard ({ ...props }) {
  return (
    <>
      <h1>Dashboard</h1>
    </>
  )
}

export default withAuth(Dashboard) // envuelve tu componente con el HOC antes de exportarlo
