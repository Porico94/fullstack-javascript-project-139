import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const { loggedIn, logout } = useContext(AuthContext);

  return (
    <nav style={{
      backgroundColor: '#1976d2',
      padding: '1rem 2rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Link a "/" con texto "Chat" */}
      <Link
        to="/"
        style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold'
        }}
        >
          {t('navbar.chat')}
        </Link>
      
      {/* Si loggedIn es true, mostrar botón "Logout" */}
      {loggedIn && (
        <Button
            variant='light'
            onClick={logout}
        >
          {t('navbar.logout')}
        </Button>
        )}
    </nav>
  );
};

export default Navbar;