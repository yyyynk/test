import words from "./wordList.json"
import {useCallback, useEffect, useState} from "react";
import {Keyboard} from "./Keyboard.tsx";
import {HangmanWord} from "./HangmanWord.tsx";
import {HangmanDrawing} from "./HangmanDrawing.tsx";

function getWord(){
    return words[Math.floor(Math.random() * words.length)]
}
function App() {
    const [wordToGuess, setWordToGuess] = useState(getWord)

    const [guessedLetters, setGuessedLetters] = useState<string[]>([])

    const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))

    console.log(wordToGuess);

    const isLoser = incorrectLetters.length >= 6
    const isWinner = wordToGuess
        .split("")
        .every((letter) => guessedLetters.includes(letter))

    const addGuessedLetter = useCallback((letter: string) => {
        if (guessedLetters.includes(letter) || isWinner || isLoser) return
        setGuessedLetters((currentLetters) => [...currentLetters, letter])
    }, [guessedLetters, isWinner, isLoser])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key;
            if (!key.match(/^[a-z]$/)) return
            e.preventDefault();
            addGuessedLetter(key);
        }
        document.addEventListener("keypress", handler)

        return () => {
            document.removeEventListener("keypress", handler)
        }
    }, [guessedLetters])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key;
            if (key !== "Enter") return
            e.preventDefault();
            setGuessedLetters([])
            setWordToGuess(getWord());
        }
        document.addEventListener("keypress", handler)

        return () => {
            document.removeEventListener("keypress", handler)
        }
    }, [])

    return (<div style={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            margin: "0 auto",
            alignItems: "center"
        }}>
            <div style={{fontSize: "2rem", textAlign: "center"}}>
                {isWinner && 'Winner! Refresh to try again'}
                {isLoser && 'Nice try! Refresh to try again'}
            </div>
            <HangmanDrawing numberOfGuesses={incorrectLetters.length}/>
            <HangmanWord guessedLetters={guessedLetters} wordToGuess={wordToGuess} reveal={isLoser}/>
            <div style={{alignSelf: "stretch"}}>
                <Keyboard
                    activeLetters={guessedLetters.filter((letter) => wordToGuess.includes(letter))}
                    inactiveLetters={incorrectLetters}
                    addGuessedLetter={addGuessedLetter}
                    disabled={isLoser || isWinner}
                />
            </div>
        </div>
    )
}

export default App
