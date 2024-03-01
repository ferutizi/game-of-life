import { useState, useEffect } from 'react'

type Cell = { 
  row: number,
  col: number,
  isAlive: boolean
}

type Row = Cell[]
type Grid = Cell[][]

export type Speed = 100 | 250 | 500

export default function useGrid() {
  const gridRows = 42
  const gridCols = 90
  const [grid, setGrid] = useState<Grid>([[]]) 
  const [isPlaying, setIsPlaying] = useState<boolean>(false) 
  const [speed, setSpeed] = useState(250)
  
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

  const liveGameRules = (row: Cell['row'], col: Cell['col'], alive: Cell['isAlive']) => {
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
  
  const updateGrid = () => {
    setGrid((prevGrid) => {
      const newGrid: Grid = prevGrid.map(row => row.map(box => ({ ...box })));
      for (let i = 0; i < gridCols; i++) {
        for (let j = 0; j < gridRows; j++) {
          newGrid[i][j].isAlive = liveGameRules(i, j, prevGrid[i][j].isAlive);
        }
      }
      return newGrid;
    });
  }
  
  useEffect(() => {
    let time: NodeJS.Timeout;
    if (isPlaying) {
      time = setInterval(updateGrid, speed);
    }
  
    return () => {
      clearInterval(time);
    };
  }, [isPlaying, grid, gridCols, speed]);
  
  const resetGame = () => {
    setGrid((prevGrid) => {
      const newGrid: Grid = prevGrid.map(row => row.map(box => ({ ...box })));
      newGrid.forEach(e => {
        e.forEach(x => x.isAlive = false)
      })
      return newGrid;
    })
    setIsPlaying(false)
  }

  const pauseGame = () => {
    setIsPlaying(!isPlaying)
  }

  const nextStep = () => {
    updateGrid()
  }

  const changeSpeed = () => {
    setSpeed(prevS => {
      if(prevS === 250) return(500)
      if(prevS === 100) return(250)
      if(prevS === 500) return(100)
      return prevS
    })
  };
  return[grid, isPlaying, pauseGame, resetGame, nextStep, handleLife, changeSpeed, speed] as const
}