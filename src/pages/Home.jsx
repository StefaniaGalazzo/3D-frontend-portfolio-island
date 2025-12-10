// src/pages/Home.jsx
import React from 'react'
import { HomeInfo, WelcomeModal, DragCursor, Scene3D } from '../components'
import useAppStore from '../store/useAppStore'
import { usePreloadAssets } from '../hooks'

/**
 * Home Page - Entry point con Progressive Loading
 * 
 * RENDERING STRATEGY:
 * 1. WelcomeModal sempre visibile all'inizio (overlay completo)
 * 2. Scene3D sempre renderizzato (progressive loading interno)
 * 3. DragCursor appare dopo chiusura modale
 * 4. HomeInfo appare quando scena è pronta
 */
export default function Home() {
  // Initialize asset loading
  usePreloadAssets()

  const hasVisited = useAppStore((state) => state.hasVisited)
  const isSceneReady = useAppStore((state) => state.isSceneReady)
  const currentStage = useAppStore((state) => state.currentStage)

  return (
    <section className='w-full h-screen relative' style={{ cursor: 'none' }}>
      {/* Welcome Modal - Overlay con loading progress */}
      <WelcomeModal />

      {/* Custom Drag Cursor - Visible solo dopo chiusura modale */}
      {hasVisited && <DragCursor />}

      {/* Home Info - Mostra stage corrente quando scena è pronta */}
      {hasVisited && isSceneReady && (
        <div className='absolute top-24 left-0 right-0 z-50 flex items-center justify-center'>
          <HomeInfo currentStage={currentStage} />
        </div>
      )}

      {/* 3D Scene - Always rendered (internal progressive loading) */}
      <Scene3D />
    </section>
  )
}
