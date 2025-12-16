import {
  css,
  git,
  github,
  html,
  javascript,
  linkedin,
  bootstrap,
  motion,
  styledComp,
  mui,
  nextjs,
  figma,
  strapi,
  react,
  redux,
  sass,
  express,
  mongodb,
  nodejs,
  weatherapp,
  tailwindcss,
  typescript,
  remix,
  threejs,
  babu,
  smartnotes,
  p5j,
} from '../assets/icons'

export const skills = [
  {
    imageUrl: html,
    name: 'HTML',
    type: 'Frontend',
  },
  {
    imageUrl: css,
    name: 'CSS',
    type: 'Frontend',
  },
  {
    imageUrl: javascript,
    name: 'JavaScript',
    type: 'Frontend',
  },
  {
    imageUrl: typescript,
    name: 'TypeScript',
    type: 'Frontend',
  },
  {
    imageUrl: react,
    name: 'React',
    type: 'Frontend',
  },
  {
    imageUrl: nextjs,
    name: 'Next.js',
    type: 'Frontend',
  },
  {
    imageUrl: remix,
    name: 'Remix',
    type: 'Frontend',
  },
  {
    imageUrl: redux,
    name: 'Redux',
    type: 'State Management',
  },
  {
    imageUrl: react,
    name: 'React Native',
    type: 'Frontend',
  },
  {
    imageUrl: sass,
    name: 'Sass',
    type: 'Frontend',
  },
  {
    imageUrl: git,
    name: 'Git',
    type: 'Version Control',
  },
  {
    imageUrl: github,
    name: 'GitHub',
    type: 'Version Control',
  },
  //   {
  //     imageUrl: mongodb,
  //     name: 'MongoDB',
  //     type: 'Database',
  //   },
  {
    imageUrl: threejs,
    name: 'Three.js',
    type: 'Frontend',
  },
  {
    imageUrl: styledComp,
    name: 'Styled Component',
    type: 'Frontend',
  },
  {
    imageUrl: motion,
    name: 'Motion',
    type: 'Animation',
  },
  {
    imageUrl: mui,
    name: 'Material-UI',
    type: 'Frontend',
  },
  {
    imageUrl: tailwindcss,
    name: 'Tailwind CSS',
    type: 'Frontend',
  },
  {
    imageUrl: bootstrap,
    name: 'Bootstrap',
    type: 'Frontend',
  },
  {
    imageUrl: strapi,
    name: 'Strapi',
    type: 'Backend',
  },
  {
    imageUrl: figma,
    name: 'Figma',
    type: 'Design',
  },
]

export const experiences = [
  {
    title: 'Frontend Developer',
    company_name: 'Ludwig.guru',
    // icon: starbucks,
    iconBg: '#accbe1',
    date: 'May 2024 > May 2025',
    points: [
      'Development and maintenance of a scalable design system with design tokens management, theming, and accessibility.',
      'Collaborating with cross-functional teams including designers, front and backend developers, to create high-quality products.',
      'Cookie management and authentication logic.',
      'Implementing responsive design and ensuring cross-browser compatibility.',
      'Work management using Agile Kanban methodology.',
    ],
  },
  {
    title: 'Tutor React Developer',
    company_name: 'ITS Steve Jobs Academy',
    // icon: tesla,
    iconBg: '#fbc3bc',
    date: 'March 2024 > March 2024',
    points: [
      'Support for students in the development of their final project.',
      'Expleaining React and core hooks, and state management, Redux Toolkit management',
      'Tutoring activities focused on project architecture, UX/UI best practices, styling management, and code scalability.',
    ],
  },
  {
    title: 'Frontend Developer',
    company_name: 'RWS Digital',
    // icon: shopify,
    iconBg: '#b7e4c7',
    date: 'April 2022 > August 2023',
    points: [
      'Integration and maintenance of responsive components in management systems and B2B platforms.',
      'Working with React, Next.js, Angular, state management, REST API integration, implementation of components with Material UI (MUI).',
      'Work management using the Agile Scrum methodology.',
    ],
  },
  {
    title: 'Web Designer',
    company_name: 'Darshan',
    // icon: meta,
    iconBg: '#0e5aa0ff',
    date: 'March 2020 > July 2020',
    points: [
      'Designing, developing and maintaining wordpress website.',
      'Collaborating with cross-functional teams to create high-quality products.',
      'Implementing responsive design and ensuring cross-browser compatibility.',
    ],
  },
  {
    title: 'Web Designer',
    company_name: 'Mobike Shop Valencia',
    // icon: meta,
    iconBg: '#a2d2ff',
    date: 'March 2020 > July 2020',
    points: [
      'Designing, developing and maintaining wordpress website.',
      'Collaborating with cross-functional teams to create high-quality products.',
      'Implementing responsive design and ensuring cross-browser compatibility.',
    ],
  },
]

export const socialLinks = [
  {
    name: 'GitHub',
    iconUrl: github,
    link: 'https://github.com/StefaniaGalazzo/',
  },
  {
    name: 'LinkedIn',
    iconUrl: linkedin,
    link: 'https://www.linkedin.com/in/stefania-galazzo-frontend-developer/',
  },
]

export const projects = [
  {
    iconUrl: babu,
    theme: 'btn-back-red',
    name: 'Babù',
    description:
      'An app that helps children with verbalization difficulties practice in a fun way. Through interactive games, step-by-step exercises, and a friendly virtual companion, kids improve their pronunciation, vocabulary, and sentence construction in their native Italian.',
    // link: '',
  },
  {
    iconUrl: smartnotes,
    theme: 'btn-back-green',
    name: 'Smart Notes',
    description: 'AI-powered note-taking assistant: rewrite, make a to do list, improve your text.',
    // link: '',
    label: 'Built with Express as a backend service',
  },
  {
    iconUrl: p5j,
    theme: 'btn-back-pink',
    name: 'P5J Test',
    description:
      'Manipulate a system of geometric shapes in real time: control their number, angles, and rotation speed. A visual experiment where every adjustment creates a unique and hypnotic composition.',
    link: 'https://stefaniagalazzo.github.io/p5js-fractal-loop/',
  },
  {
    iconUrl: weatherapp,
    theme: 'btn-back-blue',
    name: 'Weather App',
    description:
      'A simple weather app. It uses your location to show your local forecast. Built with React and Redux for a fast, smooth experience.',
    link: 'https://stefaniagalazzo.github.io/weather-react-app/',
  },
]
