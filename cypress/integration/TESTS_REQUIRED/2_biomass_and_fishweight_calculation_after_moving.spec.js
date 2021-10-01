const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankIDFirst
let tankIDSecond
const siteAndTankNamesTestFirst = [Cypress.env('siteNameTest'), Cypress.env('tankNameTestFirst')]
const siteAndTankNamesTestSecond = [Cypress.env('siteNameTest'), Cypress.env('tankNameTestSecond')]

describe("biomass and fishweight calculation after moving", () => {
  before("login page", () => {
    cy.login()
    cy.removeAllTestEntities()
  })
  beforeEach("create site and two tanks", () => {
    cy.createSiteByAPI(Cypress.env('siteNameTest')).then((siteIDReturned) => {
      siteID = siteIDReturned
      cy.createTankByAPI(Cypress.env('tankNameTestFirst'), siteID).then((tankIDReturned) => {
        tankIDFirst = tankIDReturned
        cy.createTankByAPI(Cypress.env('tankNameTestSecond'), siteID).then((tankIDReturned) => {
          tankIDSecond = tankIDReturned
        })
      })
    })
  })
  it.only("moving into empty tank, fishweight of moving fish matches with fishweight of source tank", () => {
    enterIndicators.stocking(siteID, tankIDFirst, 5000, 650)
    checkIndicators.checkIndicators(...siteAndTankNamesTestFirst, '0,13', '5 000', '650')
    checkIndicators.checkIndicators(...siteAndTankNamesTestSecond, '---', '---', '---')
    enterIndicators.moving(siteID, tankIDFirst, tankIDSecond, 1000, 130)
    checkIndicators.checkIndicators(...siteAndTankNamesTestFirst, '0,13', '4 000', '520')
    checkIndicators.checkIndicators(...siteAndTankNamesTestSecond, '0,13', '1 000', '130')
  })
  it("moving into empty tank, fishweight of moving fish does not matches with fishweight of source tank", () => {
    enterIndicators.stocking(siteID, tankIDFirst, 5000, 650)
    checkIndicators.checkIndicators(...siteAndTankNamesTestFirst, '0,13', '5 000', '650')
    checkIndicators.checkIndicators(...siteAndTankNamesTestSecond, '---', '---', '---')
    enterIndicators.moving(siteID, tankIDFirst, tankIDSecond, 1000, 110)
    checkIndicators.checkIndicators(...siteAndTankNamesTestFirst, '0,135', '4 000', '540')
    checkIndicators.checkIndicators(...siteAndTankNamesTestSecond, '0,11', '1 000', '110')
  })
  afterEach("delete tanks and site", () => {
    cy.removeTankByAPI(tankIDFirst).then(() => {
      cy.removeTankByAPI(tankIDSecond).then(() => {
        cy.removeSiteByAPI(siteID)
      })
    })
  })
})
