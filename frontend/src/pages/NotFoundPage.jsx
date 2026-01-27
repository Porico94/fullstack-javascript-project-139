import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.subtitle}>Página no encontrada</p>
      <p style={styles.text}>
        La página que buscas no existe.
      </p>
      <Link to="/" style={styles.link}>
        Volver al inicio
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: '6rem',
    margin: '0',
    color: '#1976d2',
  },
  subtitle: {
    fontSize: '2rem',
    margin: '1rem 0',
    color: '#333',
  },
  text: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '2rem',
  },
  link: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#1976d2',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
};

export default NotFoundPage;