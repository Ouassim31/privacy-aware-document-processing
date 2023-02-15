# Iexec-client-react

This README file provides an overview of the React app and instructions for developers to set up and run the app. The app is designed to interact with the iExec platform through their SDK in order to execute off-chain computations.

## Getting Started
To get started, you will need to have Node.js and npm installed on your machine. Once you have those installed, follow these steps:

1. install dependecies :\
`npm install`

2. create `.env.local` file in the `root` folder of this project (where package.json is located)
3. log into [NFT.Storage](NFT.Storage) via GitHub and create an API token
4. paste the API token into .env.local as 
```
REACT_APP_NFT_STORAGE_TOKEN=<your-api-token>
```
5. run the dev-server :\
`npm run start` and Open [http://localhost:3000](http://localhost:3000) to view it in your browser
The page will reload when you make changes.
6. builds the app for production to the `build` folder 
`npm run build`

## Usage
If you are requesting a document from an applicant that you would like to process

1. Go to the Landlord section (this section gives you an overview of all of your requests)
2. Create a new request
3. Send the generated Request-ID to the applicant and wait until the applicant has uploaded a document
4. Once the document was uploaded, select the DApp for the type of processing task you are interested in and execute the task
5. Once the task is completed, you can download the result
6. You will be prompted to sign and pay for the transaction via MetaMask

If you have been invited to provide a document

1. Go to the Applicant section
2. Click on the Upload Document button
3. Enter the Request-ID your were given by the landlord, then select the document you would like to provide from your local computer and submit
4. You will be prompted to sign the file upload via MetaMask
