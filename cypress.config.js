const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {    
    },
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports", // Répertoire des rapports
      overwrite: false,
      html: true,
      json: false
    }
  },
  env: {
    apiUrl: "http://localhost:8081",
    loginUsername: "test2@test.fr",
    loginPassword: "testtest"
  }
});
