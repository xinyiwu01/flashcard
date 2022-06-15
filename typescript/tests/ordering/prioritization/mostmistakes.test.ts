import { newMostMistakesFirstSorter } from '../../../src/ordering/prioritization/mostmistakes'
import { CardStatus, newCardStatus } from '../../../src/cards/cardstatus'
import { CardOrganizer } from '../../../src/ordering/cardorganizer'
import { newFlashCard } from '../../../src/cards/flashcard'

const status1: CardStatus = newCardStatus(newFlashCard('q1', 'a1'))
status1.recordResult(true)
status1.recordResult(true)
status1.recordResult(false)

const status2: CardStatus = newCardStatus(newFlashCard('q2', 'a2'))
status2.recordResult(true)
status2.recordResult(false)
status2.recordResult(false)

const status3: CardStatus = newCardStatus(newFlashCard('q3', 'a3'))
status3.recordResult(false)
status3.recordResult(false)
status3.recordResult(false)
status3.recordResult(false)

let cards: CardStatus[]

test('test newmostmistakesfirstorder: most mistakes first order', () => {
  cards = [status1, status2, status3]
  const cardorganizer: CardOrganizer = newMostMistakesFirstSorter()
  const newcards = cardorganizer.reorganize(cards)
  expect(newcards[0].getCard().getQuestion()).toBe(status3.getCard().getQuestion())
  expect(newcards[1].getCard().getQuestion()).toBe(status2.getCard().getQuestion())
  expect(newcards[2].getCard().getQuestion()).toBe(status1.getCard().getQuestion())
})

test('test newmostmistakesfirstorder: cards with same msitake times, reorganize should be stable', () => {
  status1.recordResult(false)
  cards = [status1, status2]
  const cardorganizer: CardOrganizer = newMostMistakesFirstSorter()
  const newcards = cardorganizer.reorganize(cards)
  expect(newcards[0].getCard().getAnswer()).toBe(status1.getCard().getAnswer())
  expect(newcards[1].getCard().getAnswer()).toBe(status2.getCard().getAnswer())
})
