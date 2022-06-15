import { CardStatus, newCardStatus } from '../../src/cards/cardstatus'
import { FlashCard, newFlashCard } from '../../src/cards/flashcard'

let flashcard: FlashCard
let cardstatus: CardStatus

beforeEach(() => {
  flashcard = newFlashCard('testQuestion', 'testAnswer')
  cardstatus = newCardStatus(flashcard)
})

test('test recordResult: record true', () => {
  cardstatus.recordResult(true)
  expect(cardstatus.getResults()[cardstatus.getResults().length - 1]).toBeTruthy()
})

test('test recordResult: record false', () => {
  cardstatus.recordResult(false)
  expect(cardstatus.getResults()[cardstatus.getResults().length - 1]).toBeFalsy()
})

test('test clearResult: clear result, successes should be empty', () => {
  cardstatus.recordResult(true)
  cardstatus.recordResult(false)
  cardstatus.recordResult(true)
  cardstatus.clearResults()
  // toEqual() for testing array, toBe() for testing value
  expect(cardstatus.getResults()).toEqual([])
})
