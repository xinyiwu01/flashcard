import { CardStatus, newCardStatus } from '../../src/cards/cardstatus'
import { newFlashCard } from '../../src/cards/flashcard'
import { CardOrganizer, newCombinedCardOrganizer } from '../../src/ordering/cardorganizer'
import { newMostMistakesFirstSorter } from '../../src/ordering/prioritization/mostmistakes'
import { newRepeatingCardOrganizer } from '../../src/ordering/repetition/cardrepeater'

// only test most mistake first order & repeating
test('test cardorganizer: most mistake first order & repeating once', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))

  card1.recordResult(false)
  card2.recordResult(false)
  card3.recordResult(false)
  card3.recordResult(false)
  const cards: CardStatus[] = [card1, card2, card3]

  const prioritization: CardOrganizer = newMostMistakesFirstSorter()
  const repeater: CardOrganizer = newRepeatingCardOrganizer(1)
  const organizers: CardOrganizer[] = [prioritization, repeater]
  const combinedOrganizer: CardOrganizer = newCombinedCardOrganizer(organizers)
  const newcards = combinedOrganizer.reorganize(cards)

  expect(newcards[0].getCard().getAnswer()).toBe(card3.getCard().getAnswer())
  expect(newcards[1].getCard().getAnswer()).toBe(card1.getCard().getAnswer())
  expect(newcards[2].getCard().getAnswer()).toBe(card2.getCard().getAnswer())
})

test('test cardorganizer: exchange the order of repeater and prioritization', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))

  card1.recordResult(false)
  card2.recordResult(false)
  card3.recordResult(false)
  card3.recordResult(false)
  const cards: CardStatus[] = [card1, card2, card3]

  const prioritization: CardOrganizer = newMostMistakesFirstSorter()
  const repeater: CardOrganizer = newRepeatingCardOrganizer(1)
  const organizers: CardOrganizer[] = [repeater, prioritization]
  const combinedOrganizer: CardOrganizer = newCombinedCardOrganizer(organizers)
  const newcards = combinedOrganizer.reorganize(cards)

  expect(newcards[0].getCard().getAnswer()).toBe(card3.getCard().getAnswer())
  expect(newcards[1].getCard().getAnswer()).toBe(card1.getCard().getAnswer())
  expect(newcards[2].getCard().getAnswer()).toBe(card2.getCard().getAnswer())
})

test('test cardorganizer: repeating twice & without initial records', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))

  const cards: CardStatus[] = [card1, card2, card3]

  const prioritization: CardOrganizer = newMostMistakesFirstSorter()
  const repeater: CardOrganizer = newRepeatingCardOrganizer(2)
  const organizers: CardOrganizer[] = [repeater, prioritization]
  const combinedOrganizer: CardOrganizer = newCombinedCardOrganizer(organizers)
  const newcards = combinedOrganizer.reorganize(cards)

  expect(newcards[0].getCard().getAnswer()).toBe(card1.getCard().getAnswer())
  expect(newcards[1].getCard().getAnswer()).toBe(card2.getCard().getAnswer())
  expect(newcards[2].getCard().getAnswer()).toBe(card3.getCard().getAnswer())
})

test('test cardorganizer: repeating twice & answers incorrectly', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))

  const cards: CardStatus[] = [card1, card2, card3]
  card1.recordResult(true)
  card2.recordResult(true)
  card3.recordResult(true)

  const prioritization: CardOrganizer = newMostMistakesFirstSorter()
  const repeater: CardOrganizer = newRepeatingCardOrganizer(2)
  const organizers: CardOrganizer[] = [repeater, prioritization]
  const combinedOrganizer: CardOrganizer = newCombinedCardOrganizer(organizers)
  let newcards = combinedOrganizer.reorganize(cards)

  expect(newcards.length).toBe(3)

  card1.recordResult(false)
  card2.recordResult(false)
  card3.recordResult(false)
  newcards = combinedOrganizer.reorganize(cards)

  expect(newcards.length).toBe(3)
  expect(newcards[0].getCard().getAnswer()).toBe(card1.getCard().getAnswer())
  expect(newcards[1].getCard().getAnswer()).toBe(card2.getCard().getAnswer())
  expect(newcards[2].getCard().getAnswer()).toBe(card3.getCard().getAnswer())
})

test('test cardorganizer: repeating twice & answers correctly', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))

  const cards: CardStatus[] = [card1, card2, card3]
  card1.recordResult(true)
  card2.recordResult(true)
  card3.recordResult(true)

  const prioritization: CardOrganizer = newMostMistakesFirstSorter()
  const repeater: CardOrganizer = newRepeatingCardOrganizer(2)
  const organizers: CardOrganizer[] = [repeater, prioritization]
  const combinedOrganizer: CardOrganizer = newCombinedCardOrganizer(organizers)
  let newcards = combinedOrganizer.reorganize(cards)

  expect(newcards.length).toBe(3)

  card1.recordResult(true)
  card2.recordResult(true)
  card3.recordResult(true)
  newcards = combinedOrganizer.reorganize(cards)
  expect(newcards.length).toBe(0)
})

test('test cardorganizer: repeating twice & without initial record & finish answering all cards', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))

  const cards: CardStatus[] = [card1, card2, card3]
  const prioritization: CardOrganizer = newMostMistakesFirstSorter()
  const repeater: CardOrganizer = newRepeatingCardOrganizer(2)
  const organizers: CardOrganizer[] = [repeater, prioritization]
  const combinedOrganizer: CardOrganizer = newCombinedCardOrganizer(organizers)
  let newcards = combinedOrganizer.reorganize(cards)

  expect(newcards.length).toBe(3)
  expect(newcards[0].getCard().getQuestion()).toBe(card1.getCard().getQuestion())
  expect(newcards[1].getCard().getQuestion()).toBe(card2.getCard().getQuestion())
  expect(newcards[2].getCard().getQuestion()).toBe(card3.getCard().getQuestion())

  card1.recordResult(true)
  card2.recordResult(false)
  card3.recordResult(true)
  newcards = combinedOrganizer.reorganize(cards)
  expect(newcards.length).toBe(3)
  expect(newcards[0].getCard().getQuestion()).toBe(card2.getCard().getQuestion())
  expect(newcards[1].getCard().getQuestion()).toBe(card1.getCard().getQuestion())
  expect(newcards[2].getCard().getQuestion()).toBe(card3.getCard().getQuestion())

  card1.recordResult(true)
  card2.recordResult(true)
  card3.recordResult(true)
  newcards = combinedOrganizer.reorganize(cards)
  expect(newcards.length).toBe(1)
  expect(newcards[0].getCard().getQuestion()).toBe(card2.getCard().getQuestion())

  card2.recordResult(true)
  newcards = combinedOrganizer.reorganize(cards)
  expect(newcards.length).toBe(0)
})

// test invalid input
test('test cardorganizer: no cardorganizer', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))

  card1.recordResult(false)
  card2.recordResult(false)
  card3.recordResult(false)
  card3.recordResult(false)
  const cards: CardStatus[] = [card1, card2, card3]

  const organizers: CardOrganizer[] = []
  const combinedOrganizer: CardOrganizer = newCombinedCardOrganizer(organizers)
  const newcards = combinedOrganizer.reorganize(cards)

  // no reorganize
  expect(newcards[0].getCard().getAnswer()).toBe(card1.getCard().getAnswer())
  expect(newcards[1].getCard().getAnswer()).toBe(card2.getCard().getAnswer())
  expect(newcards[2].getCard().getAnswer()).toBe(card3.getCard().getAnswer())
})
