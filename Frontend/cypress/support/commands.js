// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginByGoogle', () => {
        
    cy.visit('/login')
    cy.contains('Log In').click();
 cy.contains('button', 'Continue with Google')
        .click({force: true}) 

    
    cy.origin('https://accounts.google.com', () => {
        const resizeObserverLoopError = /^[^(ResizeObserver loop limit exceeded)]/;
        Cypress.on('uncaught:exception', (err) => {
            /* returning false here prevents Cypress from failing the test */
            if (resizeObserverLoopError.test(err.message)) {
            return false;
            }
        });
        cy.get('input#identifierId[type="email"]')
        .type('iosl.cy2023@gmail.com')
        .get('button[type="button"]').contains('Weiter')
        .click()
        .get('div#password input[type="password"]')
        .type('iosltest')
        .get('button[type="button"]').contains('Weiter')
        .click();
    });

    Cypress.Commands.add('assertValueCopiedToClipboard', value => {
        cy.window().then(win => {
            win.navigator.clipboard.readText().then(text => {
            assert.include(text, 'http://localhost:3000/applicant/')
    })
  })
})

});