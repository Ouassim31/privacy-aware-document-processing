# Backend Setup

The backend was created using the following commands
```bash
npx express-generator Backend
npm init
npm install --save-dev nodemon
npm install mongoose
npm install async
```

To load the dependencies (listed in package.json file) in your local environment use
```bash
npm install
```

A MongoDB database needs to be installed locally: https://www.mongodb.com/docs/manual/administration/install-community/

To start the server use
```bash
npm start
```

To run database-test-script use
```bash
node populatedb <your mongodb url> 
```
