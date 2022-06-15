import { strict as assert } from 'assert'
import { CardStatus } from '../../cards/cardstatus'
import { CardOrganizer } from '../cardorganizer'

function newCardRepeater (isComplete: (card: CardStatus) => boolean): CardOrganizer {
  function isNotComplete (card: CardStatus): boolean { return !isComplete(card) }
  return {
    reorganize: function (cards: CardStatus[]): CardStatus[] {
      return cards.filter(isNotComplete)
    }

  }
}

/**
 * Returns every {@link FlashCard} exactly once, regardless of the correctness of the response.
 */
function newNonRepeatingCardOrganizer (): CardOrganizer {
  /**
     * Checks if the provided card has not yet been answered, correctly or otherwise.
     *
     * @param card The {@link CardStatus} object to check.
     * @return {@code true} if this card has received one or more answers.
     */
  function anyAnswer (card: CardStatus): boolean {
    return card.getResults().length > 0
  }

  return newCardRepeater(anyAnswer)
}

function newRepeatingCardOrganizer (repetitions: number): CardOrganizer {
  assert(repetitions >= 1)
  /**
     * Checks if the provided card has been answered correctly the required number of times.
     *
     * @param card The {@link CardStatus} object to check.
     * @return {@code true} if this card has been answered correctly at least {@code this.repetitions} times.
     */
  function hasSufficientSuccess (card: CardStatus): boolean {
    return card.getResults().filter((c) => c).length >= repetitions
  }
  return newCardRepeater(hasSufficientSuccess)
}

export { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer }
