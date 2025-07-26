//This file provides the various routes for the application

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VerifyEmail from './components/Auth/VerifyEmail';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

import PizzaDashboard from './components/Pizza/PizzaDashboard';
import PizzaBuilder from './components/Pizza/PizzaBuilder';

import AdminDashboard from './components/Admin/AdminDashboard';
import AddInventoryItems from './components/Admin/AddInventoryItems';

import Header from './components/Layout/Header';
import PrivateRoute from './components/Layout/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
          <Route path="/verify-email/:token" element={ <VerifyEmail /> } />
          <Route path="/forgot-password" element={ <ForgotPassword /> } />
          <Route path="/reset-password/:token" element={ <ResetPassword /> } />

          <Route path="/" element={
            <PrivateRoute>
              <PizzaDashboard />
            </PrivateRoute>
          } />

          <Route path="/build-pizza" element={
            <PrivateRoute>
              <PizzaBuilder />
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute adminOnly>
              <AdminDashboard/>
            </PrivateRoute>  
          } />
          
          <Route path="/admin/inventory" element={
            <PrivateRoute adminOnly>
              <AddInventoryItems />
            </PrivateRoute>
          } />


          <Route path="*" element={<h2>404: Page Not Found</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;