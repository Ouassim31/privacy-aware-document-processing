import {
  Card,
  Table,
  Button,
  DropdownButton,
  Dropdown,
  Form,
  FormGroup,
  Container,
  Modal,
  Spinner,
} from "react-bootstrap";
import { BiWorld, BiCopyAlt } from "react-icons/bi";

import { useEffect, useState, useRef } from "react";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import TaskBtn from "./taskBtn";
import {fetchProcesses,deleteProcess, updateDescription} from '../services/backed-services'
import { connect,pushRentAsSecret,createIexecTask,getLastTask,getResult } from "../services/iexec-services";
import DescriptionCell from "./descriptionCell";



function LandlordDashboard(props) {
  //State variables
  const {
    currentLandlord,
    stateToText,
    fetchProcesses,
    createProcess,
    setTask

  } = props;
  const [isLoading, setIsLoading] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [requesterAddress, setRequesterAddress] = useState();
  
  const [appAddress, setAppaddress] = useState(
    "0x1ED2F24927A26b8C6a90413EB005562b31aBB345"
  );
  const [iexecParams, setIexecParams] = useState();
  const [show, setShow] = useState(false);

  const rentRef = useRef();

  



  /**
   *
   * EVENT HANDLING
   *
   */
  const handleClose = () => {
    setShow(false);
    setSelectedProcess({});
  };

  const handleShow = (process) => {
    setSelectedProcess(process);
    setShow(true);
  };

  const handleIexecArgsSubmit = (event) => {
    event.preventDefault();

    createProcess(currentLandlord.id, null).then((res) => {
      console.log("created process id : " + res);
      fetchProcesses(currentLandlord.id).then((res) => setProcessList(res));
    });
  };

  const handleExecute = async (pid, dataset) => {
    setAppaddress("0x1ED2F24927A26b8C6a90413EB005562b31aBB345");

    if(rentRef.current){
      pushRentAsSecret(rentRef.current.value).then((res) => {
        setIexecParams({
          dataset: dataset,
          rent_secret: res,
        });
      });
      setIsLoading([...isLoading, {pid:pid,status:['Rent pushed as secret']}]);
    }

    if (iexecParams && appAddress) {
     
      const dealid = await createIexecTask(appAddress, iexecParams);
      const tid = await getLastTask(dealid);
      setIsLoading(isLoading.map((process)=> process.pid === pid && {pid:process.pid,status:[...process.status,'deal signed and created']} ))
      setTask(pid, tid).then((res) => {
        console.log(`setting task ${tid}`);
        fetchProcesses(currentLandlord.id).then((res) => setProcessList(res));
      });

      setIsLoading(isLoading.filter((curr) => curr != pid));
    }
  };

  const handleResults = async (tid) => {
    getResult(tid);
  };

  /**
   *
   * useEffect Hooks
   *
   */
  useEffect(() => {
    console.log(iexecParams);
  }, [iexecParams]);

  useEffect(() => {
    const getprocesses = async () => {
      const result = await fetchProcesses();
      setProcessList(result);
    };
    connect().then((res) => setRequesterAddress(res));
    getprocesses();
  }, [currentLandlord]);

  useEffect(() => {
    console.log(processList);
  }, [processList]);

  useEffect(() => {
    //connect and set requester adress and my deals
  }, []);

  /**
   *
   * Rendering
   *
   */
  var app_name = "Payslip Analysis [TEE]";

  return (
    <Card className="mb-3 p-2">
      <Container className="lead d-flex flex-column align-items-center text-center">
        <p className="">Welcome, {currentLandlord.email}</p>
        <p className="">Connected with Wallet-ID : {requesterAddress}</p>
        <p>{app_name}</p>
      </Container>

      <Container fluid className="d-inline-flex align-items-center gap-2">
        <Button
          className="h-50"
          variant="primary"
          onClick={handleIexecArgsSubmit}
        >
          Add Request
        </Button>
      </Container>

      {processList.length > 0 ? (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton />
            <Modal.Body>
              {isLoading.some((pid) => pid === selectedProcess._id) ? (
                <>
                  <div className="d-table-row">
                    <Spinner
                      className="mx-3"
                      style={{ width: "2rem", height: "2rem" }}
                      animation="border"
                      role="status"
                    ></Spinner>
                    <span className="text-lg-start">
                      Please wait untill the iExec task finishes...
                    </span>
                  </div>
                  <Container>
                    <span className="m-2 text-md-center d-block">Status :</span>
                  </Container>
                </>
              ) : (
                <Container
                  fluid
                  className="m-2 gap-2 d-flex flex-column align-items-center"
                >
                  <FormGroup className="input-group" controlId="rent">
                    <Form.Label className="table text-center ">
                      Please enter the monthly rent for your apartment.
                    </Form.Label>
                    <Form.Control name="rent" ref={rentRef} type="text" />
                    <span className="input-group-text">€</span>
                  </FormGroup>
                </Container>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-primary"
                disabled={isLoading.some((pid) => pid === selectedProcess._id)}
                onClick={async () => {
                  console.log("Dataset: " + selectedProcess.dataset_address);
                  if (rentRef.current && selectedProcess.dataset_address) {
                    console.log(selectedProcess);
                    await handleExecute(
                      selectedProcess._id,
                      selectedProcess.dataset_address
                    );
                  }
                }}
              >
                Execute
              </Button>
              <Button variant="outline-danger" onClick={handleClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          <Table responsive striped bordered hover className="m-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Request-ID</th>
                <th>Request State</th>
                <th>Description</th>
                <th>iExec Task State</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {processList.length > 0 &&
                processList.map((process, index) => (
                  <tr key={"process-" + index}>
                    <td>{index}</td>
                    <td className="d-flex justify-content-between">
                      {process._id}{" "}
                      {process.process_state === 1 && (
                        <Button
                          variant="outline-primary"
                          processid={index}
                          onClick={(e) => {
                            let url = window.location.origin;
                            navigator.clipboard.writeText(process._id);
                          }}
                        >
                          <BiCopyAlt />
                        </Button>
                      )}
                    </td>
                    <td>{stateToText(process.process_state)}</td>

                    <td><DescriptionCell updateDescription={(content)=> updateDescription(process._id,content)} description={process.description}/></td>
                    <td>{process.task_id && requesterAddress && (
                        <TaskBtn
                        task_id={process.task_id}
                        processid={process._id}
                        getResult={getResult}
                      />
                      )}</td>
                    <td className="d-flex justify-content-center gap-2">
                      <DropdownButton
                        id="action-dropdown"
                        title="Action"
                      >
                        {process.process_state === 3 && (
                        <Dropdown.Item 
                          
                          target="_blank"
                          href={
                            "https://explorer.iex.ec/bellecour/task/" +
                            process.task_id
                          }
                        >
                          <BiWorld /> iExec Explorer
                        </Dropdown.Item >
                      )}
                        {requesterAddress &&
                        process.process_state === 2 &&
                        (isLoading.some((pid) => pid === process._id) ? (
                          <Dropdown.Item
                            className="d-flex d-inline"
                            variant="outline-warning"
                            onClick={(e) => {
                              handleShow(process);
                            }}
                          >
                            <Spinner
                              style={{ width: "1rem", height: "1rem" }}
                              className=""
                              animation="border"
                              role="status"
                            ></Spinner>
                            <span className="text-nowrap mx-2">Status</span>
                          </Dropdown.Item>
                        ) : (
                          <Dropdown.Item
                            variant="outline-primary"
                            processid={index}
                            onClick={(e) => {
                              handleShow(process);
                            }}
                          >
                            Execute
                          </Dropdown.Item>
                        ))}
                        
                        
                      <Dropdown.Item
                        variant="outline-danger"
                        
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
        </>
      ) : (
        <Card data-cy="no-processes-available-card" className="mb-3 p-2">
          No requests available ..
        </Card>
      )}
    </Card>
  );
}
export default withAuthenticationRequired(LandlordDashboard, {
  onRedirecting: () => "you need to be logged in to be able to see the content",
});
