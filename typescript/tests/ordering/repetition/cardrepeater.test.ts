import { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer } from '../../../src/ordering/repetition/cardrepeater'
import { CardStatus, newCardStatus } from '../../../src/cards/cardstatus'
import { CardOrganizer } from '../../../src/ordering/cardorganizer'
import { newFlashCard } from '../../../src/cards/flashcard'

test('test newNonRepeatingCardOrganizer: repeat 0 times', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))
  const repeater: CardOrganizer = newNonRepeatingCardOrganizer()
  const cards: CardStatus[] = [card1, card2, card3]
  const newcards = repeater.reorganize(cards)
  expect(newcards.length).toBe(3)
  expect(newcards[0].getCard().getQuestion()).toBe(card1.getCard().getQuestion())
  expect(newcards[1].getCard().getQuestion()).toBe(card2.getCard().getQuestion())
  expect(newcards[2].getCard().getQuestion()).toBe(card3.getCard().getQuestion())
})

test('test newNonRepeatingCardOrganizer: repeat once with correct answers', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))
  card1.recordResult(true)
  card2.recordResult(true)
  card3.recordResult(true)
  const repeater: CardOrganizer = newNonRepeatingCardOrganizer()
  const cards: CardStatus[] = [card1, card2, card3]
  const newcards = repeater.reorganize(cards)
  expect(newcards.length).toBe(0)
})

test('test newNonRepeatingCardOrganizer: repeat once with wrong answers', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))
  card1.recordResult(false)
  card2.recordResult(true)
  card3.recordResult(false)
  const repeater: CardOrganizer = newNonRepeatingCardOrganizer()
  const cards: CardStatus[] = [card1, card2, card3]
  const newcards = repeater.reorganize(cards)
  expect(newcards.length).toBe(0)
})

test('test newRepeatingCardOrganizer: without initial record', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))
  const repeater: CardOrganizer = newRepeatingCardOrganizer(1)
  const cards: CardStatus[] = [card1, card2, card3]
  const newcards = repeater.reorganize(cards)
  expect(newcards.length).toBe(3)
  expect(newcards[0].getCard().getQuestion()).toBe(card1.getCard().getQuestion())
  expect(newcards[1].getCard().getQuestion()).toBe(card2.getCard().getQuestion())
  expect(newcards[2].getCard().getQuestion()).toBe(card3.getCard().getQuestion())
})

test('test newRepeatingCardOrganizer: repeat once with correct answers', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))
  card1.recordResult(true)
  card2.recordResult(true)
  card3.recordResult(true)
  const repeater: CardOrganizer = newRepeatingCardOrganizer(1)
  const cards: CardStatus[] = [card1, card2, card3]
  const newcards = repeater.reorganize(cards)
  expect(newcards.length).toBe(0)
})

test('test newRepeatingCardOrganizer: repeat once with wrong answers', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))
  card1.recordResult(false)
  card2.recordResult(false)
  card3.recordResult(false)
  const repeater: CardOrganizer = newRepeatingCardOrganizer(1)
  const cards: CardStatus[] = [card1, card2, card3]
  const newcards = repeater.reorganize(cards)

  expect(newcards.length).toBe(3)
})

test('test newRepeatingCardOrganizer: repeat once with both correct and wrong answers', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))
  card1.recordResult(false)
  card2.recordResult(true)
  card3.recordResult(false)
  const repeater: CardOrganizer = newRepeatingCardOrganizer(1)
  const cards: CardStatus[] = [card1, card2, card3]
  const newcards = repeater.reorganize(cards)

  expect(newcards.length).toBe(2)
  expect(newcards[0].getCard().getQuestion()).toBe(card1.getCard().getQuestion())
  expect(newcards[1].getCard().getQuestion()).toBe(card3.getCard().getQuestion())
})

test('test newRepeatingCardOrganizer: repeat twice with both correct and wrong answers', () => {
  const card1 = newCardStatus(newFlashCard('q1', 'a1'))
  const card2 = newCardStatus(newFlashCard('q2', 'a2'))
  const card3 = newCardStatus(newFlashCard('q3', 'a3'))
  card1.recordResult(true)
  card2.recordResult(true)
  card3.recordResult(false)
  const repeater: CardOrganizer = newRepeatingCardOrganizer(2)
  const cards: CardStatus[] = [card1, card2, card3]
  let newcards = repeater.reorganize(cards)

  expect(newcards.length).toBe(3)

  card1.recordResult(true)
  card2.recordResult(true)
  card3.recordResult(true)
  newcards = repeater.reorganize(cards)
  expect(newcards.length).toBe(1)
  expect(newcards[0].getCard().getAnswer()).toBe(card3.getCard().getAnswer())

  card3.recordResult(true)
  newcards = repeater.reorganize(cards)
  expect(newcards.length).toBe(0)
})
