import request from "supertest";
import app from "./app.js";

// POST /process

describe("POST /process", () => {
    // On success
    describe("Given an email and optionally description", () => {

        // JSON object with process
        test("Should respond with valid json object", async () => {
            const description = "description";
            const landlordId = "landlord@test.com";

            const bodyData = [
                { landlord_id: landlordId },
                { landlord_id: landlordId, description: description },
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/process").send(body)
                expect(response.body.landlord_id).toEqual(landlordId)
                expect(response.body.process_state).toEqual(1)
                if (body.hasOwnProperty('description')) {
                    expect(response.body.description).toEqual(description)
                }
            }
        })

        // Status code 200
        test("Should respond with status code 200", async () => {
            const description = "description";
            const landlordId = "landlord@test.com";

            const bodyData = [
                { landlord_id: landlordId },
                { landlord_id: landlordId, description: description },
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/process").send(body)
                expect(response.statusCode).toBe(200)
            }
        })

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const description = "description";
            const landlordId = "landlord@test.com";

            const bodyData = [
                { landlord_id: landlordId },
                { landlord_id: landlordId, description: description },
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/process").send(body)
                expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            }
        })

    })

    // On failure
    describe("Missing landlord_id or wrong type", () => {
        test("Should respond with status code 500", async () => {
            const landlordId = "landlord";
            const description = "description";

            const bodyData = [
                {},
                { landlord_id: landlordId },
                { landlord_id: landlordId, description: description },
            ]

            for (const body of bodyData) {
                const response = await request(app).post("/process").send(body)
                expect(response.statusCode).toBe(500)
            }
        })
    })
})

// POST /process/:pid/update/description

describe("POST /process/:pid/update/description", () => {
    // On success
    describe("Given existing process_id and description", () => {
        let processId;
        const newDescription = "new description";

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: "landlord@test.com" });
            processId = createProcessResponse.body._id;
        });

        // JSON object with process
        test("Should respond with valid json object", async () => {
            const updateDescriptionResponse = await request(app)
                .post(`/process/${processId}/update/description`)
                .send({ description: newDescription });
            expect(updateDescriptionResponse.body.description).toEqual(newDescription);
            expect(updateDescriptionResponse.body.process_state).toEqual(1);
        });

        // Status code 200
        test("Should respond with status code 200", async () => {
            const updateDescriptionResponse = await request(app)
                .post(`/process/${processId}/update/description`)
                .send({ description: newDescription });
            expect(updateDescriptionResponse.status).toBe(200);
        });

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const updateDescriptionResponse = await request(app)
                .post(`/process/${processId}/update/description`)
                .send({ description: newDescription });
            expect(updateDescriptionResponse.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
    })
    // On failure
    describe("Wrong or missing process_id", () => {
        test("Should respond with status code 500", async () => {
            const processId = "c55e55c";
            const newDescription = "New Description";

            const response = await request(app)
                .post(`/process/${processId}/update/description`)
                .send({ description: newDescription });
            expect(response.status).toBe(500);
        });

        test("Should respond with status code 404", async () => {
            const processId = "";
            const newDescription = "New Description";

            const response = await request(app)
                .post(`/process/${processId}/update/description`)
                .send({ description: newDescription });
            expect(response.status).toBe(404);
        });
    })
})

// POST /process/:pid/update/applicant_dataset

