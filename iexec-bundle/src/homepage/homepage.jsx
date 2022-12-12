
//imports

import { useState } from 'react';
import { Card,ListGroup } from 'react-bootstrap';
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

  const {landlord} = props 
  return (
    
    <Card className=" p-2 homepage justify-items-end">
      <ListGroup className='w-50'>
      <ListGroup.Item >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Username</div>
          {landlord.username}</div>
      </ListGroup.Item>
      <ListGroup.Item>
        <div className="ms-2 me-auto">
          <div className="fw-bold">Landlord id</div>
          {landlord.id}</div>
      </ListGroup.Item>
      
    </ListGroup>  


      
    </Card>
  );
}

export default Homepage;
