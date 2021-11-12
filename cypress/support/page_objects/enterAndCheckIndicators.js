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
  if (digitsExist) {
    const amountNumber = makeValidNumber(indicatorExpected)
    const amountNumberFromPage = makeValidNumber(indicatorFromPage)
    expect(amountNumberFromPage).to.equal(amountNumber)
  } else {
    expect(indicatorFromPage).to.contain(indicatorExpected)
  }
}

//специально написанная функция для проверки значений в записях об изменении рыбы
function compareTwoLocatorsWithValues(recordAll, valueAfterLocator, valueDifferenceLocator, valueAfter, valueDifference) {
  let valueAfterFromPage = recordAll.find(valueAfterLocator).text()
  //Для того, чтобы отсечь второе значение разницы индикаторов, между символов (), отрезаем строку до символа (
  valueAfterFromPage = valueAfterFromPage.split('(')
  valueAfterFromPage = valueAfterFromPage[0]
  makeValidNumbersAndCompare(valueAfter, valueAfterFromPage)
  if (recordAll.find(valueDifferenceLocator).length) {
    const valueDifferenceFromPage = recordAll.find(valueDifferenceLocator).text()
    makeValidNumbersAndCompare(valueDifference, valueDifferenceFromPage)
  }
}

function setTimeDate(dateTime) {
  if (dateTime) {
    cy.get('[data-test="indicator-form__timestamp-picker"] input').clear()
    let currentYear = false
    cy.get('.el-date-picker__header > :nth-child(3)').invoke('text').then(year => {
      //проверяем нужно ли менять год, доделать
      if (year.includes('2021')) {
        cy.get('[data-test="indicator-form__timestamp-picker"] input').type(`${dateTime}{enter}`)
        currentYear = true
      } else {
        cy.get('.el-icon-arrow-left').click()
        currentYear = false
      }
    })
  }
}

