export class checkAllIndicators {
  //Проверка показателей полностью
  checkIndicatorsFull(fishWeight, amount, biomass) {
    cy.visit('/')
    cy.intercept('GET', '/api/core/sites/**').as('siteInfo')
    cy.contains(`${Cypress.env('siteName')}`).click({ force: true }).wait('@siteInfo')
    cy.contains(`${Cypress.env('tankName')}`).click({ force: true })
    this.checkIndicatorsOnlyCheck(fishWeight, amount, biomass)
  }
  //Только проверка показателей
  checkIndicatorsOnlyCheck(fishWeight, amount, biomass) {
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(1) .brief-value').should('be.visible').should('contain', fishWeight)
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(2) .brief-value').should('be.visible').invoke('text').invoke('replace', /\u00a0/g, ' ').should('contain', amount)
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(3) .brief-value').should('contain', biomass)
  }
}

export class enterAllIndicators {
  //Зарыбление
  stocking(siteID, tankID, amount, biomass) {
    cy.get('.menu__indicators > .el-button').click()
    cy.get('[data-test=indicator-form__type-picker]').click()
    cy.get('[data-test="node-fishGroup"]').click()
    cy.get('[data-test="node-seeding"]').click()
    cy.get('[for="tankId"]').click()
    cy.get('[data-test="tanks-cascader"]').click()
    cy.get(`[data-test=node-site-${siteID}]`).click()
    cy.get(`[data-test=node-tank-${tankID}]`).click()
    cy.get('[for="tankId"]').click()
    cy.get('[data-test="indicator-input"]').type(amount)
    cy.get('[data-test="fish-biomass-delta-input"]').type(biomass)
    cy.intercept('GET', `/api/core/indicators/tank/${tankID}*`).as('tankInfo')
    cy.get('[data-test="indicator-form__submit-button"]').click().wait('@tankInfo')
  }
}

export const checkIndicators = new checkAllIndicators()
export const enterIndicators = new enterAllIndicators()