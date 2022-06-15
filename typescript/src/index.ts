import { loadCards, newInMemoryCardStore } from './data/store'
import { newCardDeck } from './ordering/cardproducer'
import { newCardShuffler } from './ordering/prioritization/cardshuffler'
import { newUI } from './ui'
import { CardOrganizer, newCombinedCardOrganizer } from './ordering/cardorganizer'
import { newMostMistakesFirstSorter } from './ordering/prioritization/mostmistakes'
import { newRecentMistakesFirstSorter } from './ordering/prioritization/recentmistakes'
import { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer } from './ordering/repetition/cardrepeater'
import { Command } from 'commander'

//* **Definition Stage***
const program = new Command()

program
  .option('-o, --order <order>', 'The type of ordering to use, default "random"\n' +
        '[choices: "random", "worst-first", "recent-mistakes-first"]', 'random')
  .option('-r, --repetitions <repetitions>', 'The number of times to each card should be answered successfully. ' +
        'If not provided, every card is presented once, regardless of the correctness of the answer.')
  .option('-i, --invert', 'If set, it flips answer and question for each card. That is, it' +
        "prompts with the card's answer and asks the user to provide the corresponding question. " +
        'Default: false')
  .option('-f, --file <file>', 'The name of the csv file which contains cards. Default: "designpatterns.csv". ' +
        'The file should in cards folder.')

//* **Parsing Stage***
try {
  program.parse(process.argv)
  //* **Interrogation Stage***
  const options = program.opts()

  // Option: --file
  let filename: string
  if (options.file === undefined) {
    filename = 'cards/designpatterns.csv'
  } else {
    filename = 'cards/' + String(options.file)
  }

  // Option: --invert
  const cards = loadCards(filename).getAllCards()
  let cardStore = newInMemoryCardStore(cards)
  if (options.invert === true) {
    cardStore = cardStore.invertCards()
  }

  // Option: --order & --repetitions
  const cardOrganizers: CardOrganizer[] = []

  if (options.order === 'random') {
    cardOrganizers.push(newCardShuffler())
  } else if (options.order === 'worst-first') {
    cardOrganizers.push(newMostMistakesFirstSorter())
  } else if (options.order === 'recent-mistakes-first') {
    cardOrganizers.push(newRecentMistakesFirstSorter())
  }

  if (options.repetitions === undefined) {
    cardOrganizers.push(newNonRepeatingCardOrganizer())
  } else {
    cardOrganizers.push(newRepeatingCardOrganizer(parseInt(options.repetitions)))
  }

  const cardDeck = newCardDeck(
    cardStore.getAllCards(), newCombinedCardOrganizer(cardOrganizers)
  )
  newUI().studyCards(cardDeck)
} catch (error) {
  console.log('error!')
}
