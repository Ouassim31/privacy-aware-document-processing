# IExec Demo App (non-TEE)

This is a simple demo application that checks if the income of a tenant is
three times as high as the rent. It does not run in a TEE and it simply
takes the RENT and MONTHLY_INCOME as arguments.

The app is already deployed to the iExec marketplace and can be run using
```bash
iexec app run 0x5e4017Bd35CbA7827e0Fa193F4B9F4f158FA254E --args "400 1300" --watch --chain bellecour
```
and the results can be retreived with
```bash
iexec task show <taskid> --download my-app-result --chain bellecour  \
    && unzip my-app-result.zip -d my-app-result
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

## Run the app on iExec
```bash
iexec app run --args "400 1300" --watch --chain bellecour

## download the result
iexec task show <taskid> --download my-app-result --chain bellecour  \
    && unzip my-app-result.zip -d my-app-result
```
Debug the app using
```bash
iexec task debug <taskid> --logs --chain bellecour
```

## Publish the app to the iExec marketplace
```bash
iexec app publish --chain bellecour
```
Now, the app is publicly available and can be run using the CLI commands
```bash
iexec app run <app-address> --args "400 1300" --watch --chain bellecour
```
The result can be downloaded the same way as described above.