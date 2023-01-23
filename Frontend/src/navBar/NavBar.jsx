import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
function NavBar(props) {
  const {user} = props
  const { logout } = useAuth0();
  
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Internet of Service Lab</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="d-flex w-100 basic-navbar-nav">
          <Nav className="me-auto w-100 d-flex justify-content-between">  
            <Nav.Item className='d-flex flex-row'>
            <NavLink className="nav-link active" to="/" >Home</NavLink>
            <NavLink className="nav-link active"  to="/landlord">Landlord</NavLink>
            <NavLink className="nav-link active"  to="/applicant">Applicant</NavLink>
            </Nav.Item>
            <Nav.Item className='d-flex flex-row'>
            <span className="ms-3 text-center align-self-center">Welcome, {user.nickname}</span>
            <NavLink  className="me-3 nav-link active"  as="button" onClick={() => logout({ returnTo: window.location.origin + '/login-or-register' })}>Logout</NavLink>
            </Nav.Item>
            
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;