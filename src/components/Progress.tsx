import { Box, Card, Grid, LinearProgress, Paper, TableContainer, Typography, linearProgressClasses } from '@mui/material'
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setSelectedBoardRedux } from '../store';
import axios from 'axios';
import { TaskInterface } from './Home';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import styled from 'styled-components';
import Check from '@mui/icons-material/Check';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataGrid, GridColDef  } from '@mui/x-data-grid';
import { useAuth } from './AuthProvider';


const PrettyCard = styled(Box)`
    border-radius: 20px;
    padding: 20px;
    width: 220px;
    height: 280px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    gap: 10px;
`;

type TitleImages = {
    [key: string]: string;
}

const Progress = () => {

    const {user} = useAuth()
    const dispatch = useDispatch()
    const [doneTasks, setDonetasks] = useState<TaskInterface[]>([])
    const [allTasks, setAllTasks] = useState<TaskInterface[]>([])
    const [isLoading, setIsLoading] = useState(true);

    const [totalPoints, setTotalPoints] = useState(0);
    const [pointsTillNext, setPointsTillNext] = useState(0);
    const [badgeImage, setBadgeImage] = useState('');
    const [title, setTitle] = useState('');

    const titles = ['Novice', 'Explorer', 'Challenger', 'Wizard', 'You reached the maximum level'];
    const currentIndex = titles.indexOf(title);
    const nextTitle = currentIndex !== -1 && currentIndex < titles.length - 1 ? titles[currentIndex + 1] : null;

    const [taskData, setTaskData] = useState([
        { name: 'Done', value: 0},
        { name: 'Not done', value: 0}
    ])

    const titleImages: TitleImages = {
        Novice: require('../images/novice.png'),
        Explorer: require('../images/explorer.png'),
        Challenger: require('../images/challenger.png'),
        Wizard: require('../images/wizard.png'),
    };

    useEffect(() => {
        dispatch(setSelectedBoardRedux(null))
        const fetchPoints = async () => {
            try {
            const response = await axios.get(`user/${user?.id}/points`);
            setTotalPoints(response.data.totalPoints);
            setTitle(response.data.title);
            setPointsTillNext(response.data.pointsTillNext)
            setBadgeImage(titleImages[response.data.title])
            } catch (error) {
            console.error('Error fetching points:', error);
            }
        };
  
      fetchPoints();
    }, [user?.id]);

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Task Title', flex: 1,  },
        { field: 'description', headerName: 'Description',flex: 2 , renderCell: (params) => (
          <div dangerouslySetInnerHTML={{ __html: params.value }} />
        ) },
        { field: 'dueDate', headerName: 'Due Date', flex: 0.5 , valueGetter: (value) => 
            value && new Date(value).toLocaleDateString()
          },
        
        { field: 'points', headerName: 'Points',  flex: 0.5  },
        { field: 'done', headerName: 'Done',  flex: 0.5 ,renderCell: (params) => (
          params.value ? <Check sx={{ color: 'green' }} /> : null
        ) },
      ];
      
    
    const BorderLinearProgress = styled(LinearProgress)(() => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: '#b2b2b254',

        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: "#ff2fc2"
        },
      }));

    const getAllMyTasks = async () => {
        await axios.get(`/tasks`)
            .then((res) => {
                const allTasks: TaskInterface[] = res.data.data
                const all = allTasks.filter(task => task.assignee === user?.id);
                const done = allTasks.filter(task => task.done === true && task.assignee === user?.id);
                setAllTasks(all);
                setDonetasks(done);
                setTaskData([
                    {name: 'Done', value: done.length},
                    {name: 'Not Done', value: all.length - done.length},
                ])
            }).catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllMyTasks()
        dispatch(setSelectedBoardRedux(null))
        setTimeout(() => {
            setIsLoading(false)
        }, 300)
    }, [])
      
  return (
    <Card style={{ marginLeft: 30, padding: 30, marginTop: 16}}>
      <div >

        <Typography variant='h5'>Hey {user?.firstName},</Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6}}>
            <Typography variant='body2'>Your progress looks great!</Typography>
            <AutoAwesome sx={{ color: 'rgb(255, 230, 4)'}}/>
        </div>
        <Typography  style={{padding: '20px'}} variant='h2'>Your points: {totalPoints}</Typography>
        <div style={{ display: 'flex', marginBottom: '20px'}}>

            <PrettyCard boxShadow={1} style={{backgroundColor: 'rgb(160 211 255 / 22%)'}}>
                {!isLoading ? (
                    <>
                        <Typography sx={{fontSize: '60px'}} variant='h3'>{totalPoints}</Typography>
                        <Typography variant='body1'>total points</Typography>
                    </>
                ): null}
                
            </PrettyCard>
            <PrettyCard boxShadow={1} style={{backgroundColor: 'rgb(231 236 130 / 15%)'}}>
            {!isLoading ? (
                <>
                    <Typography variant='body1'>Current title</Typography>
                    <img src={badgeImage} width='100px' alt='novice' />
                    <Typography sx={{fontSize: '50px'}} variant='h5'>{title}</Typography>
                </>
            ): null}
                
            </PrettyCard>
            <PrettyCard boxShadow={1} style={{backgroundColor: 'rgb(160 255 218 / 22%)'}}>
            {!isLoading ? (
                <>
                    <Typography variant='body1'>Tasks done</Typography>
                    <Typography sx={{fontSize: '60px'}} variant='h3'>{doneTasks.length} / {allTasks.length}</Typography>
                </>
            ): null}
            </PrettyCard>
            <PrettyCard boxShadow={1} style={{backgroundColor: 'rgb(255 85 204 / 14%)'}}>
            {!isLoading ? (
                <>
                    <Typography variant='body1'>Points till next title</Typography>
                    <LinearProgress variant="determinate" value={(totalPoints / pointsTillNext) * 100} />
                    <Typography variant='h5'>{nextTitle}</Typography>
                    <Typography sx={{fontSize: '60px'}} variant='h3'>{pointsTillNext}</Typography>
                    <Grid spacing={1} container>
                        <Grid xs item>
                            <BorderLinearProgress variant="determinate" value={(totalPoints / (totalPoints + pointsTillNext)) * 100} />
                        </Grid>
                    </Grid>               
                </>
            ): null}
            </PrettyCard>
        </div>
        <Typography variant='h6' style={{ marginTop: '40px'}}>All my tasks</Typography>
        <TableContainer component={Paper} style={{ width: '90%', marginTop: '10px' }}>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
            rows={allTasks}
            columns={columns}
            initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
            pageSizeOptions={[5, 10, 20]}
            getRowId={(row) => row._id}
            />
        </div>
        </TableContainer>
    </div>

    <Typography variant='h6' style={{ marginTop: '40px'}}>Tasks Completion Status</Typography>
        <ResponsiveContainer width="100%" height={400}>
        <PieChart>
            <Pie
            data={taskData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
            >
            <Cell key={`cell-0`} fill="rgb(237, 80, 180)" />
            <Cell key={`cell-1`} fill="rgb(82, 67, 170)" />
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
        </ResponsiveContainer>


    </Card>
  )
}


export default Progress;
