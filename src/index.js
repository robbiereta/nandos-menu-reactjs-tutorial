import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './pages/Login';

import App  from "./pages/App";
import Dashboard from './pages/Dashboard';
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/" element={<App />} />
 
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'));