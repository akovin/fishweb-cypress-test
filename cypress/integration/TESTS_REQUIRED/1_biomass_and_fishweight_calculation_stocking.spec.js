const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankID
const siteAndTankNamesTest = [Cypress.env('siteNameTest'), Cypress.env('tankNameTestFirst')]

describe("biomass and fishweight calculation after seeding", () => {
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
  it("seeding in an empty tank", () => {
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '---', '---', '---')
    enterIndicators.seeding(siteID, tankID, 5000, 250)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,05', '5 000', '250')
  })
  it("seeding in not empty tank, the same fishweight", () => {
    enterIndicators.seeding(siteID, tankID, 5000, 250)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,05', '5 000', '250')
    enterIndicators.seeding(siteID, tankID, 300, 15)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,05', '5 300', '265')
  })
  it("seeding in not empty tank, another fishweight", () => {
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '---', '---', '---')
    enterIndicators.seeding(siteID, tankID, 5000, 250)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,05', '5 000', '250')
    enterIndicators.seeding(siteID, tankID, 300, 21)
    checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,051', '5 300', '271')
  })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
