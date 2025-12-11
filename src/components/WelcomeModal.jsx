// src/components/WelcomeModal.jsx
import React from 'react'
import useAppStore from '../store/useAppStore'
import Loader from './Loader'

const WelcomeModal = () => {
  const hasVisited = useAppStore((state) => state.hasVisited)
  const setHasVisited = useAppStore((state) => state.setHasVisited)
  const loadingProgress = useAppStore((state) => state.loadingProgress)
  const isSceneReady = useAppStore((state) => state.isSceneReady)

  const isLoaded = isSceneReady && loadingProgress >= 100
  const isOpen = !hasVisited

  const handleClose = () => {
    if (!isLoaded) {
      console.warn('[WelcomeModal] Tentativo di chiusura prematura - loading non completo')
      return
    }
    console.log('[WelcomeModal] Closing modal - Scene ready!')
    setHasVisited(true)
  }

  if (!isOpen) return null

  return (
    <div className='welcome-modal fixed inset-0 flex items-center justify-between bg-black bg-opacity-50 backdrop-blur-sm cursor-default z-[9999]'>
      {/* Contenuto */}
      <div className='modal-content'>
        <h1 className='modal-title flex flex-col text-4xl lg:text-7xl'>
          <span>Hello there!</span>
          <span className=''>Welcome to my island.</span>
        </h1>
        <p className='flex flex-col text-2xl lg:text-3xl'>
          <span>I'm Stefania, a Frontend Developer from space.</span>
          <span>Take a tour of the island on my Flamingo!</span>
        </p>
        <p className='flex flex-col text-1xl'>
          Discover my story, my skills and my projects...Drag the cursor and take flight.
        </p>

        {/* Button con progress integrato */}
        <button
          onClick={handleClose}
          disabled={!isLoaded}
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
            ${isLoaded ? 'cursor-pointer hover:border-blue-400 hover:scale-[1.02]' : 'cursor-not-allowed opacity-90'}
          `}
          style={{
            background: `linear-gradient(90deg, 
              rgba(97, 56, 231, 1) ${loadingProgress}%, 
              rgba(30, 41, 59, 0.3) ${loadingProgress}%
            )`,
          }}>
          <span className='relative z-10 flex items-center justify-center h-full font-semibold'>
            {isLoaded ? (
              <>
                <span className='mr-2 animate-pulse'>✨</span>
                Go to the island
              </>
            ) : (
              <>
                <span className='mr-2'>⏳</span>
                Loading... {Math.round(loadingProgress)}%
              </>
            )}
          </span>
        </button>

        {/* Progress details (optional debug info)*/}
        {!isLoaded && <Loader />}
      </div>
    </div>
  )
}

export default React.memo(WelcomeModal)
