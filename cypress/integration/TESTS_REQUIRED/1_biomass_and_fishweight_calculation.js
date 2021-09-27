describe("test login", () => {
  let siteID
  let tankID
  before("login page and create site", () => {
    cy.login()
    cy.createSiteAndTankByAPI().then(value => { 
      siteID = value[0]
      tankID = value[1]
    })
  })
  it("stocking in an empty tank", () => {
    //Проверка начальных показателей
    cy.visit('/')
    cy.contains(`${Cypress.env('siteName')}`).click({force: true})
    cy.contains(`${Cypress.env('tankName')}`).click({force: true})
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(1) .brief-value').should('contain', '---')
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(2) .brief-value').should('contain', '---')
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(3) .brief-value').should('contain', '---')
    //Зарыбление в пустой садок
    cy.get('.menu__indicators > .el-button').click()
    cy.get('[data-test=indicator-form__type-picker]').click()
    cy.get('[data-test="node-fishGroup"]').click()
    cy.get('[data-test="node-seeding"]').click()
    cy.get('[data-test="tanks-cascader"]').click()
    cy.get(`[data-test=node-site-${siteID}]`).click()
    cy.get(`[data-test=node-tank-${tankID}]`).click()
    cy.get(`.indicator-form-dialog`).click()
    cy.get(`[data-test="indicator-input"]`).type(5000)
    cy.get(`[data-test="fish-biomass-delta-input"]`).type(250)
    cy.get(`[data-test="indicator-form__submit-button"]`).click()
  })
  after("login page and create site", () => {
    cy.removeSiteAndTankByAPI()
  })
})
