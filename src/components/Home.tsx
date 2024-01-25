import { Button, Card, Typography } from '@mui/material';
import SideBar from './SideBar';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';

import styled from 'styled-components';
import { useState } from 'react';
import initialData from '../initial-data';
import Column from './Column';


const AddNewCardButton = styled(Button)`
  && {
    text-transform: none;
    background-color: rgba(255, 255, 255, 0.249);
    
    border-radius: 16px;
    display: flex;
    width: 300px;
  
    color: #172b4d;
    padding: 8px;
    margin: 10px;
    transition: background-color 0.3s;
    height: 30%;
    display: flex;
    justify-content: flex-start;

    &:hover {
      background-color: rgba(255, 255, 255, 0.582);
    }

    .MuiSvgIcon-root {
      margin-right: 8px;
    }
  }
`;

const ColumnsWrapper = styled.div`
    display: flex;
`;



const Home = () => {
    
    const [data, setData] = useState(initialData)
    const [user, setUser] = useState({
      id: "",
      username: "",
      email: "",
    })
    

    
  const columnsrender = () => {
    return data.columnOrder.map(columnId => {
      const column = data.columns[columnId as keyof typeof data.columns];
      const tasks = column.taskIds.map(taskId => data.tasks[taskId as keyof typeof data.tasks]);
      return <Column key={column.id} column={column} tasks={tasks}></Column>
    })
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId as keyof typeof data.columns];
    const finish = data.columns[destination.droppableId as keyof typeof data.columns];
    
    if (start === finish){
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newData);
  };


    return (
        <div style={{ display: 'flex', height: '100vh'}}>
          <SideBar />
            <div id='home' style={{width: '86%', backgroundColor: 'transparent', float: 'left', borderTopLeftRadius: 20}}>
              
              <Typography style={{ margin: '25px'}}>Board name</Typography>

              <Card style={{ 
                backgroundColor: 'transparent', 
                marginLeft: '20px', 
                border: '0px',
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'row',
                borderTopLeftRadius: 20
                }}>
                <DragDropContext onDragEnd={onDragEnd}>
                  <ColumnsWrapper>
                    {columnsrender()}
                  </ColumnsWrapper>
                </DragDropContext>
                <AddNewCardButton>
                <AddIcon />
                  <span>
                    Add a column
                  </span>
                </AddNewCardButton>
              </Card>
            </div>
        </div>
    )
}

export default Home;
