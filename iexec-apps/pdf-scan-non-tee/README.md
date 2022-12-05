# IExec Payslip PDF Analysis (non-TEE)

This is the non-TEE prototype app for the milestone presentation. It analyzes a pdf 
payslip for the net income and decides if it is larger than 3 times of the monthly rent.

## Run the app
* **Rent**: program argument
* **Payslip pdf**: direct download link of unencrypted pdf file (e.g. github raw)

The app is already deployed to the iExec marketplace and can be run using
```bash
iexec app run 0x90997fe5DA97e43621093CF6412505f5fb157B63 \
    --args "2000" \
    --input-files "https://github.com/ChrisSchahn/raw-files/raw/main/dummy-payslip.pdf" \
    --watch --chain bellecour
```
and the results can be retreived with
```bash
iexec task show <taskid> --download result --chain bellecour  \
    && unzip result.zip -d result
```

## Adjust and Redeploy

In order to deploy this app, follow these steps:

Install the iExec SDK cli (requires 
[![npm version](https://img.shields.io/badge/nodejs-%3E=14.0.0-brightgreen.svg)](https://nodejs.org/en/)):
```bash
npm i -g iexec
```

Create a new wallet file
```bash
iexec wallet create
```

Initialize iExec project with
```bash
iexec init --skip-wallet
```

Initialize remote storage for output files
```bash
iexec storage init --chain bellecour
```

If you made some changes to the application in [app](src/app.py) or the [Dockerfile](Dockerfile),
you need to rebuild it and push it to Dockerhub
```bash
docker build . --tag <app-name>

docker login
docker tag <app-name> <dockerusername>/<app-name>:1.0.0
docker push <dockerusername>/<app-name>:1.0.0
```

If you want to test the app locally before pushing it, use the [run](run.sh) script.

## Deploy the app on iExec
Adjust the file [iexec](iexec.json).
* Enter your wallet address
* Set the app name
* As multiaddr, set the URI to the docker image on dockerhub
* Replace the app checksum (it is the sha256 digest of the image on dockerhub)

```bash
iexec app deploy --chain bellecour
iexec app show --chain bellecour
```
