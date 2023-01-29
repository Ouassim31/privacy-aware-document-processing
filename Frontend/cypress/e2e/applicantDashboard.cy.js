describe('Can use functions on the applicant dashboard', () => {  
  
  beforeEach(() => {
    cy.loginByGoogle();
    cy.contains("Applicant").click();
  })

//TODO: need some return json from GET http://localhost:3001/process/by_applicant?applicant=ioslcypress2023@gmail.com

  it('does something', () => {

  })
})