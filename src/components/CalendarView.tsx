import { Scheduler } from "@aldabil/react-scheduler";
import { Board } from "./Home";
import { useEffect, useState } from "react";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import axios from "axios";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setSelectedBoardRedux } from "../store";
import { Typography } from "@mui/material";
import { taskColors } from '../colors'
interface Resource {
  id: string,
  description: string,
  title: string
}

const CalendarView = () => {
  const [tasks, setTasks] = useState<ProcessedEvent[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [board, setBoard] = useState<Board>()
  const params = useParams()
  const boardId = params.boardId

  const dispatch = useDispatch()

  const fetchTaskById = async (taskId: string) => {
    try {
      const response = await axios.get(`/tasks/get-by-id/${taskId}`);
      const newTask = response.data.data;
      return newTask;
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  }

  const getBoard = async () => {
    await axios.get(`/board/${boardId}`).then((res) => {
      setBoard(res.data)
      dispatch(setSelectedBoardRedux(res.data))
    }).catch((err) => {
      console.log(err)
    })
  }



  useEffect(() => {
    getBoard();
    if (board) {
      getTasks();
    }

  }, [board?._id]);

  const getTasks = () => {
    if (board) {
      board.tasks.map(async (task) => {
        const taskData = await fetchTaskById(task.toString());
        if (taskData.dueDate) {
          setTasks((prevTasks) => [
            ...prevTasks,
            {
              event_id: taskData._id,
              title: taskData.title,
              start: new Date(taskData.dueDate as Date),
              end: new Date(taskData.dueDate as Date),
              admin_id: taskData.assignee?.id,
              color: taskColors[Math.floor(Math.random() * taskColors.length)],
            },
          ]);
          setResources((prevResources) => [
            ...prevResources,
            {
              id: taskData._id,
              title: taskData.title,
              description: taskData.description,
            }
          ])
        }
      });
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <Typography variant="h2" style={{ 
        marginBottom: '20px',
        color: board?.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092'
      }}>{board?.name}</Typography>
      <Scheduler
        events={tasks}
        resources={resources}
        resourceFields={{
          idField: 'id',
          textField: 'title',
          subTextField: 'description',
        }}
        height={400}
        draggable={false}
        editable={false}
        deletable={false}
        agenda={false}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6], 
          weekStartOn: 1, 
          startHour: 8,
          endHour: 17,
          step: 60
        }}
        fields={[
          {
            name: "id",
            type: "select",
            options: tasks.map((task) => {
              const resource = resources.find((res) => res.id === task.event_id);
              return {
                id: task.event_id,
                text: resource ? resource.description : '', 
                value: task.event_id,
              };
            }),
          }
        ]}
        viewerExtraComponent={(fields, event) => {
          const resource = resources.find((res) => res.id === event.event_id);
          return (
            <div>
              {resource && (
                <Typography
                  style={{ display: "flex", alignItems: "center" }}
                  color="textSecondary"
                  variant="caption"
                  noWrap
                >
                  {resource.description}
                </Typography>
              )}
            </div>
          );
        }}
      />
    </div>
  )
}

export default CalendarView;
