
//imports

import { useEffect, useState } from 'react';
import { connect } from './services/iexec-services';
import NavBar from './navBar/NavBar';
import LandlordDashboard from './landlordDashboard/landlordDashboard';

import { setFileLink,fetchProcesses,setTask,createProcess } from './services/backed-services';

import {create} from 'ipfs-http-client'
import { useAuth0 } from "@auth0/auth0-react";

import {
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './homepage/homepage';

import LoginAndRegister from './loginAndRegister/loginAndRegister';
import ApplicantDashboard from './applicantDashboard/applicantDashbord';

export const   { IExec} = require('iexec')
const FileSaver = require('file-saver');
const detectEthereumProvider= require('@metamask/detect-provider');








const uploadtoIPFS = async (file) => {
  const client = create({url:'http://127.0.0.1:5001'})
  const { cid } = await client.add(file)
  return cid.toString()
}



const stateToText = (pid)=>{
  switch (pid) {
    case 1:
      return 'Waiting for the document upload'
    case 2 :
      return 'Document upload completed'
    case 3 :
      return 'IExec task started'
    case 4 :
    return 'IExec task completed'
  
    default:
     return 'UNKNOWN_STATE'
  }
}
function App() {
  const {user, isAuthenticated, isLoading} = useAuth0();
const TestcurrentLandlord = {id : '639482f617bf5b744e5a5e71', username:'bill'}
const [currentUser,setCurrentUser] = useState({})
const [RequesterAddress,setRequesterAddress] = useState(null)


useEffect(()=>{ 
  if(!isLoading){
    //call api get landlord by google_id
    const landlord = {}
    setCurrentUser({
      ...user,
      ...landlord 
    })
    
    connect().then((res)=> {
      setRequesterAddress(res)
      console.log(res)
    })
      

    console.log(currentUser)
  }
},[user])




 
  return (
    
    <div className="App">
           
       {currentUser.email && <NavBar resetCurrentuser = {()=> setCurrentUser({})} user={currentUser}/>}
      <Routes>
      
      <Route exact path='applicant' element={  <ApplicantDashboard stateToText={stateToText} setFileLink = {(pid,cid) =>setFileLink(user.email,pid,cid)}  fetchProcesses={()=>fetchProcesses('applicant',currentUser.email)} currentUser ={currentUser}/> }/>
      <Route exact path='landlord' element={  <LandlordDashboard stateToText={stateToText}   setTask = {setTask} createProcess={()=>createProcess(currentUser.email) } fetchProcesses={()=>fetchProcesses('landlord',currentUser.email)} currentLandlord ={currentUser}/> }/>
      
      <Route exact path='/'  element={ <Homepage user={currentUser}/>}/>
      
     
     
      
    
      </Routes>
      
      
      
    </div>
  );
}

export default App;
