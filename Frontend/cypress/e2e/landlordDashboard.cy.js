describe('Can use functions on the landlord dashboard', () => {  
  
  beforeEach(() => {
    cy.loginByGoogle();
    cy.contains("Landlord").click();
  })

  it('should show that there are no processes available, when the table is empty', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="no-processes-available-card"]').should('exist')
  })

  it('can click "Add Process" button to create a new process', () => {
    cy.contains("Add Process").click();
    cy.get("tr td:nth-child(1)")       //Gets the 2nd child in td column
      .eq(0)                        //Yields second matching css element 
    .contains("0")
    .should('be.visible')
  })

  it('can copy the link of a process to clipboard', () => {
    cy.contains('Copy Link').click()
    cy.assertValueCopiedToClipboard('http://localhost:3000/applicant/')
  })

  it('can delete a process', () => {
    cy.contains('Delete').first().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.contains('No Processes available ..').should('be.visible');
  })

  //TODO: Need tests for process states 2 and 3
})