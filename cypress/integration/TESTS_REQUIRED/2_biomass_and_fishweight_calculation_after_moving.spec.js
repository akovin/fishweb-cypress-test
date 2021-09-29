const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankIDFirst
let tankIDSecond
let siteAndTankNamesFirst = [Cypress.env('siteName'), Cypress.env('tankNameFirst')]
let siteAndTankNamesSecond = [Cypress.env('siteName'), Cypress.env('tankNameSecond')]

describe("biomass and fishweight calculation after moving", () => {
  before("login page", () => {
    cy.login()
  })
  beforeEach("create site and two tanks", () => {
    cy.createSiteByAPI(Cypress.env('siteName')).then((siteIDReturned) => {
      siteID = siteIDReturned
      cy.createTankByAPI(Cypress.env('tankNameFirst'), siteID).then((tankIDReturned) => {
        tankIDFirst = tankIDReturned
        cy.createTankByAPI(Cypress.env('tankNameSecond'), siteID).then((tankIDReturned) => {
          tankIDSecond = tankIDReturned
        })
      })
    })
  })
  it("moving into empty tank, fishweight of moving fish matches with fishweight of source tank", () => {
    enterIndicators.stocking(siteID, tankIDFirst, 5000, 650)
    checkIndicators.checkIndicatorsFull(...siteAndTankNamesFirst, '0,13', '5 000', '650')
    checkIndicators.checkIndicatorsFull(...siteAndTankNamesSecond, '---', '---', '---')
    enterIndicators.moving(siteID, tankIDFirst, tankIDSecond, 1000, 130)
    checkIndicators.checkIndicatorsFull(...siteAndTankNamesFirst, '0,13', '4 000', '520')
    checkIndicators.checkIndicatorsFull(...siteAndTankNamesSecond, '0,13', '1 000', '130')
  })
  it("moving into empty tank, fishweight of moving fish does not matches with fishweight of source tank", () => {
    enterIndicators.stocking(siteID, tankIDFirst, 5000, 650)
    checkIndicators.checkIndicatorsFull(...siteAndTankNamesFirst, '0,13', '5 000', '650')
    checkIndicators.checkIndicatorsFull(...siteAndTankNamesSecond, '---', '---', '---')
    enterIndicators.moving(siteID, tankIDFirst, tankIDSecond, 1000, 110)
    checkIndicators.checkIndicatorsFull(...siteAndTankNamesFirst, '0,135', '4 000', '540')
    checkIndicators.checkIndicatorsFull(...siteAndTankNamesSecond, '0,11', '1 000', '110')
  })
  afterEach("delete tanks and site", () => {
    cy.removeTankByAPI(tankIDFirst).then(() => {
      cy.removeTankByAPI(tankIDSecond).then(() => {
        cy.removeSiteByAPI(siteID)
      })
    })
  })
})
