import React, { useEffect, useState } from 'react'
import { DragDropContext, DragUpdate, DraggableLocation, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import styled, { createGlobalStyle } from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import { Button, ButtonGroup, Card, Input, Typography } from '@mui/material';
import { Board } from './Home'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setSelectedBoardRedux } from '../store';

import { User } from '../App';
import { useParams } from 'react-router-dom';

import BoardSkeleton from './BoardSkeleton';
import BoardBar from './BoardBar';

const GlobalScrollbarStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #0000002f;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-track:hover {
    background-color: #00000014;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #01010164;
  }
`;

export const ColumnContainer = styled.div`
  height: 75vh; 
  overflow: auto;
  display: grid;
  grid-auto-flow: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
`;

interface ExtendedUser extends User {
  totalPoints: number;
  title: string;
  pointsTillNext: number;
  badgeImage: string;
}

interface AddNewColProps {
  isDragging: boolean
}

const AddNewCardButton = styled(Button)<AddNewColProps>`
  && {
    text-transform: none;
    background-color: #f8f8f897;
    
    border-radius: 20px;
   
    width: 320px !important;
    display: flex;
    flex-direction: row;
    position: relative;
    color: #172b4d;
    padding: 12px;
    margin: 10px;
    transition: background-color 0.3s;
    justify-content: flex-start;
    align-items: flex-start;

    &:hover {
      background-color: rgba(255, 255, 255, 0.799);
    }

    .MuiSvgIcon-root {
      margin-right: 8px;
    }

    @media (max-width: 800px) {
      height: 40px
  } 
  }
`;

const ColumnCard = styled(Card)`
  width: 300px;
  margin: 10px;
  padding: 10px;
  font-size: small;
  border-radius: 20px !important;
  background-color: #f8f8f897 !important;
  color: #172b4d !important;

  display: flex;
  flex-direction: column;
  transition-duration: 0.3s;
  position: relative;

  @media (max-width: 800px) {
    width: 100px;
  }
`;

const StyledDiv = styled.div`
  margin-left: 20px;
  margin-top: 20px;
  margin-right: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: scroll;
  

  @media (max-width: 800px) {
    margin-left: -60px;
    margin-top: 10px;
  }
