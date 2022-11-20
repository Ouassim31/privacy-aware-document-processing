
//imports
const express = require('express');
const {IExecNetworkModule,IExecAccountModule,IExecAppModule,IExecOrderModule} = require('iexec');
const {getSignerFromPrivateKey} = require('iexec/utils')

//init server
const app = express()
const port = 3000
//init iexec_config
const ethProvider = 'bellecour';
const iexec_config = {ethProvider:ethProvider};



//console log chain id
const getNetwork = async (iexec_config) => {
  const iexec_mod = new IExecNetworkModule(iexec_config)
  const { chainId, isNative } = await iexec_mod.getNetwork();
  console.log(`working on chain ${chainId}, using native token: ${isNative}`); 
}

//console log balance
const getAccount = async (iexec_config) => {
  //wallet address
  const ethAddress = "0xa2490c896AC250bf5604aff008a9CebcA705de20"
  const iexec_mod = new IExecAccountModule(iexec_config)
  const balance = await iexec_mod.checkBalance(ethAddress);
  
  console.log('Nano RLC staked:', balance.stake.toString());
  console.log('Nano RLC locked:', balance.locked.toString());
}
//console log App object
const getApp = async(iexec_config) => {
  //app adress
  const appAddress = "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E"
  const iexec_mod = new IExecAppModule(iexec_config)
  const { app } = await iexec_mod.showApp(appAddress);
  
  console.log('app:', app);
}
//console log requestorder
const createRequestorder = async (iexec_config) => {
  const iexec_mod = new IExecOrderModule(iexec_config)
  const appAddress = "0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E"
  const requestorderTemplate = await iexec_mod.createRequestorder({
    app: appAddress,
    requester : "0xa2490c896AC250bf5604aff008a9CebcA705de20",
    salt: "0xa2490c896AC250bf5604aff008a9CebcA705de69",
    category: 0,
    params: { iexec_args: '400 300'}
   });
   //const requestorder = await iexec_mod.signRequestorder(requestorderTemplate);
   const orderHash = await iexec_mod.hashRequestorder(requestorderTemplate);
   
   return orderHash
   
}

//serve static files
app.use(express.static(__dirname +'\\dist'));
//main route
app.use('/', (req, res) => {


//getNetwork(iexec_config)
//getAccount(iexec_config)
//getApp(iexec_config)
try{
 const orderhash = createRequestorder(iexec_config)
}
catch(e){
  res.send(e)
}


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})