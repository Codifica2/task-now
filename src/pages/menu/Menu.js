import { Inter } from 'next/font/google';
import { Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './Menu.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Menu() {
  const router = useRouter();
  const currentPath = router.pathname;
  const equipos = ['Equipo 1', 'Equipo 2', 'Equipo 3'];

  const handleEquipoClick = (equipo) => {
    router.push(`/equipos/${equipo}`);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Nav defaultActiveKey="/" className="flex-column">
          <Nav.Link
            className={currentPath === '/' ? styles.active : null}
            onClick={() => router.push('')}
          >
            Todas las tareas
          </Nav.Link>
          <hr />
          <Nav.Link
            className={currentPath === '/personal' ? styles.active : null}
            href="/personal"
          >
            Área personal
          </Nav.Link>
          <hr />
          {equipos.map((equipo) => (
            <Nav.Link key={equipo} onClick={() => handleEquipoClick(equipo)}>
              {equipo}
            </Nav.Link>
          ))}
        </Nav>
      </div>
      <main className={`${styles.main} ${inter.className}`}></main>
    </div>
  );
}