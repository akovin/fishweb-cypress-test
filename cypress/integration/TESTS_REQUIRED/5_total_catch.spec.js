const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankID
const siteAndTankNamesTest = [Cypress.env('siteNameTest'), Cypress.env('tankNameTestFirst')]

describe("biomass and fishweight calculation after stocking", () => {
  beforeEach("login page and create site and tank", () => {
    cy.login()
    cy.removeAllTestEntities()
    cy.createSiteByAPI(Cypress.env('siteNameTest')).then((siteIDReturned) => {
      siteID = siteIDReturned
      cy.createTankByAPI(Cypress.env('tankNameTestFirst'), siteID).then((tankIDReturned) => {
        tankID = tankIDReturned
      })
    })
  })
  it("total catch with fish amount less than in tank, with fishweight differs from fishweight in tank", () => {
    enterIndicators.stocking(siteID, tankID, 2524, 5438.52 )
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,155', '2 524', '5 438,5')
    enterIndicators.catch(siteID, tankID, 2520, 5166, true, 'Продажа' )
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 3 , 'Вылов', 'Поправка', '2 520', '−4', '2,155', '','5 429,901', '−8,619')
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 1 , 'Вылов', 'Продажа', '0', '−2 520', 'n/a', '−2,05', '0', '−5 166')
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 2 , 'Навеска', 'Поправка', '2 520', '', '2,05', '−0,105', '5 166', '−263,901')
  })
  it("total catch with fish amount less than in tank, with the same fishweight", () => {
    enterIndicators.stocking(siteID, tankID, 2524, 5552.8 )
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,2', '2 524', '5 552,8')
    enterIndicators.catch(siteID, tankID, 2520, 5544, true, 'Продажа' )
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 2 , 'Вылов', 'Поправка', '2 520', '−4', '2,2', '','5 544', '−8,8')
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 1, 'Вылов', 'Продажа', '0', '−2 520', 'n/a', '−2,2', '0', '−5 544')
  })
  it("total catch with fish amount more than in tank, with fishweight differs from fishweight in tank", () => {
    enterIndicators.stocking(siteID, tankID, 2524, 5438.52 )
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,155', '2 524', '5 438,5')
    enterIndicators.catch(siteID, tankID, 2530, 5566, true, 'Продажа' )
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 1 , 'Вылов', 'Продажа', '0', '−2 530', 'n/a', '−2,2', '0', '−5 566')
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 2 , 'Навеска', 'Поправка', '2 530', '', '2,2', '+0,045', '5 566', '+114,552')
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 3 , 'Зарыбление', 'Поправка', '2 530', '+6', '2,155', '', '5 451,448', '+12,928')
  })
  it("total catch with fish amount more than in tank, with the same fishweight", () => {
    enterIndicators.stocking(siteID, tankID, 2524, 5552.8 )
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,2', '2 524', '5 552,8')
    enterIndicators.catch(siteID, tankID, 2530, 5566, true, 'Продажа' )
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 1 , 'Вылов', 'Продажа', '0', '−2 530', 'n/a', '−2,2', '0', '−5 566')
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 2 , 'Зарыбление', 'Поправка', '2 530', '+6', '2,2', '', '5 566', '+13,2')
  })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
