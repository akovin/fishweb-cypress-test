//приведение строк, содержащих другие символы к числу корректному, с точкой
function makeValidNumber(htmlIndicator) {
  const regex = /[\d,.−]/g
  const digitsWithDotOrComma = htmlIndicator.match(regex)
  let indicatorFinalFromPage = digitsWithDotOrComma.join('')
  return indicatorFinalFromPage
}

function makeValidNumbersAndCompare(indicatorExpected, indicatorFromPage) {
  const regex = /\d+/g
  const digitsExist = indicatorFromPage.match(regex)
  //Если значение не числовое,а , например n/a - то сравниваем на включение строки
  if(digitsExist) {
    const amountNumber = makeValidNumber(indicatorExpected)
    const amountNumberFromPage = makeValidNumber(indicatorFromPage)
    expect(amountNumberFromPage).to.equal(amountNumber)
  } else {
    expect(indicatorFromPage).to.contain(indicatorExpected)
  }
}

//специально написанная функция для проверки значений в записях об изменении рыбы
function compareTwoLocatorsWithValues (recordAll, valueAfterLocator, valueDifferenceLocator, valueAfter, valueDifference) {
  let valueAfterFromPage = recordAll.find(valueAfterLocator).text()
  //Для того, чтобы отсечь второе значение разницы индикаторов, между символов (), отрезаем строку до символа (
  valueAfterFromPage = valueAfterFromPage.split('(')
  valueAfterFromPage = valueAfterFromPage[0]
  makeValidNumbersAndCompare(valueAfter, valueAfterFromPage)
  if(recordAll.find(valueDifferenceLocator).length){
    const valueDifferenceFromPage = recordAll.find(valueDifferenceLocator).text()
    makeValidNumbersAndCompare(valueDifference, valueDifferenceFromPage)
  } 
}

export class checkAllIndicators {
  //Проверка показателей полностью
  checkIndicators(siteName, tankName, fishWeight, amount, biomass) {
    cy.visit('/')
    cy.intercept('GET', '/api/core/sites/**').as('siteInfo')
    cy.contains(siteName).click({ force: true }).wait('@siteInfo')
    cy.contains(tankName).click({ force: true })
    //проверка что индикатор не активен - не содержит в себе цифр, может быть n/a или ---
    const regexDigit = /\d+/g
    if (!regexDigit.test(fishWeight)) {
      cy.get('[data-test="tank-fish-weight-value"]').should('be.visible').invoke('text').should('contain', fishWeight)
    } else {
      cy.get('[data-test="tank-fish-weight-value"]').should('be.visible').invoke('text').then((htmlFishWeight) => {
        makeValidNumbersAndCompare(fishWeight, htmlFishWeight)
      })
    }
    if (!regexDigit.test(amount)) {
      cy.get('[data-test="tank-fish-amount-value"]').should('be.visible').invoke('text').should('contain', amount)
    } else {
      cy.get('[data-test="tank-fish-amount-value"]').invoke('text').then((htmlAmount) => {
        makeValidNumbersAndCompare(amount, htmlAmount)
      })
    }
    if (!biomass.match(regexDigit)) {
      cy.get('[data-test="tank-fish-biomass-value"]').should('be.visible').invoke('text').should('contain', biomass)
    } else {
      cy.get('[data-test="tank-fish-biomass-value"]').invoke('text').then((htmlBiomass) => {
        makeValidNumbersAndCompare(biomass, htmlBiomass)
      })
    }
  }
  checkRecordFish(siteName, tankName, numberOfRecord, nameOfRecord, reasonOfRecord,  amountAfter, amountDifference, fishWeightAfter, fishWeightDifference, biomassAfter, biomassDifference) {
    cy.visit('/')
    cy.intercept('GET', '/api/core/sites/**').as('siteInfo')
    cy.contains(siteName).click({ force: true }).wait('@siteInfo')
    cy.contains(tankName).click({ force: true })
    cy.get('[data-test="tank-fish-amount-value"]').prev().click()
    cy.get('.toolbar > :nth-child(2) > .el-button').click()
    numberOfRecord = numberOfRecord - 1
    cy.get('.el-table__row').eq(numberOfRecord).should('contain', nameOfRecord).should('contain', reasonOfRecord).then(($recordAll) => {
      compareTwoLocatorsWithValues($recordAll, '.el-table_1_column_5 .cell', '.el-table_1_column_5 .cell .relative-value', amountAfter, amountDifference)
      compareTwoLocatorsWithValues($recordAll, '.el-table_1_column_6 .cell', '.el-table_1_column_6 .cell .relative-value', fishWeightAfter, fishWeightDifference)
      compareTwoLocatorsWithValues($recordAll, '.el-table_1_column_7 .cell', '.el-table_1_column_7 .cell .relative-value', biomassAfter, biomassDifference)
    })
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
  catch(siteID, tankID, amount, biomass, totalCatch, catchReason) {
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
    if (totalCatch) {
      cy.get('[data-test="catching-everything-checkbox"] input').check({force:true})
    }
    if (catchReason) {
      cy.get('[data-test="catch-reason-input"] input').click()
      cy.get(`[data-test="catch-reason-option-${catchReason}"]`).click()
    }
    cy.get('[data-test="indicator-form__submit-button"]').click()
    cy.intercept('GET', `/api/core/indicators/tank/${tankID}*`).as('tankInfo')
    //проверяем наличие кнопки подтверждения действия
    const locatorOfPrimaryButton = '.el-message-box__btns > .el-button--primary'
    cy.get('body').then(($body) => {
      if($body.find(locatorOfPrimaryButton ).length){
        cy.get(locatorOfPrimaryButton ).click().wait('@tankInfo')
      }
    })
  }
  feeding(siteID, tankID, amount, feedRatio) {
    cy.visit('/')
    cy.get('.menu__indicators > .el-button').click()
    cy.get('[data-test=indicator-form__type-picker]').click()
    cy.get('[data-test="node-feeding"]').click()
    cy.get('[data-test="indicator-form__table-view-toggle"]').click()
    cy.get('[data-test="tanks-cascader"]').click().wait(500)
    cy.get(`[data-test=node-site-${siteID}]`).click()
    cy.get(`[data-test=node-tank-${tankID}]`).parent().prev().click()
    cy.get('[for="feedingHandbookId"]').click()
    cy.get('[data-test="feed-producer-select"]').click()
    cy.get('[data-test="feed-producer-option-5d0c916a3f8fc5002132f106"]').click()
    cy.get('[data-test="indicator-input"] input').type(amount)
    cy.get('[data-test="feed-ratio-input"] input').type(feedRatio)
    cy.get('[data-test="indicator-form__submit-button"]').click()
  }
}

export const checkIndicators = new checkAllIndicators()
export const enterIndicators = new enterAllIndicators()