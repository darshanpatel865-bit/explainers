import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CompoundInterest from './pages/CompoundInterest'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/compound-interest" element={<CompoundInterest />} />
    </Routes>
  )
}

export default App