describe("POST /process/:pid/update/applicant_dataset", () => {
    // On success
    describe("Given existing process_id, applicant_id and dataset_address", () => {
        let processId;
        const applicantId = "applicant@test.com";
        const datasetAddress = "0xD"

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: "landlord@test.com" });
            processId = createProcessResponse.body._id;
        });

        // JSON object with process
        test("Should respond with valid json object", async () => {
            const response = await request(app)
                .post(`/process/${processId}/update/applicant_dataset`)
                .send({ applicant_id: applicantId, dataset_address: datasetAddress });
            expect(response.body.applicant_id).toEqual(applicantId);
            expect(response.body.dataset_address).toEqual(datasetAddress);
            expect(response.body.process_state).toEqual(2)
        });

        // Status code 200
        test("Should respond with status code 200", async () => {
            const response = await request(app)
                .post(`/process/${processId}/update/applicant_dataset`)
                .send({ applicant_id: applicantId, dataset_address: datasetAddress });
            expect(response.status).toBe(200);
        });

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const response = await request(app)
                .post(`/process/${processId}/update/applicant_dataset`)
                .send({ applicant_id: applicantId, dataset_address: datasetAddress });
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
    })
    // On failure
    describe("Wrong or missing process_id", () => {
        test("Should respond with status code 500", async () => {
            const processId = "c55e55c";
            const applicantId = "applicant@test.com";
            const datasetAddress = "0xD"
            const response = await request(app)
                .post(`/process/${processId}/update/applicant_dataset`)
                .send({ applicant_id: applicantId, dataset_address: datasetAddress });
            expect(response.status).toBe(500);

        });

        test("Should respond with a status code of 404", async () => {
            const processId = "";
            const applicantId = "applicant@test.com";
            const datasetAddress = "0xD"
            const response = await request(app)
                .post(`/process/${processId}/update/applicant_dataset`)
                .send({ applicant_id: applicantId, dataset_address: datasetAddress });
            expect(response.status).toBe(404);
        });
    })

    // On failure
    describe("Missing applicant_id or dataset_address", () => {
        let processId;
        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: "landlord@test.com" });
            processId = createProcessResponse.body._id;
        });
        test("Should respond with a status code of 400", async () => {
            const applicantId = "applicant@test.com";
            const datasetAddress = "0xD";

            const bodyData = [
                {},
                { applicant_id: applicantId },
                { dataset_address: datasetAddress },
            ]

            for (const body of bodyData) {
                const response = await request(app)
                    .post(`/process/${processId}/update/applicant_dataset`)
                //.send({ applicant_id: applicantId, dataset_address: datasetAddress });
                expect(response.status).toBe(400);
            }
        });
    })
})

// POST /process/:pid/update/task

describe("POST /process/:pid/update/task", () => {
    // On success
    describe("Given existing process_id and task_id", () => {
        let processId;
        const taskId = "0xT";

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: "landlord@test.com" });
            processId = createProcessResponse.body._id;
        });

        // JSON object with process
        test("Should respond with valid json object", async () => {
            const response = await request(app)
                .post(`/process/${processId}/update/task`)
                .send({ task_id: taskId });
            expect(response.body.task_id).toEqual(taskId);
            expect(response.body.process_state).toEqual(3)
        });

        // Status code 200
        test("Should respond with status code 200", async () => {
            const response = await request(app)
                .post(`/process/${processId}/update/task`)
                .send({ task_id: taskId });
            expect(response.status).toBe(200);
        });

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const response = await request(app)
                .post(`/process/${processId}/update/task`)
                .send({ task_id: taskId });
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
    })
    // On failure
    describe("Wrong or missing process_id", () => {
        test("Should respond with status code 500", async () => {
            const processId = "c55e55c";
            const taskId = "0xT"
            const response = await request(app)
                .post(`/process/${processId}/update/task`)
                .send({ task_id: taskId });
            expect(response.status).toBe(500);

        });

        test("Should respond with status code 404", async () => {
            const processId = "";
            const taskId = "0xT"

            const response = await request(app)
                .post(`/process/${processId}/update/task`)
                .send({ task_id: taskId });
            expect(response.status).toBe(404);
        });
    })

    // On failure
    describe("Missing task_id", () => {
        let processId;

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: "landlord@test.com" });
            processId = createProcessResponse.body._id;
        });

        test("Should respond with status code 400", async () => {
            const response = await request(app)
                .post(`/process/${processId}/update/task`)
                .send({});
            expect(response.status).toBe(400);
        });
    })
})

// DELETE /process/:pid

describe("DELETE /process/:pid", () => {
    // On success
    describe("Given existing process_id", () => {
        let processId;

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: "landlord@test.com" });
            processId = createProcessResponse.body._id;
        });
        // Status code 200
        test("Should respond with status code 200", async () => {
            const response = await request(app)
                .delete(`/process/${processId}`)
            expect(response.status).toBe(200);
        })
    })

    // On failure
    describe("Missing process_id", () => {
        const processId = "";
        // Status code 404
        test("Should respond with status code 404", async () => {
            const response = await request(app)
                .delete(`/process/${processId}`)
            expect(response.status).toBe(404);
        })
    })

    // On failure
    describe("Invalid process_id", () => {
        const processId1 = "test";
        // Status code 400
        test("Should respond with status code 400", async () => {
            const response = await request(app)
                .delete(`/process/${processId1}`)
            expect(response.status).toBe(400);
        })
    })
})

// GET /process/by_applicant?applicant=applicant_id

