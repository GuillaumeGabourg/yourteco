import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { SmoothProvider } from './lib/smooth.jsx'
import { Header, Footer } from './components/Chrome.jsx'
import Home from './pages/Home.jsx'
import ContentPage from './pages/ContentPage.jsx'
import SeedField from './components/SeedField.jsx'

function Page() {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/+|\/+$/g, '')
  return <ContentPage key={slug} slug={slug} />
}

export default function App() {
  return (
    <SmoothProvider>
      <SeedField />
      <a href="#contenu" className="skip">Aller au contenu</a>
      <Header />
      <main id="contenu" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Navigate to="/#devis" replace />} />
          <Route path="/contact/" element={<Navigate to="/#devis" replace />} />
          <Route path="*" element={<Page />} />
        </Routes>
      </main>
      <Footer />
    </SmoothProvider>
  )
}
