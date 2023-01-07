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
  const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEM2NDI5Qjg3QjM0ODE2NDg2Y2I1N2U5MzQyQ0NCMjQyRTU4NjExRjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MDkyNjYxOTczMSwibmFtZSI6IklPU0wifQ.dTPIU8YNbQ-oUyfbxJUOaaGNycF3Y238yRkpnmU2pfI';

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
    setFileLink(pid,uploadUrl)
  };

  //handle file change event
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
