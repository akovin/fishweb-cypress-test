const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankID
let siteAndTankNames = [Cypress.env('siteName'), Cypress.env('tankNameFirst')]

describe("biomass and fishweight calculation after stocking", () => {
  beforeEach("login page and create site and tank", () => {
    cy.login()
    cy.createSiteByAPI(Cypress.env('siteName')).then((siteIDReturned) => {
      siteID = siteIDReturned
      cy.createTankByAPI(Cypress.env('tankNameFirst'), siteID).then((tankIDReturned) => {
        tankID = tankIDReturned
      })
    })
  })
  it("stocking in an empty tank", () => {
    checkIndicators.checkIndicatorsFull(...siteAndTankNames , '---', '---', '---')
    enterIndicators.stocking(siteID, tankID, 5000, 250)
    checkIndicators.checkIndicatorsFull(...siteAndTankNames, '0,05', '5 000', '250')
  })
  it("stocking in not empty tank, the same fishweight", () => {
    enterIndicators.stocking(siteID, tankID, 5000, 250)
    checkIndicators.checkIndicatorsFull(...siteAndTankNames, '0,05', '5 000', '250')
    enterIndicators.stocking(siteID, tankID, 300, 15)
    checkIndicators.checkIndicatorsFull(...siteAndTankNames, '0,05', '5 300', '265')
  })
  it("stocking in not empty tank, another fishweight", () => {
    // //Очищаем все данные прошлых тестов
    // cy.removeTankByAPI(tankID).then(() => {
    //   cy.removeSiteByAPI(siteID)
    // })
    // cy.createSiteByAPI(Cypress.env('siteName')).then((siteIDReturned) => {
    //   siteID = siteIDReturned
    //   cy.createTankByAPI(Cypress.env('tankNameFirst'), siteID).then((tankIDReturned) => {
        // tankID = tankIDReturned
        checkIndicators.checkIndicatorsFull(...siteAndTankNames, '---', '---', '---')
        enterIndicators.stocking(siteID, tankID, 5000, 250)
        checkIndicators.checkIndicatorsFull(...siteAndTankNames, '0,05', '5 000', '250')
        enterIndicators.stocking(siteID, tankID, 300, 21)
        checkIndicators.checkIndicatorsFull(...siteAndTankNames, '0,051', '5 300', '271')
      })
  //   })
  // })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
