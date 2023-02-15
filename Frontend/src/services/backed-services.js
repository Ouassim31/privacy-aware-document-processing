
import axios from 'axios';

/**
 * get a process by its ID
 * @param pid - the process ID
 * @returns JSON-Object representing the process
 */
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
/**
 * update the description of a process
 * @param  pid - ID of the process to update 
 * @param {*} description - the new description
 * @returns 
 */
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
/**
 * fetch all processes of a given user
 * @param  role applicant/landlord
 * @param  email - the email of the user
 * @returns a list of processes created/followed by the given user
 */
export const fetchProcesses = async (role,email) => {
    console.log('fetching processes')
    let res = await axios({
      method: 'get',
      headers: { 'Content-Type': 'application/json'},
      url: `http://localhost:3001/process/by_${role}?${role}=${email}`,
     })
  
    return res.data
  }
  /**
   * create a process for a given landlord
   * @param {*} landlord 
   * @returns 
   */
  export const createProcess = async (landlord) => {
    console.log('creating process')
    let res = await axios({
      method: 'post',
      headers: { 'Content-Type': 'application/json'},
      url: 'http://localhost:3001/process/',
      data: {
        'landlord_id' : landlord,
      }
  
     })
     return  res.data
  }
  /**
   * delete a process with a given id
   * @param {*} pid - the process to be deleted
   * @returns 
   */
  export const deleteProcess = async (pid) => {
    console.log('deleting process' + pid)
    let res = await axios({
      method: 'delete',
      headers: { 'Content-Type': 'application/json'},
      url: 'http://localhost:3001/process/'+pid,
     })
     return  res.data
  }
  /**
   * assign a task to a given process
   * @param {*} pid - the process to update
   * @param {*} tid - the task to assign
   * @returns 
   */
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
  /**
   * assign a file to a process
   * @param {*} email - applicant email
   * @param {*} pid - process to be updated
   * @param {*} cid - cid of the file
   * @returns 
   */
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