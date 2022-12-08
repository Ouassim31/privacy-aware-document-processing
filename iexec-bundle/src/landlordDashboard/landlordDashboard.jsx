import {
  Table,
  Button,
  DropdownButton,
  Dropdown,
  Form,
  FormGroup,
} from "react-bootstrap";
import FileSaver from "file-saver";

import { useEffect, useState, useRef } from "react";

export const { IExec } = require("iexec");

function LandlordDashboard() {
  //State variables
  const [requesterAddress, setRequesterAddress] = useState();
  const [myDeals, setMyDeals] = useState([]);
  const [appAddress, setAppaddress] = useState();
  const [iexecParams, setIexecParams] = useState();
  const incomeRef = useRef();
  const rentRef = useRef();

  //get last task
  const getLastTask = async (dealId) => {
    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    const taskId = await iexec_mod.deal.computeTaskId(dealId, 0);
    return taskId;
  };
  //download result of a given task
  const getResult = async (dealId) => {
    console.log(dealId);
    const taskId = await getLastTask(dealId);
    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    const response = await iexec_mod.task.fetchResults(taskId);
    const binary = await response.blob();

    const task = await iexec_mod.task.show(taskId);
    console.log("downloading results");
    console.log(task);
    FileSaver.saveAs(binary, "results.zip");
  };
  //create request order
  const createProcess = async (appAddress, iexec_params) => {
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
  const handleIexecArgsChange = () => {
    if (rentRef.current.value && incomeRef.current.value) {
      if (appAddress == "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E")
        setIexecParams({
          iexec_args: rentRef.current.value + " " + incomeRef.current.value,
        });
      else if (appAddress == "0x90997fe5DA97e43621093CF6412505f5fb157B63")
        setIexecParams({
          iexec_args: rentRef.current.value,
          iexec_input_files: [incomeRef.current.value],
        });
    }
  };
  const handleIexecArgsSubmit = (event) => {
    event.preventDefault();
    if (appAddress && iexecParams) {
      createProcess(appAddress, iexecParams);
    } else {
      window.alert("Both values need to be entred");
    }
  };
  const handleAppSelect = (e) => {
    if (e == "non-tee-args")
      setAppaddress("0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E");
    else if (e == "non-tee-file")
      setAppaddress("0x90997fe5DA97e43621093CF6412505f5fb157B63");
  };
  useEffect(() => {
    console.log(iexecParams);
  }, [iexecParams]);
  useEffect(() => {
    //connect and set requester adress and my deals
    const connect = async () => {
      if (window.ethereum) {
        const address = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const iexec_mod = new IExec({ ethProvider: window.ethereum });
        const balance = await iexec_mod.account.checkBalance(address[0]);
        const { deals, count } = await iexec_mod.deal.fetchRequesterDeals(
          address[0]
        );
        setRequesterAddress(address[0]);
        const deals_list = [];
        //add task id to state variable to use it later
        for (const deal of deals) {
          const lasttaskid = await getLastTask(deal.dealid);
          deal.lasttaskid = lasttaskid;
          deals_list.push(deal);
        }
        setMyDeals(deals_list);
      } else {
        alert("install metamask extension!!");
      }
    };
    connect();
  }, []);

  var incomeInput, iexec_params;
  if (appAddress == "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E")
    incomeInput = "text";
  else if (appAddress == "0x90997fe5DA97e43621093CF6412505f5fb157B63")
    incomeInput = "file";
  return (
    <div>
      <div>Welcome {requesterAddress}</div>
      <DropdownButton
        onSelect={handleAppSelect}
        variant="success"
        id="dropdown-basic-button"
        title="Create Request"
      >
        <Dropdown.Item eventKey="non-tee-args">
          Non Tee App With Args
        </Dropdown.Item>
        <Dropdown.Item eventKey="non-tee-file">
          Non Tee App With File
        </Dropdown.Item>
        <Dropdown.Item disabled>Tee App With File</Dropdown.Item>
      </DropdownButton>

      {
        /* Display form only if we chose an app  */
        appAddress && (
          <Form onSubmit={handleIexecArgsSubmit}>
            <FormGroup controlId="rent">
              <Form.Label>Rent</Form.Label>
              <Form.Control
                ref={rentRef}
                onChange={handleIexecArgsChange}
                type="text"
              />
            </FormGroup>
            <FormGroup controlId="income">
              <Form.Label>
                Income{" "}
                {appAddress == "0x90997fe5DA97e43621093CF6412505f5fb157B63" &&
                  "(File Link)"}
              </Form.Label>
              <Form.Control
                ref={incomeRef}
                onChange={handleIexecArgsChange}
                type="text"
              />
            </FormGroup>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )
      }

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ProcessID</th>
            <th>Process State</th>
            <th>Link for Applicant</th>
            <th>Iexec Task ID</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {myDeals.length > 0 &&
            myDeals.map((deal, index) => (
              <tr key={"deal-" + index}>
                <td>{index}</td>
                <td>{deal.dealid}</td>
                <td>State</td>
                <td>Sent</td>
                <td>{deal.lasttaskid}</td>

                <td>
                  <Button
                    variant="outline-primary"
                    dealid={deal.dealid}
                    onClick={(e) => {
                      getResult(deal.dealid);
                    }}
                  >
                    Result
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default LandlordDashboard;
