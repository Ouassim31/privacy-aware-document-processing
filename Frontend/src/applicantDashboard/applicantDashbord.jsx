
import {Table,Card,Button,Container} from "react-bootstrap";
import { useEffect } from "react";
import { useState } from "react";

function ApplicantDashboard (props){
   const  {currentUser,fetchProcesses,connect,deleteProcess} = props
   const [requesterAddress,setRequesterAddress] = useState()
   const [processList,setProcessList] = useState([])
   
   
   useEffect(() => {
    const getprocesses = async () => {
      const result = await fetchProcesses();
      setProcessList(result);
    };
    getprocesses();
    connect().then((res)=>setRequesterAddress(res))
  }, [currentUser]);
   return (
        
        
        <Card className="mb-3 p-2">
            
            <Card.Body>
            <Container className="d-flex flex-column align-items-center">
          <Card.Title className="mb-3">
            Welcome {currentUser.nickname}
          </Card.Title>
          <Card.Subtitle className="mb-3">
            Connected with the Wallet ID : {requesterAddress}
          </Card.Subtitle>
          
        </Container>
        <p className="h4">My Processes</p>
        { processList.length > 0 ? 
            <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>ProcessID</th>
              <th>Process State</th>
              {process.process_state === 3 && <><th>Iexec Task ID</th><th></th></>}
              
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
                  {process.process_state === 3 && <><td>
                    <a
                      target="_blank"
                      href={
                        "https://explorer.iex.ec/bellecour/task/" +
                        process.task_id
                      }
                    >
                      {process.task_id}{" "}
                    </a>
                  </td>
                  <td>
                    { requesterAddress && (
                      <Button
                        variant="outline-primary"
                        processid={index}
                        onClick={(e) => {
                          //open dataset link
                        }}
                      >
                        Dataset
                      </Button>
                    )}
                  </td></>}
                  <td>
                    
                      <Button
                        variant="outline-danger"
                        processid={index}
                        onClick={(e) => {
                        deleteProcess(process._id)
                        setProcessList(processList.filter(p => p._id != process._id))      
                        }}
                      >
                        Delete
                      </Button>
                    
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        :
        <Card className="mb-3 p-2">
        
        No Processes available ..
      </Card>}
            </Card.Body>
        </Card> 
    )

}
export default ApplicantDashboard