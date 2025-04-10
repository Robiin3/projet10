describe('XSS Tests - Reviews', () => {
  const xssPayload = '<script>alert("XSS")</script>';
  let authToken; // Stocke le token pour réutilisation

  describe('Frontend XSS Tests', () => {
    beforeEach(() => {
      // Connexion frontend
      cy.visit('http://localhost:8080');
      cy.get('[data-cy="nav-link-login"]').click();
      cy.get('[data-cy="login-input-username"]').type(Cypress.env('loginUsername'));
      cy.get('[data-cy="login-input-password"]').type(Cypress.env('loginPassword'));
      cy.get('[data-cy="login-submit"]').click().then(() => {
        // Récupère le token depuis le localStorage après connexion
        authToken = localStorage.getItem('user');
      });
      cy.get('[data-cy="nav-link-cart"]').should("be.visible");
      cy.get('[data-cy="nav-link-reviews"]').should('be.visible').click(); // Accède à la page des avis après connexion
    });

    it('test XSS vulnerability in review submission', () => {
      // Envoie un avis contenant un script XSS
      cy.get('[data-cy="review-input-title"]').type('XSS Test'); // Renseigne le titre de l'avis
      cy.get('[data-cy="review-input-comment"]').type(xssPayload); // Saisit le script XSS dans le champ de commentaire
      cy.get('img[alt="Étoile"]').eq(4).click(); // Sélectionne une note (5 étoiles)
      cy.get('[data-cy="review-submit"]').click(); // Soumet l'avis

      // Vérifie que le script n'est pas exécuté et est correctement échappé
      cy.get('[data-cy="review-comment"]').should('not.contain.html', xssPayload); // Vérifie que le HTML n'est pas injecté
      cy.get('[data-cy="review-comment"]').should('contain.text', '&lt;script&gt;'); // Vérifie que le texte brut est affiché
    });
  });

  describe('Backend XSS Tests', () => {
    it('test XSS vulnerability in review submission', () => {
      // Envoie un avis contenant un script XSS via l'API
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/reviews`,
        headers: {
          Authorization: `Bearer ${authToken}` // Réutilise le token récupéré lors de la connexion frontend
        },
        body: {
          title: "XSS Test", // Titre de l'avis
          comment: xssPayload, // Commentaire contenant le script XSS
          rating: 5 // Note de l'avis
        }
      }).then((response) => {
        expect(response.status).to.equal(200); // Vérifie que la requête est acceptée
        expect(response.body.comment).to.not.contain('<script>'); // Vérifie que le script est échappé
        expect(response.body.comment).to.contain('&lt;script&gt;'); // Vérifie que le script est affiché comme texte brut
      });
    });
  });
});
