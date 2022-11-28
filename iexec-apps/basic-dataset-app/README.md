# IExec App with Dataset and Requester Secret (TEE)

This app features the basic functionality for reading and analysing
an encrypted input file. The input file is a .txt one-liner contianing
"income: <income>". The

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
This prints out the app address.

## Create an encrypted dataset
Navigate into the dataset folder
```bash
cd dataset
````
The unencrypted (original) txt file is located in [dataset/datasets/original](dataset/datasets/original).

Now run the following command to encrypt the file:
```bash
iexec dataset encrypt
```
This outputs a checksum. Enter it in the [iexec json file](dataset/iexec.json) of the dataset.

The command generated the file ```datasets/encrypted/icome.txt.enc```, which is the encrypted
version of the file. It needs to be pushed somewhere accessible because the worker will 
download it during the execution process. Upload the file to a public github repository
and use the link
```
https://github.com/<username>/<repo>/raw/main/income.txt.enc
```
Enter the link to your file in this [iexec json file](dataset/iexec.json) as the multiaddr
and name the dataset.

## Deploy the dataset
To deploy the dataset, run:
```bash
iexec dataset deploy --chain bellecour
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
in chain.json.

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
iexec requester push-secret rent --chain bellecour

# restore the default configuration in chain.json
sed -i 's|"bellecour": { "sms": "https://v7.sms.debug-tee-services.bellecour.iex.ec" },|"bellecour": {},|g' chain.json
```

## Run the app

```bash
cd app

# set custom bellecour SMS in chain.json
sed -i 's|"bellecour": {},|"bellecour": { "sms": "https://v7.sms.debug-tee-services.bellecour.iex.ec" },|g' chain.json
```

Navigate into the app folder and run
```bash
iexec app run <appAddress> \
  --tag tee \
  --dataset <datasetAddress> \
  --workerpool v7-debug.main.pools.iexec.eth \
  --secret 1=rent \
  --watch \
  --chain bellecour
```

and retreive the result with
```bash
iexec task show <taskId> --download result --chain bellecour
```

The logs can be accessed with
```bash
iexec task debug <taskId> --logs --chain bellecour
```