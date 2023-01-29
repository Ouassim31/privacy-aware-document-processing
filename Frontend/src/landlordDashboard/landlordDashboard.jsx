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
  const { currentLandlord, fetchProcesses, createProcess,deleteProcess, setTask,connect } = props;
  const [isLoading,setIsLoading] = useState([])
  const [processList, setProcessList] = useState([]);
  const [selectedProcess, setSelectedProcess]=useState(null)
  const [requesterAddress, setRequesterAddress] = useState();
  const [myDeals, setMyDeals] = useState([]);
  const [appAddress, setAppaddress] = useState("0x1ED2F24927A26b8C6a90413EB005562b31aBB345");
  const [iexecParams, setIexecParams] = useState();
  const [show, setShow] = useState(false);
 
  const incomeRef = useRef();
  const rentRef = useRef();
  
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
    const iexec_mod = new IExec({ ethProvider: window.ethereum });

    //fetch app from marketplace
    const { count: app_count, orders: app_orders } =
      await iexec_mod.orderbook.fetchAppOrderbook(appAddress);

    //fetch workerpool from marketplace
    const { count: wp_count, orders: wp_orders } =
      await await iexec_mod.orderbook.fetchWorkerpoolOrderbook({ category: 0 });

    //create and sign request order
    const requestorderTemplate = await iexec_mod.order.createRequestorder({
      app: appAddress,
      category: 0,
      //iexec args
      params: iexec_params,
    });
    const signedrequestorder = await iexec_mod.order.signRequestorder(
      requestorderTemplate
    );
    //match orders
    const { dealid, txHash } = await iexec_mod.order.matchOrders({
      apporder: app_orders[0]?.order,
      workerpoolorder: wp_orders[0]?.order,
      requestorder: signedrequestorder,
    });
    console.log(`created deal ${dealid} in tx ${txHash}`);
    return dealid;
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
    setSelectedProcess(process)
    setShow(true)};
  const handleIexecArgsChange = () => {
    if (rentRef.current.value  && appAddress == "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E") {

        setIexecParams({
          iexec_args: rentRef.current.value + " " + incomeRef.current.value,
        });
     
  }};
  const handleIexecArgsSubmit = (event) => {
    event.preventDefault();
    
      createProcess(currentLandlord.id, null).then((res) => {
        console.log("created process id : " + res);
        fetchProcesses(currentLandlord.id).then((res) => setProcessList(res));
      });

      //createIexecTask(appAddress, iexecParams);
  
  };
  const handleAppSelect = (e) => {
    if (e == "non-tee-args")
      setAppaddress("0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E");
    else if (e == "non-tee-file")
      setAppaddress("0x90997fe5DA97e43621093CF6412505f5fb157B63");
    else if (e == "tee-file")
      setAppaddress("0x1ED2F24927A26b8C6a90413EB005562b31aBB345")
  };
  const handleExecute = async (pid,dataset) => {
      
      if (appAddress === "0x90997fe5DA97e43621093CF6412505f5fb157B63") {
        let daddr = processList.filter((process)=>process._id === pid)[0].download_address
        console.log(daddr)
        setIexecParams({
        iexec_args: rentRef.current.value,
        iexec_input_files: [daddr],
      })
    }
    else if (appAddress === "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E") {
      setIexecParams({
        iexec_args: rentRef.current.value + " " + incomeRef.current.value,
      });
    }
    else if (appAddress === "0x1ED2F24927A26b8C6a90413EB005562b31aBB345"){
      pushRentAsSecret(rentRef.current.value).then((res)=>{
      setIexecParams(
        {
          dataset : dataset,
          secret: res,
          
        }
      )
    })
  }
    if(iexecParams && appAddress){
      setIsLoading([...isLoading,pid])
      const dealid = await createIexecTask(appAddress, iexecParams);
      const tid = await getLastTask(dealid);

      setTask(pid, tid).then((res) => {
        console.log(`setting task ${tid}`)
        fetchProcesses(currentLandlord.id).then((res) => setProcessList(res));
      });
      setIsLoading(isLoading.filter(curr => curr != pid ))
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
  var app_name
  if (appAddress == "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E")
    app_name = "Non TEE App using arguments";
  else if (appAddress == "0x90997fe5DA97e43621093CF6412505f5fb157B63")
    app_name = "Non TEE App using file";
    else if (appAddress == "0x1ED2F24927A26b8C6a90413EB005562b31aBB345")
    app_name = "TEE App using file";
  return (
     
    <Card className="mb-3 p-2">
        
      <Container fluid className="d-inline-flex align-items-center gap-2">
      <Button className="h-50" variant="primary" onClick={handleIexecArgsSubmit}>Add Process</Button>
      <DropdownButton
        onSelect={handleAppSelect}
        variant="success"
        id="dropdown-basic-button"
        title="Chose Dapp"
        className="m-3 sticky-top"
      >
        <Dropdown.Item eventKey="non-tee-args">
          Non Tee App With Args
        </Dropdown.Item>
        <Dropdown.Item eventKey="non-tee-file">
          Non Tee App With File
        </Dropdown.Item>
        <Dropdown.Item eventKey="tee-file">Tee App With File</Dropdown.Item>
      </DropdownButton>
      </Container>
      <Card.Body>
        <Container className="d-flex flex-column align-items-center">
          <Card.Title className="mb-3">
            Welcome {currentLandlord.given_name +' ' + currentLandlord.family_name}
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
                <Form.Label className="table text-center ">please input a rent to compare it to the applicant income</Form.Label>
                  <Form.Control
                    name="rent"
                    ref={rentRef}
                    onChange={handleIexecArgsChange}
                    type="text"
                  />
                  <span className="input-group-text">
                    € 
                  </span>
                </FormGroup>
                {appAddress === "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E" && 
                <FormGroup className="input-group w-50" controlId="income">
                  <span className="input-group-text">
                    Income 
                  </span>
                  <Form.Control
                  name="income"
                    ref={incomeRef}
                    onChange={handleIexecArgsChange}
                    type="text"
                  />
                </FormGroup>}
                
              </Container>}
            
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="outline-primary" disabled={isLoading.some((pid)=>pid === selectedProcess._id)} onClick={() => {
            if(rentRef.current){
              console.log(selectedProcess)
              handleExecute(selectedProcess._id,selectedProcess.dataset_address);
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
                      