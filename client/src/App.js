import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from '../src/components/register';
import Home from '../src/components/home';
import Login from '../src/components/login';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
