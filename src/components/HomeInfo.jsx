import { Link } from 'react-router-dom'
import { arrow } from '../assets/icons'

const STAGES = {
  1: {
    text1: "Have something in mind? Let's build it together!",
    linkTo: '/contact',
    linkLabel: 'Contact me',
  },
  2: {
    text1: 'In 2021, I started studing and working as a ',
    strong: 'Frontend developer',
    text2: 'Before 2021, I studied and worked as a web designer.',
    linkTo: '/skills',
    linkLabel: 'Discover my skills',
  },
  3: {
    text1: 'Corious? Take a look at my projects!',
    linkTo: '/projects',
    linkLabel: 'Projects',
  },
}

const HomeInfo = ({ currentStage }) => {
  const data = STAGES[currentStage]
  if (!data) return null

  return (
    <div id='homeInfo' className='dark-glass text-center py-4 px-8 text-white cursor-default'>
      <p className='font-medium sm:text-xl text-center'>
        {data.text1}
        {data.strong && <strong>{data.strong}</strong>}
      </p>

      {data.text2 && <p className='text-center sm:text-md'>{data.text2}</p>}

      <Link
        to={data.linkTo}
        className='flex items-center justify-center mt-2 pointer-events-auto cursor-pointer transition-colors'>
        {data.linkLabel}
        <img src={arrow} alt='arrow' className='w-4 h-4 object-contain ms-3' />
      </Link>
    </div>
  )
}

export default HomeInfo
