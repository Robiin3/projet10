describe('API tests', () => {
  let authToken;

  it('basket without authentication', () => {
    // Vérifie qu'un utilisateur non authentifié ne peut pas accéder au panier
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/orders`,
      failOnStatusCode: false // Empêche le test d'échouer si le statut n'est pas 200
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  it('login with unknown user', () => {
    // Teste une tentative de connexion avec un utilisateur inconnu
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body: {
        username: 'unknown@test.fr', // Utilisateur inconnu
        password: 'wrongpassword'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(401); // Vérifie que le statut est 401
    });
  });

  it('login with known user', () => {
    // Teste une connexion avec un utilisateur valide
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body: {
        username: Cypress.env('loginUsername'),
        password: Cypress.env('loginPassword')
      }
    }).then((response) => {
      expect(response.status).to.equal(200); // Vérifie que le statut est 200
      expect(response.body).to.have.property('token'); // Vérifie que le token est présent dans la réponse
    });
  });

  before(() => {
    // Récupère un token valide avant les tests
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

  it('add product basket and get basket products list', () => {
    // Ajoute un produit au panier et vérifie son contenu
    const productIdToAdd = 4; // ID du produit à ajouter au panier

    // Ajoute un article au panier
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
    // Vérifie les détails d'un produit spécifique
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products/3`,
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(3); // Vérifie que l'ID du produit est bien 3
    });
  });

  it('add out-of-stock product to basket', () => {
    // Teste l'ajout d'un produit en rupture de stock
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/orders/add`,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: {
        product: 3, // Id du produit en rupture de stock
        quantity: 1
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400); // Vérifie que le statut est 400
    });
  });

  it('add a review', () => {
    // Ajoute un avis et vérifie sa création
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/reviews`,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: {
        title: "test",
        comment: "Excellent",
        rating: 5
      },      
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id'); // Vérifie que l'avis a un ID
      expect(response.body.rating).to.equal(5); // Vérifie que la note correspond
      expect(response.body.comment).to.equal('Excellent'); // Vérifie que le texte du commentaire correspond
    });
  });  
});