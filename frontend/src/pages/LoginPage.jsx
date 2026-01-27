import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(20, 'El nombre de usuario debe tener máximo 20 caracteres')
      .required('El nombre de usuario es obligatorio'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es obligatoria'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // Por ahora solo mostramos en consola
      console.log('Formulario enviado:', values);
      // TODO: Implementar autenticación
    },
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar Sesión</h1>
        
        <form onSubmit={formik.handleSubmit} style={styles.form}>
          {/* Campo de usuario */}
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Tu nombre de usuario"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              style={styles.input}
            />
            {formik.touched.username && formik.errors.username ? (
              <div style={styles.error}>{formik.errors.username}</div>
            ) : null}
          </div>

          {/* Campo de contraseña */}
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Tu contraseña"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              style={styles.input}
            />
            {formik.touched.password && formik.errors.password ? (
              <div style={styles.error}>{formik.errors.password}</div>
            ) : null}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            style={styles.button}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos básicos
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  error: {
    color: '#d32f2f',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default LoginPage;