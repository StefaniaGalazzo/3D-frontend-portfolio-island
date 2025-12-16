import { Link } from 'react-router-dom'
import { arrow } from '../assets/icons'

const ProjectCard = ({ project }) => {
  return (
    <article className='lg:w-[400px] w-full'>
      <div className='block-container w-12 h-12'>
        <div className={`btn-back rounded-xl ${project.theme}`} />
        <div className='btn-front rounded-xl flex justify-center items-center'>
          <img
            src={project.iconUrl}
            alt={project.name + ' logo'}
            className='w-1/2 h-1/2 object-contain'
            loading='lazy'
          />
        </div>
      </div>

      <div className='mt-5 flex flex-col'>
        <h4 className='text-2xl font-poppins font-semibold'>{project.name}</h4>
        <p className='mt-2 text-slate-300'>{project.description}</p>

        <div className='mt-5 flex items-center gap-2 font-poppins'>
          {project?.link ? (
            <>
              <Link
                to={project.link}
                target='_blank'
                rel='noopener noreferrer'
                className='font-semibold hover:underline'>
                Live Link
              </Link>
              <img src={arrow} alt='' className='w-4 h-4 object-contain' />
            </>
          ) : (
            <p>{project?.label || 'Work in progress'}</p>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
