
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import FileSaver from 'file-saver';
import { useEffect } from 'react';
import { useState } from 'react';

export const   { IExec} = require('iexec')


function LandlordDashboard() {
    //State variables
    const [requesterAddress,setRequesterAddress] = useState()
    const [myDeals,setMyDeals] = useState([])
    
    //get last task
    const getLastTask = async (dealId) => {
      
      const iexec_mod = new IExec({ ethProvider: window.ethereum})
      const taskId = await iexec_mod.deal.computeTaskId(dealId,0)
      return taskId
    
    }
    //download result of a given task
    const getResult = async (dealId) => {
          console.log(dealId)
          const taskId = await getLastTask(dealId)
          const iexec_mod = new IExec({ ethProvider: window.ethereum})
          const response = await iexec_mod.task.fetchResults(taskId);
          const binary = await response.blob();
        
          const task = await iexec_mod.task.show(
          taskId,
         );
          console.log('downloading results')
          console.log(task);
         FileSaver.saveAs(binary, "results.zip");
      }
    //create request order
    const createProcess = async () => {
        const iexec_mod = new IExec({ ethProvider: window.ethereum})
        const appAddress = "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E"
        //fetch app from marketplace
        const { count:app_count, orders:app_orders } = await iexec_mod.orderbook.fetchAppOrderbook(appAddress);
         
        //fetch workerpool from marketplace
        const { count:wp_count, orders:wp_orders }  = await (await iexec_mod.orderbook.fetchWorkerpoolOrderbook({category:0}));
        
        //create and sign request order
        const requestorderTemplate = await iexec_mod.order.createRequestorder({
        app: appAddress,
        category: 0,
        //iexec args
        params: { iexec_args: '400 300'}
        });
        const signedrequestorder = await iexec_mod.order.signRequestorder(requestorderTemplate)
        //match orders
        const { dealid, txHash } = await iexec_mod.order.matchOrders({
        apporder:app_orders[0]?.order,
        workerpoolorder:wp_orders[0]?.order,
        requestorder:signedrequestorder,
            });
        console.log(`created deal ${dealid} in tx ${txHash}`);
        return dealid
    }

    useEffect( ()=>{
    //connect and set requester adress and my deals
    const connect = async () => {
        if(window.ethereum){
                    const address = await window.ethereum.request({method:'eth_requestAccounts'})
                    const iexec_mod = new IExec({ ethProvider: window.ethereum})
                    const balance = await iexec_mod.account.checkBalance(address[0]);
                    const { deals, count } = await iexec_mod.deal.fetchRequesterDeals(address[0]);
                    setRequesterAddress(address[0])
                    const deals_list = []
                    //add task id to state variable to use it later
                    for (const deal of deals) {
                      const lasttaskid = await getLastTask(deal.dealid)
                      deal.lasttaskid = lasttaskid
                      deals_list.push(deal) 
                    }
                    setMyDeals(deals_list)       
         } 

         else{
            alert("install metamask extension!!")
          }}
          connect()
        
},[])


    

    return (
    <div>
    <div>Welcome {requesterAddress}</div>
    <button onClick={createProcess}>Create Request</button>
    
    <Table responsive striped bordered hover>
    
      <thead>

        <tr>
        <th>#</th>
          <th>dealid</th>
          <th>AppAdress</th>
          <th>Workerpooladress</th>
          <th>Dataset</th>
          <th>Last Task ID</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>

        
        {
        myDeals.length > 0 && myDeals.map(((deal,index) => (
                <tr key={'deal-'+index}>
                <td>{index}</td>
                <td>{deal.dealid}</td>
                <td>{deal.app.pointer}</td>
                <td>{deal.workerpool.pointer}</td>
                <td>{deal.dataset.pointer}</td>
                <td>{deal.lasttaskid}</td>

                <td><Button variant="outline-primary" dealid={deal.dealid} onClick={(e)=>{getResult(deal.dealid)}}>Result</Button></td>
            </tr>
        )))
      }
      </tbody>
    </Table>
    </div>
    
    )
    }

export default LandlordDashboard