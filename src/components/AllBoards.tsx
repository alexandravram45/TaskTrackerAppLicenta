import { Button, Card, CircularProgress, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Board } from './Home';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setSelectedBoardRedux } from '../store';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import { ColorButton, CreateButton } from './SideBar';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import CheckIcon from '@mui/icons-material/Check';
import { backgroundColors } from '../colors';
import StarIcon from '@mui/icons-material/Star';

interface AllBoardsProps {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-top: 20px;
  margin-left: 20px;
`;

const AddNewBoardButton = styled(IconButton)`
  && {
    text-transform: none;
    background-color: transparent;
    border-radius: 16px;
    color: #172b4d; 
    padding: 8px;
    transition: background-color 0.3s;
    align-items: center;  

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

const BoardCard = styled(Card)`
  && {
    width: 300px;
    height: 100px;
    padding: 10px;
    text-align: center;
    align-content: center; 
    align-items: center;
    display: flex;

    &:hover {
      background-color: rgba(79, 79, 79, 0.174);
    }
  }
`;

const AllBoards: React.FC<AllBoardsProps> = ({ user }) => {
  const [showAddNewBoardButton, setShowAddNewBoardButton] = useState(true);
  const [newBoardName, setNewBoardName] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedColor, setSelectedColor] = useState("")
  const boardsRedux = useSelector((state: AppState) => state.boards); 
  const [sortBy, setSortBy] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('');


  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterBy(event.target.value);
  };

  const dispatch = useDispatch();

  const addNewBoard = async (title: String, color: String) => {
    if (title === "") {
        toast.error('The board title should not be empty!', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            draggable: true,
            theme: "light",
          });
    } else {
        await axios.post('http://localhost:5000/board', {
            user: user,
            name: title,
            columns: [],
            color: color,
        }).then((response) => {
            toast.success(`Created board ${title}.`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                draggable: true,
                theme: "light",
              });

            console.log(response.data)
            getAllBoards(); // Fetch boards again to update the list
        }).catch((err) => {
            console.log(err)
        })
    } 
}

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('title is required')
  });

  let initialValues = {
    title: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
        addNewBoard(values.title, selectedColor)
        console.log(selectedColor)
    }
  })


  useEffect(() => {
    getAllBoards();
  }, [sortBy, filterBy]);

  const getAllBoards = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/board?userId=${user.id}`);
      let sortedBoards = response.data;

      // Sortare în funcție de criteriul selectat
      if (sortBy === 'createdAt') {
        sortedBoards = response.data.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      } else if (sortBy === 'title') {
        sortedBoards = response.data.sort((a: any, b: any) => {
          if (a.title && b.title) {
            return a.title.localeCompare(b.title);
          } else {
            return 0;
          }
        });
      }

      if (filterBy === "favorites") {
        sortedBoards = response.data.filter((a: any) => {
          return a.favorite === true;
        })
      }
      console.log(sortedBoards)

      setBoards(sortedBoards);
      // dispatch(setBoards(sortedBoards))

    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const addBoard = () => {
    setShowAddNewBoardButton(false);
  }

  const closeAddNewCard = () => {
    setShowAddNewBoardButton(true)
  }

  const handleNewBoardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewBoardName(event.target.value);
  }

  const saveNewBoard = () => {
    // Aici poți adăuga logica pentru a salva noul bord
    console.log("Noul bord salvat:", newBoardName);
    setShowAddNewBoardButton(true);
    setNewBoardName('');
  }

  return (
    <div>
      <div style={{ display: 'flex', marginTop: '50px', padding: '50px', justifyContent: 'center', alignItems: 'center' }}>
        <img src={require('../ticked.png')} width='300px' alt='ticked' style={{ marginRight: '20px' }} />
        <Button style={{backgroundColor: '#0c66e4', color: 'white'}}><PersonAddAltIcon style={{marginRight: 10}} />Invite members</Button>
      </div>

      <Divider />
      <Typography  style={{padding: '20px'}} variant='h2'>All boards</Typography>

      <FormControl style={{width: '200px', marginLeft: '20px'}}>
        <InputLabel id="demo-simple-select-label">Filter by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Filter by"
          onChange={handleFilterChange}
          value={filterBy}
        >
          <MenuItem value="default">-</MenuItem>
          <MenuItem value="favorites">Favorites</MenuItem>
        </Select>
      </FormControl>

      <FormControl style={{width: '200px', marginLeft: '20px'}}>
        <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="sort-by"
          label="Sort by"
          onChange={handleSortChange}
          value={sortBy}
        >
          <MenuItem value="none">-</MenuItem>
          <MenuItem value="createdAt">Date created</MenuItem>
          <MenuItem value="title">Title</MenuItem>
        </Select>
      </FormControl>

      <Container >
        {showAddNewBoardButton ? (
            <BoardCard onClick={addBoard}>
            <AddIcon style={{ marginRight: 4}} />
              <Typography>
                Create new board
              </Typography>
            </BoardCard>
        ) : (
          <BoardCard style={{ height: 'auto', flexDirection: 'column',  }}>
             <Button onClick={closeAddNewCard} style={{alignSelf: 'flex-end' , color: 'black', marginRight: '-10px', marginTop: '10px'}}>
                  <Close style={{ fontSize: '16px' }}/>
              </Button>
              <Typography style={{alignSelf: 'center'}} variant='body2'>Create board</Typography>
              <form 
                  style={{ display: 'flex', flexDirection: "column", gap: '20px'}}

                  onSubmit={formik.handleSubmit}
              >  
              <TextField 
                  variant='standard' 
                  label='title' 
                  name='title'
                  id='title'
                  value={formik.values.title} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
              />
              <Typography variant='body2'>Choose background</Typography>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap',}}>
              {
                  backgroundColors.map((color, index) => {
                      return <ColorButton 
                          key={index} 
                          style={{backgroundImage: color}}
                          onClick={() => setSelectedColor(color)}
                      >
                          { selectedColor === color ? (
                              <CheckIcon style={{ color: 'white' }} />
                          ) : null }
                      </ColorButton>
                  })
              }
              </div>
          
              <CreateButton type='submit'style={{marginBottom:'20px'}} >
                  Create board
              </CreateButton>
              </form>

          </BoardCard>
          
        )}

        {boards.map((board) => (
          <Link to={`/boards/${board._id}`} style={{ textDecoration: 'none' }} onClick={() => dispatch(setSelectedBoardRedux(board))}>
            <BoardCard style={{backgroundImage: board.color}}>
              <Typography variant='body1'>{board.name}</Typography>
              {
                board.favorite
                ? <StarIcon style={{color: 'rgba(17, 17, 17, 0.503)', marginLeft: 6}}/>
                : null
              }
            </BoardCard>
          </Link>
        ))}
      </Container>
    </div>
  )
}

export default AllBoards;
