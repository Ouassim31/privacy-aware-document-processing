//imports

import { useState } from "react";
import { Card,Carousel, ListGroup, Accordion, Container,Tabs,Tab } from "react-bootstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";

export const { IExec } = require("iexec");
const FileSaver = require("file-saver");
const detectEthereumProvider = require("@metamask/detect-provider");

const connect = async () => {
  const provider = await detectEthereumProvider();

  if (provider) {
  } else {
    console.log("Please install MetaMask!");
  }
};

function Homepage(props) {
  const { user } = props;

  return (
    
    <Carousel variant="dark">

    <Carousel.Item className="mb-4">
    <h2 className="display-5 text-center">What does the app do?</h2>
    <Container className="w-75 text-center">
        <p className="">
          Imagine a setting where a landlord wants to rent out an apartment and
          make sure that the candidate applying for the apartment makes enough
          money to cover the monthly rent. In a traditional setting, the
          landlord would ask the applicant to hand in a payslip and check the
          applicant's income manually. This procedure is not privacy-perserving
          as a lot of sensitive personal information is exposed on the payslip
          that is not relevant for the rental.
        </p>
        <p>
          {" "}
          To solve this problem the landlord can make use of the 
          <strong>Payslip Analysis DApp</strong> which will analyze the
          applicant's payslip document and then output a response to the
          question "is the applicant's income sufficient to cover the monthly rent".
        </p>
      </Container>
    </Carousel.Item>
    <Carousel.Item className="mb-4">
      <div>
      <h2 className="display-5 text-center">Example use case</h2>
      <Container className="w-75 text-center">
        <p className="">
          Imagine a setting where a landlord wants to rent out an apartment and
          make sure that the candidate applying for the apartment makes enough
          money to cover the monthly rent. In a traditional setting, the
          landlord would ask the applicant to hand in a payslip and check the
          applicant's income manually. This procedure is not privacy-perserving
          as a lot of sensitive personal information is exposed on the payslip
          that is not relevant for the rental.
        </p>
        <p>
          {" "}
          To solve this problem the landlord can make use of the 
          <strong>Payslip Analysis DApp</strong> which will analyze the
          applicant's payslip document and then output a response to the
          question "is the applicant's income sufficient to cover the monthly rent".
        </p>
      </Container>
      </div>
    </Carousel.Item>
    <Carousel.Item>
    <Container className="m-3 d-flex flex-column align-items-center">
      <Tabs
      defaultActiveKey="landlord"
      id="fill-tab-example"
      className="mb-3 text-center w-75"
      fill
    >
      <Tab eventKey="landlord" title="Landlord">
      <div className="p-3 ">
          <p className="text-center">
            If you are <strong>requesting a document</strong> from an applicant
            that you would like to process
          </p>
          <ol>
            <li>
              Go to the <strong>Landlord</strong> section (this section
              gives you an overview of all of your requests)
            </li>
            <li> Create a new request </li>
            <li>
              {" "}
              Send the generated <strong>Request-ID</strong> to the applicant
              and wait until the applicant has uploaded a document
            </li>
            <li>
              {" "}
              Once the document was uploaded, select the <strong>
                DApp
              </strong>{" "}
              for the type of processing task you are interested in and execute
              the task{" "}
            </li>
            <li>
            Once the task is completed, you can download the result
            </li>
            <li>
              {" "}
              You will be prompted to sign and pay for the transaction via MetaMask{" "}
            </li>
          </ol>
        </div>
      </Tab>
      <Tab eventKey="applicant" title="Applicant">
      <div className="p-3 " >
          <p className="text-center">
            {" "}
            If you have been <strong>invited to provide a document</strong>
          </p>
          <ol>
            {" "}
            <li>
              {" "}
              Go to the <strong>Applicant</strong> section{" "}
            </li>
            <li>
            Click on the <strong>Upload Document</strong> button
            </li>
            <li>
            Enter the <strong>Request-ID</strong> your were given by the landlord, then select the document you would like to provide from your local computer and <strong>submit</strong>
            </li>
            <li>
            You will be prompted to sign the file upload via MetaMask
            </li>
          </ol>
        </div>
      </Tab>
      
    </Tabs>
      </Container>
    </Carousel.Item>
  </Carousel>

  );
}

export default withAuthenticationRequired(Homepage, {
  onRedirecting: () => "you need to be logged in to be able to see the content",
});
