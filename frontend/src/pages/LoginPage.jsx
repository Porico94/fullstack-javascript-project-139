import { useContext } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const formik = useFormik({
    initialValues: {username: '', password: ''},
    validationSchema: Yup.object({
      username: Yup.string().required(t('login.errors.required')),
      password: Yup.string().required(t('login.errors.required')),
    }),
    onSubmit: async (values, {setErrors, setSubmitting}) => {
      const result = await login(values.username, values.password);

      if (result.success) {
        navigate('/');
      } else {

        let errorMessage;
        
        switch (result.errorCode) {
          case 'INVALID_CREDENTIALS':
            errorMessage = t('login.errors.invalidCredentials');
            break;
          case 'CONNECTION_ERROR':
            errorMessage = t('login.errors.connectionError');
            break;
          default:
            errorMessage = t('login.errors.connectionError');
        }
        setErrors({ password: errorMessage});
      }

      setSubmitting(false);
    }
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{t('login.title')}</h1>
        
        <form onSubmit={formik.handleSubmit} style={styles.form}>
          {/* Campo de usuario */}
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              {t('login.usernamePlaceholder')}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder={t('login.usernamePlaceholder')}
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
              {t('common.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={t('login.passwordPlaceholder')}
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
            {t('login.submitButton')}
          </button>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span>{t('login.noAccount')} </span>
            <Link to="/signup" style={{ color: '#0066cc' }}>
              {t('login.signupLink')}
            </Link>
          </div>
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