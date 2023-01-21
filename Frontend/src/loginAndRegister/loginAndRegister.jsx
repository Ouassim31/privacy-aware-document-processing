import React, { useState } from 'react';
import { Card,Button,Container } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";



function LoginAndRegister(props) {

  
  const { loginWithRedirect } = useAuth0();
  

  return (
    <Container fluid className='h-100' >
    <Card className=' mx-auto p-4 gap-4 w-50 justify-content-center'>
      <div className='p-1 text-center'>Easy Login </div>
      <Button variant="outline-primary"  size = 'lg' onClick={() => loginWithRedirect()}>Log In</Button>
    </Card>
    </Container>
    
        );
}

export default LoginAndRegister;