describe("GET BY APPLICANT", () => {
    // On success
    describe("Given existing applicant_id", () => {
        let processId;
        const landlordId = "landlord@test.com";
        const applicantId = "applicant@test.com";
        const datasetAddress = "0xD";

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: landlordId });
            processId = createProcessResponse.body._id;
        });

        beforeEach(async () => {
            // Add applicant_id and data_set address to process object
            const createResponse = await request(app)
                .post(`/process/${processId}/update/applicant_dataset`)
                .send({ applicant_id: applicantId, dataset_address: datasetAddress });
        });

        // JSON object with processes
        test("Should respond with valid json object", async () => {
            const response = await request(app).get(`/process/by_applicant?applicant=${applicantId}`)
            const allObjectsHaveApplicantId = response.body.every(obj => obj.applicant_id === applicantId);
            expect(allObjectsHaveApplicantId).toBe(true);
        })

        // Status code 200
        test("Should respond with status code 200", async () => {
            const response = await request(app).get(`/process/by_applicant?applicant=${applicantId}`)
            expect(response.status).toBe(200);
        })

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const response = await request(app).get(`/process/by_applicant?applicant=${applicantId}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    // On failure
    describe("Missing or invalid applicant_id", () => {
        // Status code 200
        test("Should respond with status code 200", async () => {
            const applicantIds = ["", "landlord@test.com"];
            for (const applicant of applicantIds) {
                const response = await request(app).get(`/process/by_applicant?applicant=${applicant}`)
                expect(response.status).toBe(200);
            }
        })
        // Empty body
        test("Should return empty list in response body", async () => {
            const applicantIds = ["", "landlord@test.com"];
            for (const applicant of applicantIds) {
                const response = await request(app).get(`/process/by_applicant?applicant=${applicant}`)
                expect(response.body).toEqual([]);
            }
        })
    })
})

// GET /process/by_landlord?landlord=landlord_id

describe("GET BY LANDLORD", () => {
    // On success
    describe("Given existing landlord_id", () => {
        let processId;
        const landlordId = "landlord@test.com";

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: landlordId });
            processId = createProcessResponse.body._id;
        });

        // JSON object with processes
        test("Should respond with valid json object", async () => {
            const response = await request(app).get(`/process/by_landlord?landlord=${landlordId}`)
            const allObjectsHaveLandlordId = response.body.every(obj => obj.landlord_id === landlordId);
            expect(allObjectsHaveLandlordId).toBe(true);
        })

        // Status code 200
        test("Should respond with status code 200", async () => {
            const response = await request(app).get(`/process/by_landlord?landlord=${landlordId}`)
            expect(response.status).toBe(200);
        })

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const response = await request(app).get(`/process/by_landlord?landlord=${landlordId}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    // On failure
    describe("Missing or invalid landlord_id", () => {
        // Status code 200
        test("Should respond with status code 200", async () => {
            const landlordIds = ["", "applicant@test.com"];
            for (const landlord of landlordIds) {
                const response = await request(app).get(`/process/by_landlord?landlord=${landlord}`)
                expect(response.status).toBe(200);
            }
        })
        // Empty body
        test("Should return empty list in response body", async () => {
            const landlordIds = ["", "applicant@test.com"];
            for (const landlord of landlordIds) {
                const response = await request(app).get(`/process/by_landlord?landlord=${landlord}`)
                expect(response.body).toEqual([]);
            }
        })
    })
})

// GET /process/:pid

describe("GET /process/:pid", () => {
    // On success
    describe("Given existing process_id", () => {
        let processId;

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: "landlord@test.com" });
            processId = createProcessResponse.body._id;
        });
        // Status code 200
        test("Should respond with status code 200", async () => {
            const response = await request(app)
                .get(`/process/${processId}`)
            expect(response.status).toBe(200);
        })
    })

    // On failure
    describe("Missing process_id", () => {
        const processId = "";
        // Status code 404
        test("Should respond with status code 404", async () => {
            const response = await request(app)
                .get(`/process/${processId}`)
            expect(response.status).toBe(404);
        })
    })

    // On failure
    describe("Invalid process_id", () => {
        const processId1 = "test";
        // Status code 400
        test("Should respond with status code 400", async () => {
            const response = await request(app)
                .get(`/process/${processId1}`)
            expect(response.status).toBe(500);
        })
    })
})

// PUT /process/:pid/update/state

