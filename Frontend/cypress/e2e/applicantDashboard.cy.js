const fixtureFile = 'cypress/fixtures/cypress-upload-test.pdf';

describe('Can use functions on the applicant dashboard', () => {  
  
  beforeEach(() => {
    cy.loginByGoogle();
  })

  it('should show that there are no processes available, when the table is empty', () => {
    cy.get("[data-cy=navbar-applicant]").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy=no-processes-available-card-applicant]').should('exist')
  })

  it('can click "Upload Document" button to upload a document', () => {
    cy.get("[data-cy=navbar-applicant]").click();
    cy.contains("Upload Document").click();
    cy.get("[data-cy=process-id-textfield]").type('63d51d049fa2c2dbe9e576e3');
    cy.get('input[type=file]').selectFile(fixtureFile)
    cy.contains("Submit").click();
    assert.exists("Please wait...")
  })

  it('can have a process in state 2', () => {
    cy.intercept('http://localhost:3001/process/by_applicant?applicant=iosl.cy2023@gmail.com', { fixture: 'process_state2.json' })
    cy.get("[data-cy=navbar-applicant]").click();
    assert.exists("Document Upload Completed");
  })

  it('can have a process in state 3 that contains a link to the iExec task', () => {
    cy.intercept('http://localhost:3001/process/by_applicant?applicant=iosl.cy2023@gmail.com', { fixture: 'process_state3.json' })
    cy.get("[data-cy=navbar-applicant]").click();
    cy.get('[data-cy="dropdown-button"]').click();
    cy.contains('iExec Explorer').should('have.attr', 'href', 'https://explorer.iex.ec/bellecour/task/0x225172019a388fa4a5cb3dcadb5537993c59a161dbca9c10f8738a90d8e122f5')
  })

  it('can have a process in state 4', () => {
    cy.intercept('http://localhost:3001/process/by_applicant?applicant=iosl.cy2023@gmail.com', { fixture: 'process_state4.json' })
    cy.get("[data-cy=navbar-applicant]").click();
    assert.exists("iExec task completed");
 })

})