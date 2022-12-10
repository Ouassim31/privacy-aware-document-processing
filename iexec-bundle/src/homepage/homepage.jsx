
//imports

import { useState } from 'react';

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
function Homepage() {

  const [currentLandlord,setCurrentLandlord] = useState()
  return (
    
    <div className="homepage">
        


      
    </div>
  );
}

export default Homepage;
