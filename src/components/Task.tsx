import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Card } from '@mui/material';

interface ContainerProps {
  isDragging: boolean;
}

const TaskCard = styled(Card)<ContainerProps>`
  border: 1px solid lightgray;
  padding: 8px;
  border-radius: 10px !important;
  margin-bottom: 8px;
`;

interface TaskProps {
  task: { id: string; content: string };
  index: number;
}

const Task: React.FC<TaskProps> = (props) => {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <TaskCard
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {props.task.content}
        </TaskCard>
      )}
    </Draggable>
  );
};

export default Task;
