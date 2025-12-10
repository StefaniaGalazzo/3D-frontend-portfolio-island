// import { Html } from '@react-three/drei'
import { useEffect, useState } from 'react'

const phrases = [
  'Stabilizing the floating islands...',
  'Loading the brightest stars...',
  'Preparing launch for new galaxies...',
  'The cosmic flamingo is aligning its feathers...',
  'Synchronizing space‑time travel...',
]
const Loader = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    // <Html>
    <div className='grid center m-auto text-white w-full h-full top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center z-50 pointer-events-none'>
      <p
        key={index}
        className='
          text-white w-full text-md md:text-sm font-light tracking-wide transition-opacity duration-700 opacity-100 animate-fade'>
        {phrases[index]}
      </p>
    </div>
    // </Html>
  )
}

export default Loader
