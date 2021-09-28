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
let siteID
let tankID
Cypress.Commands.add("createSiteAndTankByAPI", () => {
  cy.request({
    method: "POST",
    url: "/api/core/sites",
    body: { name: `${Cypress.env('siteName')}`, color: "#0288D1" },
  }).then((response) => {
    expect(response.status).to.eq(200)
    siteID = response.body
    cy.request({
      method: "POST",
      url: "/api/core/tanks",
      body: {name: `${Cypress.env('tankName')}`, siteId: `${siteID}`, virtualSiteIds: []},
    }).then((response) => {
      expect(response.status).to.eq(200)
      tankID = response.body
      return [siteID, tankID]
    })
  })
  /*
  //Полностью рабочий код по созданию участка через UI
  cy.visit("/")
  cy.get('[class="edit-map-btn"]').click()
  cy.contains("Создать участок").click()
  cy.get(':nth-child(3) > .el-card__body .el-input__inner').type('Участок для автотестов 1')
  cy.get(':nth-child(3) > .el-card__body button').contains('Сохранить').click() 
  */
})
Cypress.Commands.add("removeSiteAndTankByAPI", () => {
  // cy.getCookies().then( (cookies) => {
  //   console.log(cookies)
    cy.request({
      method: "DELETE",
      url: `/api/core/tanks/${tankID}`
      // ,
      // cookie: `${cookies}`
    }).then((response) => {
      expect(response.status).to.eq(200)
      cy.request({
        method: "DELETE",
        url: `/api/core/sites/${siteID}`
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
  })
  // })
  /*
  //Код для удаление участка через UI. В самом конце ошибка возникает. Невозможно удалить участок.
  cy.visit("/")
  cy.intercept('GET', 'api/core/factory/map').as('getArea')
  cy.get('[class="edit-map-btn"]').click().wait('@getArea')
  cy.contains('Карта хозяйства').should('be.visible')
  cy.contains('Участок для автотестов 1').should('exist').click()
  cy.get('[style=""] > .el-button').should('be.visible').scrollIntoView().click()
  cy.get('.el-message-box__btns .el-button--primary').click()
  */
})
