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
        checkIndicators.checkFeeding(messages.find(message => message.nameOfMessage == 'calculatedData').nameOfMessage, siteID, tankID, feeds.find(feed => feed.feedProducerId == Cypress.env('feedNumberOneId')).feedProducerId, '9.4', '0.80', feeds.find(feed => feed.feedTableId == Cypress.env('feedTableNumberOneId')).feedTableId)
      })    
    })
  })
  it("daily feeding rate calculation, strategy handbook. feeding table does not exist", () => {
    enterIndicators.stocking(siteID, tankID, 3600, 370.8)
    enterIndicators.temperature(siteID, tankID, 14)
    cy.fixture('feeds').as('feeds').then((feeds) => {
      cy.fixture('messages').as('messages').then((messages) => {
        checkIndicators.checkFeeding(messages.find(message => message.nameOfMessage == 'tableNotFound').nameOfMessage, siteID, tankID, feeds.find(feed => feed.feedProducerId == Cypress.env('feedNumberTwoId')).feedProducerId, null, null, null)
      })
    })
  })
  it("daily feeding rate calculation, strategy handbook. feed does not fill in", () => {
    enterIndicators.stocking(siteID, tankID, 3600, 370.8)
    enterIndicators.temperature(siteID, tankID, 14)
    cy.fixture('feeds').as('feeds').then((feeds) => {
      cy.fixture('messages').as('messages').then((messages) => {
        checkIndicators.checkFeeding(messages.find(message => message.nameOfMessage == 'feedNotFillIn').nameOfMessage, siteID, tankID, feeds.find(feed => feed.feedProducerId == Cypress.env('feedNumberTwoId')).feedProducerId, null, null, null)
      })
    })
  })
  it("daily feeding rate calculation, strategy handbook. temperature did not enter", () => {
    enterIndicators.stocking(siteID, tankID, 3600, 370.8)
    cy.fixture('feeds').as('feeds').then((feeds) => {
      cy.fixture('messages').as('messages').then((messages) => {
        checkIndicators.checkFeeding(messages.find(message => message.nameOfMessage == 'temperatureNotEntered').nameOfMessage, siteID, tankID, feeds.find(feed => feed.feedProducerId == Cypress.env('feedNumberOneId')).feedProducerId, null, null, feeds.find(feed => feed.feedTableId == Cypress.env('feedTableNumberOneId')).feedTableId)
      })
    })
  })
  afterEach("delete tank and site", () => {
    cy.removeTankByAPI(tankID).then(() => {
      cy.removeSiteByAPI(siteID)
    })
  })
})
