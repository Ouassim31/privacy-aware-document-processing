
import Button from 'react-bootstrap/Button';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useEffect } from 'react';
import { useState } from 'react';

export const   { IExec} = require('iexec')
function ApplicantDashbord(){
    //State variables
    const [requesterAddress,setRequesterAddress] = useState()
    const [selectedFile, setSelectedFile] = useState('');
    const [datasetFile,setDatasetFile] = useState(undefined)
    const [encryptedDataset,setEncryptedDataset] = useState(undefined)
    const [count,setCount] = useState(0)
    const [datasetList,setDatasetList] = useState([])
    
    //init requester address and datasets count
    useEffect( ()=>{
        const connect = async () => {
            if(window.ethereum){
                        const address = await window.ethereum.request({method:'eth_requestAccounts'})
                        const iexec_mod = new IExec({ ethProvider: window.ethereum})
                        const balance = await iexec_mod.account.checkBalance(address[0]);
                        const count = await iexec_mod.dataset.countUserDatasets(address[0]);
                        setRequesterAddress(address[0])
                        setCount(count.words[0])                  
             } 
    
             else{
                alert("install metamask extension!!")
              }}
              connect()
            
    },[])
    //helper function to convert file to BufferArray
    const toArrayBuffer = async (file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
        setDatasetFile(reader.result)
        }
        reader.readAsArrayBuffer(file)
    }
    //helper function to encrypt ArrayBuffer
    const encrypt = async (datasetFile) => {
        const iexec_mod = new IExec({ethProvider:window.ethereum})
        // generate a key DO NOT leak this key
        const encryptionKey = iexec_mod.dataset.generateEncryptionKey();
        // encrypt
        const encryptedDataset = await iexec_mod.dataset.encrypt(
        datasetFile,
        encryptionKey,
        );
        setEncryptedDataset(encryptedDataset)
        
    }
    //helper function to deploy dataset
    const deploy = async (encrypted_file) => {
        const iexec_mod = new IExec({ethProvider:window.ethereum})
        const checksum = await iexec_mod.dataset.computeEncryptedFileChecksum(
            encryptedDataset,
           );

        const { address } = await iexec_mod.dataset.deployDataset({
            owner: requesterAddress,
            name: 'testing.txt',
            multiaddr: '/ipfs/QmXuLadkMiZRmLJRbsdQAEWwNnGcZLALJi4pn5FBA5oN5s',
            checksum: checksum,
           });
        console.log('deployed at', address);
        
    }

    //handle file submit event
    const handleSubmit = (event) =>{
        event.preventDefault();
        toArrayBuffer(selectedFile)
        //you_function(selectFile)

        
        
    }
    //handle file change event
    const handleChange = (event) => {
        setSelectedFile(event.target.files[0])
    }
    //encrypt when dataset converted to array buffer
    useEffect(()=>{
       if(datasetFile) encrypt(datasetFile)
    },[datasetFile])
    //deploy when ArrayBuffer encrypted
    useEffect(()=>{
        if(encryptedDataset) deploy(encryptedDataset)
    },[encryptedDataset])
    //set Dataset list when count > 0
    useEffect(()=>{
        const getDataset = async (userAddress,index) => {
            const iexec_mod = new IExec({ethProvider:window.ethereum})
            const {dataset} =  await iexec_mod.dataset.showUserDataset(index, userAddress);
            setDatasetList((current) => [...current,dataset])
        } 
        if(count > 0 ) {
            

            for (let index = 0; index < count; index++) {
                
                getDataset(requesterAddress,index)
                
            }
         }
    },[count])
    
    
    return (<div>
        <p>Welcome {requesterAddress}</p>
        <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>File</Form.Label>
        <Form.Control  onChange={handleChange} type="file" />
        <Form.Text className="text-muted">
          We'll never share your data with anyone else.
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    <p>Uploaded Datasets : {count}</p>
    <Table responsive striped bordered hover>
    
      <thead>

        <tr>
        <th>#</th>
          <th>datasetChecksum</th>
          <th>datasetMultiaddr</th>
          <th>datasetName</th>
          <th>owner</th>
          <th>registry</th>
        </tr>
      </thead>
      <tbody>
        {datasetList.map(((dataset,index) => (
            <tr key={'dataset-'+index}>
                <td>{index}</td>
              <td>{dataset.datasetChecksum}</td>
          <td>{dataset.datasetMultiaddr}</td>
          <td>{dataset.datasetName}</td>
          <td>{dataset.owner}</td>
          <td>{dataset.registry}</td>  
            </tr>
        )))}
      </tbody>
    </Table>

    </div>)
}
export default ApplicantDashbord