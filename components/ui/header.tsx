"use client"
import { PlanetIcon } from '@phosphor-icons/react'
import React from 'react'
import ThemeToggle from './theme-toggle'

export default function Header() {
  return (
    <header className="w-full p-8 px-4 sm:px-32 flex justify-between items-center">
        <div className='flex space-x-2 items-center'>
            <PlanetIcon size={32} weight="duotone" color='#6d0095ff' />
            <h1 className='text-2xl font-bold'>Pluto</h1>
        </div>
      <ThemeToggle />
    </header>
  )
}
