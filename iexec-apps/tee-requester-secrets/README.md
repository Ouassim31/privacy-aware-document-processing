# IExec Demo App (TEE)

This application runs in a TEE and takes the requester secrets
**rent** (number) and **income** (number) as input and computes if
the INCOME >= 3*RENT.
It is not published to the iExec marketplace yet, which requires 
further communication with the iExec support.

In order to run the application, it needs to be deployed with
the following commands.

Install the iExec SDK cli (requires 
[![npm version](https://img.shields.io/badge/nodejs-%3E=14.0.0-brightgreen.svg)](https://nodejs.org/en/)):
```bash
npm i -g iexec
```

Create a new wallet file if you don't have one yet
```bash
iexec wallet create
```

Initialize remote storage for output files
```bash
iexec storage init --chain bellecour
```

Deploy app
```bash
iexec app deploy --chain bellecour
```

## Push the requester secrets to the SMS
```bash
iexec requester push-secret rent --chain bellecour
iexec requester push-secret income --chain bellecour
```
**note** after the push-secret command, you will be prompted to enter the secret.

## Run the TEE app with requester secrets
```bash
## deploy
iexec app deploy --chain bellecour

## run
iexec app run <app address> \
  --tag tee \
  --workerpool v7-debug.main.pools.iexec.eth \
  --secret 1=rent \
  --secret 2=income \
  --watch \
  --chain bellecour

## download result
iexec task show <taskID> --download result --chain bellecour
```

