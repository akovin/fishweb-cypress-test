const { checkIndicators } = require("../../support/page_objects/enterAndCheckIndicators")
const { enterIndicators } = require("../../support/page_objects/enterAndCheckIndicators")

let siteID
let tankID

describe("biomass and fishweight calculation", () => {
  before("login page and create site and tank", () => {
    cy.login()
    cy.createSiteAndTankByAPI().then((value) => {
      siteID = value[0]
      tankID = value[1]
    })
  })
  it("stocking in an empty tank", () => {
    checkIndicators.checkIndicatorsFull('---', '---', '---')
    enterIndicators.stocking(siteID, tankID, 5000, 250)
    checkIndicators.checkIndicatorsOnlyCheck('0,05', '5 000', '250')
  })
  it("stocking in not empty tank, the same fishweight", () => {
    checkIndicators.checkIndicatorsFull('0,05', '5 000', '250')
    enterIndicators.stocking(siteID, tankID, 300, 15)
    checkIndicators.checkIndicatorsOnlyCheck('0,05', '5 300', '265')
  })
  it("stocking in not empty tank, another fishweight", () => {
    //Очищаем все данные прошлых тестов
    cy.removeSiteAndTankByAPI()
    cy.createSiteAndTankByAPI().then((value) => {
      siteID = value[0]
      tankID = value[1]
      checkIndicators.checkIndicatorsFull('---', '---', '---')
      enterIndicators.stocking(siteID, tankID, 5000, 250)
      checkIndicators.checkIndicatorsOnlyCheck('0,05', '5 000', '250')
      enterIndicators.stocking(siteID, tankID, 300, 21)
      checkIndicators.checkIndicatorsOnlyCheck('0,051', '5 300', '271')
    })
  })
  after("delete tank and site", () => {
    cy.removeSiteAndTankByAPI()
  })
})
