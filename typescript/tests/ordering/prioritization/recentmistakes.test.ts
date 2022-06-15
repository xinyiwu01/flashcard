import { newRecentMistakesFirstSorter } from '../../../src/ordering/prioritization/recentmistakes'
import { CardStatus, newCardStatus } from '../../../src/cards/cardstatus'
import { CardOrganizer } from '../../../src/ordering/cardorganizer'
import { newFlashCard } from '../../../src/cards/flashcard'

const status1: CardStatus = newCardStatus(newFlashCard('q1', 'a1'))
status1.recordResult(true)
status1.recordResult(false)

const status2: CardStatus = newCardStatus(newFlashCard('q2', 'a2'))
status2.recordResult(false)
status2.recordResult(true)

const status3: CardStatus = newCardStatus(newFlashCard('q3', 'a3'))
status1.recordResult(true)
status1.recordResult(false)

let cards: CardStatus[]

test('test newRecentMistakesFirstSorter: recent mistakes first order, order should be stable', () => {
  cards = [status1, status2, status3]
  const cardorganizer: CardOrganizer = newRecentMistakesFirstSorter()
  const newcards = cardorganizer.reorganize(cards)
  expect(newcards[0].getCard().getQuestion()).toBe(status1.getCard().getQuestion())
  expect(newcards[1].getCard().getQuestion()).toBe(status3.getCard().getQuestion())
  expect(newcards[2].getCard().getQuestion()).toBe(status2.getCard().getQuestion())
})
