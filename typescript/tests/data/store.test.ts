import { FlashCard, newFlashCard } from '../../src/cards/flashcard'
import { newInMemoryCardStore, CardStore } from '../../src/data/store'

let flashcards: FlashCard[]
let cardstore: CardStore

beforeEach(() => {
  flashcards = [newFlashCard('english', 'pinyin'), newFlashCard('card', 'ka'), newFlashCard('test', 'yanzheng')]
  cardstore = newInMemoryCardStore(flashcards)
})

test('test addCard: adding a different card should return true', () => {
  const newcard: FlashCard = newFlashCard('new', 'xin')
  // result should true
  expect(cardstore.addCard(newcard)).toBeTruthy()

  cardstore.addCard(newcard)
  const cards = cardstore.getAllCards()
  // add the new card
  expect(cards[cards.length - 1].getQuestion()).toBe('new')
  expect(cards[cards.length - 1].getAnswer()).toBe('xin')
})

test('test addCard: adding an identical card should return flase', () => {
  const samecard: FlashCard = newFlashCard('card', 'ka')
  // result should be false
  expect(cardstore.addCard(samecard)).toBeFalsy()

  const size: number = cardstore.getAllCards().length
  cardstore.addCard(samecard)
  // doesn't add the new card
  expect(cardstore.getAllCards().length === size).toBeTruthy()
})

test('test removeCard: removing an existing card should return true', () => {
  const newcard: FlashCard = newFlashCard('card', 'ka')
  // result should be true
  expect(cardstore.removeCard(newcard)).toBeTruthy()

  const size: number = cardstore.getAllCards().length
  cardstore.removeCard(newcard)
  expect(cardstore.getAllCards().length === size - 1).toBeTruthy()
})

test("test removeCard: removes a card which isn't present and returns false", () => {
  const newcard: FlashCard = newFlashCard('box', 'hezi')
  // result should be false
  expect(cardstore.removeCard(newcard)).toBeFalsy()

  const size: number = cardstore.getAllCards().length
  cardstore.removeCard(newcard)
  expect(cardstore.getAllCards().length === size).toBeTruthy()
})

test('test invertCards: flips all cards', () => {
  const original: CardStore = cardstore
  const newstore = cardstore.invertCards()
  for (var i = 0; i < original.getAllCards().length; i++) {
    const question1 = original.getAllCards()[i].getQuestion()
    const question2 = newstore.getAllCards()[i].getQuestion()
    const answer1 = original.getAllCards()[i].getAnswer()
    const answer2 = newstore.getAllCards()[i].getAnswer()
    expect(question1).toBe(answer2)
    expect(answer1).toBe(question2)
  }
})
