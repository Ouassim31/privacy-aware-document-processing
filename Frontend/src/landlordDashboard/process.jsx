import { Button,Card,ListGroup,Dropdown,DropdownButton,Spinner } from "react-bootstrap"
import { useLocation } from 'react-router-dom'
import { useState,useEffect } from "react"
import TaskBtn from "./taskBtn"
import DescriptionCell from "./descriptionCell"
import { BiWorld,BiCopyAlt } from "react-icons/bi"
import { getResult } from "../services/iexec-services"
import { updateDescription } from "../services/backed-services"


function Process({process,handleShow,deleteProcess,requesterAddress,isLoading}) {
   
    const view = useLocation().pathname;
    console.log(view)
    const stateToText = (pid)=>{
        switch (pid) {
          case 1:
            return 'Waiting for document upload'
            case 2 :
              return 'Document upload completed'
            case 3 :
              return 'iExec task started'
            case 4 :
            return 'iExec task completed'
        
          default:
           return 'UNKNOWN_STATE'
        }
      }
    return <Card style={{ width: '20rem' }}>
    <Card.Body>
      <Card.Title className="row"><p>{process._id}</p> {process.process_state === 1 && (
                        <Button
                          variant="outline-primary"
                          processid={process._id}
                          onClick={(e) => {
                            let url = window.location.origin;
                            navigator.clipboard.writeText(process._id);
                          }}><BiCopyAlt /></Button>
                          )}</Card.Title>
       <Card.Subtitle className="mb-2 text-muted">{view === '/landlord' ? process.applicant_id : process.landlord_id  }</Card.Subtitle>
      <ListGroup variant="flush">
        <ListGroup.Item><strong>State</strong> : {stateToText(process.process_state)}</ListGroup.Item>
       { view === '/landlord' && <ListGroup.Item><strong >Description</strong> : <DescriptionCell updateDescription={(content)=> updateDescription(process._id,content)} description={process.description}/></ListGroup.Item>}
      </ListGroup>
      </Card.Body>
    <Card.Footer className="d-flex gap-3">
      {process.task_id && view =='/landlord' && <TaskBtn
                        task_id={process.task_id}
                        processid={process._id}
                        getResult={getResult}
                      />}
      <DropdownButton
                        id="action-dropdown"
                        title="More"

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
                        (isLoading ? (
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
                            processid={process._id}
                            onClick={(e) => {
                              handleShow(process);
                            }}
                          >
                            Execute
                          </Dropdown.Item>
                        ))}
                        
                        
                      <Dropdown.Item
                        variant="outline-danger"
                        
                        processid={process._id}
                        onClick={(e) => {
                          deleteProcess(process._id);
                          
                        }}
                      >
                        Delete
                      </Dropdown.Item>
                      </DropdownButton>
    

    </Card.Footer>
  </Card>
}
export default Process