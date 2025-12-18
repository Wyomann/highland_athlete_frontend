import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthInitializer from './components/AuthInitializer'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'
import MyProfile from './pages/MyProfile'
import LiftRankings from './pages/LiftRankings'
import AthleteProfiles from './pages/AthleteProfiles'
import AthleteProfile from './pages/AthleteProfile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import DataDeletion from './pages/DataDeletion'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: "#4a7323",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthInitializer />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/rankings/lifts" element={<LiftRankings />} />
          <Route path="/athletes" element={<AthleteProfiles />} />
          <Route path="/athletes/:id" element={<AthleteProfile />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
