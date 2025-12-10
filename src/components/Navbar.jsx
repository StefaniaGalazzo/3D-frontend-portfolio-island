import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { appRoutes } from '../routes'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const active = 'text-[var(--accent-blue)]'
  const inactive = 'text-white'

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className='header text-white flex items-center justify-between'>
      <NavLink to='/' className={({ isActive }) => (isActive ? active : inactive)} onClick={closeMenu}>
        <h5 className='flex flex-col text-lg leading-4'>
          <span>Stefania</span>
          <span>Frontend</span>
          <span>Island</span>
        </h5>
      </NavLink>

      {/* Desktop Navigation */}
      <nav className='hidden md:flex text-lg gap-7 font-medium'>
        {appRoutes &&
          appRoutes
            .filter((r) => r.layout?.navbar !== false && r.label)
            .map(({ path, label }) => (
              <NavLink key={path} to={path} className={({ isActive }) => (isActive ? active : inactive)}>
                {label}
              </NavLink>
            ))}
      </nav>

      {/* Burger Menu Button */}
      <button
        id='burger-menu'
        className='md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center'
        onClick={toggleMenu}
        aria-label='Toggle menu'>
        <span
          className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
        />
        <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
        <span
          className={`w-full h-0.5 bg-white transition-all duration-300 ${
            isMenuOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-screen w-64 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] shadow-2xl transition-transform duration-300 z-50  ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <nav className='flex flex-col gap-6 pt-24 px-8 text-lg font-medium'>
          {appRoutes &&
            appRoutes
              .filter((r) => r.layout?.navbar !== false && r.label)
              .map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => (isActive ? active : inactive)}
                  onClick={closeMenu}>
                  {label}
                </NavLink>
              ))}
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className='md:hidden fixed inset-0 bg-black bg-opacity-50 z-40' onClick={closeMenu} />}
    </header>
  )
}

export default Navbar
