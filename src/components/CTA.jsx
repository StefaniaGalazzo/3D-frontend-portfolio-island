import { Link } from 'react-router-dom'

const CTA = ({ ...props }) => {
  return (
    <section
      className='cta cursor-light-trigger text-black border border-solid border-acid-200 p-8'
      {...props}
      id='cta-footer'>
      <p className='cta-text'>
        Have something in mind? <br className='sm:block hidden' />
        Let's build it together!
      </p>
      <Link to='/contact' className='btn'>
        Contact
      </Link>
    </section>
  )
}

export default CTA
