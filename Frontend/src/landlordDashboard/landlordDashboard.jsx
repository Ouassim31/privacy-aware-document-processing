import {
  Card,
  Button,
  Form,
  FormGroup,
  Container,
  Modal,
  Spinner,
} from "react-bootstrap";
import { BiWorld, BiCopyAlt } from "react-icons/bi";

import { useEffect, useState, useRef } from "react";

import { withAuthenticationRequired } from "@auth0/auth0-react";

import {
  fetchProcesses,
  deleteProcess,
  updateDescription,
} from "../services/backed-services";
import {
  connect,
  pushRentAsSecret,
  createIexecTask,
  getLastTask,
  getResult,
} from "../services/iexec-services";
import Process from "./process";

function LandlordDashboard(props) {
  //State variables
  const { currentLandlord, fetchProcesses, createProcess, setTask } = props;
  const [isLoading, setIsLoading] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [requesterAddress, setRequesterAddress] = useState();

  const [appAddress, setAppaddress] = useState(
    "0x1ED2F24927A26b8C6a90413EB005562b31aBB345"
  );
  const [iexecParams, setIexecParams] = useState({});
  const [show, setShow] = useState(false);

  const rentRef = useRef();

  /**
   *
   * EVENT HANDLING
   *
   */
  const handleDelete = (pid) => {
    deleteProcess();
    setProcessList(processList.filter((p) => p._id != pid));
  };
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

    if (rentRef.current) {
      const rent_secret = await pushRentAsSecret(rentRef.current.value);
      
      setIsLoading([
        ...isLoading,
        { pid: pid, status: ["Rent pushed as secret"] },
      ]);
      console.log(iexecParams)
      const dealid = await createIexecTask(appAddress,{
        dataset: dataset,
        rent_secret: rent_secret,
      });
      const tid = await getLastTask(dealid);
      setIsLoading(
        isLoading.map(
          (process) =>
            process.pid === pid && {
              pid: process.pid,
              status: [...process.status, "deal signed and created"],
            }
        )
      );
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
              {isLoading.some(({ pid }) => pid === selectedProcess._id) ? (
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
                    <ol>
                      {isLoading
                        .filter(({ pid }) => selectedProcess._id)[0]
                        .status.map((status, index) => (
                          <li id={index}>{status}</li>
                        ))}
                    </ol>
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
                disabled={isLoading.some(
                  ({ pid }) => pid === selectedProcess._id
                )}
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

          <Container
            fluid
            className="d-flex flex-wrap gap-4 m-3 justify-content-center"
          >
            {processList.length > 0 &&
              processList.map((process, index) => (
                <Process
                  key={index}
                  requesterAddress={requesterAddress}
                  process={process}
                  isLoading={isLoading.some(({ pid }) => pid === process._id)}
                  handleShow={handleShow}
                  deleteProcess={handleDelete}
                />
              ))}
          </Container>
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
