// src/components/WelcomeModal.jsx
import React from 'react'
import useAppStore from '../store/useAppStore'
import Loader from './Loader'

const WelcomeModal = () => {
  const hasVisited = useAppStore((state) => state.hasVisited)
  const setHasVisited = useAppStore((state) => state.setHasVisited)
  const loadingProgress = useAppStore((state) => state.loadingProgress)
  const modelsRendered = useAppStore((state) => state.modelsRendered)

  // Pulsante abilitato SOLO quando i modelli sono renderizzati
  const canClose = modelsRendered && loadingProgress >= 100
  const isOpen = !hasVisited

  const handleClose = () => {
    if (!canClose) return
    setHasVisited(true)
  }

  if (!isOpen) return null

  return (
    <div className='welcome-modal fixed inset-0 flex items-center justify-between cursor-default z-[9999]'>
      <div className='modal-content'>
        <h1 className='modal-title flex flex-col text-4xl lg:text-7xl'>
          <span>Hello there!</span>
          <span>Welcome to my island.</span>
        </h1>
        <p className='flex flex-col text-2xl lg:text-3xl'>
          <span>I'm Stefania, a Frontend Developer from space.</span>
          <span>Take a tour of the island on my Flamingo!</span>
        </p>
        <p className='flex flex-col text-1xl'>
          Discover my story, my skills and my projects...Drag the cursor and take flight.
        </p>

        <button
          onClick={handleClose}
          disabled={!canClose}
          className={`
            modal-button 
            relative 
            w-full 
            h-12
            mt-8
            overflow-hidden 
            rounded-lg
            border-2
            border-gray-700
            text-center 
            transition-all 
            duration-300
            text-nowrap
            ${canClose ? 'cursor-pointer hover:border-blue-400 hover:scale-[1.02]' : 'cursor-not-allowed opacity-90'}
          `}
          style={{
            background: `linear-gradient(90deg, 
              rgba(97, 56, 231, 1) ${loadingProgress}%, 
              rgba(30, 41, 59, 0.3) ${loadingProgress}%
            )`,
          }}>
          <span className='relative z-10 flex items-center justify-center h-full font-semibold'>
            {canClose ? (
              <>
                <span className='mr-2 animate-pulse'>✨</span>
                Go to the island
              </>
            ) : loadingProgress >= 80 ? (
              <>
                <span className='mr-2'>🎨</span>
                Rendering scene... {Math.round(loadingProgress)}%
              </>
            ) : (
              <>
                <span className='mr-2'>⏳</span>
                Loading models... {Math.round(loadingProgress)}%
              </>
            )}
          </span>
        </button>

        {/* Loader con isComplete quando tutto pronto */}
        <Loader isComplete={canClose} />
      </div>
    </div>
  )
}

export default React.memo(WelcomeModal)
