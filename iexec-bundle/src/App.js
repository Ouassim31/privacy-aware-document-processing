
//imports
export const   { IExec} = require('iexec')
const FileSaver = require('file-saver');
const detectEthereumProvider= require('@metamask/detect-provider');



const connect = async () => {
  const provider = await detectEthereumProvider();

  if (provider) {
    
  } else {
    console.log('Please install MetaMask!');
  }
}
//console log balance
export const getAccount = async () => {
  //wallet address
  
  const requesterAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const iexec_mod = new IExec({ ethProvider: window.ethereum})
  const balance = await iexec_mod.account.checkBalance(requesterAddress[0]);
  
  console.log('Nano RLC staked:', balance.stake.toString());
  console.log('Nano RLC locked:', balance.locked.toString());
}
//console log chain id
export const getNetwork = async () => {
  const iexec_mod = new IExec({ ethProvider: window.ethereum})
  const { chainId, isNative } = await iexec_mod.network.getNetwork();
  console.log(`working on chain ${chainId}, using native token: ${isNative}`); 
  return { chainId, isNative };
  
}
//console log App object
const getApp = async() => {
  //app adress
  const appAddress = "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E"
  const iexec_mod = new IExec({ ethProvider: window.ethereum})
  const { app } = await iexec_mod.app.showApp(appAddress);
  
  console.log('app:', app);
}
//console log requestorder
const createRequestorder = async () => {
  const iexec_mod = new IExec({ ethProvider: window.ethereum})
  
  const appAddress = "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E"
  const requesterAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //fetch app from marketplace
  const { count:app_count, orders:app_orders } = await iexec_mod.orderbook.fetchAppOrderbook(appAddress);
  console.log('app orders')
  console.log('best order:', app_orders[0]?.order);
  console.log('total orders:', app_count);
  
  //fetch workerpool from marketplace
  const { count:wp_count, orders:wp_orders }  = await (await iexec_mod.orderbook.fetchWorkerpoolOrderbook({category:0}));
  console.log('workpool orders :')
  console.log('best order:', wp_orders[0]?.order);
  console.log('total orders:', wp_count);
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
//console log fetched worker pool
const getWorkerpool = async () => {
  const iexec_mod = new IExec({ ethProvider: window.ethereum})
  const { count, orders } = await iexec_mod.orderbook.fetchWorkerpoolOrderbook({category:0});
  console.log('best order:', orders[0]?.order);
  console.log('total orders:', count);
  return orders[0]?.order
}
//console log last deal of wallet owner
const getMyLastDeal = async () => {
  const iexec_mod = new IExec({ ethProvider: window.ethereum})
  const requesterAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const { deals, count } = await iexec_mod.deal.fetchRequesterDeals(requesterAddress[0]);
  console.log('deals count:', count);
  console.log('last deal:', deals[0]);
  return deals[0].dealid
}
//console log last task of a given deal
const getLastTask = async (dealId) => {
  const iexec_mod = new IExec({ ethProvider: window.ethereum})
  const taskId = await iexec_mod.deal.computeTaskId(dealId,0)
  console.log('task id  is ',taskId)
  return taskId

}
//get status of a given task
const getStatus = async (taskId,dealId) => {

  const iexec_mod = new IExec({ ethProvider: window.ethereum})
  const taskObservable = await iexec_mod.task.obsTask(taskId,{dealid:dealId});
  const unsubscribe = taskObservable.subscribe({
    next: ({ message, task }) => console.log(message, task.statusName),
    error: (e) => console.error(e),
    complete: () => console.log('final state reached'),
   });
}
//get last task status of the wallet owner
const getMyLastTaskStatus = async () => {
  const dealId = await getMyLastDeal()
  const taskId = await  getLastTask(dealId)
  getStatus(taskId,dealId)
}
//download result of a given task
const getResult = async (taskId) => {
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
//download result of my last task
const getMyLastTaskResult = async () =>{
  const dealId = await getMyLastDeal()
  const taskId = await  getLastTask(dealId)
  getResult(taskId,dealId)
}


 


function App() {
  
  return (
    <div className="App">
      <button onClick={connect}>connect</button>
      <button onClick={getNetwork}>getNetwork</button>
      <button onClick={getAccount}>getAccount</button>
      <button onClick={getApp}>getApp</button>
      <button onClick={getWorkerpool}>fetch workerpool from marketplace</button>
      <button onClick={createRequestorder}>create request order</button>
      <button onClick={getMyLastDeal}>get my deals</button>
      <button onClick={getLastTask}>getTask</button>
      <button onClick={getMyLastTaskStatus}>get last Task status</button>
      <button onClick={getMyLastTaskResult}>get last Task result</button>
      


      
    </div>
  );
}

export default App;
