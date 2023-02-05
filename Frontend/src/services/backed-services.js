
import axios from 'axios';


export const getProcessByID = async (pid) => {
    console.log('fetching processess by id')
    let res = await axios({
      method: 'get',
      headers: { 'Content-Type': 'application/json'},
      url: `http://localhost:3001//process/${pid}`,
     
      error : (err) => console.log(err)
     })
  
    return res.data
  }

export const updateDescription = async (pid,description) => {
    console.log('updating description')
    let res = await axios({
      method: 'post',
      headers: { 'Content-Type': 'application/json'},
      url: `http://localhost:3001/process/${pid}/update/description`,
      data: {
        description : description
      },
      error : (err) => console.log(err)
     })
  
    return res.data
  }

export const fetchProcesses = async (role,email) => {
    console.log('fetching processes')
    let res = await axios({
      method: 'get',
      headers: { 'Content-Type': 'application/json'},
      url: `http://localhost:3001/process/by_${role}?${role}=${email}`,
     })
  
    return res.data
  }
  
  export const createProcess = async (landlord) => {
    console.log('creating process')
    let res = await axios({
      method: 'post',
      headers: { 'Content-Type': 'application/json'},
      url: 'http://localhost:3001/process/',
      data: {
        'landlord_id' : landlord,
        'description' : 'test'
  
      }
  
     })
     return  res.data
  }
  export const deleteProcess = async (pid) => {
    console.log('deleting process' + pid)
    let res = await axios({
      method: 'delete',
      headers: { 'Content-Type': 'application/json'},
      url: 'http://localhost:3001/process/'+pid,
     })
     return  res.data
    }
  export const setTask = async (pid,tid) => {
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
  export const setFileLink = async(email,pid,cid) =>{
    console.log('setting file to process ' + pid)
    
    let res = await axios({
      method : 'post',
      headers: { 'Content-Type': 'application/json'},
      url: `http://localhost:3001/process/${pid}/update/applicant_dataset`,
      data: { applicant_id : email , dataset_address : cid}
    })
     return  res.data
  }