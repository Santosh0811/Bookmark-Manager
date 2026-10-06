import React from 'react'
import './App.css'
import Navbar from './Component/Navbar'
import Bookmark from './Component/Bookmark'
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import BookmarkState from './Component/context/BookmarkState';
import Landing from './Component/Landing';
import VerifiyEmail from './Component/VerifyEmail';
import Login from './Component/Login';
import Signup from './Component/Signup';
import ForgotPassword from './Component/ForgotPassword';

const App = () => {
  return (
    <BookmarkState>
      <div style={{
        backgroundImage: `url(${import.meta.env.VITE_BG_IMAGE})`,
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}>
        <Navbar />

        <ToastContainer
          position="top-center"
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

        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/home' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path='/verifyEmail/:email' element={<VerifiyEmail />} />
          <Route path='/bookmark' element={<Bookmark />} />
        </Routes>
      </div>
    </BookmarkState>
  )
}

export default App
