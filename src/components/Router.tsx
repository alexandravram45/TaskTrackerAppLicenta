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
import { useSelector } from 'react-redux'
import { AppState } from '../store'

const Router = () => {

  const user = useSelector((state: AppState) => state.currentUser);

  return (
    <BrowserRouter>
      <Routes>
        { user
          ? <>
              <Route path="/home" element={<Home user={user} />}>
                <Route path="boards" element={<AllBoards />} />
                <Route path="boards/:boardId" element={<BoardComponents />} />
                <Route path="boards/:boardId/calendarView" element={<CalendarView />} />
                <Route path="progress" element={<Progress />} />
                <Route path="" element={<Navigate to="/home/boards" />} />
              </Route>
              <Route path="/" element={<Navigate to="/home/boards" />} />
              <Route path='/landing' element={<LandingPage />} />

              <Route path="board/:boardId/join/:userId" element={<InvitationPage />} /> 
            </>
          : <>
            <Route path='/landing' element={<LandingPage />} />
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="board/:boardId/join/:userId" element={<InvitationPage />}/>
            <Route path="user/:id/verify/:token" element={<AccountVerify />}/>
            <Route path="/resetPassword/:token" element={<ResetPassword />}/>
          </>
        }
      </Routes>
    </BrowserRouter>
      
  )
}

export default Router
