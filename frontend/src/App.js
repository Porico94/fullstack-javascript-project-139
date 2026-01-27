import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - Chat */}
        <Route path="/" element={<ChatPage />} />
        
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta 404 - debe estar al final */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
