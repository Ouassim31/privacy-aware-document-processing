import Button from "react-bootstrap/Button";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useEffect } from "react";
import { useState } from "react";

import { NFTStorage, File } from 'nft.storage'
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

export const { IExec } = require("iexec");
function ApplicantDashbord(props) {
  //State variables
  const [requesterAddress, setRequesterAddress] = useState();
  const [selectedFile, setSelectedFile] = useState("");
  // Log into NFT.Storage via GitHub and create API token
  // Paste your NFT.Storage API key into the quotes:
  const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ2OTVCQkE5MzRFYjI4RTY1OTFEQ2NiZjlCOTU0ZTY0MDAwMzVhM0YiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzM1Njc5MjY2OSwibmFtZSI6Imlvc2wifQ.OoOHlZLMuVIVKKedY4XOQHyvw-ygLnj6EYcUd7314B4';

  const {setFileLink,uploadtoIPFS} = props
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
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
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
    const datasetAddress = await handlePdfDocument(selectedFile);
    setFileLink(pid, datasetAddress);
  };

  // handle file change event
  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
 
  return (
    <Card className="m-3 p-3">
      <h3>Process id : {pid}</h3>
    
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>File</Form.Label>
          <Form.Control className="w-100" onChange={handleChange} type="file"  />
          <Form.Text className="text-muted">
            We'll never share your data with anyone else.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Card>
  );
}
export default ApplicantDashbord;
