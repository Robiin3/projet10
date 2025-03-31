describe('Login tests', () => {
  it('successful login', () => {
    cy.visit('http://localhost:8080');
    cy.get('[data-cy="nav-link-login"]').click();

    // Complète le formulaire de connexion
    cy.get('[data-cy="login-input-username"]').type(Cypress.env('loginUsername'));
    cy.get('[data-cy="login-input-password"]').type(Cypress.env('loginPassword'));

    // Soumet le formulaire
    cy.get('[data-cy="login-submit"]').click();

    // Vérifie que la connexion a réussi
    cy.get('[data-cy="nav-link-cart"]').should("be.visible")
    cy.get('[data-cy="nav-link-logout"]').should("be.visible")
  });
});
