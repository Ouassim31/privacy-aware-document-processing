import React, { useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';

function LoginAndRegister(props) {

  const [justifyActive, setJustifyActive] = useState('tab1');
  const {login, register} = props

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const handleLogin= (e) => {
    console.log(e.target.username.value);
    e.preventDefault();
    login(e.target.username.value).then(
      (e) => window.location.replace('/')

    );
  }

  const handleRegister= (e) => {
    console.log(e.target.username.value);
    e.preventDefault();
    register(e.target.username.value).then(
      (e) => console.log(e + " - Register handled.")
    );
  }

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

      <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>

        <MDBTabsPane show={justifyActive === 'tab1'}>
        <form onSubmit={handleLogin}>
          <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text'/>
          <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password'/>

          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>
          <MDBBtn className="mb-4 w-100">Sign in</MDBBtn>
          </form>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>
        <form onSubmit={handleRegister}>
          <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text'/>
          <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password'/>

          <MDBBtn className="mb-4 w-100">Sign up</MDBBtn>
        </form>
        </MDBTabsPane>

      </MDBTabsContent>

    </MDBContainer>
  );
}

export default LoginAndRegister;