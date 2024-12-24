import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './components/store/useAuthStore.js';
import { useEffect } from 'react';
import {Loader} from "lucide-react";

const App = () => {
  const {authUser, checkAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
 console.log({authUser});

if (true ) return (
  <div className='flex justify-center items-center h-screen'> 
    <Loader className="size-10 animate-spin"/>
  </div>
  );
  return (
    <div>
      
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settigs" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </div>
  );
}
export default App;