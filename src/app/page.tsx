'use client'

import { useState } from "react";
import useGrid from "./hooks/useGrid";

export type Colors = 'bg-stone-300' | 'bg-gray-800' | 'bg-stone-600' | 'bg-red-600' | 'bg-orange-600' |
'bg-amber-600' | 'bg-lime-600' | 'bg-lime-950' | 'bg-emerald-600' | 'bg-emerald-950' |
'bg-cyan-600' | 'bg-cyan-950' | 'bg-blue-600' | 'bg-blue-950' | 'bg-indigo-700' |
'bg-violet-600' | 'bg-purple-950' | 'bg-fuchsia-600' |'bg-pink-600' | 'bg-pink-950'

export default function Home() {
  const [cellColor, setCellColor] = useState(['bg-stone-300', 'hover:bg-stone-300'])
  const [showColors, setShowColors] = useState(false)
  const [grid, isPlaying, pauseGame, resetGame, nextStep, handleLife, changeSpeed, speed] = useGrid()

  const speedText: Record<number, string> = {
    500: 'Slow',
    250: 'Normal',
    100: 'Fast',
  }

  const colors = [
    ['bg-stone-300', 'hover:bg-stone-300'],
    ['bg-gray-800', 'hover:bg-gray-800'],
    ['bg-stone-600', 'hover:bg-stone-600'],
    ['bg-red-600', 'hover:bg-red-600'],
    ['bg-orange-600', 'hover:bg-orange-600'],
    ['bg-amber-600', 'hover:bg-amber-600'],
    ['bg-lime-600', 'hover:bg-lime-600'],
    ['bg-lime-950', 'hover:bg-lime-950'],
    ['bg-emerald-600', 'hover:bg-emerald-600'],
    ['bg-emerald-950', 'hover:bg-emerald-950'],
    ['bg-cyan-600', 'hover:bg-cyan-600'],
    ['bg-cyan-950', 'hover:bg-cyan-950'],
    ['bg-blue-600', 'hover:bg-blue-600'],
    ['bg-blue-950', 'hover:bg-blue-950'],
    ['bg-indigo-700', 'hover:bg-indigo-700'],
    ['bg-violet-600', 'hover:bg-violet-600'],
    ['bg-purple-950', 'hover:bg-purple-950'],
    ['bg-fuchsia-600', 'hover:bg-fuchsia-600'],
    ['bg-pink-600', 'hover:bg-pink-600'],
    ['bg-pink-950', 'hover:bg-pink-950']
  ]

  const btnStyle = 'border border-slate-400 rounded-lg px-4 py-1 shadow hover:bg-slate-400 active:shadow-none font-semibold'
    
  return (
    <main className="flex h-screen flex-col items-center w-full bg-stone-900">
      <header className="flex items-center bg-slate-300 text-black h-16 w-screen justify-between px-52">
        <h1 className="text-2xl font-semibold">Game of Life</h1>
        <div className="flex gap-6">
          <button className={btnStyle} onClick={() => pauseGame()}>{isPlaying ? 'Stop' : 'Start'}</button>
          <button className={btnStyle} onClick={() => resetGame()}>Reset</button>
          <button className={btnStyle} onClick={() => nextStep()}>Next</button>
        </div>
        <div className="flex gap-8">
          <div className="flex gap-4 items-center">
            <p>Speed:</p>
            <button className={`${btnStyle} min-w-24`} onClick={() => changeSpeed()}>{speedText[speed]}</button>
          </div>
          <div className="flex gap-4 items-center">
            <p>Cell Color:</p>
            <button
              className={`${btnStyle} ${cellColor[0]} h-8 w-14`}
              onClick={() => setShowColors(!showColors)}
            ></button>
            { showColors &&
              <div className="grid grid-cols-5 gap-2 absolute top-20 bg-slate-300 p-4 rounded-md shadow-xl">
                {colors.map((e, i) => 
                  <div
                    key={i}
                    className={`h-8 w-12 rounded-md cursor-pointer border border-stone-900 hover:scale-125 hover:shadow-lg ${e[0]}`}
                    onClick={() => {setCellColor(e), setShowColors(false), console.log(cellColor)}}
                  ></div>
                )}
              </div>
            }
          </div>
        </div>
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
                  className={`w-5 h-5 border ${cellColor[1]} border-black cursor-pointer ${x.isAlive ? cellColor[0] : 'bg-gray-600'}`}
                  >
                  </div>
                )
              }
            </div>
          )}
        </div>
      : <div className='m-auto text-white text-xl'>Loading...</div> 
      }
    </main>
  );
}
