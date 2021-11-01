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
    cy.fixture('feeds').as('feeds').then((feeds) => {
      cy.fixture('messages').as('messages').then((messages) => {
        checkIndicators.checkFeeding(messages.find(message => message.name == 'calculatedData').name, siteID, tankID, feeds.find(feed => feed.id == Cypress.env('feedFirstId')).id, '9.4', '0.80', feeds.find(feed => feed.tableId == Cypress.env('feedTableFirstId')).tableId)
      })    
    })
  })
  it("daily feeding rate calculation, strategy handbook. feeding table does not exist", () => {
    enterIndicators.stocking(siteID, tankID, 3600, 370.8)
    enterIndicators.temperature(siteID, tankID, 14)
    cy.fixture('feeds').as('feeds').then((feeds) => {
      cy.fixture('messages').as('messages').then((messages) => {
        checkIndicators.checkFeeding(messages.find(message => message.name == 'tableNotFound').name, siteID, tankID, feeds.find(feed => feed.id == Cypress.env('feedSecondId')).id, null, null, null)
      })
    })
  })
  it("daily feeding rate calculation, strategy handbook. feed does not fill in", () => {
    enterIndicators.stocking(siteID, tankID, 3600, 370.8)
    enterIndicators.temperature(siteID, tankID, 14)
    cy.fixture('feeds').as('feeds').then((feeds) => {
      cy.fixture('messages').as('messages').then((messages) => {
        checkIndicators.checkFeeding(messages.find(message => message.name == 'feedNotFillIn').name, siteID, tankID, feeds.find(feed => feed.id == Cypress.env('feedSecondId')).id, null, null, null)
      })
    })
  })
  it("daily feeding rate calculation, strategy handbook. temperature did not enter", () => {
    enterIndicators.stocking(siteID, tankID, 3600, 370.8)
    cy.fixture('feeds').as('feeds').then((feeds) => {
      cy.fixture('messages').as('messages').then((messages) => {
        checkIndicators.checkFeeding(messages.find(message => message.name == 'temperatureNotEntered').name, siteID, tankID, feeds.find(feed => feed.id == Cypress.env('feedFirstId')).id, null, null, feeds.find(feed => feed.tableId == Cypress.env('feedTableFirstId')).tableId)
      })
    })
  })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
