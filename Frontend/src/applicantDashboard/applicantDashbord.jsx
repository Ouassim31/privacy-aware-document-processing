import {
  Table,
  Card,
  Button,
  Container,
  Modal,
  Form,
} from "react-bootstrap";

import { useState, useEffect, useRef } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import FileUpload from "./fileUpload";
import { deleteProcess, getProcessByID } from "../services/backed-services";
import { connect } from "../services/iexec-services";
import Process from "../landlordDashboard/process";

function ApplicantDashboard(props) {
  //State Variable
  const { currentUser, stateToText, setFileLink, fetchProcesses } = props;
  const [requesterAddress, setRequesterAddress] = useState();
  const [processList, setProcessList] = useState([]);
  const [show, setShow] = useState(false);
  const [pidRef, setPidRef] = useState();

  //Event Handling
  const handleDelete = (pid) => {
    deleteProcess(pid);
    setProcessList(
      processList.filter((p) => p._id != pid)
    );
  }
  const handlePidChange = (e) => {
    getProcessByID(e.target.value).then((res) => {
      setPidRef(e.target.value);
    });
    setPidRef(e.target.value);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (process) => {
    setShow(true);
  };
  //USE EFFECT HOOKS
  useEffect(() => {
    const getprocesses = async () => {
      const result = await fetchProcesses();
      setProcessList(result);
    };
    getprocesses();
    connect().then((res) => setRequesterAddress(res));
  }, [currentUser]);
  useEffect(() => {
    console.log(pidRef);
  }, [pidRef]);
  
  //RENDERING
  return (
    <><Card className="mw-100">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="lead"
      >
        <Modal.Header closeButton data-cy="applicant-upload-document-button" >Upload document</Modal.Header>
        <Modal.Body className="m-2 p-2 g-2">
          <Form.Group>
            <Form.Label>Please enter a valid Process-ID</Form.Label>
            <Form.Control
              className="w-100"
              onChange={handlePidChange}
              type="text"
              data-cy="process-id-textfield"
            />
          </Form.Group>
          {pidRef && (
            <FileUpload
              currentUser={currentUser}
              setFileLink={setFileLink}
              handleClose={handleClose}
              pid={pidRef}
            />
          )}
        </Modal.Body>
      </Modal>

      
      <Container className="lead d-flex flex-column align-items-center text-center">
        <p className="">Welcome, {currentUser.email}</p>
        <p className="">Connected with Wallet-ID: {requesterAddress}</p>
        
      </Container>

        <Container fluid className="d-inline-flex align-items-begin p-2">
          <Button
            className="h-50"
            variant="outline-primary"
            onClick={handleShow}
          >
            Upload Document
          </Button>
        </Container>
        {processList.length > 0 ? (

        <Container fluid className="d-flex flex-wrap gap-4 m-3 justify-content-center">
          
          
                {processList.map((process, index) => (<Process key={index} process={{_id:process._id,process_state:process.process_state,landlord_id:process.landlord_id,task_id:process.task_id}}  deleteProcess={handleDelete}/>))}
                
                
          </Container>
        )
  
         : (

          <Card className="mb-3 p-2" data-cy="no-processes-available-card-applicant" >No Processes available ..</Card>
        )}
      </Card>
    
    </>
  );
}
export default withAuthenticationRequired(ApplicantDashboard, {
  onRedirecting: () => "you need to be logged in to be able to see the content",
});
