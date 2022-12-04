
import Table from 'react-bootstrap/Table';
import { useEffect } from 'react';
import { useState } from 'react';

export const   { IExec} = require('iexec')





function LandlordDashboard() {
    //State variables
    const [requesterAddress,setRequesterAddress] = useState()
    const [myDeals,setMyDeals] = useState([])
    
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
                    setMyDeals(deals)         
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
        </tr>
      </thead>
      <tbody>
        {myDeals.map(((deal,index) => (
            <tr key={'deal-'+index}>
                <td>{index}</td>
                <td>{deal.dealid}</td>
                <td>{deal.app.pointer}</td>
                <td>{deal.workerpool.pointer}</td>
                <td>{deal.dataset.pointer}</td>
            </tr>
        )))}
      </tbody>
    </Table>
    </div>
    
    )
    }

export default LandlordDashboard