'use client'

import { useState, useEffect } from "react";

type Cell = { 
  row: number,
  col: number,
  isAlive: boolean
}

type Row = Cell[]
type Grid = Cell[][]

export default function Home() {
  //Grid 20x20
  const gridRows = 42
  const gridCols = 90
  const [grid, setGrid] = useState<Grid>([[]]) 
  const [isPlaying, setIsPlaying] = useState<boolean>(false) 

  const generateRow = (cols: number, row: number) => {
    const currentRow: Row = []
    for(let i = 0; i < cols; i++) {
      currentRow.push({ row: row, col: i, isAlive: false })
    }
    return currentRow
  } 

  useEffect(() => {
    const newGrid = generateGrid(gridRows, gridCols)
    setGrid(newGrid)
  }, [])

  const generateGrid = (rows: number, cols: number): Grid => {
    const grid: Grid = []
    for(let i = 0; i < cols; i++) {
      const row = generateRow(rows, i)
      grid.push(row)
    }
    console.log(grid)
    return grid
  }

  const handleLife = (row: Cell['row'], col: Cell['col'], isAlive: Cell['isAlive']) => {
    setGrid((prevGrid) => {
      if (prevGrid && prevGrid[row] && prevGrid[row][col]) {
        const newGrid = [...prevGrid];
        newGrid[row][col] = { ...prevGrid[row][col], isAlive: !isAlive };
        return newGrid;
      }
      return prevGrid;
    });
  }

  // si 2 o 3 permanece viva
  // +3 o -2 muere
  // muerta con +3 revive

  const liveGame = (row: Cell['row'], col: Cell['col'], alive: Cell['isAlive']) => {
    let alivedNeighbor = 0

    for (let i = Math.max(0, row - 1); i <= Math.min(gridCols - 1, row + 1); i++) {
      for (let j = Math.max(0, col - 1); j <= Math.min(gridRows - 1, col + 1); j++) {
        if (!(i === row && j === col)) {
          alivedNeighbor += grid[i][j].isAlive ? 1 : 0;
        }
      }
    }

    if(alive) {
      return alivedNeighbor >= 2 && alivedNeighbor <= 3
    } else {
      return alivedNeighbor === 3
    }
  }

  useEffect(() => {
    let time: NodeJS.Timeout;
  
    const updateGridCallback = () => {
      console.time('loop')
      setGrid((prevGrid) => {
        const newGrid: Grid = prevGrid.map(row => row.map(box => ({ ...box })));
        for (let i = 0; i < gridCols; i++) {
          for (let j = 0; j < gridRows; j++) {
            newGrid[i][j].isAlive = liveGame(i, j, prevGrid[i][j].isAlive);
          }
        }
        return newGrid;
      });
      console.timeEnd('loop')
    };
  
    if (isPlaying) {
      time = setInterval(updateGridCallback, 50);
    }
  
    return () => {
      clearInterval(time);
    };
  }, [isPlaying, grid, gridCols]);
    

  return (
    <main className="flex h-screen flex-col items-center w-full bg-stone-900">
      <header className="flex gap-4 items-center bg-slate-300 text-black h-16 w-screen justify-center">
        <h1>Game of life</h1>
        <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Stop' : 'Start'}</button>
      </header>
      { grid.length > 1 
      ?<div className="flex px-12 my-auto">
          {grid?.map(e => 
            <div className="flex flex-col ">
              {
                e.map(x =>   
                  <div 
                  key={`${x.row}-${x.col}`}
                  {...{ "data-isalive": x.isAlive}}
                  onClick={() => handleLife(x.row, x.col, x.isAlive)}
                  className={`w-5 h-5 hover:bg-stone-300 border border-black cursor-pointer ${x.isAlive ? 'bg-stone-300' : 'bg-gray-600'}`}
                  >
                  </div>
                )
              }
            </div>
          )}
        </div>
      : <div>Loading...</div> 
      }
    </main>
  );
}
