const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankID
const siteAndTankNamesTest = [Cypress.env('siteNameTest'), Cypress.env('tankNameTestFirst')]

describe("daily feeding rate calculation, strategy handbook", () => {
  beforeEach("login page and create site and tank", () => {
    cy.login()
    cy.removeAllTestIndicatorsConstantTank(Cypress.env('tankTestConstantId'), ['seeding', 'temperature'])
  })
  it("daily feeding rate calculation, strategy feeding plan(without condition by fishweight)", () => {
    enterIndicators.seeding(Cypress.env('siteTestConstantId'), Cypress.env('tankTestConstantId'), 3600, 370.8, '1 Авг 15:00')
    enterIndicators.temperature(Cypress.env('siteTestConstantId'), Cypress.env('tankTestConstantId'), 14, '1 Авг 15:00')
    cy.fixture('feedingPlans').as('feedingPlans').then((feedingPlans) => {
        checkIndicators.checkFeeding('calculatedDataWithoutFillInFeed', Cypress.env('siteTestConstantId'), Cypress.env('tankTestConstantId'), null, '9.4', '0.80', null, feedingPlans.find(feedingPlan => feedingPlan.name == Cypress.env('feedingPlanFirstName')).id, '2 Авг 15:00')
    })
  })
  it.only("daily feeding rate calculation, strategy feeding plan(with condition by fishweight)", () => {
    enterIndicators.seeding(Cypress.env('siteTestConstantId'), Cypress.env('tankTestConstantId'), 3600, 72, '1 Авг 15:00')
    enterIndicators.temperature(Cypress.env('siteTestConstantId'), Cypress.env('tankTestConstantId'), 14, '1 Авг 15:00')
    cy.fixture('feedingPlans').as('feedingPlans').then((feedingPlans) => {
        checkIndicators.checkFeeding('calculatedDataWithoutFillInFeed', Cypress.env('siteTestConstantId'), Cypress.env('tankTestConstantId'), null, '3.0', '0.80', null, feedingPlans.find(feedingPlan => feedingPlan.name == Cypress.env('feedingPlanSecondName')).id, '3 Авг 15:00')
    })
  })
})
