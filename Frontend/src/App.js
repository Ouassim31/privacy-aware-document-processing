
//imports

import { useEffect, useState } from 'react';

import NavBar from './navBar/NavBar';
import LandlordDashboard from './landlordDashboard/landlordDashboard';
import FileUpload from './applicantDashboard/fileUpload';

import {create} from 'ipfs-http-client'
import { useAuth0 } from "@auth0/auth0-react";
import {
  Navigate as Redirect,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Homepage from './homepage/homepage';
import axios from 'axios';
import LoginAndRegister from './loginAndRegister/loginAndRegister';
import ApplicantDashboard from './applicantDashboard/applicantDashbord';
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

const fetchProcesses = async (role,email) => {
  console.log('fetching processes')
  let res = await axios({
    method: 'get',
    headers: { 'Content-Type': 'application/json'},
    url: `http://localhost:3000/process/${role}?${role}=${email}`,
   })

  return res.data
}

const createProcess = async (lid,process) => {
  console.log('creating process')
  let res = await axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3000/data/process/'+lid+'/create/',
   })
   return  res.data
}
const setTask = async (pid,tid) => {
  console.log('setting task to process ' + pid)
  let res = await axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3000/data/process/'+pid+'/'+tid+'/updatetask',
   })
   return  res.data
}
const setFileLink = async(pid,cid) =>{
  console.log('setting file to process ' + pid)
  
  let res = await axios.post('http://localhost:3000/data/process/'+pid+'/daddr/update',cid)
   return  res.data
}
const register = async(username) =>{
  console.log('registering a landlord ' + username)
  let res = await axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3000/data/landlord/'+username+'/create',
   })
   return  res.data
}
const login = async(username) =>{
  console.log('logging in as landlord ' + username)
  let res = await axios({
    method: 'get',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3000/data/landlord/'+username,
   })
   
   localStorage.setItem("logged_user_username", username)
   localStorage.setItem("logged_user_id", res.data)
   
   
   return  res.data
}

const uploadtoIPFS = async (file) => {
  const client = create({url:'http://127.0.0.1:5001'})
  const { cid } = await client.add(file)
  return cid.toString()
}


function App() {
  const {user, isAuthenticated, isLoading} = useAuth0();
const TestcurrentLandlord = {id : '639482f617bf5b744e5a5e71', username:'bill'}
const [currentUser,setCurrentUser] = useState()


useEffect(()=>{ 
  if(!isLoading){
    //call api get landlord by google_id
    const landlord = {}
    setCurrentUser({
      ...user,
      ...landlord 
    })
    console.log(currentUser)
  }
},[user])





  return (
    
    <div className="App">
           
       {currentUser && <NavBar user={currentUser}/>}
      <Routes>
      
      {currentUser &&
      <>
      <Route exact path='/'  element={currentUser ? <Homepage user={currentUser}/> : <Redirect to='/login-or-register'/> }/>
      <Route exact path='applicant' element={ currentUser ? <ApplicantDashboard  fetchProcesses={()=>fetchProcesses('applicant',currentUser.email)} currentUser ={currentUser}/> : <Redirect to='/login-or-register'/>}/>
      <Route exact path='landlord' element={ currentUser ? <LandlordDashboard setTask = {setTask} createProcess={()=>createProcess(currentUser.id) } fetchProcesses={()=>fetchProcesses('landlord',currentUser.email)} currentLandlord ={currentUser}/> : <Redirect to='/login-or-register'/>}/>
      <Route exact path='/applicant/:pid' element={currentUser ? <FileUpload currentUser={user} setFileLink = {setFileLink} uploadtoIPFS={uploadtoIPFS}/> : <Redirect to='/login-or-register'/>} />
      </>
       }
      
       
      <Route exact path='/login-or-register'element= {!currentUser ? <LoginAndRegister/> : <Redirect to='/'/>} /> 
      </Routes>
      
      
      
    </div>
  );
}

export default App;
