import { FlashCard, newFlashCard } from '../cards/flashcard'
import fs from 'fs'

interface CardStore {
  /**
     * Retrieves the full set of cards in this store, in no prescribed order.
     *
     * @return all cards stored in this dataset.
     */
  getAllCards: () => FlashCard[]

  /**
     * Adds a card to the dataset. If an identical card is present, returns false and does not add this card.
     *
     * @param card The {@link FlashCard} to add.
     * @return {@code false}, it this card already present in the data store, in which case it has not been added.
     */
  addCard: (card: FlashCard) => boolean

  /**
     * Removes this card from the data store, if it is present.
     *
     * @param card The {@link FlashCard} to remove.
     * @return A boolean, indicating whether this card was present in the data store, in which case it has been removed.
     */
  removeCard: (card: FlashCard) => boolean

  /**
   * Flip back and front of all cards.
   *
   * @returns New card store with all cards flipped
   */
  invertCards: () => CardStore
}

function newInMemoryCardStore (initialCards: FlashCard[]): CardStore {
  const cards: FlashCard[] = initialCards.slice()
  return {
    getAllCards: function (): FlashCard[] { return cards.slice() },
    addCard: function (card: FlashCard): boolean {
      // includes checks element1===element2, for object, must be the same object
      // if (cards.includes(card)) return false
      for (var flashcard of cards) {
        if (flashcard.getQuestion() === card.getQuestion() && flashcard.getAnswer() === card.getAnswer()) {
          return false
        }
      }
      cards.push(card)
      return true
    },
    removeCard: function (card: FlashCard): boolean {
      let idx = -1
      for (var flashcard of cards) {
        if (flashcard.getQuestion() === card.getQuestion() && flashcard.getAnswer() === card.getAnswer()) {
          idx = 1
          break
        }
      }
      if (idx === -1) return false
      idx = cards.indexOf(card)
      cards.splice(idx, 1)
      return true
    },
    invertCards: function (): CardStore {
      const newCards: FlashCard[] = []
      for (const card of cards) {
        newCards.push(newFlashCard(card.getAnswer(), card.getQuestion()))
      }
      return newInMemoryCardStore(newCards)
    }
  }
}

function loadCards (file: string): CardStore {
  const lines: string[] = fs.readFileSync(file).toString().split(/\r?\n/)
  const result: FlashCard[] = []
  for (const line of lines) {
    const idx = line.indexOf('--')
    if (idx > 0) {
      result.push(newFlashCard(
        line.substring(idx + 2),
        line.substring(0, idx)
      ))
    }
  }
  return newInMemoryCardStore(result)
}

export { newInMemoryCardStore, CardStore, loadCards }
