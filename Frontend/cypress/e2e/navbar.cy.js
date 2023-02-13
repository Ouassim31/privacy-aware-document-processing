
describe('Can navigate with the navbar', () => {

  beforeEach(() => {
    cy.loginByGoogle();
  })
  it('can log out of the application', () => {
    cy.contains("Logout").click();
    cy.url().should('contain', 'login');
  })

  it('can navigate to Applicant Dashboard', () => {
    cy.get("[data-cy=navbar-applicant]").click();
    cy.url().should('contain', 'applicant');
  })

  it('can navigate to Landlord Dashboard', () => {
    cy.get("[data-cy=navbar-landlord]").click();
    cy.url().should('contain', 'landlord');
  })

  it('can navigate from another page back to Home', () => {
    cy.get("[data-cy=navbar-landlord]").click();
    cy.get("[data-cy=navbar-home]").click();
    assert.exists("What does the app do?");
  })

})