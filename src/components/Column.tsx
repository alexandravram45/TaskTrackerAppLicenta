import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Task from './Task';
import { Button, Card } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import { COLORS } from '../colors';
import AddIcon from '@mui/icons-material/Add';

interface TaskListProps {
  isDraggingOver: boolean;
}


interface ColumnCardProps {
    dynamicHeight: number;
}

interface ColumnProps {
    column: { title: string; id: string };
    tasks: Array<{ id: string; content: string }>;
  }

const ColumnCard = styled(Card)<ColumnCardProps>`
  width: 300px;
  margin: 10px;
  padding: 10px;
  font-size: small;
  border-radius: 20px !important;
  display: flex;
  flex-direction: column;
  background-color: #ebecf0 !important;
  color: #172b4d !important;

  min-height: 30px; 
  height: auto; //? TO DO
`;

const AddNewCardButton = styled(Button)`
  && {
    text-transform: none;
    background-color: transparent;
    border-radius: 16px;
    display: flex;
    color: #172b4d; 
    padding: 8px;
    transition: background-color 0.3s;

    display: flex;
    justify-content: flex-start;

    &:hover {
      background-color: #ddd;
    }

    &:active {
      background-color: #aaa;
    }

    .MuiSvgIcon-root {
      margin-right: 8px;
    }
  }
`;

const Title = styled.h3`
  margin-left: 14px;
`;

const TaskList = styled.div<TaskListProps>`
  padding: 8px;
  transition: background-color 0.2s ease;
  flex-grow: 1;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    height: 36px;
    width: 282px;
    border-radius: 10px;
    background-color: #40404019; /* Color for the dragged-over task contour */
    display: ${(props) => (props.isDraggingOver ? 'block' : 'none')};
    z-index: 1;
  }
`;

const Column: React.FC<ColumnProps> = (props) => {
  const [dynamicHeight, setDynamicHeight] = useState(100); // Set initial height

  useEffect(() => {
    // Calculate the dynamic height based on the number of tasks
    const calculatedHeight = 100 + props.tasks.length * 50; // Adjust the multiplier based on your design
    setDynamicHeight(calculatedHeight);
  }, [props.tasks]);

  return (
    <ColumnCard style={{ minHeight: dynamicHeight }}>
      <Title>{props.column.title}</Title>
      <Droppable droppableId={props.column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {props.tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
      <AddNewCardButton>
        <AddIcon />
        <span>Add a card</span>
      </AddNewCardButton>
    </ColumnCard>
  );
};

export default Column;
