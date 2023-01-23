
//imports

import { useState } from 'react';
import { Card,ListGroup } from 'react-bootstrap';
import { withAuthenticationRequired } from '@auth0/auth0-react';
export const   { IExec} = require('iexec')
const FileSaver = require('file-saver');
const detectEthereumProvider= require('@metamask/detect-provider');




const connect = async () => {
  const provider = await detectEthereumProvider();

  if (provider) {
    
  } else {
    console.log('Please install MetaMask!');
  }
}






const currentLandlord = {id : '639482f617bf5b744e5a5e71', username:'bill'}
function Homepage(props) {

  const {user} = props;
  
  return (
    
    <Card className=" p-2 homepage">
      <ListGroup horizontal>
      <ListGroup className='w-50'>
      <ListGroup.Item >
        <div className="ms-2 me-auto">
          <div className="fw-bold">username</div>
          {user.nickname}</div>
      </ListGroup.Item>
      <ListGroup.Item >
        <div className="ms-2 me-auto">
          <div className="fw-bold">firstname</div>
          {user.given_name}</div>
      </ListGroup.Item>
      <ListGroup.Item>
        <div className="ms-2 me-auto">
          <div className="fw-bold">lastname</div>
          {user.family_name}</div>
      </ListGroup.Item> 
      <ListGroup.Item>
        <div className="ms-2 me-auto">
          <div className="fw-bold">email</div>
          {user.email}</div>
      </ListGroup.Item> 
    </ListGroup> 
       
    <ListGroup.Item className="text-center h-100">
      <img src={user.picture} className="img-thumbnail" alt="..."/>
    </ListGroup.Item>
      
      </ListGroup>

      
    </Card>
  );
}

export default Homepage;
