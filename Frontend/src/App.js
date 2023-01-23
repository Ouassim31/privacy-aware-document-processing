
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
  if (window.ethereum) {
  const address = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
    return address
  } else {
    console.log('Please install MetaMask!');
  }
}

const fetchProcesses = async (role,email) => {
  console.log('fetching processes')
  let res = await axios({
    method: 'get',
    headers: { 'Content-Type': 'application/json'},
    url: `http://localhost:3001/process/by_${role}?${role}=${email}`,
   })

  return res.data
}

const createProcess = async (landlord) => {
  console.log('creating process')
  let res = await axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3001/process/',
    data: {
      'landlord-id' : landlord,
      'description' : 'test'

    }

   })
   return  res.data
}
const deleteProcess = async (pid) => {
  console.log('deleting process' + pid)
  let res = await axios({
    method: 'delete',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3001/process/'+pid,
   })
   return  res.data
  }
const setTask = async (pid,tid) => {
  console.log('setting task to process ' + pid)
  let res = await axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    url: 'http://localhost:3001/process/'+pid+'/update/task',
    data: {
      task_id : tid
    }
   })
   return  res.data
}
const setFileLink = async(email,pid,cid) =>{
  console.log('setting file to process ' + pid)
  
  let res = await axios({
    method : 'post',
    headers: { 'Content-Type': 'application/json'},
    url: `http://localhost:3001/process/${pid}/update/applicant_dataset`,
    data: { applicant_id : email , dataset_addr : cid}
  })
   return  res.data
}


const uploadtoIPFS = async (file) => {
  const client = create({url:'http://127.0.0.1:5001'})
  const { cid } = await client.add(file)
  return cid.toString()
}
const connecting = async () => {
  if (window.ethereum) {
    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    const balance = await iexec_mod.account.checkBalance(address[0]);
    const { deals, count } = await iexec_mod.deal.fetchRequesterDeals(
      address[0]
    );
    //setRequesterAddress(address[0]);
    const deals_list = [];
    //add task id to state variable to use it later
    for (const deal of deals) {
      //const lasttaskid = await getLastTask(deal.dealid);
      //deal.lasttaskid = lasttaskid;
      deals_list.push(deal);
    }
    //setMyDeals(deals_list);
  } else {
    alert("install metamask extension!!");
  }
};

function App() {
  const {user, isAuthenticated, isLoading} = useAuth0();
const TestcurrentLandlord = {id : '639482f617bf5b744e5a5e71', username:'bill'}
const [currentUser,setCurrentUser] = useState()
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




  console.log(isLoading)
  return (
    
    <div className="App">
           
       {currentUser && <NavBar user={currentUser}/>}
      <Routes>
      { currentUser &&
        <>
      <Route exact path='applicant' element={  <ApplicantDashboard deleteProcess={deleteProcess} connect={connect}  fetchProcesses={()=>fetchProcesses('applicant',currentUser.email)} currentUser ={currentUser}/> }/>
      <Route exact path='landlord' element={  <LandlordDashboard connect={connect} deleteProcess={deleteProcess} setTask = {setTask} createProcess={()=>createProcess(currentUser.email) } fetchProcesses={()=>fetchProcesses('landlord',currentUser.email)} currentLandlord ={currentUser}/> }/>
      <Route exact path='/applicant/:pid' element={ <FileUpload currentUser={user} setFileLink = {(pid,cid) =>setFileLink(user.email,pid,cid)} uploadtoIPFS={uploadtoIPFS}/>} />
      <Route exact path='/'  element={<Homepage user={currentUser}/>}/>
      </>
      }
      <Route exact path='/login'  element={<LoginAndRegister/>}/>
      
     
      </Routes>
      
      
      
    </div>
  );
}

export default App;
