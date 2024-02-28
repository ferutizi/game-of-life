'use client'

import { useState, useEffect } from "react";

type Box = { 
  r: number,
  c: number,
  isAlive: boolean
}

type Row = Box[]
type Grid = Box[][]

export default function Home() {
  //Grid 20x20
  const columns = 20
  const [grid, setGrid] = useState<Grid>() 

  const generateRow = (cols: number, row: number) => {
    const currentRow: Row = []
    for(let i = 0; i < cols; i++) {
/*       const isAlive = grid ? (grid[row][i]?.isAlive || false) : false; */
      currentRow.push({r: row, c: i, isAlive: false /* isAlive */})
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
    console.log(grid)
    return grid
  }

  const handleLife = (row: Box['r'], col: Box['c'], isAlive: Box['isAlive']) => {
    setGrid((prevGrid) => {
      if (prevGrid && prevGrid[row] && prevGrid[row][col]) {
        const newGrid = [...prevGrid];
        newGrid[row][col] = { ...prevGrid[row][col], isAlive: !isAlive };
        return newGrid;
      }
      return prevGrid;
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Game of life</h1>
      <div className="flex flex-wrap">
        {grid?.map(e => 
          <div>
            {
              e.map(x =>   
                <div 
                key={`${x.r}-${x.c}`}
                {...{ "data-isalive": x.isAlive}}
                onClick={() => handleLife(x.r, x.c, x.isAlive)}
                className={`w-4 h-4 border hover:bg-slate-400 border-black cursor-pointer ${x.isAlive ? 'bg-slate-900' : 'bg-slate-200'}`}
                >
                </div>
              )
            }
          </div>
        )}
      </div>
      <button onClick={() => generateGrid(20)}>g</button>
    </main>
  );
}
