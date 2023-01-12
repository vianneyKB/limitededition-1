import React, { useEffect } from 'react';
import './App.css';
import { Layout, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import ModelViewer from './components/ModelViewer';
import LELogo from './assets/logo/LElogo.png'
import { BrowserRouter as Router, Routes as Switch, Route, Link
} from "react-router-dom";
// import TotPage from './components/TOTPage/TotPage';
// import TestCanvas from './components/TestCanvas/TestCanvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Library from './components/Library';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Reset from './components/pages/Reset';
import Dashboard from './components/pages/Dashboard'

// using bcrypt to  user password
const bcrypt = require('bcrypt');
const User = require('./store/userModel');
const { Header, Content } = Layout;
// require database connection
const dbConnection = require('./store/dbConnect');
// execute database to see the connection
dbConnection();

const App = ({}) => {
  return (<>
  {/* <Router> */}
    <Layout className="layout-main">
    <Navbar expand="xl" className='header-layout'>
      <Container>
      <div className='d-flex align-center h-100 mr-3'>
              <img className='title-logo mr--8' src={LELogo} alt="logo"/>
              <div className='title-name'>
                Limited Edition
              </div>
            </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ background: '#f8f8f8' }}/>
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto my-2 my-lg-0" navbarScroll >
            <Nav.Link href="/"><div className='item-header mr--86 cursor-pointer actived'>Home</div></Nav.Link>
            <Nav.Link href="/library"><div className='item-header mr--86 cursor-pointer'>Library</div></Nav.Link>
            <Nav.Link href="/library"><div className='item-header cursor-pointer'>Tutorials</div></Nav.Link>
            <Nav.Link href="#action3"><div className='item-header cursor-pointer'>Tutorials</div></Nav.Link>

            {/* <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown> */}
            {/* <Nav.Link href="#" disabled>
              Link
            </Nav.Link> */}
          </Nav>
            <Nav.Link href="/login"><div className='d-flex align-center h-100'>
              <div className='login-btn cursor-pointer'>Login</div>
            </div></Nav.Link>
            <Nav.Link href="/register"><div className='item-header cursor-pointer'>Register</div></Nav.Link>

        {/* <Row className='h-100 w-100 justify-content-end'>
          <Col lg={12} xl={12}>
            <div className='d-flex align-center h-100'>
              <div className='item-header mr--86 cursor-pointer actived'>Home</div>
              <div className='item-header mr--86 cursor-pointer'>Library</div>
              <div className='item-header cursor-pointer'>Tutorials</div>
            </div>
          </Col>
          <Col lg={6} xl={6}>
            <div className='d-flex align-center justify-content-end h-100'>
              <div className='login-btn cursor-pointer'>Login</div>
            </div>
          </Col>
        </Row> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <Content>
        <div className="main-wraper">
          <Switch>
            <Route exact path="/" element={<ModelViewer isCustomizeMode={false}/>}/>
            <Route exact path="/customize-model" element={<ModelViewer isCustomizeMode={true}/>}/>
            <Route exact path="/library" element={<Library />}/>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          </Switch>
        </div>
      </Content>
    </Layout>
  {/* </Router> */}
  </>)
};

function Home() {
  return <h2>Home</h2>;
}

export default App;
