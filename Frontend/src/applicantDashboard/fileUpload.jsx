import {Button,Card,Form,Container,Spinner,Modal} from "react-bootstrap";
import { redirect } from "react-router-dom";
import { withAuthenticationRequired } from '@auth0/auth0-react';

import { useEffect } from "react";
import { useState } from "react";

import { encryptDataset,uploadToIpfs,deployEncryptedDataset,pushDatasetSecretToSMS,publishDataset } from "../services/iexec-services";

export const { IExec } = require("iexec");
function FileUpload(props) {
  //State variables
  const [requesterAddress, setRequesterAddress] = useState();
  const [selectedFile, setSelectedFile] = useState("");
  const [isUploading,setIsUploading] = useState(false)
  const [UploadStatus,setUploadStatus] = useState([])
  
  const {setFileLink,pid,handleClose} = props
  
  
  //init requester address and datasets count
  useEffect(() => {
    const connect = async () => {
      if (window.ethereum) {
        const address = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const iexec_mod = new IExec({ ethProvider: window.ethereum });
        const balance = await iexec_mod.account.checkBalance(address[0]);
        
        setRequesterAddress(address[0]);
        
      } else {
        alert("install metamask extension!!");
      }
    };
    connect();
  }, []);



  async function handlePdfDocument(file) {
    const encryptedKeyValue = await encryptDataset(file);
    setUploadStatus([...UploadStatus,'Document encrypted'])
    const encryptedDataset = encryptedKeyValue.at(0);
    const encryptionKey = encryptedKeyValue.at(1);
    const ipfsUrl = await uploadToIpfs(new Blob([encryptedDataset]));
    setUploadStatus([...UploadStatus,'Document uploaded to IPFS'])
    const datasetAddress = await deployEncryptedDataset(requesterAddress,encryptedDataset, ipfsUrl);
    setUploadStatus([...UploadStatus,'Encrypted document deployed'])
    await pushDatasetSecretToSMS(datasetAddress, encryptionKey);
    setUploadStatus([...UploadStatus,'Encryption secret pushed'])
    await publishDataset(datasetAddress);
    
    return datasetAddress;
  }


  // handle file submit event
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true)
    const datasetAddress = await handlePdfDocument(selectedFile);
    setUploadStatus([...UploadStatus,'Document succesfuly uploaded'])
    setFileLink(pid,datasetAddress);
    handleClose()
    
  };

  // handle file change event
  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
 
  return (
    
      <Container className="d-flex flex-column align-items-center my-4 ">
          <div className="text-center">
          <p>Process-ID : {pid}</p>
          </div>
          { isUploading ? <><Spinner style={{width: '6rem', height: '6rem'}} className="m-2" animation="border" role="status"></Spinner>{UploadStatus.length > 0 ? <ul>{UploadStatus.map((e,index) => <li  id={index}>{e}</li>)}</ul> : <span className="fs-2 m-2">Please wait...</span>}</>
          :<Form onSubmit={handleSubmit} className="w-100">
          <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label >File</Form.Label>
          <Form.Control className="w-100" onChange={handleChange} type="file"  />
          <Form.Text className="text-muted">
            We'll never share your data with anyone else.
          </Form.Text>
        </Form.Group>
        <Button className="d-flex" variant="primary" type="submit" disabled={isUploading}>
         Submit
        </Button>
      </Form>}
        </Container>
      
    
  );
}
export default withAuthenticationRequired(FileUpload, {
  onRedirecting: () => 'you need to be logged in to be able to see the content',
});
