import React from 'react'
// import logo from './logo.svg';
import './App.css';
import Nav from './Components/Nav';
import PrivateRoute from './Components/PrivateRoute'
import Home from './Components/Home';
import Library from './Components/Library';
import Dashboard from './Components/Dashboard';
import UpdateProfile from './Components/UpdateProfile';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import {BrowserRouter as Router, Routes , Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
          <Nav />
          {/* adding a Routes that is part of the react router dom to load selected link rout me there*/ }
          <Routes >
            <Route path="/" exact element={<Home/>} />
            <Route path="/library" exact element={<Library/>} />
        <Route exact element={<PrivateRoute  />}>
            <Route exact path="/dashboard" element={<Dashboard/>} />
            <Route path="/update-profile" element={<UpdateProfile/>} />
          </Route>
              {/* <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} /> */}
              <Route path="/signup" element={<Signup/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/forgot-password" component={ForgotPassword} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
