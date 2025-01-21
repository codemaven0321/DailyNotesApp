import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import UpdateNote from './pages/Notes/UpdateNote';
import CreateNote from './pages/Notes/CreateNote';
import NotFound from './pages/NotFound';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import MenuBar from './components/Menubar';

function App() {
  return (
    <Router>
      <MenuBar />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes/create" element={<CreateNote />} />
          <Route path="/notes/update/:id" element={<UpdateNote />} />
        </Route>

        {/* NotFound Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
