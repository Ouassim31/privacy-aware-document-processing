import Container from 'react-bootstrap/Container';
import {Button} from 'bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

function NavBar(props) {
  const logout = () => {
    localStorage.clear()
    window.location.replace('/login-or-register')
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Internet of Service Lab</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="d-flex w-100 basic-navbar-nav">
          <Nav className="me-auto w-100 d-flex justify-content-between">  
            <Nav.Item className='d-flex flex-row'>
            <NavLink className="nav-link active" to="/" >Home</NavLink>
            <NavLink className="nav-link active"  to="/landlord">Dashboard</NavLink>
            </Nav.Item>
            <Nav.Item className='d-flex flex-row'>
            <NavLink className="nav-link active" to="/login-or-register">Login</NavLink>
            <NavLink  className="me-3 nav-link active" to="login-or-register" as="button" onClick={logout}>Logout</NavLink>
            <span className="ms-3 text-center align-self-center">Welcome, {localStorage.getItem('logged_user_username')}</span>
            </Nav.Item>
            
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;