
//imports

import { useEffect, useState } from 'react';

import NavBar from './navBar/NavBar';
import LandlordDashboard from './landlordDashboard/landlordDashboard';
import ApplicantDashbord from './applicantDashboard/applicantDashboard';

import {
  
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Homepage from './homepage/homepage';
import axios from 'axios';
import LoginAndRegister from './loginAndRegister/loginAndRegister';
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

const fetchProcesses = async (landlordid) => {
  console.log('fetching processes')
  let res = await axios({
    method: 'get',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3000/data/process/'+landlordid,
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
  let res = await axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3000/data/process/'+pid+'/'+cid+'/update',
   })
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


function App() {

const TestcurrentLandlord = {id : '639482f617bf5b744e5a5e71', username:'bill'}
const [currentLandlord,setCurrentLandlord] = useState({id:localStorage.getItem("logged_user_id"), username: localStorage.getItem("logged_user_username")})

console.log(currentLandlord)

useEffect(()=>{
  if (localStorage.getItem("logged_user_id")){
  setCurrentLandlord({id:localStorage.getItem("logged_user_id"), username: localStorage.getItem("logged_user_username")})
  }
  else {
    setCurrentLandlord(null)
  }
  
},[localStorage.getItem("logged_user_id")])



  return (
    
    <div className="App">
           
      <NavBar />
      <Routes>
      
      {currentLandlord && (<><Route  path='/landlord' element={<LandlordDashboard setTask = {setTask} createProcess={()=>createProcess(currentLandlord.id)} fetchProcesses={()=>fetchProcesses(currentLandlord.id)} landlord={currentLandlord}/>}/></>)}
      <Route exact path='/' element={<Homepage/>} />
      <Route  path='/applicant/:pid' element={<ApplicantDashbord setFileLink = {setFileLink}/>} />
      <Route  path='/login-or-register' element={<LoginAndRegister login={login} register={register}/>} />
      </Routes>
      
      
      
    </div>
  );
}

export default App;
