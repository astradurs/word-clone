import React from 'react'

import { sample, range } from '../../utils'
import { checkGuess } from '../../game-helpers'
import { WORDS } from '../../data'
import { NUM_OF_GUESSES_ALLOWED } from '../../constants'

// Pick a random word on every pageload.
const answer = sample(WORDS)
// To make debugging easier, we'll log the solution in the console.
console.info({ answer })

function GuessGrid({ guesses, cols, rows }) {
  console.log({ rows, cols })
  return (
    <div className="guess-results">
      {Array(rows)
        .fill(null)
        .map((_, i) => {
          const guessResult = guesses[i] ?? range(cols)
          return (
            <p key={`guess_${i}`} className="guess">
              {guessResult.map((result, j) => {
                return (
                  <span
                    key={`letter_${j}`}
                    className={`cell ${result?.status ?? ''}`}
                  >
                    {result?.letter ?? ''}
                  </span>
                )
              })}
            </p>
          )
        })}
    </div>
  )
}

function GameEndBanner({ gameWon, gameLost, totalGuesses, answer }) {
  if (gameWon) {
    return <GameWonBanner totalGuesses={totalGuesses} />
  }

  if (gameLost) {
    return <GameLostBanner answer={answer} />
  }

  return null
}

function GameLostBanner({ answer }) {
  return (
    <div className="sad banner">
      <p>
        Sorry, the answer is <strong>{answer}</strong>
      </p>
    </div>
  )
}

function GameWonBanner({ totalGuesses }) {
  return (
    <div className="happy banner">
      <p>
        <strong>Congratulations!</strong> Got it in{' '}
        <strong>{totalGuesses} guesses</strong>
      </p>
    </div>
  )
}

function Game() {
  const [guesses, setGuesses] = React.useState([])
  const rows = 6
  const cols = 5
  const guessResults = guesses.map((guess) => checkGuess(guess, answer))

  const totalGuesses = guesses.length
  const lastGuess = guessResults[totalGuesses - 1]
  const gameWon = lastGuess?.every((letter) => letter.status === 'correct')
  const gameLost = !gameWon && guesses.length === NUM_OF_GUESSES_ALLOWED
  const gameEnd = gameWon || gameLost

  return (
    <>
      <GuessGrid guesses={guessResults} cols={cols} rows={rows} />
      <form
        onSubmit={() => {
          window.event.preventDefault()
          const guess = document.getElementById('guess-input').value
          if (guess.length === 5) {
            console.log(guess, guesses)
            document.getElementById('guess-input').value = ''
            return setGuesses([...guesses, guess])
          }
        }}
        className="guess-input-wrapper"
      >
        <label htmlFor="guess-input">Enter guess:</label>
        <input
          type="text"
          id="guess-input"
          disabled={gameWon || gameLost}
          onChange={() => {
            const guess = document
              .getElementById('guess-input')
              .value.toUpperCase()
            if (guess.length > cols) {
              return (document.getElementById('guess-input').value =
                guess.slice(0, 5))
            }
            return (document.getElementById('guess-input').value = guess)
          }}
        />
      </form>
      {gameEnd ? (
        <GameEndBanner
          gameWon={gameWon}
          gameLost={gameLost}
          totalGuesses={totalGuesses}
          answer={answer}
        />
      ) : null}
    </>
  )
}

export default Game
