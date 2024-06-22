import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './Home'
import AllBoards from './AllBoards'
import BoardComponents from './BoardComponents'
import CalendarView from './CalendarView'
import Progress from './Progress'
import InvitationPage from './InvitationPage'
import LandingPage from './LandingPage'
import AccountVerify from './AccountVerify'
import ResetPassword from './ResetPassword'
import PrivateRoute from './PrivateRoute'
import { useAuth } from './AuthProvider'

const Router = () => {

  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<PrivateRoute>{user && <Home user={user} />}</PrivateRoute>}>
            <Route path="boards" element={<AllBoards />} />
            <Route path="boards/:boardId" element={<BoardComponents />} />
            <Route path="boards/:boardId/calendarView" element={<CalendarView />} />
            <Route path="progress" element={<Progress />} />
            <Route path="" element={<Navigate to="/home/boards" />} />
        </Route>
        <Route path="/" element={user ? <Navigate to="/home/boards" /> : <Navigate to="/landing" />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="board/:boardId/join/:userId" element={<InvitationPage />} />
        <Route path="user/:id/verify/:token" element={<AccountVerify />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default Router
