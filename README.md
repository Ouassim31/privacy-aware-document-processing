# Privacy-aware Document Processing

## Introduction

This application is intended to be used in apartment application procedures where documents need to be verified. It allows a landlord to process (verify) a document provided by an applicant in a privacy-preserving way.
The processing task is handled remotely by the **Payslip Analysis DApp** that is available on the [iExec marketplace](https://iex.ec/marketplace/). This application offers a generic interface that can easily be adapted by integrating your own DApps with custom document processing capabilities.

## Example Use Case

Imagine a setting where a landlord wants to rent out an apartment and make sure that the candidate applying for the apartment makes enough money to cover the monthly rent. In a traditional setting, the landlord would ask the applicant to hand in a payslip and check the applicant's income manually. This procedure is not privacy-perserving as a lot of sensitive personal information is exposed on the payslip that is not relevant for the rental. To solve this problem the landlord can make use of the **Payslip Analysis DApp** which will analyze the applicant's payslip document and then output a response to the question *"is the applicant's income sufficient to cover the rent"*.

## Prerequisites

Make sure to install the [Metamask browser extension](https://metamask.io/) and to create an ethereum wallet. This will be needed to sign transactions. A **Google account** is also required to login.

## Getting started

1. Start the [backend & database](Backend/README.md)
2. Start the [frontend](Frontend/README.md)
3. Go to [http://localhost:3000](http://localhost:3000) to access the web interface

## Usage

If you are requesting a document from an applicant that you would like to process

1. Go to the Landlord section (this section gives you an overview of all of your requests)
2. Create a *new request*
3. Send the generated Request-ID to the applicant and wait until the applicant has uploaded a document
4. Once the document was uploaded you can execute the task
5. Once the task is completed you can download the result
6. You will be prompted to sign and pay for the transaction via MetaMask

If you have been invited to provide a document

1. Go to the Applicant section
2. Click on the *Upload Document* button
3. Enter the Request-ID your were given by the landlord, then select the document you would like to provide from your local computer and submit
4. You will be prompted to sign the file upload via MetaMask