const processCreationFix = 'process_creation.json';

describe('Can use functions on the landlord dashboard', () => {  
  
  beforeEach(() => {
    cy.loginByGoogle();

  })

  it('should show that there are no processes available, when the table is empty', () => {
    cy.contains("Landlord").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="no-processes-available-card"]').should('exist')
  })

  it('can click "Add Process" button to create a new process', () => {
    cy.intercept(
      {
        method: 'POST',
        url: 'http://localhost:3001/process/'
      },
      request => {
        request.reply({
          fixture: processCreationFix
        });
      }
    );
    cy.contains("Landlord").click();
    cy.contains("Add Process").click().then(() => {
      cy.intercept('/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state1.json' })
    });
    cy.get("tr td:nth-child(1)")       //Gets the 2nd child in td column
      .eq(0)                        //Yields second matching css element 
    .contains("0")
    .should('be.visible')
  })

  it('can copy the link of a process to clipboard', () => {
    cy.intercept('/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state1.json' })
    cy.contains("Landlord").click();
    cy.contains('Copy Link').click()
    cy.assertValueCopiedToClipboard('http://localhost:3000/applicant/')
  })

  it('can delete a process', () => {
    cy.intercept(
      {
        method: 'POST',
        url: 'http://localhost:3001/process/'
      },
      request => {
        request.reply({
          fixture: processCreationFix
        });
      }
    );
    cy.intercept('DELETE', 'http://localhost:3001/process/63d51d049fa2c2dbe9e576e3').as('deleteProcess');
    cy.contains("Landlord").click();
    cy.contains("Add Process").click().then(() => {
      cy.intercept('/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state1.json' })
    });
    cy.contains('Delete').first().click();
    cy.wait('@deleteProcess');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.contains('No Processes available ..').should('be.visible');

  })

  it('can have a process in state 2 with some assertion', () => {
    //TODO: Need help here with correct fixture content
    cy.intercept('/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state2.json' })
    cy.contains("Landlord").click();
    //TODO: Do some assertion?
  })

  it('can have a process in state 3 that contains a link to the iExec task', () => {
    //TODO: Need help here with correct fixture content
    cy.intercept('/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state3.json' })
    cy.contains("Landlord").click();
    cy.get('[data-cy="iexec-explorer-button"]').should('have.attr', 'href', 'https://explorer.iex.ec/bellecour/task/undefined')
  })


})