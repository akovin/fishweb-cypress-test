const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankID
const siteAndTankNamesTest = [Cypress.env('siteNameTest'), Cypress.env('tankNameTestFirst')]

describe("daily feeding rate calculation, strategy handbook", () => {
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
  it("daily feeding rate calculation, strategy handbook", () => {
    enterIndicators.stocking(siteID, tankID, 3600, 370.8)
    enterIndicators.temperature(siteID, tankID, 14)
    cy.fixture('feedingPlans').as('feedingPlans').then((feedingPlans) => {
        checkIndicators.checkFeeding(null, siteID, tankID, null, '9.4', '0.80', null, feedingPlans.find(feedingPlan => feedingPlan.name == Cypress.env('feedingPlanFirstName')).id, '2 Авг 15:00')
    })
  })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
