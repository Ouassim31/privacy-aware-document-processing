# Frontend

This README file provides an overview of the React app and instructions for developers to set up and run the app. The app is designed to interact with the iExec platform through their SDK in order to execute off-chain computations.

## Getting Started
To get started, you will need to have Node.js and npm installed on your machine and Metamask on your webbrowser. Once you have those installed, follow these steps:

1. install dependecies:\
`npm install`

2. create `.env.local` file in the `root` folder of this project (where package.json is located)
3. log into [NFT.Storage](NFT.Storage) via GitHub and create an API token
4. paste the API token into .env.local as 
```
REACT_APP_NFT_STORAGE_TOKEN=<your-api-token>
```
5. run the dev-server:\
`npm run start` and open [http://localhost:3000](http://localhost:3000) to view it in your browser
The page will reload when you make changes.

6. builds the app for production to the `build` folder 
`npm run build`
