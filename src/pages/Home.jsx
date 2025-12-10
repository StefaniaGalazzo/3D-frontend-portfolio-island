// src/pages/Home.jsx
import React, { useEffect } from 'react'
import { HomeInfo, WelcomeModal, DragToExplore, Scene3D, DragCursor } from '../components'
import useAppStore from '../store/useAppStore'
import { usePreloadAssets } from '../hooks'

export default function Home() {
  usePreloadAssets()

  const hasVisited = useAppStore((state) => state.hasVisited)
  const hasInteracted = useAppStore((state) => state.hasInteracted)
  const currentStage = useAppStore((state) => state.currentStage)
  const loadingProgress = useAppStore((state) => state.loadingProgress)
  const isLoaded = loadingProgress >= 100

  return (
    <section className='w-full h-screen relative' style={{ cursor: 'none' }}>
      {/* Drag Cursor - sempre visibile quando caricato */}
      {isLoaded && <DragCursor />}
      {/* Indicatore "Drag to explore" - appare solo se hasVisited && !hasInteracted */}
      {/* {hasVisited && isLoaded && <DragToExplore />} */}

      {/* Modale - appare quando hasVisited = false */}
      <WelcomeModal />

      {/* HomeInfo - appare solo se hasVisited && hasInteracted */}
      {/* {hasVisited && hasInteracted && ( */}
      <div className='absolute top-24 left-0 right-0 z-50 flex items-center justify-center'>
        <HomeInfo currentStage={currentStage} />
      </div>
      {/* )} */}

      <Scene3D />
    </section>
  )
}
