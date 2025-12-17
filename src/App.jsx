import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { appRoutes } from './routes'
import AppLayout from './components/layouts/AppLayout'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route element={<AppLayout />}>
          {appRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}

          {/* 404 - Custom page invece di redirect */}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
