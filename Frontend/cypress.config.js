// cypress.config.js
const { defineConfig } = require('cypress');
require('dotenv').config()

module.exports = defineConfig({
  env: {
    googleSocialLoginUsername: process.env.GOOGLE_USERNAME,
    googleSocialLoginPassword: process.env.GOOGLE_PASSWORD
  },
  e2e: {
    experimentalSessionAndOrigin: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    "baseUrl":"http://localhost:3000/",
    "chromeWebSecurity": false,
    "defaultCommandTimeout": 10000,
    video: false
  }
})
