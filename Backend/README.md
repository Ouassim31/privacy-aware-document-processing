## Backend Setup

# Install dependencies 
```bash
npm install
```
# Install MongoDB
https://www.mongodb.com/docs/manual/administration/install-community/

# Start Server
```bash
npm start
```

## API Endpoints

In order to test the endpoints make sure database is running.

# POST: Create process 
http://localhost:3000/process

In request body: landlord_id (required) and description (optional)

# DELETE: Delete process
http://localhost:3000/process/:pid

# POST: Update description
http://localhost:3000/process/:pid/update/description

In request body: description

# POST: Set applicant and dataset
http://localhost:3000/process/:pid/update/applicant_dataset

In request body: applicant-id and dataset-address

# POST: Set iExec task-id
http://localhost:3000/process/:pid/update/task

In request body: task_id

# GET: Get processes by applicant
http://localhost:3000/process/by_applicant

Query parameters: ?applicant=applicant-id

# GET: Get processes by landlord
http://localhost:3000/process/by_landlord

Query parameters: ?landlord=landlord-id