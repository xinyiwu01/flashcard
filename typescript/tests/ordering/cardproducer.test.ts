import { newCardDeck, CardDeck } from '../../src/ordering/cardproducer'
import { FlashCard, newFlashCard } from '../../src/cards/flashcard'
import { newCardShuffler } from '../../src/ordering/prioritization/cardshuffler'
import { newMostMistakesFirstSorter } from '../../src/ordering/prioritization/mostmistakes'
import { newRepeatingCardOrganizer } from '../../src/ordering/repetition/cardrepeater'

test('test countCards: returns card number', () => {
  const card1 = newFlashCard('q1', 'a1')
  const card2 = newFlashCard('q2', 'a2')
  const card3 = newFlashCard('q3', 'a3')
  const cards: FlashCard[] = [card1, card2, card3]
  const cardDeck: CardDeck = newCardDeck(cards, newCardShuffler())
  expect(cardDeck.countCards()).toBe(3)
})

test('test countCards: returns 0 if there is no card', () => {
  const cards: FlashCard[] = []
  const cardDeck: CardDeck = newCardDeck(cards, newCardShuffler())
  expect(cardDeck.countCards()).toBe(0)
})

test('test isComplete: returns false if not complete', () => {
  const card1 = newFlashCard('q1', 'a1')
  const card2 = newFlashCard('q2', 'a2')
  const card3 = newFlashCard('q3', 'a3')
  const cards: FlashCard[] = [card1, card2, card3]
  const cardDeck: CardDeck = newCardDeck(cards, newCardShuffler())
  expect(cardDeck.isComplete()).toBeFalsy()
})

test('test isComplete: returns true for if there is no card in CardDeck', () => {
  const cards: FlashCard[] = []
  const cardDeck: CardDeck = newCardDeck(cards, newCardShuffler())
  expect(cardDeck.isComplete()).toBeTruthy()
})

test('test reorganize: reorganize status based on the given organizer', () => {
  const card1 = newFlashCard('q1', 'a1')
  const card2 = newFlashCard('q2', 'a2')
  const card3 = newFlashCard('q3', 'a3')
  const cards: FlashCard[] = [card1, card2, card3]
  const cardDeck: CardDeck = newCardDeck(cards, newMostMistakesFirstSorter())
  cardDeck.getCards()[0].recordResult(true)
  cardDeck.getCards()[1].recordResult(false)
  cardDeck.getCards()[2].recordResult(false)
  cardDeck.getCards()[2].recordResult(false)
  cardDeck.reorganize()
  expect(cardDeck.getCards()[0].getCard().getQuestion()).toBe(card3.getQuestion())
  expect(cardDeck.getCards()[1].getCard().getQuestion()).toBe(card2.getQuestion())
  expect(cardDeck.getCards()[2].getCard().getQuestion()).toBe(card1.getQuestion())
})

// invalid input
test('test reorganize: no flashcard', () => {
  const cards: FlashCard[] = []
  const cardDeck: CardDeck = newCardDeck(cards, newRepeatingCardOrganizer(1))
  cardDeck.reorganize()
  expect(cardDeck.getCards().length).toBe(0)
})
