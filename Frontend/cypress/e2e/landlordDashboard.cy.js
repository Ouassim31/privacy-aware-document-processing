const processCreationFix = 'process_creation.json';

describe('Can use functions on the landlord dashboard', () => {  
  
  beforeEach(() => {
    cy.loginByGoogle();

  })

  it('should show that there are no processes available, when the table is empty', () => {
    cy.get("[data-cy=navbar-landlord]").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="no-processes-available-card"]').should('exist')
  })

  it('can click "Add Request" button to create a new process', () => {
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
    cy.get("[data-cy=navbar-landlord]").click();
    cy.contains("Add Request").click().then(() => {
      cy.intercept('GET', '/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state1.json' })
    });
    cy.get("[class='card']").should('be.visible')
  })

  it('can copy the link of a process to clipboard', () => {
    cy.intercept('/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state1.json' })
    cy.get("[data-cy=navbar-landlord]").click();
    cy.get("[data-cy=process-id-copy-button]").click();
    cy.assertValueCopiedToClipboard('63d51d049fa2c2dbe9e576e3')
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
    cy.intercept('DELETE', 'http://localhost:3001/process/undefined').as('deleteProcess');
    cy.get("[data-cy=navbar-landlord]").click();
    cy.contains("Add Request").click().then(() => {
      cy.intercept('GET', '/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state1.json' })
    });
    cy.get('[data-cy=dropdown-button]').click();
    cy.contains('Delete').click();
    cy.wait('@deleteProcess');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy=no-processes-available-card]').should('be.visible');
  })

  it('can have a process in state 2', () => {
    cy.intercept('http://localhost:3001/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state2.json' })
    cy.get("[data-cy=navbar-landlord]").click();
    assert.exists("Document Upload Completed");
  })

  it('can have a process in state 3 that contains a link to the iExec task', () => {
    cy.intercept('http://localhost:3001/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state3.json' })
    cy.get("[data-cy=navbar-landlord]").click();
    cy.get('[data-cy="dropdown-button"]').click();
    cy.contains('iExec Explorer').should('have.attr', 'href', 'https://explorer.iex.ec/bellecour/task/0x225172019a388fa4a5cb3dcadb5537993c59a161dbca9c10f8738a90d8e122f5')
  })

  it('can have a process in state 4', () => {
    cy.intercept('http://localhost:3001/process/by_landlord?landlord=iosl.cy2023@gmail.com', { fixture: 'process_state4.json' })
    cy.get("[data-cy=navbar-landlord]").click();
    assert.exists("iExec task completed");
 })


})