`;

const BoardComponents = () => {
  const [draggingOverIndex, setDraggingOverIndex] = useState(0)
  const [addNewColumnStyle, setNewColumnStyle] = useState({display: 'none'})
  const [addButtonStyle, setAddButtonStyle] = useState({display: 'flex'})
  const [members, setMembers] = useState<ExtendedUser[]>([])
  const dispatch = useDispatch();
  const selectedBoardRedux = useSelector((state: AppState) => state.selectedBoard);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const { boardId } = useParams()
  const [columnTitle, setColumnTitle] = useState("")
  const [boardNotFound, setBoardNotFound] = useState(false)
  const [isDragging, setIsDragging] = useState(false);


  useEffect(() => {
      if (!boardId) {
        setBoardNotFound(true)
        return;
      }
      try {
        setSelectedBoard(null);
        setMembers([])
        fetchBoardById(boardId).then((res: any) => {
          dispatch(setSelectedBoardRedux(res))
          setSelectedBoard(res);
        });
      } catch (error) {
        console.error('Error fetching board:', error);
      }
  }, [boardId]);


  const addNewColumn = async () => {
    setNewColumnStyle({display: 'block'})
    setAddButtonStyle({ display: 'none' })
  }

  const giveUp = async () => {
    setNewColumnStyle({display: 'none'})
    setAddButtonStyle({ display: 'flex' })
  }

  const onDragUpdate = (update: DragUpdate) => {
    const { destination } = update;
    if (!destination) return;
    setDraggingOverIndex(destination.index);
  };

  const fetchTaskById = async (taskId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks/get-by-id/${taskId}`);
      const newTask = response.data.data;
      return newTask;
    } catch (error) {
  
      console.error('Error fetching task:', error);
    }
  }

  const fetchColumnById = async (columnId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/column/get-by-id/${columnId}`);
      const column = response.data.data;
      const fetchedTasks = await Promise.all(column.tasks.map((taskId: string) => fetchTaskById(taskId)));
      column.tasks = fetchedTasks;
      return column;
    } catch (error) {
      console.error('Error fetching column:', error);
    }
  };
  
  const fetchBoardById = async (boardId: string) => {
    try {
      const boardResponse = await axios.get(`http://localhost:5000/board/${boardId}`);
      const board = boardResponse.data;
  
      const columnPromises = board.columns?.map((columnId: string) => fetchColumnById(columnId));
      const taskPromises = board.tasks.map((taskId: string) => fetchTaskById(taskId));
  
      const [columnData, taskData] = await Promise.all([
        Promise.all(columnPromises),
        Promise.all(taskPromises),
      ]);
  
      board.columns = columnData;
      board.tasks = taskData;
      return board;
    } catch (error) {
      setBoardNotFound(true)
      console.error('Error fetching board:', error);
    }
  };

  const updateColumn = async (columnId: string, tasks: Array<( { title: string, _id: string, description: string, dueDate: Date | null })>) => {
    const taskIds = tasks.map(task => task._id); // Extrage doar id-urile task-urilor

    await axios.put(`http://localhost:5000/column/${columnId}`, {
      taskIds
    }).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })  
  }

  const updateBoard = async (columnId: string) => {

    const getBoard = await axios.get(`http://localhost:5000/board/${selectedBoard?._id}`);
    const board = getBoard.data;
    const updatedColumns = [...board.columns, columnId];
    await axios.put(`http://localhost:5000/board/${selectedBoard?._id}`, {
      columns: updatedColumns
    }).then((res) => {
      dispatch(setSelectedBoardRedux(res.data.data))
      setSelectedBoard(selectedBoardRedux)
      }).catch((err) => {
      console.log(err)
    })  
  }

  const addColumn = async (event: React.MouseEvent<HTMLElement>) => {

    event.preventDefault();

    if (columnTitle !== ""){
      await axios.post('http://localhost:5000/column', {
        title: columnTitle,
        boardId: selectedBoard?._id,
        tasks: [], 
      }).then( async (response) => {
        await updateBoard(response.data.data._id);
        const newColumn = {
          _id: response.data.data._id,
          title: response.data.data.title,
          tasks: [],
          done: false
        };

        const updatedColumns = selectedBoard?.columns.concat(newColumn);

        setSelectedBoard({
          ...selectedBoard!,
          columns: updatedColumns || []
        });
        
        setColumnTitle("");
        setAddButtonStyle({display: 'flex'});
        setNewColumnStyle({display: 'none '})
      })
      .catch((error) => {
        console.log(error.message)
      })
    } else {
      toast.error('The column title should not be empty!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        draggable: true,
        theme: "light",
      });

    }
  }

  const updateBoardOnDrag = async (board: Board) => {
    setSelectedBoard(board);

    await axios.put(`http://localhost:5000/board/${board._id}`, {
      tasks: board.tasks,
      columns: board.columns
    }).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })  
  }

  const updateTask = async (taskId: string) => {
    await axios.put(`http://localhost:5000/tasks/${taskId}`, {
      done: true
    }).then((res) => {
      dispatch(setSelectedBoardRedux(selectedBoard))
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }
  
  const onDragEndColumn = (draggableId: string, source: DraggableLocation, destination: DraggableLocation) => {
    const draggedColumn = selectedBoard?.columns.find((column) => column._id === draggableId)
    if (!draggedColumn) {
      console.error(`Column with id ${draggableId} not found in selected board`);
      return;
    }
    const newColumnOrder = [...(selectedBoard?.columns || [])];

    newColumnOrder?.splice(source.index, 1) 
    newColumnOrder?.splice(destination?.index, 0, draggedColumn)

    const newData: Board = {
      ...selectedBoard!,
      columns: newColumnOrder || []
    }
    updateBoardOnDrag(newData)
    return;
  }

  const onDragEndTask = (draggableId: string, source: DraggableLocation, destination: DraggableLocation) => {
    const draggedTask = selectedBoard?.tasks.find((task) => task._id === draggableId);
  
    if (!draggedTask) {
      console.error(`Task with id ${draggableId} not found in selected board`);
      return;
    }
  
    // Create a mutable copy of draggedTask
    const mutableDraggedTask = { ...draggedTask };
  
    const start = selectedBoard?.columns.find((column) => column._id === source.droppableId);
    const finish = selectedBoard?.columns.find((column) => column._id === destination.droppableId);
  
    if (!start || !finish) {
      console.error('Start or finish column is undefined');
      return;
    }
  
    const isMovingFromUndoneToDone = start.done !== true && finish.done === true;
  
    if (isMovingFromUndoneToDone) {
      updateTask(mutableDraggedTask._id);
      mutableDraggedTask.done = true;
    }
  
    if (start._id === finish._id) {
      const newTaskIds = Array.from(start.tasks);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, mutableDraggedTask);
  
      const newColumn = {
        ...start,
        tasks: newTaskIds,
      };
  
      updateColumn(newColumn._id, newTaskIds);
      const newColumns = selectedBoard?.columns.map(column => {
        if (column._id === newColumn._id) {
          return newColumn;
        } else {
          return column;
        }
      });
  
      if (!newColumns) {
        console.error('Columns array is undefined');
        return;
      }
  
      const newData: Board = {
        ...selectedBoard!,
        columns: newColumns,
      };
  
      updateBoardOnDrag(newData);
      return;
    }
  
    const startTaskIds = Array.from(start.tasks);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      tasks: startTaskIds,
    };
  
    updateColumn(newStart._id, startTaskIds);
  
    const finishTaskIds = Array.from(finish.tasks);
    finishTaskIds.splice(destination.index, 0, mutableDraggedTask);
    const newFinish = {
      ...finish,
      tasks: finishTaskIds,
    };
  
    updateColumn(newFinish._id, finishTaskIds);
  
    const newColumns = selectedBoard?.columns.map(column => {
      if (column._id === newStart._id) {
        return newStart;
      } else if (column._id === newFinish._id) {
        return newFinish;
      } else {
        return column;
      }
    });
  
    if (!newColumns) {
      console.error('Columns array is undefined');
      return;
    }
    if (!selectedBoard) {
      console.error('Selected board is undefined');
      return;
    }
  
    const newData: Board = {
      ...selectedBoard,
      columns: newColumns,
    };
  
    updateBoardOnDrag(newData);
  };
  

  const onDragStart = () => {
    setIsDragging(true);
  };
  
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      setIsDragging(false);
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      setIsDragging(false);
      return;
    }

    if (type === 'column'){
     onDragEndColumn(draggableId, source, destination)
    }
    else {
      onDragEndTask(draggableId, source, destination)
    }
    setIsDragging(false);
  };

  return (
    <>
    {selectedBoard? (
      <div >
      <BoardBar selectedBoard={selectedBoard} setSelectedBoard={setSelectedBoard} members={members} setMembers={setMembers} />

        <StyledDiv>

          <div style={{ flexShrink: 0 }}>

          
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragUpdate={onDragUpdate} >
              <Droppable droppableId='all-columns' direction='horizontal' type='column'>
                {provided => (
                <ColumnContainer
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  
                >
                    {selectedBoard?.columns?.map((column, index) => {
                        return <Column 
                                  key={column._id} 
                                  column={column} 
                                  tasks={column.tasks} 
                                  index={index} 
                                  draggingOverIndex={draggingOverIndex} 
                                  selectedBoard={selectedBoard}
                                  setSelectedBoard={setSelectedBoard}
                                  members={members}
                                  done={column.done}
                                />;
                    })}
                    
                    <ColumnCard style={addNewColumnStyle}>
                      <Input
                        placeholder="Enter column title..." 
                        disableUnderline={true} 
                        multiline={true} 
                        minRows={2} 
                        value={columnTitle} 
                        onChange={(e) => setColumnTitle(e.target.value)}
                      />
                    <GlobalScrollbarStyle />

                        <ButtonGroup  orientation='vertical' color='secondary' style={{float: 'right' }}>
                          <Button onClick={addColumn}>
                            <CheckIcon />
                          </Button>
                          <Button onClick={giveUp}>
                            <CloseIcon />
                          </Button>
                        </ButtonGroup>
                    </ColumnCard>
                     
                  {provided.placeholder}
                </ColumnContainer>
                )}
                 
              </Droppable>
            </DragDropContext>
            </div>
            <div style={{ width: '300px', }}>
              <AddNewCardButton isDragging={isDragging} style={addButtonStyle} onClick={addNewColumn}>
                  <AddIcon />
                  <span>Add a column</span>
              </AddNewCardButton>
            </div>


        </StyledDiv>

      </div>
    ) : boardNotFound ? (
      <div style={{
        marginTop: '20px',
        marginLeft: '50px'
      }}>
      <Typography variant="h2" >
          Oops!
      </Typography>
      <Typography variant="h4">
          This board does not exist.
      </Typography>
      </div>
    ) : ( 
      <div >
        <BoardSkeleton />
      </div>
    )}
    </>
  )
}

export default BoardComponents

