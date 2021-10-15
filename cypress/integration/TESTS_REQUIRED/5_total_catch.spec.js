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
    // checkIndicators.checkRecordFish(...siteAndTankNamesTest, 3 , 'Вылов', 'Поправка', '2 520', '−4', '2,155', '','5 429,901', '−8,619')
    checkIndicators.checkRecordFish(...siteAndTankNamesTest, 1 , 'Вылов', 'Продажа', '0', '−2 520', 'n/a', '−2,05', '0', '−5 166')
    // checkIndicators.checkRecordFish(...siteAndTankNamesTest, 2 , 'Навеска', 'Поправка', '2 520', '', '2,05', '−0,105', '5 166', '−263,901')
  })
  // it("catch fishweight differs from tank fishweight", () => {
  //   enterIndicators.stocking(siteID, tankID, 4780, 11213.88)
  //   checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,346', '4 780', '11 213,9')
  //   enterIndicators.catch(siteID, tankID, 2256, 5775,36)
  //   checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,155', '2 524', '5 438,9')
  // })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
