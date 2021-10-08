//приведение строк, содержащих другие символы к числу корректному, с точкой
function makeNumberFromString(htmlIndicator) {
  const regex = /[\d,.]/g
  const digitsWithDotOrComma = htmlIndicator.match(regex)
  const indexOfComma = digitsWithDotOrComma.indexOf(',')
  digitsWithDotOrComma[indexOfComma] = '.'
  let indicatorFinalFromPage = digitsWithDotOrComma.join('')
  indicatorFinalFromPage = Number(indicatorFinalFromPage)
  return indicatorFinalFromPage
}

export class checkAllIndicators {
  //Проверка показателей полностью
  checkIndicators(siteName, tankName, fishWeight, amount, biomass) {
    cy.visit('/')
    cy.intercept('GET', '/api/core/sites/**').as('siteInfo')
    cy.contains(siteName).click({ force: true }).wait('@siteInfo')
    cy.contains(tankName).click({ force: true })
    //проверка что индикатор не активен - не содержит в себе цифр, может быть n/a или ---
    const regexDigit = /\d/g
    if (!regexDigit.test(fishWeight)) {
      cy.get('[data-test="tank-fish-weight-value"]').should('be.visible').invoke('text').should('contain', fishWeight)
    } else {
      cy.get('[data-test="tank-fish-weight-value"]').should('be.visible').invoke('html').then((htmlFishWeight) => {
        const fishWeightNumber = makeNumberFromString(fishWeight)
        const fishWeightNumberFromPage = makeNumberFromString(htmlFishWeight)
        expect(fishWeightNumberFromPage).to.equal(fishWeightNumber)
      })
    }
    if (!regexDigit.test(amount)) {
      cy.get('[data-test="tank-fish-weight-value"]').should('be.visible').invoke('text').should('contain', fishWeight)
    } else {
      cy.get('[data-test="tank-fish-amount-value"]').invoke('html').then((htmlAmount) => {
        const amountNumber = makeNumberFromString(amount)
        const amountNumberFromPage = makeNumberFromString(htmlAmount)
        expect(amountNumberFromPage).to.equal(amountNumber)
      })
    }
    if (!regexDigit.test(biomass)) {
      cy.get('[data-test="tank-fish-weight-value"]').should('be.visible').invoke('text').should('contain', fishWeight)
    } else {
      cy.get('[data-test="tank-fish-biomass-value"]').invoke('html').then((htmlBiomass) => {
        const biomassNumber = makeNumberFromString(biomass)
        const biomassNumberFromPage = makeNumberFromString(htmlBiomass)
        expect(biomassNumberFromPage).to.equal(biomassNumber)
      })
    }
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
    cy.intercept('POST', `/api/core/indicators*`).as('indicatorsInfo')
    cy.get('[data-test="indicator-form__submit-button"]').click().wait('@indicatorsInfo')
  }
  //Отход
  mortality(siteID, tankID, amount, biomass) {
    cy.visit('/')
    cy.get('.menu__indicators > .el-button').click()
    cy.get('[data-test=indicator-form__type-picker]').click()
    cy.get('[data-test="node-fishGroup"]').click()
    cy.get('[data-test="node-mortality"]').click()
    cy.get('[data-test="indicator-form__table-view-toggle"]').click()
    cy.get('[data-test="tanks-cascader"]').click()
    cy.get(`[data-test=node-site-${siteID}]`).click()
    cy.get(`[data-test=node-tank-${tankID}]`).click()
    cy.get('[for="tankId"]').click()
    cy.get('[data-test="indicator-input"]').type(amount)
    cy.get('[data-test="fish-biomass-delta-input"]').clear().type(biomass)
    cy.intercept('GET', `/api/core/indicators/tank/${tankID}*`).as('tankInfo')
    cy.get('[data-test="indicator-form__submit-button"]').click().wait('@tankInfo')
  }
  //Вылов
  catch(siteID, tankID, amount, biomass) {
    cy.visit('/')
    cy.get('.menu__indicators > .el-button').click()
    cy.get('[data-test=indicator-form__type-picker]').click()
    cy.get('[data-test="node-fishGroup"]').click()
    cy.get('[data-test="node-catch"]').click()
    cy.get('[data-test="tanks-cascader"]').click()
    cy.get(`[data-test=node-site-${siteID}]`).click()
    cy.get(`[data-test=node-tank-${tankID}]`).click()
    cy.get('[for="tankId"]').click()
    cy.get('[data-test="indicator-input"]').type(amount)
    cy.get('[for="tankId"]').click()
    if (biomass) {
      cy.get('[data-test="fish-biomass-delta-input"] input').clear().type(biomass)
      cy.get('[for="tankId"]').click()
    }
    cy.intercept('GET', `/api/core/indicators/tank/${tankID}*`).as('tankInfo')
    cy.get('[data-test="indicator-form__submit-button"]').click().wait('@tankInfo')
  }
}

export const checkIndicators = new checkAllIndicators()
export const enterIndicators = new enterAllIndicators()