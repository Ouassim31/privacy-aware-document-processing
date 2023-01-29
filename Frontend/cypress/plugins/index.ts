const { GoogleSocialLogin} = require('cypress-social-logins').plugins/***

@type {Cypress.PluginConfig}*/module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    on('task', {
        GoogleSocialLogin: GoogleSocialLogin
    })}