
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


function App() {

const TestcurrentLandlord = {id : '639482f617bf5b744e5a5e71', username:'bill'}
const [currentLandlord,setCurrentLandlord] = useState(TestcurrentLandlord)



useEffect(()=>{
 
  
},[currentLandlord])



  return (
    
    <div className="App">
           
      <NavBar />
      <Routes>
      <Route exact path='/' element={<Homepage/>} />
      <Route  path='/landlord' element={<LandlordDashboard setTask = {setTask} createProcess={()=>createProcess(currentLandlord.id)} fetchProcesses={()=>fetchProcesses(currentLandlord.id)} landlord={currentLandlord}/>}/>
      <Route  path='/applicant' element={<ApplicantDashbord/>}/>
      </Routes>
      
      
      
    </div>
  );
}

export default App;
