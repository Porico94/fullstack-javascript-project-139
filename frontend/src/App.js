import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRouter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - Chat */}
        <Route path="/" element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
          } />
        
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta 404 - debe estar al final */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
