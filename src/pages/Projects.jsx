// https://frontendmasters.com/blog/the-deep-card-conundrum/ card for projects

import ProjectCard from '../components/ProjectCard'
import { CTA, CustomCursor } from '../components'
import { projects } from '../constants'

const Projects = () => {
  return (
    <CustomCursor>
      <section className='max-container text-slate-100'>
        <h1 className='head-text'>
          My <span className='blue-gradient_text drop-shadow font-semibold'>Projects</span>
        </h1>

        <p className='text-slate-300 mt-2 leading-relaxed'>
          I've built various projects over the years, but these are the ones that best represent my work. Some are
          open-source — feel free to explore them or propose improvements.
        </p>

        {projects.length === 0 && <p className='mt-10 text-slate-400 italic'>No projects available at the moment.</p>}

        <div className='flex flex-wrap my-20 gap-16'>
          {projects.map((p) => (
            <div key={p.name} className='hoverable'>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>

        <CTA />
      </section>
    </CustomCursor>
  )
}

export default Projects
