// src/components/PlumbobLabel.jsx
import React, { useState } from 'react'
import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { arrow } from '../assets/icons'

/**
 * PlumbobLabel - HTML overlay 3D sui plumbob
 *
 * Usa useNavigate invece di Link per compatibilità con Html component
 */
const PlumbobLabel = ({ position, stage, flamingoInfo }) => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const LABELS = {
    1: {
      text: 'Contact me',
      linkTo: '/contact',
      color: '#00ff88',
    },
    2: {
      text: 'Discover my skills',
      linkTo: '/skills',
      color: '#ff00ff',
    },
    3: {
      text: 'Projects',
      linkTo: '/projects',
      color: '#ffaa00',
    },
  }

  const config = LABELS[stage]
  if (!config) return null

  // Show label solo quando flamingo è vicino a questa isola
  const isNearPlumbob = flamingoInfo && flamingoInfo.currentStage === stage

  if (!isNearPlumbob) return null

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(config.linkTo)
  }

  return (
    <Html position={position} center distanceFactor={6} zIndexRange={[100, 0]} transform sprite occlude={false}>
      <div
        onClick={handleClick}
        className='plumbob-label'
        style={{
          '--label-color': config.color,
        }}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}>
        <span className='plumbob-label-text'>{config.text}</span>
        {/* <img
          src={arrow}
          alt='arrow'
          className='plumbob-label-arrow'
          style={{
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        /> */}
      </div>
    </Html>
  )
}

// Memoization ottimizzata
export default React.memo(PlumbobLabel, (prev, next) => {
  return (
    prev.stage === next.stage &&
    prev.flamingoInfo?.currentStage === next.flamingoInfo?.currentStage &&
    prev.position[0] === next.position[0] &&
    prev.position[1] === next.position[1] &&
    prev.position[2] === next.position[2]
  )
})
