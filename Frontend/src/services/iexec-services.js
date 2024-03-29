
import FileSaver from "file-saver";
import { NFTStorage, File } from 'nft.storage'
import { v4 as uuidv4 } from "uuid";
const { IExec } = require("iexec");

const WORKERPOOL_ADDRESS = "v7-debug.main.pools.iexec.eth";
const NFT_STORAGE_KEY = process.env.REACT_APP_NFT_STORAGE_TOKEN;
const APP_ADDRESS = '0xA748F9904b2106210CA91a217fBF8E7D6ec18c05';  

/**
 * encrypt dataset
 * @param {*} datasetFile - file to encrypt
 * @returns 
 */
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

/**
 * upload file to IPFS (NFTStorage)
 * @param {*} file - to uploaded
 * @returns 
 */
export async function uploadToIpfs(file) {
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
  const cid = await nftstorage.storeBlob(file);
  const uploadUrl = 'https://' + cid + '.ipfs.nftstorage.link';
  console.log('Uploaded dataset to ' + uploadUrl);
  return uploadUrl;
}

/**
 * depoloy the encrypted dataset to SMS
 * @param {*} requesterAddress - public key of the applicant
 * @param {*} encryptedDataset - the encrypted dataset
 * @param {*} ipfsAddress - ipfs address
 * @returns 
 */
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

/**
 * push encryption secret to SMS
 * @param {*} datasetAddress dataset adress
 * @param {*} encryptionKey secret to be pushed
 */
export async function pushDatasetSecretToSMS(datasetAddress, encryptionKey) {
  const configArgs = { ethProvider: window.ethereum,  chainId : 134};
  const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
  const iexec = new IExec(configArgs, configOptions);
  const pushed = await iexec.dataset.pushDatasetSecret(datasetAddress, encryptionKey);
  console.log('secret pushed:', pushed);
}

/**
 * publish dataset 
 * @param {*} datasetAddress - dataset to be pushed
 * @returns 
 */
export async function publishDataset(datasetAddress) {
  const configArgs = { ethProvider: window.ethereum,  chainId : 134};
  const configOptions = { smsURL: 'https://v7.sms.debug-tee-services.bellecour.iex.ec' };
  const iexec = new IExec(configArgs, configOptions);

  const signedOrder = await iexec.order.signDatasetorder(
    await iexec.order.createDatasetorder({
      dataset: datasetAddress,
      apprestrict: APP_ADDRESS,
      datasetprice: "0",
      volume: "1000",
      tag: ["tee"]
    })
  );

  const orderHash = await iexec.order.publishDatasetorder(signedOrder);
  return orderHash;
}
/**
 * connect metamask 
 * @returns 
 */
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
/**
 * get the last executed task of a given deal
 * @param {*} dealId 
 * @returns 
 */
   export const getLastTask = async (dealId) => {
      const iexec_mod = new IExec({ ethProvider: window.ethereum });
      const taskId = await iexec_mod.deal.computeTaskId(dealId, 0);
      return taskId;
    };
  
    /**
     * get result of a given task 
     * @param {*} taskId 
     */
   export const getResult = async (taskId) => {
      const iexec_mod = new IExec({ ethProvider: window.ethereum });
      const response = await iexec_mod.task.fetchResults(taskId);
      const binary = await response.blob();
  
      const task = await iexec_mod.task.show(taskId);
      console.log("downloading results");
      FileSaver.saveAs(binary, "results.zip");
    };
  
  /**
   * create and sign Iexec request order 
   * @param {*} appAddress - the dapp to execute
   * @param {*} iexec_params - dapp required params
   * @returns 
   */
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
          app: APP_ADDRESS,
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
  /**
   * push rent to sms
   * @param {*} rent 
   * @returns 
   */
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
