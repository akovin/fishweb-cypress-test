// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
let siteID
let tankID

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: "/api/core/auth/login",
    body: {
      login: "testeranton",
      password: "testAnton101220",
    },
  }).then((resp) => {
    expect(resp.status).to.eq(200)
  })
})
Cypress.Commands.add("createSiteByAPI", (siteName) => {
  cy.request({
    method: "POST",
    url: "/api/core/sites",
    body: { name: siteName, color: "#0288D1" },
  })
    .then((response) => {
      expect(response.status).to.eq(200)
      siteID = response.body
      return siteID
    })
})
Cypress.Commands.add("createTankByAPI", (tankName, siteID) => {
  cy.request({
    method: "POST",
    url: "/api/core/tanks",
    body: { name: tankName, siteId: siteID, virtualSiteIds: [] },
  }).then((response) => {
    expect(response.status).to.eq(200)
    tankID = response.body
    return tankID
  })
})
Cypress.Commands.add("removeSiteByAPI", (siteID) => {
    cy.request({
      method: "DELETE",
      url: `/api/core/sites/${siteID}`
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
})
Cypress.Commands.add("removeTankByAPI", (tankID) => {
  cy.request({
    method: "DELETE",
    url: `/api/core/tanks/${tankID}`
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})
