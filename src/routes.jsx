// routes.js
import { Home, Skills, Projects, Contact } from './pages'

// label = compare nella navbar
// layout = gestione UI
export const appRoutes = [
  {
    path: '/',
    element: <Home />,
    layout: { footer: false, navbar: true },
    label: null, // non deve apparire nella navbar
  },
  {
    path: '/skills',
    element: <Skills />,
    label: 'Skills',
    layout: { footer: true, navbar: true },
  },
  {
    path: '/projects',
    element: <Projects />,
    label: 'Projects',
    layout: { footer: false, navbar: true },
  },
  {
    path: '/contact',
    element: <Contact />,
    label: 'Contact',
    layout: { footer: true, navbar: true },
  },
]
