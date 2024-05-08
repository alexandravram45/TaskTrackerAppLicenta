import { Scheduler } from "@aldabil/react-scheduler";
import { Board } from "./Home";
import React, { useEffect, useState } from "react";
import { FieldProps, ProcessedEvent } from "@aldabil/react-scheduler/types";
import axios from "axios";
import { useLocation, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppState, setSelectedBoardRedux } from "../store";
import { Typography } from "@mui/material";
import { startOfHour } from "date-fns";

export const EVENTS = [
    {
      event_id: 1,
      title: "Event 1",
      start: new Date("2024/04/21 09:30"),
      end: new Date("2024/04/21 10:30"),
      admin_id: [1, 2, 3, 4],
      color: "#50b500",

    },
    {
      event_id: 2,
      title: "Event 2",
      start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
      end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
      admin_id: 2,
      color: "#50b500",
    },
    {
      event_id: 3,
      title: "Event 3",
      start: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
      end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
      admin_id: 1,
      editable: false,
      deletable: false,
    },
    {
      event_id: 4,
      title: "Event 4",
      start: new Date(
        new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(
          new Date().getDate() - 2
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
          new Date().getDate() - 2
        )
      ),
      admin_id: 2,
      color: "#900000",
    },
    {
      event_id: 5,
      title: "Event 5",
      start: new Date(
        new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
          new Date().getDate() - 2
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
          new Date().getDate() - 2
        )
      ),
      admin_id: 2,
      editable: true,
    },
    {
      event_id: 6,
      title: "Event 6",
      start: new Date(
        new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
          new Date().getDate() - 4
        )
      ),
      end: new Date(new Date(new Date().setHours(14)).setMinutes(0)),
      admin_id: 2,
    },
  ];
  
  interface Resource {
    id: string,
    description: string,
    title: string
  }
  

const CalendarView = () => {
  const [tasks, setTasks] = useState<ProcessedEvent[]>([]);
  const [resources, setResourcers] = useState<Resource[]>([]);

  const [board, setBoard] = useState<Board>()
  const params = useParams()
  const location = useLocation()
  const boardId = params.boardId
  const selectedBoardRedux = useSelector((state: AppState) => state.selectedBoard);

  const dispatch = useDispatch()

  const fetchTaskById = async (taskId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks/get-by-id/${taskId}`);
      const newTask = response.data.data;
      return newTask;
    } catch (error) {
  
      console.error('Error fetching task:', error);
    }
  }


  const getBoard = async () => {
      await axios.get(`http://localhost:5000/board/${boardId}`).then((res) => {
        console.log(res.data)
        setBoard(res.data)
        dispatch(setSelectedBoardRedux(res.data))
      }).catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getBoard()
  }, [location.pathname])

  const colors = [
    '#FF5733', // Portocaliu
    '#33FF57', // Verde luminos
    '#3399FF', // Albastru luminos
    '#FF33E9', // Roz
    '#FFD133', // Galben
    '#8A2BE2', // Mov
    '#33FFDD', // Turcoaz
    '#FF3366', // Roșu
    '#33FF33', // Verde neon
    '#33FFFF', // Albastru neon
  ];
  
  // useEffect(() => {
  //   getTasks()
  // })

  useEffect(() => {
    getBoard();
  }, []);

  useEffect(() => {
    if (board) {
      getTasks();
    }
  }, [board]);


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
              color: colors[Math.floor(Math.random() * colors.length)],
            },
          ]);
          setResourcers((prevTasks) => [
            ...prevTasks,
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

  useEffect(()=> {
    console.log(tasks)
    console.log(resources)

  })

  return (
    <div style={{ padding: '50px'}}>
      <Typography variant="h2" style={{ marginBottom: '20px'}}>{board?.name}</Typography>
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
                text: resource ? resource.description : '', // Afiseaza descrierea daca este disponibila
                value: task.event_id,
              };
            }),
          }
        ]}
        
        viewerExtraComponent={(fields, event) => {
          const resource = resources.find((res) => res.id === event.event_id);
          console.log(resource)
          console.log(fields)
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

export default CalendarView
