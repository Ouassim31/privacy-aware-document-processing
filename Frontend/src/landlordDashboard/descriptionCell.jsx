import { useEffect, useState, useRef } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import {AiOutlineEdit,AiOutlineClose} from "react-icons/ai"

function DescriptionCell({ description,updateDescription }) {
  const [isEditing, setIsEditing] = useState(false);
const [content,setContent]=useState(description)
const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
    updateDescription(content)
    
    .catch((err)=>console.log(err))

}
const handleCancel = () => {
    setIsEditing(false)
    setContent(description)
}
  return isEditing ? (
    <Form onSubmit={handleSubmit}>
        <FormGroup  className="input-group">
            <Form.Control onChange={(e)=>setContent(e.target.value)} value={content} type="text"/>
            <Button variant="outline-success" type="submit"><AiOutlineEdit/></Button>
            <Button variant="outline-danger" type="button" onClick={handleCancel}><AiOutlineClose/></Button>
        </FormGroup>
    </Form>
    
  ) : (
    <p onClick={() => setIsEditing(true)}>{content ? content : 'Please add a description'}</p>
  );
}
export default DescriptionCell;