export class checkAllIndicators {
  //Проверка показателей полностью
  checkIndicators(siteName, tankName, fishWeight, amount, biomass, temperature) {
    cy.visit('/')
    cy.intercept('GET', '/api/core/sites/**').as('siteInfo')
    cy.contains(siteName, { timeout: 6000 }).click({ force: true }).wait('@siteInfo')
    cy.intercept('GET', '/api/core/indicators/fish/change/tank*').as('tankInfo')
    cy.contains(tankName, { timeout: 6000 }).click({ force: true }).wait('@tankInfo')
    //проверка что индикатор не активен - не содержит в себе цифр, может быть n/a или ---
    const regexDigit = /\d+/g
    if (!regexDigit.test(fishWeight)) {
      cy.get('[data-test="tank-fish-weight-value"]').should('be.visible').invoke('text').should('contain', fishWeight)
    } else {
      cy.get('[data-test="tank-fish-weight-value"]').should('be.visible').invoke('text').then((htmlFishWeight) => {
        //добавить эту проверку сюда   .should('have.css', 'background-color').and('equal', 'rgba(119, 142, 255, 0.24)')
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
    if (temperature) {
      if (!temperature.match(regexDigit)) {
        cy.get('[data-test="tank-temperature-value"]').should('be.visible').invoke('text').should('contain', temperature)
      } else {
        cy.get('[data-test="tank-temperature-value"]').invoke('text').then((htmlTemperature) => {
          makeValidNumbersAndCompare(temperature, htmlTemperature)
        })
      }
    }
  }
  checkRecordFish(siteName, tankName, numberOfRecord, nameOfRecord, reasonOfRecord, amountAfter, amountDifference, fishWeightAfter, fishWeightDifference, biomassAfter, biomassDifference) {
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
  checkFeeding(name, siteID, tankID, id, amount, feedingRatio, feedingTableId, feedingPlanId, dateTime) {
    cy.visit('/')
    cy.get('.menu__indicators > .el-button').click()
    cy.get('[data-test=indicator-form__type-picker]').click()
    cy.get('[data-test="node-feeding"]').click()
    cy.get('[data-test="indicator-form__table-view-toggle"]').click()
    cy.get('[data-test="tanks-cascader"]').click().wait(500)
    cy.get(`[data-test=node-site-${siteID}]`).click()
    cy.get(`[data-test=node-tank-${tankID}]`).parent().prev().click()
    cy.get('[placeholder="Введите комментарий"]').click()

    cy.get('[data-test="tanks-cascader"] .el-cascader__search-input').invoke('attr', 'placeholder').then(placeholderValue => {
      console.log(placeholderValue + 'el-cascader__search-input')
    })

    if (feedingPlanId) {
      cy.get(`[data-test="feeding-plan-select"]`).click()
      cy.get(`[data-test="feeding-plan-option-${feedingPlanId}"]`).click()
      cy.get('[data-test="feeding-strategy-checkbox-handbook"]').click()
    }

    if (!(name == 'feedNotFillIn') && (name !== null) && (name !== 'calculatedDataWithoutFillInFeed')) {
      cy.get('[data-test="feed-producer-select"]').click()
      cy.get(`[data-test="feed-producer-option-${id}"]`).click()
    }

    if (feedingTableId) {
      cy.get(`[data-test="feed-producer-handbook-select"]`).click()
      cy.get(`[data-test="feed-producer-handbook-option-${feedingTableId}"]`).should('be.visible').click()
      cy.get('[data-test="feeding-strategy-checkbox-handbook"]').click()
    } else {
      cy.log('feedingTableId not exist')
      cy.get('[data-test="feed-producer-handbook-select"]').rightclick()
      cy.get('body').then($body => {
        if ($body.find('[data-test="feed-producer-handbook-select"] .el-icon-circle-close').length) {
          cy.get('[data-test="feed-producer-handbook-select"] .el-icon-circle-close').click()
        }
      })
    }

    cy.intercept('GET', '/api/core/indicators/tank**').as('formInfo')

    setTimeDate(dateTime)

    cy.get('body').then($body => {
      if (!$body.find('[data-test="tanks-cascader"] .el-cascader__tags span').length) {
        cy.get('[data-test="tanks-cascader"]').click().wait(500)
        cy.get(`[data-test=node-site-${siteID}]`).click()
        cy.get(`[data-test=node-tank-${tankID}]`).parent().prev().click()
      }
    })

    switch (name) {
      case 'calculatedDataWithoutFillInFeed':
        cy.get('[data-test="feeding-strategy-checkbox-feedingPlan"]').click()
        cy.get('[data-test="indicator-input"] input').invoke('val').then(amountCalculated => {
          expect(amount).to.equal(amountCalculated)
        })
        cy.get('[data-test="feed-ratio-input"] input').invoke('val').then(feedingRatioCalculated => {
          expect(feedingRatio).to.equal(feedingRatioCalculated)
        })
        break
      case 'calculatedData':
        cy.get('[data-test="indicator-input"] input').invoke('val').then(amountCalculated => {
          expect(amount).to.equal(amountCalculated)
        })
        cy.get('[data-test="feed-ratio-input"] input').invoke('val').then(feedingRatioCalculated => {
          expect(feedingRatio).to.equal(feedingRatioCalculated)
        })
        break
      case 'tableNotFound':
        cy.get('[data-test="feeding-strategy-checkbox-group"]').rightclick().wait(500)
        cy.fixture('messages').as('messages').then((messages) => {
          // cy.get('.el-popover__title').contains('Справочник').next().should('contain', messages.find(message => message.name == 'tableNotFound').text)
          cy.get('.feeding-strategy-preview').contains('справочник не найден').should('contain', 'справочник не найден')
        })
        break
      case 'feedNotFillIn':
        cy.get('[data-test="feeding-strategy-checkbox-group"]').rightclick()
        cy.fixture('messages').as('messages').then((messages) => {
          cy.get('.feeding-strategy-preview').contains('справочник не найден').should('contain', 'справочник не найден')
        })
        break
      case 'temperatureNotEntered':
        cy.get('[data-test="feeding-strategy-checkbox-group"]').rightclick()
        cy.fixture('messages').as('messages').then((messages) => {
          cy.get('.el-popover__title').contains('Справочник').next().should('contain', 'температура не найдена')
        })
        break
      default:
        cy.log(`Sorry, we are out of ${name}.`)
    }
  }
}

export class enterAllIndicators {
  //Зарыбление
  seeding(siteID, tankID, amount, biomass, dateTime) {
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
    setTimeDate(dateTime)
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
      cy.get('[data-test="catching-everything-checkbox"] input').check({ force: true })
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
      if ($body.find(locatorOfPrimaryButton).length) {
        cy.get(locatorOfPrimaryButton).click().wait('@tankInfo')
      }
    })
  }
  feeding(siteID, tankID, id, amount, feedRatio) {
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
    //ID Raisio aqua (5 мм) = 5d0c916a3f8fc5002132f106
    cy.get(`[data-test="feed-producer-option-${id}"]`).click()
    cy.get('[data-test="indicator-input"] input').type(amount)
    cy.get('[data-test="feed-ratio-input"] input').type(feedRatio)
    cy.get('[data-test="indicator-form__submit-button"]').click()
  }
  temperature(siteID, tankID, temperature, dateTime) {
    cy.visit('/')
    cy.get('.menu__indicators > .el-button').click()
    cy.get('[data-test=indicator-form__type-picker]').click()
    cy.get('[data-test="node-water"]').click()
    cy.get('[data-test="indicator-form__table-view-toggle"]').click()
    cy.get('[data-test="tanks-cascader"]').click()
    cy.get(`[data-test=node-site-${siteID}]`).click()
    cy.get(`[data-test=node-tank-${tankID}]`).parent().prev().click()
    cy.get('.indicator-form__title').click()
    cy.get('[data-test="temperature-input"] input').type(temperature)
    setTimeDate(dateTime)
    cy.get('[data-test="indicator-form__submit-button"]').click()
  }
}

export const checkIndicators = new checkAllIndicators()
export const enterIndicators = new enterAllIndicators()