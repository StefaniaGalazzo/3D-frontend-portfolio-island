import { matchPath, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { appRoutes } from '../../routes'
import { Footer, Navbar } from '..'

const AppLayout = () => {
  const { pathname } = useLocation()
  const route = appRoutes.find((r) => matchPath({ path: r.path, end: true }, pathname))
  const showNavbar = route?.layout?.nav !== false
  const showFooter = route?.layout?.footer === true

  // console.log('AppLayout render - route', route)
  // console.log('AppLayout render - showNavbar:', showNavbar, 'showFooter:', showFooter)
  return (
    <div className='bg-slate-300/20 min-h-screen flex flex-col'>
      {showNavbar && <Navbar />}
      <main className='flex-1'>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export default AppLayout
