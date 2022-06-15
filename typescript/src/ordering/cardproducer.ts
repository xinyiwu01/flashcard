import { FlashCard } from '../cards/flashcard'
import { CardOrganizer } from './cardorganizer'
import { CardStatus, newCardStatus } from '../cards/cardstatus'

interface CardDeck {
  getCards: () => CardStatus[]
  isComplete: () => boolean
  getOrganizer: () => CardOrganizer
  reorganize: () => void
  countCards: () => number
}

function newCardDeck (cards: FlashCard[], cardOrganizer: CardOrganizer): CardDeck {
  let status: CardStatus[] = cards.map(newCardStatus)

  return {

    getCards: function (): CardStatus[] {
      return status.slice()
    },
    getOrganizer: function (): CardOrganizer {
      return cardOrganizer
    },
    reorganize: function () {
      status = cardOrganizer.reorganize(status)
    },
    isComplete: function (): boolean {
      return status.length === 0
    },
    countCards: function () {
      return status.length
    }

  }
}

export { newCardDeck, CardDeck }
