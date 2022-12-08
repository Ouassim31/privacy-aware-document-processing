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

## API Endpoints

In order to test the endpoints make sure to run a MongoDB database locally.

Then start the server using
```bash
npm start
```

or in debug mode using
```bash
DEBUG=Backend:* npm start
```

Now you can test the following endpoints:

POST
http://localhost:3000/data/landlord/:username/create

GET
http://localhost:3000/data/landlord/:username

POST
http://localhost:3000/data/process/:lid/create

POST
http://localhost:3000/data/process/:pid/:daddr/update

POST
http://localhost:3000/data/process/:pid/:tid/updatetask

GET
http://localhost:3000/data/process/:lid