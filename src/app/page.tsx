'use client'

import { time } from "console";
import { useState, useEffect } from "react";

type Box = { 
  row: number,
  col: number,
  isAlive: boolean
}

type Row = Box[]
type Grid = Box[][]

export default function Home() {
  //Grid 20x20
  const gridRows = 60
  const gridCols = 120
  const [grid, setGrid] = useState<Grid>([[{row: 1, col: 1, isAlive: false}]]) 
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

  const handleLife = (row: Box['row'], col: Box['col'], isAlive: Box['isAlive']) => {
    setGrid((prevGrid) => {
      if (prevGrid && prevGrid[row] && prevGrid[row][col]) {
        const newGrid = [...prevGrid];
        newGrid[row][col] = { ...prevGrid[row][col], isAlive: !isAlive };
        return newGrid;
      }
      return prevGrid;
    });
  }

  //contador
  // si 2 o 3 permanece viva
  // +3 o -2 muere
  // muerta con +3 revive

  const liveGame = (row: Box['row'], col: Box['row'], alive: Box['isAlive']) => {
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
      return alivedNeighbor >= 3
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
      time = setInterval(updateGridCallback, 500);
    }
  
    return () => {
      clearInterval(time);
    };
  }, [isPlaying, grid, gridCols]);
    

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Game of life</h1>
      <div className="flex gap-1">
        {grid?.map(e => 
          <div className="flex flex-col gap-1">
            {
              e.map(x =>   
                <div 
                key={`${x.row}-${x.col}`}
                {...{ "data-isalive": x.isAlive}}
                onClick={() => handleLife(x.row, x.col, x.isAlive)}
                className={`w-5 h-5 borde hover:bg-slate-500 border-black cursor-pointer ${x.isAlive ? 'bg-slate-900' : 'bg-slate-300'}`}
                >
                </div>
              )
            }
          </div>
        )}
      </div>
        <button onClick={() => setIsPlaying(!isPlaying)}>Start</button>
    </main>
  );
}
