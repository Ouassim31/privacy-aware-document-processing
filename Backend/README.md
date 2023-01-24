# Setup

## Backend Server

Install dependencies
```bash
npm install
```

Start server
```bash
npm start
```
## Database

Install [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) on your local machine and ⚠️ **make sure the database is running** whenever testing and in production.

# Testing

Tests can be found on in the file `app.test.js`.

To run the tests use
```bash
npx jest
```

# Endpoints

## Notes
- On local host access server via `http://localhost:3001`
- `landlord_id` and `applicant_id` parameters are required to be of type `email`
- `/process` endpoint does not require arguments for `description` (optional) 
- `/process/update/applicant_dataset` endpoint requires both arguments
## Overview

| Endpoint    | Method      | Input (in Request Body as JSON Object) | Output (Status Code)  | Output (in Response Body as JSON Object)  | Description     |
| :---        |    :---   |    :---   |    :---   |     :---   |          :--- |
| `/process`      | POST      | `{ landlord_id: , description: }` | 200; 500  |process object| create process; set state == 1 |
| `/process/:pid`      | DELETE       |    | 200; 404  || delete process  |
| `/process/:pid/update/description`     | POST       | `{ description: }`   | 200; 500    |process object| update description   |
| `/process/:pid/update/applicant_dataset`      | POST       | `{ applicant_id: , dataset_address: }`| 200; 500    |process object  | update applicant_id and dataset_address; set state == 2   |
| `/process/:pid/update/task`      | POST       | `{ task_id: }`   | 200; 500    |process object | update iExec task_id; set state == 3  |
| `/process/by_applicant?applicant=applicant_id`     | GET      |    | 200; 400    |list of process objects     | get processes by applicant_id   |
| `/process/by_landlord?landlord=landlord_id`     | GET       |    | 200; 400    |list of process objects   | get processes by landlord_id    |
