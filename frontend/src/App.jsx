import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ReferralCodeEntry from './pages/ReferralCodeEntry'
import PaymentScreen from './pages/PaymentScreen'
import PaymentSuccess from './pages/PaymentSuccess'
import ProfileSetup from './pages/ProfileSetup'
import HomeFeed from './pages/HomeFeed'
import DiscoverPeople from './pages/DiscoverPeople'
import ReferralDashboard from './pages/ReferralDashboard'
import EarningsWallet from './pages/EarningsWallet'
import ChatList from './pages/ChatList'
import ChatConversation from './pages/ChatConversation'
import Profile from './pages/Profile'
import ProfileDetails from './pages/ProfileDetails'
import EditProfile from './pages/EditProfile'
import Withdrawal from './pages/Withdrawal'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Search from './pages/Search'
import EarningsHistory from './pages/EarningsHistory'
import HelpSupport from './pages/HelpSupport'

function PageWrapper({ children }) {
  const location = useLocation()
  return <div key={location.pathname} className="page-enter">{children}</div>
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin shadow-[0_4px_20px_rgba(216,27,96,0.15)]" />
        <p className="font-body-md text-body-md text-on-surface-variant animate-pulse">Loading...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<PageWrapper><Splash /></PageWrapper>} />
        <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignUp /></PageWrapper>} />
        <Route path="/referral-code" element={<ProtectedRoute><PageWrapper><ReferralCodeEntry /></PageWrapper></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PageWrapper><PaymentScreen /></PageWrapper></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PageWrapper><PaymentSuccess /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile-setup" element={<PageWrapper><ProfileSetup /></PageWrapper>} />
        <Route path="/home" element={<ProtectedRoute><PageWrapper><HomeFeed /></PageWrapper></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><PageWrapper><DiscoverPeople /></PageWrapper></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><PageWrapper><ReferralDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/earnings" element={<ProtectedRoute><PageWrapper><EarningsWallet /></PageWrapper></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><PageWrapper><ChatList /></PageWrapper></ProtectedRoute>} />
        <Route path="/chats/:chatId" element={<ProtectedRoute><PageWrapper><ChatConversation /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><PageWrapper><ProfileDetails /></PageWrapper></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><PageWrapper><EditProfile /></PageWrapper></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><PageWrapper><Withdrawal /></PageWrapper></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><PageWrapper><Notifications /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><PageWrapper><Search /></PageWrapper></ProtectedRoute>} />
        <Route path="/earnings-history" element={<ProtectedRoute><PageWrapper><EarningsHistory /></PageWrapper></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><PageWrapper><HelpSupport /></PageWrapper></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}
