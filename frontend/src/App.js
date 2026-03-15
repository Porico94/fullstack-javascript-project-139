import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/SignupPage';
import Navbar from './components/NavBar';
import PrivateRoute from './components/PrivateRouter';


function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* Ruta principal - Chat */}
        <Route path="/" element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
          } />
        
        {/* Ruta de signup */}
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta 404 - debe estar al final */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
