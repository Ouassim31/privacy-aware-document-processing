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
  Spinner
} from "react-bootstrap";
import { BiWorld } from 'react-icons/bi';
import FileSaver from "file-saver";
import { useEffect, useState, useRef } from "react";
import {v4 as uuidv4} from 'uuid';

export const { IExec } = require("iexec");

function LandlordDashboard(props) {

  //State variables
  const { currentLandlord, fetchProcesses, createProcess, deleteProcess, setTask, connect } = props;
  const [isLoading, setIsLoading] = useState([])
  const [processList, setProcessList] = useState([]);
  const [selectedProcess, setSelectedProcess]=useState(null)
  const [requesterAddress, setRequesterAddress] = useState();
  const [myDeals, setMyDeals] = useState([]);
  const [appAddress, setAppaddress] = useState("0x1ED2F24927A26b8C6a90413EB005562b31aBB345");
  const [iexecParams, setIexecParams] = useState();
  const [show, setShow] = useState(false);
 
  const incomeRef = useRef();
  const rentRef = useRef();

  const WORKERPOOL_ADDRESS = "v7-debug.main.pools.iexec.eth";
  
  //get last task
  const getLastTask = async (dealId) => {
    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    const taskId = await iexec_mod.deal.computeTaskId(dealId, 0);
    return taskId;
  };

  //download result of a given task
  const getResult = async (taskId) => {
    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    const response = await iexec_mod.task.fetchResults(taskId);
    const binary = await response.blob();

    const task = await iexec_mod.task.show(taskId);
    console.log("downloading results");
    FileSaver.saveAs(binary, "results.zip");
  };

  //create request order
  const createIexecTask = async (appAddress, iexec_params) => {

    const DATASET_ADDRESS = iexec_params.dataset;
    const RENT_SECRET = iexec_params.rent_secret;
    const configArgs = { ethProvider: window.ethereum,  chainId : 134};
    const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
    const iexec = new IExec(configArgs, configOptions);

    console.log("DATASET: " + DATASET_ADDRESS);
    console.log("RENT SECRET: " + RENT_SECRET);

    const storageToken = await iexec.storage.defaultStorageLogin();
        await iexec.storage.pushStorageToken(storageToken, {
            forceUpdate: true
        });

    //fetch app order from marketplace
    const { orders } = await iexec.orderbook.fetchAppOrderbook(appAddress, {
      workerpool: WORKERPOOL_ADDRESS,
      minTag: 'tee'
    });

    const appOrder = orders && orders[0] && orders[0].order;
    if (!appOrder) throw Error(`no apporder found for app ${appAddress}`);

    // fetch worker pool
    const workerPoolRes = await iexec.orderbook.fetchWorkerpoolOrderbook({
      workerpool : WORKERPOOL_ADDRESS,
      minTag : 'tee'
    });
    
    const workerPoolOrders = workerPoolRes.orders;
    const workerpoolOrder = workerPoolOrders && workerPoolOrders[0] && workerPoolOrders[0].order;
    if (!workerpoolOrder)
        throw Error('no workerpoolorder found for the selected options');

    // fetch dataset order
    const datasetOrderRes = await iexec.orderbook.fetchDatasetOrderbook(DATASET_ADDRESS, {
      workerpool: WORKERPOOL_ADDRESS,
      minTag: 'tee'
    });

    const datasetOrders = datasetOrderRes.orders;
    const datasetOrder = datasetOrders && datasetOrders[0] && datasetOrders[0].order;
    if (!datasetOrder)
      throw Error('no datasetorder found for the selected options');
  
    const requestOrderToSign = await iexec.order.createRequestorder({
      app: appAddress,
      workerpool: WORKERPOOL_ADDRESS,
      dataset: DATASET_ADDRESS,
      volume: 1,
      category: 0,
      tag : 'tee',
      params : {iexec_secrets : {1: RENT_SECRET}}
    });

    const requestOrder = await iexec.order.signRequestorder(requestOrderToSign);

    // execute app with matching orders
    const res = await iexec.order.matchOrders({
      apporder: appOrder,
      requestorder: requestOrder,
      workerpoolorder: workerpoolOrder,
      datasetorder: datasetOrder
    });

    console.log(`created deal ${res.dealid} in tx ${res.txHash}`);
    return res.dealid;
  };

  const pushRentAsSecret = async (rent) => {
    const configArgs = { ethProvider: window.ethereum,  chainId : 134};
    const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
    const iexec = new IExec(configArgs, configOptions);
    const secretName = "rent-" + uuidv4();
    const { isPushed } = await iexec.secrets.pushRequesterSecret(secretName, rent);
    console.log('pushed secret ' + secretName + ':', isPushed);
    return secretName;
  }

  /**
   *
   * EVENT HANDLING
   *
   */
  const handleClose = () => {
    setShow(false)
    setSelectedProcess({})
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

    if (!iexecParams) {
      pushRentAsSecret(rentRef.current.value).then((res) => {
        setIexecParams({
          dataset : dataset,
          rent_secret: res  
        });
      });
    }

    if (iexecParams && appAddress) {
      setIsLoading([...isLoading, pid]);
      const dealid = await createIexecTask(appAddress, iexecParams);
      const tid = await getLastTask(dealid);

      setTask(pid, tid).then((res) => {
        console.log(`setting task ${tid}`);
        fetchProcesses(currentLandlord.id).then((res) => setProcessList(res));
      });

      setIsLoading(isLoading.filter(curr => curr != pid ));
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
    connect().then((res) => setRequesterAddress(res))
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
  var app_name = "TEE Payslip Analysis";

  return (
     
    <Card className="mb-3 p-2">
        
      <Container fluid className="d-inline-flex align-items-center gap-2">
      <Button className="h-50" variant="primary" onClick={handleIexecArgsSubmit}>Add Process</Button>
      </Container>
      <Card.Body>
        <Container className="d-flex flex-column align-items-center">
          <Card.Title className="mb-3">
            Welcome {currentLandlord.email}
          </Card.Title>
          <Card.Subtitle className="mb-3">
            Connected with the Wallet ID : {requesterAddress}
          </Card.Subtitle>
          <span>{app_name}</span>
        </Container>
    <Card.Body/>
        
            
        { processList.length > 0 ?
        <><Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton/>
        <Modal.Body>
        
              {isLoading.some((pid)=>pid === selectedProcess._id) ? 
              <>
              <div className="d-table-row"><Spinner className="mx-3" style={{width: '2rem', height: '2rem'}}  animation="border" role="status"></Spinner>
              <span className="text-lg-start" >Please wait untill the iexec task finishes...</span></div>
              <Container><span className="m-2 text-md-center d-block">Status :</span></Container>
              </>
               : <Container
                fluid
                className="m-2 gap-2 d-flex flex-column align-items-center"
              >
                <FormGroup className="input-group" controlId="rent">
                <Form.Label className="table text-center ">Please enter the monthly rent for your appartment.</Form.Label>
                  <Form.Control
                    name="rent"
                    ref={rentRef}
                    type="text"
                  />
                  <span className="input-group-text">
                    € 
                  </span>
                </FormGroup>                
              </Container>}
            
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="outline-primary" disabled={(isLoading.some((pid)=>pid === selectedProcess._id))} onClick={async () => {
            console.log("Dataset: " + selectedProcess.dataset_address);
            if (rentRef.current && selectedProcess.dataset_address) {
              console.log(selectedProcess);
              await handleExecute(selectedProcess._id, selectedProcess.dataset_address);
            }
            
          }}>Execute</Button>
          <Button variant="outline-danger"  onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>ProcessID</th>
              <th>Process State</th>
              <th>Link for Applicant</th>
              <th>Iexec Task ID</th>
              <th>Result</th>
              <th> </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processList.length > 0 &&
              processList.map((process, index) => (
                <tr key={"process-" + index}>
                  <td>{index}</td>
                  <td>{process._id}</td>
                  <td>{process.process_state}</td>
                  <td>
                    {process.process_state === 1 && (
                      <Button
                        variant="outline-primary"
                        processid={index}
                        onClick={(e) => {
                          let url = window.location.origin;
                          navigator.clipboard.writeText(
                            url + "/applicant/" + process._id
                          );
                        }}
                      >
                        Copy Link
                      </Button>
                    )}
                  </td>
                  <td>
                    {process.process_state === 3 && <Button
                      variant="warning"
                      target="_blank"
                      data-cy="iexec-explorer-button"
                      href={
                        "https://explorer.iex.ec/bellecour/task/" +
                        process.task_id
                      }
                    >
                      
                      <BiWorld/> Iexec Explorer
                     
                    </Button>}
                  </td>

                  <td>
                    {process.process_state === 3 && requesterAddress && (
                      <Button
                        variant="outline-success"
                        processid={index}
                        onClick={(e) => {
                          process.task_id && handleResults(process.task_id);
                        }}
                      >
                        Result
                      </Button>
                    )}
                  </td>
                  <td>
                    
                    { requesterAddress && 
                     (isLoading.some((pid)=>pid === process._id) ? <Button className="d-flex d-inline" variant="outline-warning" 
                     onClick={
                      (e) => {
                          handleShow(process)
                      }}>
                     <Spinner style={{width: '1rem', height: '1rem'}} className="" animation="border" role="status"></Spinner>
                     <span className="text-nowrap mx-2">Status</span></Button> :
                       <Button
                        variant="outline-primary"
                        processid={index}
                        onClick={(e) => {
                            
                            handleShow(process)
                            
                          
                        }}
                      >
                        Execute
                      </Button>) 
                    }
                  </td>
                  <td>
                    
                      <Button
                        variant="outline-danger"
                        processid={index}
                        onClick={(e) => {
                        deleteProcess(process._id);
                        setProcessList(processList.filter(p => p._id != process._id))      
                        }}
                      >
                        Delete
                      </Button>
                    
                  </td>
                </tr>
              ))}
          </tbody>
        </Table></>
        :
        <Card data-cy="no-processes-available-card" className="mb-3 p-2">
        
        No Processes available ..
      </Card>}
      </Card.Body>
    </Card>
  
)
                      }
export default LandlordDashboard;
                      