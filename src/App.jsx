import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes ,Route} from 'react-router-dom';
import ProtectedRoute from './ProjectedRoute/ProtectedRoute';
import DashboardRoutes from './Routes/DashboardRoute';
import Layout from './pages/Layout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css' 
function App() {

  return (
    <BrowserRouter>
    <Routes>

    <Route path='/LoginPage' element={<LoginPage />} ></Route>
    <Route path='/RegisterPage' element={<RegisterPage/>}></Route>

    <Route path='/' element={
         <ProtectedRoute>
      <Layout/>
    </ProtectedRoute>
    }>

 {DashboardRoutes}


    </Route>


    </Routes>
    <ToastContainer />
    </BrowserRouter>
  )
}

export default App