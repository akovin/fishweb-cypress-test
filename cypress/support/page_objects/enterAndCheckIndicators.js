export class checkAllIndicators {
  //Проверка показателей полностью
  checkIndicators(siteName, tankName, fishWeight, amount, biomass) {
    cy.visit('/')
    cy.intercept('GET', '/api/core/sites/**').as('siteInfo')
    cy.contains(siteName).click({ force: true }).wait('@siteInfo')
    cy.contains(tankName).click({ force: true })
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(1) .brief-value').should('be.visible').should('contain', fishWeight)
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(2) .brief-value').should('be.visible').invoke('text').invoke('replace', /\u00a0/g, ' ').should('contain', amount)
    cy.get('.tank-metrics > :nth-child(3) > .el-card__body > :nth-child(3) .brief-value').invoke('text').invoke('replace', /\u00a0/g, ' ').should('contain', biomass)
  }
}

export class enterAllIndicators {
  //Зарыбление
  stocking(siteID, tankID, amount, biomass) {
    cy.visit('/')
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
  //Пересадка
  moving(siteID, tankIDFirst, tankIDSecond, amount, biomass) {
    cy.visit('/')
    cy.get('.menu__indicators > .el-button').click()
    cy.get('[data-test=indicator-form__type-picker]').click()
    cy.get('[data-test="node-fishGroup"]').click()
    cy.get('[data-test=node-moving]').click()
    cy.get('[data-test=moving-tank-picker__from-tank]').click()
    cy.get(`[data-test=node-site-${siteID}]`).eq(1).click({ force: true })
    cy.get(`[data-test=node-tank-${tankIDFirst}]`).first().click()
    cy.get(`[data-test=node-site-${siteID}]`).eq(0).click({ force: true })
    cy.get(`[data-test=node-tank-${tankIDSecond}]`).eq(1).click({ force: true })
    cy.get('[data-test="indicator-input"]').clear().type(amount)
    cy.get('[for="tankId"]').click()
    cy.get('[data-test="fish-biomass-delta-input"] input').clear().type(biomass)
    cy.get('[for="tankId"]').click()
    cy.intercept('POST', `/api/core/indicators*`).as('indicatorsInfo')
    cy.get('[data-test="indicator-form__submit-button"]').click().wait('@indicatorsInfo')
  }
}

export const checkIndicators = new checkAllIndicators()
export const enterIndicators = new enterAllIndicators()