# Backend Setup

### Install Dependencies 
```bash
npm install
```
### Install MongoDB
https://www.mongodb.com/docs/manual/administration/install-community/

### Start Server
```bash
npm start
```

# Endpoints

- In order to test the endpoints make sure the database is running
- On local host access via: http://localhost:3000
- **landlord-id** and **applicant-id** are required to be an email address

| Endpoint    | Method      | Input (Request Body) | Output (Status Code)  | Output (Response Body)  | Description     |
| :---        |    :---   |    :---   |    :---   |     :---   |          :--- |
| /process      | POST      | landlord-id, description (optional)  | 200; 500  |json object| create process; set state == 1 |
| /process/:pid      | DELETE       |    | 200; 404  || delete process  |
| /process/:pid/update/description     | POST       | description   | 200; 500    |json object| update description   |
| /process/:pid/update/applicant_dataset      | POST       | applicant-id, dataset-address   | 200; 500    |json object  | update applicant-id and dataset-address; set state == 2   |
| /process/:pid/update/task      | POST       | task-id   | 200; 500    |json object | update iExec task-id; set state == 3  |
| /process/by_applicant?applicant=applicant-id     | GET      |    | 200; 400    |json object     | get processes by applicant-id   |
| /process/by_landlord?landlord=landlord-id     | GET       |    | 200; 400    |json object   | get processes by landlord-id    |