describe("PUT /process/:pid/update/state", () => {
    // On success
    describe("Given existing process_id and state", () => {
        let processId;
        const newState = 4;

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: "landlord@test.com" });
            processId = createProcessResponse.body._id;
        });

        // JSON object with process
        test("Should respond with valid json object", async () => {
            const updateStateResponse = await request(app)
                .put(`/process/${processId}/update/state`)
                .send({ state: newState });
            expect(updateStateResponse.body.process_state).toEqual(newState);
        });

        // Status code 200
        test("Should respond with status code 200", async () => {
            const updateStateResponse = await request(app)
                .put(`/process/${processId}/update/state`)
                .send({ state: newState });
            expect(updateStateResponse.status).toBe(200);
        });

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const updateStateResponse = await request(app)
                .put(`/process/${processId}/update/state`)
                .send({ state: newState });
            expect(updateStateResponse.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
    })
    // On failure
    describe("Wrong or missing process_id", () => {
        test("Should respond with status code 500", async () => {
            const processId = "c55e55c";
            const newState = 4;

            const response = await request(app)
                .put(`/process/${processId}/update/state`)
                .send({ state: newState });
            expect(response.status).toBe(500);
        });

        test("Should respond with status code 404", async () => {
            const processId = "";
            const newState = 4;

            const response = await request(app)
                .put(`/process/${processId}/update/state`)
                .send({ state: newState });
            expect(response.status).toBe(404);
        });
    })
})

// PUT /process/:pid/dereference_applicant

describe("PUT /process/:pid/dereference_applicant", () => {
    // On success
    describe("Given existing process_id", () => {
        let processId;
        const landlordId = "landlord@test.com";
        const applicantId = "applicant@test.com";
        const datasetAddress = "0xD";

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: landlordId });
            processId = createProcessResponse.body._id;
        });

        beforeEach(async () => {
            // Add applicant_id and data_set address to process object
            const createResponse = await request(app)
                .post(`/process/${processId}/update/applicant_dataset`)
                .send({ applicant_id: applicantId, dataset_address: datasetAddress });
        });

        // JSON object with processes
        test("Should respond with valid json object", async () => {
            const response = await request(app)
                .put(`/process/${processId}/dereference_applicant`);
            expect(response.body).not.toHaveProperty("applicant_id");
        })

        // Status code 200
        test("Should respond with status code 200", async () => {
            const response = await request(app)
                .put(`/process/${processId}/dereference_applicant`);
            expect(response.status).toBe(200);
        })

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const response = await request(app)
                .put(`/process/${processId}/dereference_applicant`);
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    // On failure
    describe("Wrong or missing process_id", () => {
        test("Should respond with status code 500", async () => {
            const processId = "c55e55c";
            const response = await request(app)
                .put(`/process/${processId}/dereference_applicant`);
            expect(response.status).toBe(500);
        });

        test("Should respond with status code 404", async () => {
            const processId = "";
            const response = await request(app)
                .put(`/process/${processId}/dereference_applicant`);
            expect(response.status).toBe(404);
        });
    })
})

// PUT /process/:pid/reset

describe("PUT /process/:pid/reset", () => {
    // On success
    describe("Given existing process_id", () => {
        let processId;
        const landlordId = "landlord@test.com";
        const applicantId = "applicant@test.com";
        const datasetAddress = "0xD";

        beforeEach(async () => {
            // Create a process object in the database
            const createProcessResponse = await request(app)
                .post("/process")
                .send({ landlord_id: landlordId });
            processId = createProcessResponse.body._id;
        });

        beforeEach(async () => {
            // Add applicant_id and data_set address to process object
            const createResponse = await request(app)
                .post(`/process/${processId}/update/applicant_dataset`)
                .send({ applicant_id: applicantId, dataset_address: datasetAddress });
        });

        // JSON object with processes
        test("Should respond with valid json object", async () => {
            const response = await request(app)
                .put(`/process/${processId}/reset`);
            expect(response.body.applicant_id).toEqual("");
            expect(response.body.dataset_address).toEqual("");
            expect(response.body.process_state).toEqual(1);
        })

        // Status code 200
        test("Should respond with status code 200", async () => {
            const response = await request(app)
                .put(`/process/${processId}/reset`);
            expect(response.status).toBe(200);
        })

        // Should specify json in content type header
        test("Should specify json in content type header", async () => {
            const response = await request(app)
                .put(`/process/${processId}/reset`);
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    // On failure
    describe("Wrong or missing process_id", () => {
        test("Should respond with status code 500", async () => {
            const processId = "c55e55c";
            const response = await request(app)
                .put(`/process/${processId}/reset`);
            expect(response.status).toBe(500);
        });

        test("Should respond with status code 404", async () => {
            const processId = "";
            const response = await request(app)
                .put(`/process/${processId}/reset`);
            expect(response.status).toBe(404);
        });
    })
})