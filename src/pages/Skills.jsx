import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'

import { CTA, CustomCursor } from '../components'
import { experiences, skills } from '../constants'

import 'react-vertical-timeline-component/style.min.css'

const Skills = () => {
  return (
    <CustomCursor>
      <section className='max-container text-white'>
        <h1 className='head-text'>
          👋 Hi, I'm <span className='blue-gradient_text font-semibold drop-shadow'> Stefania</span>
        </h1>

        <div className='mt-5 flex flex-col gap-3'>
          <p>
            Frontend developer based in Turin, specialized in design and build modern applications with a focus on
            accessibility, user experience, and visual effects.
          </p>
        </div>

        <div className='py-10 flex flex-col'>
          <h3 className='subhead-text'>My Skills</h3>

          <div className='mt-16 flex flex-wrap gap-12'>
            {skills.map((skill) => (
              <div className='block-container w-20 h-20 hoverable' key={skill.name}>
                <div className='btn-back rounded-xl' />
                <div className='btn-front rounded-xl flex flex-col justify-center items-center'>
                  <img src={skill.imageUrl} alt={skill.name} className='w-1/2 h-1/2 object-contain' />
                  <p className='text-sm text-center'>{skill.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='py-16'>
          <h3 className='subhead-text'>Work Experience</h3>
          <div className='mt-5 flex flex-col gap-3 text-slate-200'>
            <p>
              I've worked with different teams and companies, growing my skills and working alongside talented people.
              Here's an overview:
            </p>
          </div>

          <div className='mt-12 flex'>
            <VerticalTimeline lineColor='rgba(255, 255, 255, 0.2)'>
              {experiences.map((experience) => (
                <VerticalTimelineElement
                  key={experience.company_name}
                  date={experience.date}
                  dateClassName='text-slate-300'
                  iconStyle={{
                    background: experience.iconBg || '#733aec',
                    boxShadow:
                      '0 0 0 4px rgba(255, 255, 255, 0.1), inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)',
                  }}
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  contentArrowStyle={{
                    borderRight: '7px solid rgba(255, 255, 255, 0.1)',
                  }}>
                  <div className='hoverable'>
                    <h3 className='text-white text-xl font-poppins font-semibold'>{experience.title}</h3>
                    <p className='text-slate-300 font-medium text-base' style={{ margin: '4px 0 0 0' }}>
                      {experience.company_name}
                    </p>
                  </div>

                  <ul className='hoverable my-5 list-disc ml-5 space-y-2'>
                    {experience.points.map((point, index) => (
                      <li key={`experience-point-${index}`} className='text-slate-200 font-normal pl-1 text-sm'>
                        {point}
                      </li>
                    ))}
                  </ul>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          </div>
        </div>

        <CTA />
      </section>
    </CustomCursor>
  )
}

export default Skills
