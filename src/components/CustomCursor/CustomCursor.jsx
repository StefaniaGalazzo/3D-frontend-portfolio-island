import { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

const CustomCursor = ({ children }) => {
  const bigBallRef = useRef(null)
  const smallBallRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const bigBallPos = useRef({ x: 0, y: 0 })
  const smallBallPos = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  useEffect(() => {
    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const onMouseEnter = () => setIsVisible(true)
    const onMouseLeave = () => setIsVisible(false)

    const animate = () => {
      // Smooth follow per big ball (più lento, più smooth)
      bigBallPos.current.x += (mousePos.current.x - bigBallPos.current.x) * 0.15
      bigBallPos.current.y += (mousePos.current.y - bigBallPos.current.y) * 0.15

      // Smooth follow per small ball (più veloce e reattivo)
      smallBallPos.current.x += (mousePos.current.x - smallBallPos.current.x) * 0.4
      smallBallPos.current.y += (mousePos.current.y - smallBallPos.current.y) * 0.4

      if (bigBallRef.current) {
        bigBallRef.current.style.transform = `translate(${bigBallPos.current.x - 15}px, ${bigBallPos.current.y - 15}px)`
      }
      if (smallBallRef.current) {
        smallBallRef.current.style.transform = `translate(${smallBallPos.current.x - 5}px, ${
          smallBallPos.current.y - 5
        }px)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)

    rafId.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isVisible])

  useEffect(() => {
    const handleHover = (e) => {
      const isInteractive = e.target.closest('a, button, .hoverable, .block-container, [role="button"]')
      const isLightCTA = e.target.closest('.cursor-light-trigger')

      // Hover normale
      if (isInteractive) {
        bigBallRef.current?.classList.add('cursor-hover')
      } else {
        bigBallRef.current?.classList.remove('cursor-hover')
      }

      // Hover CTA (effetto luce WOW)
      if (isLightCTA) {
        bigBallRef.current?.classList.add('cursor-light')
      } else {
        bigBallRef.current?.classList.remove('cursor-light')
      }
    }

    document.addEventListener('mouseover', handleHover)
    return () => document.removeEventListener('mouseover', handleHover)
  }, [])

  return (
    <div className='custom-cursor-wrapper'>
      {isVisible && (
        <>
          <div ref={bigBallRef} className='cursor-ball cursor-ball--big'>
            <div className='cursor-inner'></div>
          </div>

          <div ref={smallBallRef} className='cursor-ball cursor-ball--small'>
            <div className='cursor-inner'></div>
          </div>
        </>
      )}

      {children}
    </div>
  )
}

export default CustomCursor
