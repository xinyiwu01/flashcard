import { CardStatus } from '../../cards/cardstatus'
import { CardOrganizer } from '../cardorganizer'

function newRecentMistakesFirstSorter (): CardOrganizer {
  return {
    /**
         * Orders the cards by the correctness of the last round.
         *
         * @param cards The {@link CardStatus} objects to order.
         * @return The ordered cards.
         */
    reorganize: function (cards: CardStatus[]): CardStatus[] {
      const cardsList: CardStatus[] = []
      for (var card of cards) { // of: element; in: index
        const successes: boolean[] = card.getResults()
        if (!successes[successes.length - 1]) {
          cardsList.push(card)
        }
      }
      for (card of cards) {
        const successes: boolean[] = card.getResults()
        if (successes[successes.length - 1]) {
          cardsList.push(card)
        }
      }
      return cardsList
    }

  }
}

export { newRecentMistakesFirstSorter }
