import {Button,Card,Form,Container,Spinner,Modal} from "react-bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import { redirect } from "react-router-dom";
import { useParams } from "react-router-dom";
import { NFTStorage, File } from 'nft.storage'

export const { IExec } = require("iexec");


function FileUpload(props) {
  //State variables
  const [requesterAddress, setRequesterAddress] = useState();
  const [selectedFile, setSelectedFile] = useState("");
  const [isUploading,setIsUploading] = useState(false)
  const {currentUser, setFileLink, uploadtoIPFS} = props
  const {pid} = useParams()
  
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


  async function encryptDataset(datasetFile) {
    
    // convert file to bytestream
    const fileBytes = await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(datasetFile);
      fileReader.onload = (e) => resolve(e.target.result);
      fileReader.onerror = () =>
        reject(Error(`Failed to read file: ${fileReader.error}`));
      fileReader.onabort = () => reject(Error(`Failed to read file: aborted`));
    });

    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    const encryptionKey = iexec_mod.dataset.generateEncryptionKey();
    const encryptedDataset = await iexec_mod.dataset.encrypt(
      fileBytes,
      encryptionKey
    );

    return [encryptedDataset, encryptionKey];
  };


  async function uploadToIpfs(file) {
    const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_TOKEN });
    const cid = await nftstorage.storeBlob(file);
    const uploadUrl = 'https://' + cid + '.ipfs.nftstorage.link';
    console.log('Uploaded dataset to ' + uploadUrl);
    return uploadUrl;
  }


  async function deployEncryptedDataset(encryptedDataset, ipfsAddress) {
    const configArgs = { ethProvider: window.ethereum,  chainId : 134};
    const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
    const iexec_mod = new IExec(configArgs, configOptions);

    const checksum = await iexec_mod.dataset.computeEncryptedFileChecksum(
      encryptedDataset
    );

    const { address } = await iexec_mod.dataset.deployDataset({
      owner: requesterAddress,
      name: "payslip",
      multiaddr: ipfsAddress,
      checksum: checksum,
    });

    console.log("deployed at", address);
    return address;
  };


  async function pushDatasetSecretToSMS(datasetAddress, encryptionKey) {
    const configArgs = { ethProvider: window.ethereum,  chainId : 134};
    const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
    const iexec = new IExec(configArgs, configOptions);
    const pushed = await iexec.dataset.pushDatasetSecret(datasetAddress, encryptionKey);
    console.log('secret pushed:', pushed);
  }


  async function publishDataset(datasetAddress) {
    const configArgs = { ethProvider: window.ethereum,  chainId : 134};
    const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
    const iexec = new IExec(configArgs, configOptions);

    const signedOrder = await iexec.order.signDatasetorder(
      await iexec.order.createDatasetorder({
        dataset: datasetAddress,
        datasetprice: "0",
        volume: "1000",
        tag: ["tee"]
      })
    );

    const orderHash = await iexec.order.publishDatasetorder(signedOrder);
    return orderHash;
  }


  async function handlePdfDocument(file) {
    const encryptedKeyValue = await encryptDataset(file);
    const encryptedDataset = encryptedKeyValue.at(0);
    const encryptionKey = encryptedKeyValue.at(1);
    const ipfsUrl = await uploadToIpfs(new Blob([encryptedDataset]));
    const datasetAddress = await deployEncryptedDataset(encryptedDataset, ipfsUrl);
    await pushDatasetSecretToSMS(datasetAddress, encryptionKey);
    await publishDataset(datasetAddress);
    return datasetAddress;
  }


  // handle file submit event
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true)
    const datasetAddress = await handlePdfDocument(selectedFile);
    setFileLink(pid,datasetAddress);
    redirect('/applicant')
    
  };

  // handle file change event
  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
 
  return (
    <Card className="m-3 p-3">
      <Container className="d-flex flex-column align-items-center">
          <Card.Title className="mb-3">
            Welcome {currentUser.given_name +' ' + currentUser.family_name}
          </Card.Title>
          <Card.Subtitle className="mb-3">
            Connected with the Wallet ID : {requesterAddress}
          </Card.Subtitle>
          <h3>Process id : {pid}</h3>
          { isUploading ? <><><Spinner style={{width: '6rem', height: '6rem'}} className="m-2" animation="border" role="status"></Spinner><span className="fs-2 m-2">Please wait...</span></></> :<Form onSubmit={handleSubmit} className="w-75">
          <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>File</Form.Label>
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
      
    </Card>
  );
}
export default FileUpload;
