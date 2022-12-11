import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Internet of Service Lab</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">  
            <NavLink className="nav-link active" to="/" >Home</NavLink>
            <NavLink className="nav-link active" to="/applicant/6394c555d61f5be48f2a3d77">For Applicants</NavLink>
            <NavLink className="nav-link active"  to="/landlord">For Landlords</NavLink>
            <NavLink className="nav-link active" to="">Login</NavLink>
            <NavLink className="nav-link active" to="#link">Register</NavLink>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;