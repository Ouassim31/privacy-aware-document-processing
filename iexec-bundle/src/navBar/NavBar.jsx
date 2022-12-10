import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Internet of Service Lab</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">  
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/applicant">For Applicants</Nav.Link>
            <Nav.Link href="/landlord">For Landlords</Nav.Link>
            <Nav.Link href="/login-or-register">Login</Nav.Link>
            <Nav.Link href="/login-or-register">Register</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;