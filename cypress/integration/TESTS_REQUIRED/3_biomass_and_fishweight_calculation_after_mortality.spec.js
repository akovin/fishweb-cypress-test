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
  it("mortality with the same fishweight in tank", () => {
    enterIndicators.stocking(siteID, tankID, 4000, 540)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,135', '4 000', '540')
    enterIndicators.mortality(siteID, tankID, 220, 29.7)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,135', '3 780', '510,3')
  })
  it("mortality fishweight differs from tank fishweight", () => {
    enterIndicators.stocking(siteID, tankID, 4000, 540)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,135', '4 000', '540')
    enterIndicators.mortality(siteID, tankID, 220, 22)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,137', '3 780', '518')
  })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
