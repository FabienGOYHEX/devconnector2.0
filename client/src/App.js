import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

//Redux
import { Provider } from 'react-redux';
import store from './store'

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;
