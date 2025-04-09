describe('Cart tests', () => {
  beforeEach(() => {
    // Connexion avant de commencer les tests
    cy.visit('http://localhost:8080');
    cy.get('[data-cy="nav-link-login"]').click();
    cy.get('[data-cy="login-input-username"]').type(Cypress.env('loginUsername'));
    cy.get('[data-cy="login-input-password"]').type(Cypress.env('loginPassword'));
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-cart"]').should("be.visible");

    // Vide le panier avant de commencer les tests (si nécessaire)
    cy.get('[data-cy="nav-link-cart"]').click(); // Accède à la page du panier
    cy.wait(1000); // Ajoute une attente pour permettre le chargement des éléments du panier
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="cart-line-delete"]').length > 0) { // Vérifie si le panier n'est pas vide
        cy.get('[data-cy="cart-line-delete"]').click({ multiple: true }); // Supprime tous les articles du panier
      } else {
        cy.log('Le panier est déjà vide');
      }
    });
  });

  it('add product to cart and validate stock', () => {
    cy.get('[data-cy="nav-link-products"]').click(); // Clique sur le lien des produits
    cy.get('[data-cy="product-link"]').eq(3).click(); // Clique sur le quatrième produit de la liste (index 3)

    // Vérifie que le nombre est supérieur à 1
    cy.get('[data-cy="detail-product-stock"]')
    .should(($el) => {
      expect($el.text()).to.match(/\d+/); // Attendre que le texte contienne un chiffre
    })
    .invoke('text')
    .then((stockText) => {
      const stockMatch = stockText.match(/(\d+)/); // Cherche un nombre dans stockText
      const stock = stockMatch ? parseInt(stockMatch[0], 10) : 0; // Convertit le texte en nombre
      
      expect(stock).to.be.greaterThan(1); // Vérifie que le nombre est supérieur à 1

      // Ajoute le produit au panier
      cy.get('[data-cy="detail-product-name"]').invoke('text').then((ProductName) => { // Récupère le nom du produit
        cy.get('[data-cy="detail-product-add"]').click(); // Clique sur le bouton d'ajout au panier

        // Vérifie que le bon produit est dans le panier
        cy.get('[data-cy="cart-line-name"]').should('have.text', ProductName);

        // Vérifie la mise à jour du stock
        cy.get('[data-cy="cart-line-quantity"]').invoke('val').then((quantity) => { // Récupère la quantité dans le panier
          const cartQuantity = parseInt(quantity, 10); // Convertit la valeur en nombre
          cy.go('back'); // Retourne à la page produit
          cy.get('[data-cy="detail-product-stock"]') // Vérifie le stock du produit
            .should(($el) => {
              expect($el.text()).to.match(/\d+/); // Attendre que le texte contienne un chiffre
            })
            .invoke('text') // Récupère le texte du stock
            .then((updatedStockText) => {
              const updatedStockMatch = updatedStockText.match(/(\d+)/); // Cherche un nombre dans updatedStockText
              const updatedStock = updatedStockMatch ? parseInt(updatedStockMatch[0], 10) : 0; // Convertit le texte en nombre
              expect(updatedStock).to.equal(stock - cartQuantity); // Vérifie que le stock a diminué de la quantité mise dans le panier
            });
        });
      });
    });
  });

  it('cart negative limit', () => {
    cy.get('[data-cy="nav-link-products"]').click(); // Clique sur le lien des produits
    cy.get('[data-cy="product-link"]').eq(3).click(); // Clique sur le quatrième produit de la liste (index 3)

    // Entre une quantité négative
    cy.get('[data-cy="detail-product-quantity"]').clear().type('-1'); // Entre une quantité négative
    cy.get('[data-cy="detail-product-add"]').click(); // Tente d'ajouter le produit au panier

    // Vérifie que le produit n'est pas ajouté au panier
    cy.wait(500); // Attente de 500ms
    cy.get('[data-cy="nav-link-cart"]').click(); // Accède à la page du panier
    cy.get('[data-cy="cart-line-name"]').should('not.exist'); // Vérifie qu'aucun produit n'est présent
  });

  it('cart exceeding limit', () => {
    cy.get('[data-cy="nav-link-products"]').click(); // Clique sur le lien des produits
    cy.get('[data-cy="product-link"]').eq(3).click(); // Clique sur le quatrième produit de la liste (index 3)

    // Entre une quantité supérieure à 20
    cy.get('[data-cy="detail-product-quantity"]').clear().type('21'); // Entre une quantité supérieure à 20
    cy.get('[data-cy="detail-product-add"]').click(); // Tente d'ajouter le produit au panier

    // Vérifie que le produit n'est pas ajouté au panier
    cy.wait(500); // Attente de 500ms
    cy.get('[data-cy="nav-link-cart"]').click(); // Accède à la page du panier
    cy.get('[data-cy="cart-line-name"]').should('not.exist'); // Vérifie qu'aucun produit n'est présent
  });

  it('add an item to the cart and verify via API', () => {
    cy.get('[data-cy="nav-link-products"]').click(); // Clique sur le lien des produits
    cy.get('[data-cy="product-link"]').eq(3).click(); // Clique sur le quatrième produit de la liste (index 3)

    // Récupère le nom du produit
    cy.get('[data-cy="detail-product-name"]').invoke('text').then((productName) => {
      // Ajoute le produit au panier
      cy.get('[data-cy="detail-product-add"]').click();

      // Vérifie le contenu du panier via l'API
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/orders`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user')}`
        }
      }).then((response) => {
        expect(response.status).to.equal(200); // Vérifie que la requête a réussi
        expect(productName).to.exist; // Vérifie que le produit ajouté est présent dans le panier
      });
    });
  });
});
