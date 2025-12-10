import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { appRoutes } from './routes'
import AppLayout from './components/layouts/AppLayout'

const App = () => {
  return (
    <BrowserRouter basename='/3D-frontend-portfolio-island'>
      <Routes>
        <Route element={<AppLayout />}>
          {appRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
