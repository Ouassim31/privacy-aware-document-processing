import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useAuth0,withAuthenticationRequired } from "@auth0/auth0-react";
function NavBar(props) {
  const {user,resetCurrentuser} = props
  const { logout } = useAuth0();
  
  return (
    <Navbar  bg="primary" variant="dark" expand="lg">
      
        <Navbar.Brand className='mx-2' data-cy="navbar-home" href="/">Privacy-Aware Document Processing</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="d-flex w-100 basic-navbar-nav">
          <Nav className="mx-2 w-100 d-flex justify-content-between">  
            <Nav.Item className='d-flex flex-row'>
            
            <NavLink className="nav-link active" data-cy="navbar-landlord" to="/landlord">Landlord</NavLink>
            <NavLink className="nav-link active" data-cy="navbar-applicant" to="/applicant">Applicant</NavLink>
            </Nav.Item>
            <Nav.Item className='d-flex flex-row'>
            <span style={{color:'white'}} className="ms-3 text-center align-self-center">Welcome, {user.nickname}</span>
            <NavLink  className="me-3 nav-link active"  data-cy="logout-button" as="button" onClick={() => { logout({ returnTo: window.location.origin + '/login' }) ;resetCurrentuser();}}>Logout</NavLink>
            </Nav.Item>
            
            
          </Nav>
        </Navbar.Collapse>
      
    </Navbar>
  );
}

export default NavBar;