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
  const [datasetFile, setDatasetFile] = useState(undefined);
  const [encryptedDataset, setEncryptedDataset] = useState(undefined);
  const [count, setCount] = useState(0);
  const [datasetList, setDatasetList] = useState([]);
  // Log into NFT.Storage via GitHub and create API token
  // Paste your NFT.Storage API key into the quotes:
  const NFT_STORAGE_KEY = '<API Token>';

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
        const count = await iexec_mod.dataset.countUserDatasets(address[0]);
        setRequesterAddress(address[0]);
        setCount(count.words[0]);
      } else {
        alert("install metamask extension!!");
      }
    };
    connect();
  }, []);
  //helper function to convert file to BufferArray
  const toArrayBuffer = async (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setDatasetFile(reader.result);
    };
    reader.readAsArrayBuffer(file);
  };
  //helper function to encrypt ArrayBuffer
  const encrypt = async (datasetFile) => {
    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    // generate a key DO NOT leak this key
    const encryptionKey = iexec_mod.dataset.generateEncryptionKey();
    // encrypt
    const encryptedDataset = await iexec_mod.dataset.encrypt(
      datasetFile,
      encryptionKey
    );
    setEncryptedDataset(encryptedDataset);
  };
  //helper function to deploy dataset
  const deploy = async (encrypted_file) => {
    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    const checksum = await iexec_mod.dataset.computeEncryptedFileChecksum(
      encryptedDataset
    );
  

    const { address } = await iexec_mod.dataset.deployDataset({
      owner: requesterAddress,
      name: "testing.txt",
      multiaddr: "/ipfs/QmXuLadkMiZRmLJRbsdQAEWwNnGcZLALJi4pn5FBA5oN5s",
      checksum: checksum,
    });
    console.log("deployed at", address);
  };


  async function uploadToIpfs(file) {
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
    const cid = await nftstorage.storeBlob(file);
    return 'https://' + cid + '.ipfs.nftstorage.link';
  }

  //handle file submit event
  const handleSubmit = async (event) => {
    event.preventDefault();
    const uploadUrl = await uploadToIpfs(selectedFile);
    console.log("uploaded file to: " + uploadUrl);
    // TODO: API call update
  };

  //handle file change event
  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  //encrypt when dataset converted to array buffer
  useEffect(() => {
    if (datasetFile) encrypt(datasetFile);
  }, [datasetFile]);
  //deploy when ArrayBuffer encrypted
  useEffect(() => {
    if (encryptedDataset) deploy(encryptedDataset);
  }, [encryptedDataset]);
  //set Dataset list when count > 0
  useEffect(() => {
    const getDataset = async (userAddress, index) => {
      const iexec_mod = new IExec({ ethProvider: window.ethereum });
      const { dataset } = await iexec_mod.dataset.showUserDataset(
        index,
        userAddress
      );
      setDatasetList((current) => [...current, dataset]);
    };
    if (count > 0) {
      for (let index = 0; index < count; index++) {
        getDataset(requesterAddress, index);
      }
    }
  }, [count]);

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
