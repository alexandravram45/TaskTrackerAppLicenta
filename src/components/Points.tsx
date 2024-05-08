import { Box, Button, Card, Container, Divider, Grid, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, linearProgressClasses } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppState, setSelectedBoardRedux } from '../store';
import axios from 'axios';
import { Board, ColumnInterface, TaskInterface } from './Home';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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




const Points = () => {

    const currentUser = useSelector((state: AppState) => state.currentUser);
    const dispatch = useDispatch()
    const [doneTasks, setDonetasks] = useState<TaskInterface[]>([])
    const [allTasks, setAllTasks] = useState<TaskInterface[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortColumn, setSortColumn] = useState<string>('');

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


    const getMyDoneTasks = async () => {
        await axios.get(`http://localhost:5000/tasks`)
            .then((res) => {
                const allTasksFromDb: TaskInterface[] = res.data.data
                const filteredTasks = allTasksFromDb.filter(task => task.done === true && task.assignee === currentUser?.id);
                setDonetasks(filteredTasks);
            }).catch((err) => {
                console.log(err)
            })
    }

    const getAllMyTasks = async () => {
        await axios.get(`http://localhost:5000/tasks`)
            .then((res) => {
                const allTasks: TaskInterface[] = res.data.data
                const filteredTasks = allTasks.filter(task => task.assignee === currentUser?.id);
                setAllTasks(filteredTasks);
                console.log(filteredTasks);
            }).catch((err) => {
                console.log(err)
            })
    }

    const totalPoints = doneTasks.reduce((total, task) => {
        return total + (task.points ?? 0);
    }, 0);
    
    useEffect(() => {
        getMyDoneTasks()
        getAllMyTasks()
        dispatch(setSelectedBoardRedux(null))
        setTimeout(() => {
            setIsLoading(false)
        }, 300)
    }, [])

    const getTitleAndPointsTillNext = (points: number): { title: string, pointsTillNext: number } => {
        if (points <= 50) {
            return { title: "Novice", pointsTillNext: 50 - points };
        } else if (points <= 100) {
            return { title: "Explorer", pointsTillNext: 100 - points };
        } else if (points <= 200) {
            return { title: "Challenger", pointsTillNext: 200 - points };
        } else {
            return { title: "Wizard", pointsTillNext: 0 };
        }
    }
    
    const { title, pointsTillNext } = getTitleAndPointsTillNext(totalPoints);

    type TitleImages = {
        [key: string]: string;
    }

    const titles = ['Novice', 'Explorer', 'Challenger', 'Wizard', 'You reached the maximum level'];
    const currentIndex = titles.indexOf(title);
    const nextTitle = currentIndex !== -1 && currentIndex < titles.length - 1 ? titles[currentIndex + 1] : null;

    const titleImages: TitleImages = {
        Novice: require('../novice.png'),
        Explorer: require('../explorer.png'),
        Challenger: require('../challenger.png'),
        Wizard: require('../wizard.png'),
    };

    const badgeImage = titleImages[title];

    const handleSort = (column: string) => {
        const newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        if (column === sortColumn) {
            // Dacă da, inversăm ordinea sortării
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
        const sortedTasks = [...allTasks].sort((a, b) => {
        if (column === 'title') {
            return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (column === 'dueDate') {
            if (a.dueDate && b.dueDate) {
            return sortOrder === 'asc' ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            } else {
            return a.dueDate ? -1 : b.dueDate ? 1 : 0;
            }
        } else if (column === 'points') {
            return sortOrder === 'asc' ? (a.points || 0) - (b.points || 0) : (b.points || 0) - (a.points || 0);
        }
        return 0;
        });
            
        setAllTasks(sortedTasks);
      }
      
  return (
    <Card style={{ marginLeft: 30, padding: 30}}>
      {/* <div style={{ display: 'flex', padding: '50px', justifyContent: 'center', alignItems: 'center' }}>
        <img src={require('../ticked.png')} width='300px' alt='ticked' style={{ marginRight: '20px' }} />
        <Button style={{backgroundColor: '#0c66e4', color: 'white'}}><PersonAddAltIcon style={{marginRight: 10}} />Invite members</Button>
      </div>

      <Divider /> */}
      <div >

        <Typography variant='h5'>Hey {currentUser?.firstName},</Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6}}>
            <Typography variant='body2'>Your progress looks great!</Typography>
            <AutoAwesome sx={{ color: 'rgb(255, 230, 4)'}}/>
        </div>


        <Typography  style={{padding: '20px'}} variant='h2'>Your points: {totalPoints}</Typography>
        {/* <LinearProgress variant="determinate" value={50} /> */}

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
        <Typography variant='body2' >All my tasks</Typography>

        <TableContainer component={Paper} style={{width: '90%', marginTop: '10px'}}>
        <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell sx={{fontWeight: 700 , ":hover": {backgroundColor: 'rgba(113, 113, 113, 0.121)', cursor: 'pointer'}}} onClick={() => handleSort('title')}> 
                        Task title
                    </TableCell>
                    <TableCell sx={{fontWeight: 700}}>Description</TableCell>
                    <TableCell sx={{fontWeight: 700 , ":hover": {backgroundColor: 'rgba(113, 113, 113, 0.121)', cursor: 'pointer'}}} onClick={() => handleSort('dueDate')}>Due date</TableCell>
                    <TableCell sx={{fontWeight: 700 , ":hover": {backgroundColor: 'rgba(113, 113, 113, 0.121)', cursor: 'pointer'}}} onClick={() => handleSort('points')}>Points</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {allTasks.map((task) => (
                <TableRow
                key={task._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {task.title}
                </TableCell>
                <TableCell >
                    <ReactQuill 
                        theme='bubble' 
                        readOnly={true}
                        value={task.description}
                    />

                </TableCell>
                <TableCell>
                    {task.dueDate ? (
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    ) : null}
                </TableCell>
                <TableCell >{task.points}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </div>

    </Card>
  )
}

export default Points
