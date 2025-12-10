// src/components/DragToExplore.jsx
import React from 'react'
import useAppStore from '../store/useAppStore'

/**
 * DragToExplore - Indicatore "drag to explore"
 * Appare solo se l'utente non ha ancora interagito
 */
const DragToExplore = () => {
  const hasInteracted = useAppStore((state) => state.hasInteracted)

  if (hasInteracted) return null

  return (
    <div className='absolute inset-0 z-10 flex items-center justify-center pointer-events-none'>
      <div className='text-center text-white bg-black bg-opacity-50 px-6 py-4 rounded-lg animate-pulse'>
        <p className='text-2xl font-bold mb-2'>👆 Drag to Explore</p>
        <p className='text-sm'>Use your mouse to rotate the view</p>
      </div>
    </div>
  )
}

export default React.memo(DragToExplore)
