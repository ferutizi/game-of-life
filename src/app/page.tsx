'use client'

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
  const columns = 20
  const [grid, setGrid] = useState<Grid>([[{row: 1, col: 1, isAlive: false}]]) 
  const [isPlaying, setIsPlaying] = useState<boolean>(false) 

  const generateRow = (cols: number, row: number) => {
    const currentRow: Row = []
    for(let i = 0; i < cols; i++) {
/*       const isAlive = grid ? (grid[row][i]?.isAlive || false) : false; */
      currentRow.push({row: row, col: i, isAlive: false /* isAlive */})
    }
    return currentRow
  } 

  useEffect(() => {
    const newGrid = generateGrid(columns)
    setGrid(newGrid)
  }, [])

  const generateGrid = (rows: number): Grid => {
    const grid: Grid = []
    for(let i = 0; i < rows; i++) {
      const row = generateRow(rows, i)
      grid.push(row)
    }
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
    let alivedNightmares = 0
    if(row > 0) {
      grid[row-1][col].isAlive && alivedNightmares++
      if(col > 0) grid[row-1][col-1].isAlive && alivedNightmares++
      if(col < columns - 1) grid[row-1][col+1].isAlive && alivedNightmares++
    }

    if(col > 0) grid[row][col-1].isAlive && alivedNightmares++
    if(col < columns - 1) grid[row][col+1].isAlive && alivedNightmares++

    if(row < columns - 1) {
      grid[row+1][col].isAlive && alivedNightmares++
      if(col > 0) grid[row+1][col-1].isAlive && alivedNightmares++
      if(col < columns - 1) grid[row+1][col+1].isAlive && alivedNightmares++
    }

    if(alive) {
      console.log(alivedNightmares >= 2 && alivedNightmares <= 3)
      return alivedNightmares >= 2 && alivedNightmares <= 3
    } else {
      return alivedNightmares >= 3
    }
  }

  useEffect(() => {
    let time: NodeJS.Timeout;
  
    const updateGridCallback = () => {
      setGrid((prevGrid) => {
        const newGrid: Grid = prevGrid.map(row => row.map(box => ({ ...box })));
        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < columns; j++) {
            newGrid[i][j].isAlive = liveGame(i, j, prevGrid[i][j].isAlive);
          }
        }
        return newGrid;
      });
    };
  
    if (isPlaying) {
      time = setInterval(updateGridCallback, 250);
    }
  
    return () => {
      clearInterval(time);
    };
  }, [isPlaying, grid, columns]);
    

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Game of life</h1>
      <div className="flex flex-wrap">
        {grid?.map(e => 
          <div>
            {
              e.map(x =>   
                <div 
                key={`${x.row}-${x.col}`}
                {...{ "data-isalive": x.isAlive}}
                onClick={() => handleLife(x.row, x.col, x.isAlive)}
                className={`w-4 h-4 border hover:bg-slate-400 border-black cursor-pointer ${x.isAlive ? 'bg-slate-900' : 'bg-slate-200'}`}
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
