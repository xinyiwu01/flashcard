import { FlashCard, newFlashCard } from '../../src/cards/flashcard'

const flashcard: FlashCard = newFlashCard('testQuestion', 'testAnswer')

test('test checkSuccess: right answer should be true', () => {
  expect(flashcard.checkSuccess('testAnswer')).toBeTruthy()
})

test('test checkSuccess: ignore space', () => {
  expect(flashcard.checkSuccess('  testAnswer  ')).toBeTruthy()
})

test('test checkSuccess: case insensitive', () => {
  expect(flashcard.checkSuccess('TestanSwer')).toBeTruthy()
})

test('test checkSuccess: wrong answer should be false', () => {
  expect(flashcard.checkSuccess('test')).toBeFalsy()
})
