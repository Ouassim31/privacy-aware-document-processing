import React, { useState } from 'react';
import { Card,Button,Container } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";



function LoginAndRegister(props) {

  
  const { loginWithRedirect } = useAuth0();
  

  return (
    <Container fluid className='h-100' >
    <Card className=' mx-auto p-4 w-75 justify-content-center'>
      <div><p className="fs-1 text-center">Privacy-aware Document Processing</p></div>
      <div className='p-1 text-center d-flex flex-row justify-content-between'>
        <p className="fs-4">If you are either requesting a document or if you want to respond to a request by uploading a document, please click on login. Registration is not required.</p>
        <p className="fs-4">Before logging in, make sure to install the MetaMask browser extension and to create an etherium wallet. Also make sure to add the iExec sidechain to MetaMask.</p>
      </div>
      <Button variant="outline-primary"  size = 'lg' onClick={() => loginWithRedirect()}>Log In</Button>
    </Card>
    </Container>
    
        );
}

export default LoginAndRegister;