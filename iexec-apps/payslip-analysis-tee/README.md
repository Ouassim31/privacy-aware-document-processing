# Payslip Analysis App with Dataset and Requester Secret (TEE)

This app specifies whether a tenant makes more than 3 times the rent per month,
based on the net income specified in a payslip. The input file is a text based pdf 
file of the tenant's payslip encrypted as an iExec dataset. The rent is specified in
the frontend by the landlord and passed a requester secret.

## Deployment of the app
Navigate into the app folder
```bash
cd app
```
In order to deploy the app, enter your wallet id in the [iexec json file](app/iexec.json)
of the app. Then deploy the app with
```bash
iexec app deploy --chain bellecour
```
This prints out the app address. Then, publish the app to the iExec Marketplace using
```bash
iexec app publish <0x-app-address> --chain bellecour
```

Running the published app in a TEE requires an app order. It is already set up for this app.
First, run
```bash
iexec order init --app
```
To create an apporder, enter the app address into the [iexec json file](app/iexec.json).
Make sure it is tagged as ```"tee"```. Then, run
```bash
iexec order sign --app && iexec order publish --app
```

## Create an encrypted dataset
Navigate into the dataset folder
```bash
cd dataset
````
The unencrypted (original) pdf file is located in [dataset/datasets/original](dataset/datasets/original).

Now run the following commands to encrypt the file:
```bash
iexec dataset init --encrypted
iexec dataset encrypt
```
This outputs a checksum. Enter it in the [iexec json file](dataset/iexec.json) of the dataset.

The command generated the file ```datasets/encrypted/icome.txt.enc```, which is the encrypted
version of the file. It needs to be pushed somewhere accessible because the worker will 
download it during the execution process. Upload the file to NFT.Storage and copy the download
link. It looks something like this:
```
https://bafkreielxpqxklccixth3lzztkjxy7sjpezbmzijq7hxswyufgi7xu6tv4.ipfs.nftstorage.link
```
Enter this link in the [iexec json file](dataset/iexec.json) as the multiaddr
and name the dataset.

## Deploy and publiush the dataset
To deploy the dataset, run
```bash
iexec dataset deploy --chain bellecour
```

If you want to use the dataset with a different wallet (e.g., the applicant uploads the dataset,
the landlord uses it when launching the app), it needs to be published to the iExec Marketplace.
This can be done with the following commands:
```bash
iexec dataset publish <0x-dataset-address>
iexec order init --dataset
```
Now you need to create a dataset order that allows it to be used in a TEE. First, add the dataset
address in the ```orders``` section. Then, sign and publish the dataset order with
```bash
iexec order sign --dataset && iexec order publish --dataset
```

Now push the secret to the SMS to make it available to applications running in the 
TEE-debug workerpool (for now).

```bash
# set a custom bellecour SMS in chain.json
sed -i 's|"bellecour": {},|"bellecour": { "sms": "https://v7.sms.debug-tee-services.bellecour.iex.ec" },|g' chain.json
```
If this command fails:
```bash
# replace this line
"bellecour": {}

# with this line
"bellecour": { "sms": "https://v7.sms.debug-tee-services.bellecour.iex.ec" },
```
in the [chain json file](dataset/chain.json).

Then push the dataset secret to the SMS:
```bash
iexec dataset push-secret --chain bellecour
```
Save the dataset address for later and
```bash
# restore the default configuration in chain.json
sed -i 's|"bellecour": { "sms": "https://v7.sms.debug-tee-services.bellecour.iex.ec" },|"bellecour": {},|g' chain.json
```
Now the dataset is accessible for applications running in the debug workerpool
*v7-debug.main.pools.iexec.eth* .

## Push the rent as requester secret
```bash
# set a custom bellecour SMS in chain.json
sed -i 's|"bellecour": {},|"bellecour": { "sms": "https://v7.sms.debug-tee-services.bellecour.iex.ec" },|g' chain.json

# push some requester secrets to the SMS (this prompts you to enter the rent value)
# the name of the secret (here it is called rent) can only exist once on the workerpool.
# if the name is rejected, simply use a different name, e.g., rent2, ...
iexec requester push-secret rent --chain bellecour

# restore the default configuration in chain.json
sed -i 's|"bellecour": { "sms": "https://v7.sms.debug-tee-services.bellecour.iex.ec" },|"bellecour": {},|g' chain.json
```

## Run the publicly available app
The app is publicly available in debug mode. You can run it with the following command.
Remember that you need to run it from within a directory that is initialized with iexec init.
Also, make sure that you have a valid dataset address and pushed the rent secret, using your
wallet address, to the sms of the debug workerpool 
(see [Push the rent as requester secret](#push-the-rent-as-requester-secret)).
```bash
# set a custom bellecour SMS in chain.json
sed -i 's|"bellecour": {},|"bellecour": { "sms": "https://v7.sms.debug-tee-services.bellecour.iex.ec" },|g' chain.json

iexec app run 0x1ED2F24927A26b8C6a90413EB005562b31aBB345 \
  --tag tee \
  --dataset 0xCD62368817a0620B1ADe1b1F04Cd313aa54CD2B9 \
  --workerpool v7-debug.main.pools.iexec.eth \
  --secret 1=rent5 \
  --watch \
  --chain bellecour
```
