const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
  },
  env: {
    apiUrl: "http://localhost:8081",
    loginUsername: "test2@test.fr",
    loginPassword: "testtest"
  }
});
