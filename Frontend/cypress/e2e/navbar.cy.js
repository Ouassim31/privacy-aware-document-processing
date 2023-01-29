describe('Can navigate with the navbar', () => {

  beforeEach(() => {
    cy.loginByGoogle();
  })
  it('can log out of the application', () => {
    cy.contains("Logout").click();
    cy.url().should('contain', 'login');
  })

  it('can navigate to Applicant Dashboard', () => {
    cy.contains("Applicant").click();
    cy.url().should('contain', 'applicant');
  })

  it('can navigate to Landlord Dashboard', () => {
    cy.contains("Landlord").click();
    cy.url().should('contain', 'landlord');
  })

  it('can navigate from another page back to Home', () => {
    cy.contains("Landlord").click();
    cy.contains("Home").click();
    //TODO: make an assertion here that something exists that is unique to this page.
  })

})