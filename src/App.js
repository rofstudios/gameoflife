import React, { useCallback, useRef, useState } from 'react';
import './App.css';
import produce, { produceWithPatches } from 'immer';

let numRows = 25;
let numCols = 25;
let count = 0

let operations = [
  [0, 1],
  [0, -1],
  [1,-1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

let generateEmptyGrid = () => {
  let rows = [];
  count = 0

  for (let i = 0; i < numRows; i++){
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

function App() {
  let [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  });

  let [running, setRunning] = useState(false);


  let runningRef = useRef(running);
  runningRef.current = running

  // keeps the function unchaged, so it doesn't re-render every time
  let runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++){
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              let newI = i + x;
              let newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }

          }
        }
      });
    });
    count += 1
    setTimeout(runSimulation, 1000)
  }, [])

  console.log(grid)
  return (
    <>
    <h1>Game of Life</h1>
    <section className="main">
      <div 
        style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 30px)`
      }}>
        {grid.map((rows, i) => 
          rows.map((col, j) => 
            <div
            onClick={() => {
              let newGrid = produce(grid, gridCopy => {
                gridCopy[i][j] = grid[i][j] ? 0 : 1;
              })
              setGrid(newGrid)
            }}
            key={`${i} - ${j}`}
            style={{
            width: 30, 
            height: 25, 
            backgroundColor: grid[i][j] ? 'blueviolet' : undefined,
            border: 'solid 1px black'
            }}/>
        ))}
      </div>
      <div className="game">
        <div className="rules">
          Rules Placeholder
        </div>
        
        <div className="controls">
          <button
          onClick={() => {
            setRunning(!running)
            if (!running) {
              runningRef.current = true
              runSimulation()}}
            }
          style={{width: 100, margin: 10}}>{running ? 'Stop' : "Start"}</button>
          <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
          style={{width: 100, margin: 10}}>Clear</button>
          <button style={{width: 100, margin: 10}}>Pause</button>
          <button 
          onClick={() => {
            let rows = [];
            count = 0

            for (let i = 0; i < numRows; i++){
              rows.push(Array.from(Array(numCols), () => Math.random() > .5 ? 1 : 0))
            }
            return setGrid(rows)
          }}
          style={{width: 100, margin: 10}}>Random</button>
          <h3>Generations: {count}</h3>
        </div>
      </div>
    </section>
    </>
  );
}

export default App;
