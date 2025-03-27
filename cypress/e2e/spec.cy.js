describe('API tests', () => {
  let authToken;

  it('basket without authentication', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/orders`,
      failOnStatusCode: false
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  before(() => {
    // Automatisation de la connexion pour récupérer un token valide
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`, // Utilise l'URL de l'API depuis cypress.config.js
      body: {
        username: Cypress.env('loginUsername'), // Utilise le nom d'utilisateur depuis cypress.config.js
        password: Cypress.env('loginPassword')  // Utilise le mot de passe depuis cypress.config.js
      }
    }).then((response) => {
      expect(response.status).to.equal(200); // Vérifie que la connexion est réussie
      authToken = response.body.token; // Stocke le token pour les tests suivants
    });
  });

  it('basket when authenticated', () => {
    const productIdToAdd = 3; // ID du produit à ajouter au panier

    // Ajouter un article au panier
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/orders/add`, // Endpoint pour ajouter un produit au panier
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: {
        product: productIdToAdd,
        quantity: 1
      }
    }).then((response) => {
      expect(response.status).to.equal(200); // Vérifie que l'ajout au panier est réussi
    });

    // Vérifie que le produit ajouté est bien dans le panier
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/orders`,
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.orderLines).to.have.lengthOf.above(0); // Vérifie que le panier contient des articles
      const addedProduct = response.body.orderLines.find(item => item.product.id === productIdToAdd); // Trouve le produit ajouté
      expect(addedProduct).to.exist; // Vérifie que le produit ajouté est présent dans le panier
    });
  });

  it('specific product details', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products/3`,
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(3);
    });
  });
});