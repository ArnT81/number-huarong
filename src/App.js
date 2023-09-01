import { useEffect, useState, useRef } from "react";


export default function App() {
  const [gameNumbers, setGameNumbers] = useState(Array.from({ length: 16 }, (_, i) => i + 1).sort(() => Math.random() - 0.5));
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [status, setStatus] = useState('Game is unsolved');
  const boardRef = useRef();


  useEffect(() => {
    checkIfGameIsWon()
  }, [gameNumbers]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey)
  }, [selectedNumber, gameNumbers]);


  const checkIfGameIsWon = () => {
    [...gameNumbers].sort((a, b) => a - b).toString() == gameNumbers && setStatus('You won');
  }

  const restartGame = () => {
    const scrambled = [...gameNumbers].sort(() => Math.random() - 0.5);
    setGameNumbers(scrambled);
    handleActiveClass();
  }

  const handleActiveClass = (target) => {
    const bricks = boardRef.current.childNodes;

    bricks.forEach(element => {
      if (!element.classList) return;
      else if (element.textContent === target?.textContent) element.classList.add('active');
      else element.classList.remove('active');
    });
  }

  const handleClick = ({ target }) => {
    setSelectedNumber(parseInt(target.textContent));
    handleActiveClass(target)
  }

  const swapIndex = (arr, index1, index2) => {
    let copy = [...arr];
    let temp = copy[index1];

    copy[index1] = copy[index2];
    copy[index2] = temp;

    return copy;
  }

  const handleKey = ({ key }) => {
    const arrowkeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key);
    if (!arrowkeys) return;

    const indexOfChosenNr = gameNumbers.indexOf(selectedNumber);
    const indexOfSixteen = gameNumbers.indexOf(16);
    let newArray;

    switch (key) {
      case 'ArrowLeft':
        if (indexOfChosenNr !== indexOfSixteen + 1) return;
        newArray = swapIndex(gameNumbers, indexOfChosenNr, indexOfSixteen);
        break;
      case 'ArrowRight':
        if (indexOfChosenNr !== indexOfSixteen - 1) return;
        newArray = swapIndex(gameNumbers, indexOfChosenNr, indexOfSixteen);
        break;
      case 'ArrowUp':
        if (indexOfChosenNr !== indexOfSixteen + 4) return;
        newArray = swapIndex(gameNumbers, indexOfChosenNr, indexOfSixteen);
        break;
      case 'ArrowDown':
        if (indexOfChosenNr !== indexOfSixteen - 4) return;
        newArray = swapIndex(gameNumbers, indexOfChosenNr, indexOfSixteen);
        break;
      default:
        break;
    };
    setGameNumbers(newArray);
  }


  return (
    <div className="app">
      <h1>Order numbers with the arrow-keys to win the game</h1>
      <div
        id="board"
        ref={boardRef}
      >
        {gameNumbers?.map(gameNumber => (
          <div
            key={gameNumber}
            className={`brick noselect ${gameNumber === 16 ? 'noshow' : 'clickable'}  `}
            onClick={handleClick}
          >
            <p>{gameNumber}</p>
          </div>
        ))}
      </div>
      <button onClick={restartGame}>New Game</button>
      <p>{status}</p>
    </div>
  );
}