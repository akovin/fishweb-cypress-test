const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankID
const siteAndTankNamesTest = [Cypress.env('siteNameTest'), Cypress.env('tankNameTestFirst')]

describe("biomass and fishweight calculation after feeding", () => {
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
  it("biomass and fishweight calculation after feeding", () => {
    cy.fixture('feeds').as('feeds').then((feeds) => {
      enterIndicators.stocking(siteID, tankID, 3600, 370.8)
      checkIndicators.checkIndicators(...siteAndTankNamesTest, '0,103', '3 600', '370,8')
      enterIndicators.feeding(siteID, tankID, feeds.find(feed => feed.feedName == Cypress.env('feedNumberOne')).feedProducerId, 15, 0.8)
      checkIndicators.checkRecordFish(...siteAndTankNamesTest, 1 , 'Кормление', '', '3 600', '', '0,108', '+0,005', '389,55', '+18,75')
  
    })
  })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
