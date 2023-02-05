import {
  Table,
  Card,
  Button,
  Container,
  Modal,
  Form,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

import { useState, useEffect, useRef } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import FileUpload from "./fileUpload";
import { BiWorld } from "react-icons/bi";
import { deleteProcess, getProcessByID } from "../services/backed-services";
import { connect } from "../services/iexec-services";

function ApplicantDashboard(props) {
  const { currentUser, stateToText, setFileLink, fetchProcesses } = props;
  const [requesterAddress, setRequesterAddress] = useState();
  const [processList, setProcessList] = useState([]);
  const [show, setShow] = useState(false);
  const [pidRef, setPidRef] = useState();

  const handlePidChange = (e) => {
    getProcessByID(e.target.value).then((res) => {
      //TODO check if exists
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
  return (
    <Card className="mb-3 p-2">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="lead"
      >
        <Modal.Header closeButton>Upload document</Modal.Header>
        <Modal.Body className="m-2 p-2 g-2">
          <Form.Group>
            <Form.Label>Please enter a valid Process-ID</Form.Label>
            <Form.Control
              className="w-100"
              onChange={handlePidChange}
              type="text"
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
      <Card.Body>
        <Container className="d-flex flex-column align-items-center">
          <Card.Title className="mb-3">Welcome, {currentUser.email}</Card.Title>
          <Card.Subtitle className="mb-3">
            Connected with Wallet-ID : {requesterAddress}
          </Card.Subtitle>
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
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Request-ID</th>
                <th>Request State</th>
                <th>iExec Task-ID</th>
              </tr>
            </thead>
            <tbody>
              {processList.length > 0 &&
                processList.map((process, index) => (
                  <tr key={"process-" + index}>
                    <td>{index}</td>
                    <td>{process._id}</td>
                    <td>{stateToText(process.process_state)}</td>
                    <td>
                      <DropdownButton
                      variant="outline-primary"
                        id="dropdown-action-button"
                        title="More"
                      >
                        {process.process_state === 3 && (
                          <Dropdown.Item
                            href={
                              "https://explorer.iex.ec/bellecour/task/" +
                              process.task_id
                            }
                          >
                            <BiWorld /> iExec Explorer
                          </Dropdown.Item>
                        )}

                        <Dropdown.Item
                          processid={index}
                          onClick={(e) => {
                            deleteProcess(process._id);
                            setProcessList(
                              processList.filter((p) => p._id != process._id)
                            );
                          }}
                        >
                          Delete
                        </Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        ) : (
          <Card className="mb-3 p-2">No Processes available ..</Card>
        )}
      </Card.Body>
    </Card>
  );
}
export default withAuthenticationRequired(ApplicantDashboard, {
  onRedirecting: () => "you need to be logged in to be able to see the content",
});
