describe('Smoke tests', () => {
  it('login fields and buttons', () => {
    cy.visit('http://localhost:8080');
    cy.get('[data-cy="nav-link-login"]').click();

    // Vérifie la présence des champs et boutons de connexion
    cy.get('[data-cy="login-input-username"]').should('be.visible');
    cy.get('[data-cy="login-input-password"]').should('be.visible');
    cy.get('[data-cy="login-submit"]').should('be.visible');
  });

  it('add-to-cart button when logged in', () => {
    cy.visit('http://localhost:8080');
    cy.get('[data-cy="nav-link-login"]').click();

    // Connexion
    cy.get('[data-cy="login-input-username"]').type(Cypress.env('loginUsername'));
    cy.get('[data-cy="login-input-password"]').type(Cypress.env('loginPassword'));
    cy.get('[data-cy="login-submit"]').click();

    // Vérifie la présence des boutons d’ajout au panier
    cy.get('[data-cy="product-home-link"]').first().click(); // Clique sur le premier produit
    cy.get('[data-cy="detail-product-add"]').should('be.visible');
    });

  it('product availability field', () => {
    cy.visit('http://localhost:8080');

    // Vérifie la présence du champ de disponibilité du produit
    cy.get('[data-cy="product-home-link"]').first().click(); // Clique sur le premier produit
    cy.get('[data-cy="detail-product-stock"]').should('be.visible');
  });
});
