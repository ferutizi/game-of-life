'use client'

import { useState, useEffect } from "react";
import useGrid from "./hooks/useGrid";

export default function Home() {

  const [grid, isPlaying, pauseGame, resetGame, nextStep, handleLife] = useGrid()

  const btnStyle = 'border border-slate-400 rounded-lg px-4 py-1 shadow hover:bg-slate-400 active:shadow-none font-semibold'
    
  return (
    <main className="flex h-screen flex-col items-center w-full bg-stone-900">
      <header className="flex items-center bg-slate-300 text-black h-16 w-screen">
        <h1 className="ml-6 text-2xl font-semibold">Game of Life</h1>
        <div className="flex gap-6 mx-auto -translate-x-24">
          <button className={btnStyle} onClick={() => pauseGame()}>{isPlaying ? 'Stop' : 'Start'}</button>
          <button className={btnStyle} onClick={() => resetGame()}>Reset</button>
          <button className={btnStyle} onClick={() => nextStep()}>Next</button>
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
                  className={`w-5 h-5 hover:bg-stone-300 border border-black cursor-pointer ${x.isAlive ? 'bg-stone-300' : 'bg-gray-600'}`}
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
