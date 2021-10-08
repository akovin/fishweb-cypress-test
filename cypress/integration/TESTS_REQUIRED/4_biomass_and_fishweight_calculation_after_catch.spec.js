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
  it("catch with the same fishweight in tank", () => {
    enterIndicators.stocking(siteID, tankID, 4780, 11213.88)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,346', '4 780', '11 213,9')
    enterIndicators.catch(siteID, tankID, 2256)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,346', '2 524', '5 921,3')
  })
  it("catch fishweight differs from tank fishweight", () => {
    enterIndicators.stocking(siteID, tankID, 4780, 11213.88)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,346', '4 780', '11 213,9')
    enterIndicators.catch(siteID, tankID, 2256, 5775,36)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '2,155', '2 524', '5 438,9')
  })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
