import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AuthContext from '../contexts/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };
  const { loggedIn, logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
        style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }}
      >
        {t('navbar.chat')}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Button variant="outline-light" size="sm" onClick={toggleLanguage}>
          🌐
          {i18n.language === 'en' ? 'ES' : 'EN'}
        </Button>

        {loggedIn && (
          <Button
            variant="light"
            size="sm"
            onClick={logout}
          >
            {t('navbar.logout')}
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
