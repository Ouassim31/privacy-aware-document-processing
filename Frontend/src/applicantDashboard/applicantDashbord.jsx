import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useEffect } from "react";
import { useState } from "react";

function ApplicantDashboard (props){
   const  {currentUser,fetchProcesses} = props
   const [processList,setProcessList] = useState([])
   
   useEffect(() => {
    const getprocesses = async () => {
      const result = await fetchProcesses();
      setProcessList(result);
    };
    getprocesses();
  }, [currentUser]);
   return (
        
        processList.length > 0 ? 
        <Card className="mb-3 p-2">
            <h3>My Processes</h3>
        </Card> :
        <Card className="mb-3 p-2">
        
        No Processes available ..
      </Card>
    )

}
export default ApplicantDashboard