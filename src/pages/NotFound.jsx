import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className='relative flex flex-col items-center justify-center min-h-screen max-container text-white'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold mb-4'>404</h1>
        <p className='text-xl mb-8'>Oops! This island doesn't exist.</p>

        <Link
          to='/'
          className='btn bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:scale-105 transition-transform'>
          Return to Main Island
        </Link>
      </div>

      <div className='absolute bottom-10 right-10 opacity-50'>
        <svg width='100' height='100' viewBox='0 0 100 100'>
          <text x='50' y='50' fontSize='60' textAnchor='middle' className='animate-bounce'>
            🦩
          </text>
        </svg>
      </div>
    </section>
  )
}

export default NotFound
