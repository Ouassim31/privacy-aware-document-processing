
import FileSaver from "file-saver";
import { NFTStorage, File } from 'nft.storage'
import { v4 as uuidv4 } from "uuid";
const { IExec } = require("iexec");
const WORKERPOOL_ADDRESS = "v7-debug.main.pools.iexec.eth";
// Log into NFT.Storage via GitHub and create API token
  // Paste your NFT.Storage API key into the quotes:
  const NFT_STORAGE_KEY = process.env.REACT_APP_NFT_STORAGE_TOKEN


export async function encryptDataset(datasetFile) {
    
  // convert file to bytestream
  const fileBytes = await new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(datasetFile);
    fileReader.onload = (e) => resolve(e.target.result);
    fileReader.onerror = () =>
      reject(Error(`Failed to read file: ${fileReader.error}`));
    fileReader.onabort = () => reject(Error(`Failed to read file: aborted`));
  });

  const iexec_mod = new IExec({ ethProvider: window.ethereum });
  const encryptionKey = iexec_mod.dataset.generateEncryptionKey();
  const encryptedDataset = await iexec_mod.dataset.encrypt(
    fileBytes,
    encryptionKey
  );

  return [encryptedDataset, encryptionKey];
};


export async function uploadToIpfs(file) {
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
  const cid = await nftstorage.storeBlob(file);
  const uploadUrl = 'https://' + cid + '.ipfs.nftstorage.link';
  console.log('Uploaded dataset to ' + uploadUrl);
  return uploadUrl;
}


export const deployEncryptedDataset = async (requesterAddress,encryptedDataset, ipfsAddress) =>{
  const configArgs = { ethProvider: window.ethereum,  chainId : 134};
  const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
  const iexec_mod = new IExec(configArgs, configOptions);

  const checksum = await iexec_mod.dataset.computeEncryptedFileChecksum(
    encryptedDataset
  );

  const { address } = await iexec_mod.dataset.deployDataset({
    owner: requesterAddress,
    name: "payslip",
    multiaddr: ipfsAddress,
    checksum: checksum,
  });

  console.log("deployed at", address);
  return address;
};


export async function pushDatasetSecretToSMS(datasetAddress, encryptionKey) {
  const configArgs = { ethProvider: window.ethereum,  chainId : 134};
  const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
  const iexec = new IExec(configArgs, configOptions);
  const pushed = await iexec.dataset.pushDatasetSecret(datasetAddress, encryptionKey);
  console.log('secret pushed:', pushed);
}


export async function publishDataset(datasetAddress) {
  const configArgs = { ethProvider: window.ethereum,  chainId : 134};
  const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
  const iexec = new IExec(configArgs, configOptions);

  const signedOrder = await iexec.order.signDatasetorder(
    await iexec.order.createDatasetorder({
      dataset: datasetAddress,
      datasetprice: "0",
      volume: "1000",
      tag: ["tee"]
    })
  );

  const orderHash = await iexec.order.publishDatasetorder(signedOrder);
  return orderHash;
}

export const connect = async () => {
    if (window.ethereum) {
    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
      return address
    } else {
      console.log('Please install MetaMask!');
    }
  }

    //get last task
   export const getLastTask = async (dealId) => {
      const iexec_mod = new IExec({ ethProvider: window.ethereum });
      const taskId = await iexec_mod.deal.computeTaskId(dealId, 0);
      return taskId;
    };
  
    //download result of a given task
   export const getResult = async (taskId) => {
      const iexec_mod = new IExec({ ethProvider: window.ethereum });
      const response = await iexec_mod.task.fetchResults(taskId);
      const binary = await response.blob();
  
      const task = await iexec_mod.task.show(taskId);
      console.log("downloading results");
      FileSaver.saveAs(binary, "results.zip");
    };
  
    //create request order
  export  const createIexecTask = async (appAddress, iexec_params) => {
      const DATASET_ADDRESS = iexec_params.dataset;
      const RENT_SECRET = iexec_params.rent_secret;
      const configArgs = { ethProvider: window.ethereum, chainId: 134 };
      const configOptions = {
        smsURL: "https://v7.sms.debug-tee-services.bellecour.iex.ec",
      };
      const iexec = new IExec(configArgs, configOptions);
  
      console.log("DATASET: " + DATASET_ADDRESS);
      console.log("RENT SECRET: " + RENT_SECRET);
  
      const storageToken = await iexec.storage.defaultStorageLogin();
      await iexec.storage.pushStorageToken(storageToken, {
        forceUpdate: true,
      });
  
      //fetch app order from marketplace
      const { orders } = await iexec.orderbook.fetchAppOrderbook(appAddress, {
        workerpool: WORKERPOOL_ADDRESS,
        minTag: "tee",
      });
  
      const appOrder = orders && orders[0] && orders[0].order;
      if (!appOrder) throw Error(`no apporder found for app ${appAddress}`);
  
      // fetch worker pool
      const workerPoolRes = await iexec.orderbook.fetchWorkerpoolOrderbook({
        workerpool: WORKERPOOL_ADDRESS,
        minTag: "tee",
      });
  
      const workerPoolOrders = workerPoolRes.orders;
      const workerpoolOrder =
        workerPoolOrders && workerPoolOrders[0] && workerPoolOrders[0].order;
      if (!workerpoolOrder)
        throw Error("no workerpoolorder found for the selected options");
  
      // fetch dataset order
      const datasetOrderRes = await iexec.orderbook.fetchDatasetOrderbook(
        DATASET_ADDRESS,
        {
          workerpool: WORKERPOOL_ADDRESS,
          minTag: "tee",
        }
      );
  
      const datasetOrders = datasetOrderRes.orders;
      const datasetOrder =
        datasetOrders && datasetOrders[0] && datasetOrders[0].order;
      if (!datasetOrder)
        throw Error("no datasetorder found for the selected options");
  
      const requestOrderToSign = await iexec.order.createRequestorder({
        app: appAddress,
        workerpool: WORKERPOOL_ADDRESS,
        dataset: DATASET_ADDRESS,
        volume: 1,
        category: 0,
        tag: "tee",
        params: { iexec_secrets: { 1: RENT_SECRET } },
      });
  
      const requestOrder = await iexec.order.signRequestorder(requestOrderToSign);
  
      // execute app with matching orders
      const res = await iexec.order.matchOrders({
        apporder: appOrder,
        requestorder: requestOrder,
        workerpoolorder: workerpoolOrder,
        datasetorder: datasetOrder,
      });
  
      console.log(`created deal ${res.dealid} in tx ${res.txHash}`);
      return res.dealid;
    };
  
   export const pushRentAsSecret = async (rent) => {
      const configArgs = { ethProvider: window.ethereum, chainId: 134 };
      const configOptions = {
        smsURL: "https://v7.sms.debug-tee-services.bellecour.iex.ec",
      };
      const iexec = new IExec(configArgs, configOptions);
      const secretName = "rent-" + uuidv4();
      const { isPushed } = await iexec.secrets.pushRequesterSecret(
        secretName,
        rent
      );
      console.log("pushed secret " + secretName + ":", isPushed);
      return secretName;
    };