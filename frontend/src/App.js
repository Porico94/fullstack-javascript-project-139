import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
