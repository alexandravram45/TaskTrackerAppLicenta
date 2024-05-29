import SideBar from './SideBar';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setSelectedBoardRedux } from '../store';
import { User } from '../App';
import AppMenuBar from './AppMenuBar';

export interface Board {
  _id: string;
  name: string;
  user: string;
  columns: Array<ColumnInterface>;
  tasks: Array<TaskInterface>;
  color: string;
  createdAt: Date;
  favorite: Boolean;
  members: Array<User>;
  archived: boolean;
}

export interface ColumnInterface {
  _id: string, 
  title: String,
  tasks: Array<TaskInterface>;
  done: Boolean;
}

export interface TaskInterface {
  _id: string;
  title: string;
  description: string,
  dueDate: Date | null,
  points: number | null, 
  assignee: string | null,
  done: Boolean | null
}

interface HomeProps {
  user: User
}

const Container = styled.div`
  display: flex;
  height: 100%;
  min-height: 100vh;
  background-image: ${props => props.color !== undefined ? props.color : 'white'};
`;

const Home: React.FC<HomeProps> = ({ user }) => {
    
  const selectedBoardRedux = useSelector((state: AppState) => state.selectedBoard);
  const dispatch = useDispatch()

  const handleBoardSelect = (board: Board) => {
    dispatch(setSelectedBoardRedux(board))
  };

    return (
      <>
        <AppMenuBar />
        <Container color={selectedBoardRedux?.color}>
          <SideBar user={user} onBoardSelect={handleBoardSelect} />
          <div id='home' style={{width: '86%', backgroundColor: 'transparent', marginTop: '61px', float: 'left', borderTopLeftRadius: 20}}>
            <Outlet />
          </div>
        </Container>
    </>
    )
}

export default Home;