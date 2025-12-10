import { useEffect, useRef, useState } from 'react'
import './DragCursor.css'

const DragCursor = () => {
  const cursorRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const cursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const rafId = useRef(null)

  useEffect(() => {
    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // Nascondi il cursore se si trova sopra navbar o modale
      const element = document.elementFromPoint(e.clientX, e.clientY)
      const isOverNavbar = element?.closest('.header')
      const isOverModal = element?.closest('.welcome-modal')
      const isOverHomeInfo = element?.closest('#homeInfo')

      if (isOverNavbar || isOverModal || isOverHomeInfo) {
        setIsVisible(false)
      } else if (!isVisible) {
        setIsVisible(true)
      }
    }

    const onMouseEnter = () => setIsVisible(true)
    const onMouseLeave = () => setIsVisible(false)

    const animate = () => {
      // Smooth follow
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 40}px, ${cursorPos.current.y - 40}px)`
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

  if (!isVisible) return null

  return (
    <div ref={cursorRef} className='drag-cursor'>
      <div className='drag-cursor-circle'>
        <svg className='arrow-left' width='12' height='12' viewBox='0 0 12 12'>
          <path d='M8 2 L4 6 L8 10' stroke='white' strokeWidth='2' fill='none' />
        </svg>

        <span className='drag-text'>DRAG</span>

        <svg className='arrow-right' width='12' height='12' viewBox='0 0 12 12'>
          <path d='M4 2 L8 6 L4 10' stroke='white' strokeWidth='2' fill='none' />
        </svg>
      </div>
    </div>
  )
}

export default DragCursor
