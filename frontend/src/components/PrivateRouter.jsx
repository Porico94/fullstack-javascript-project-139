import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useContext(AuthContext);

  // Si NO está logueado, redirigir a /login
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  // Si está logueado, mostrar el contenido (ChatPage)
  return children;
};

export default PrivateRoute;