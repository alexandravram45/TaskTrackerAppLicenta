import { Button, Card, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Board } from './Home';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setBoards, setSelectedBoardRedux } from '../store';
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

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-top: 20px;
  margin-left: 20px;
`;

const BoardCard = styled(Card)`
  && {
    width: 300px;
    height: 100px;
    padding: 20px;
    text-align: center;
    align-content: center; 
    align-items: center;
    display: flex;

    &:hover {
      background-color: rgba(79, 79, 79, 0.174);
    }
  }
`;

const AllBoards = () => {
  const [showAddNewBoardButton, setShowAddNewBoardButton] = useState(true);
  const [boards, setBoardsHere] = useState<Board[]>([]);
  const [selectedColor, setSelectedColor] = useState("")
  const [sortBy, setSortBy] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('');
  const currentUser = useSelector((state: AppState) => state.currentUser);
  const dispatch = useDispatch()

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterBy(event.target.value);
  };

  useEffect(() => {
    dispatch(setSelectedBoardRedux(null))
  })

  const addNewBoard = async (title: String, color: String) => {
      await axios.post('/board', {
          user: currentUser,
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
        
          const newBoard: Board = response.data.data;
          const updated = [...boards, newBoard]
          dispatch(setBoards(updated))
          getAllBoards(); 
          closeAddNewCard()

          formik.resetForm();

      }).catch((err) => {
          console.log(err)
      })

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
      if (values.title.trim() === "") {
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
          const existingBoard = boards.find(board => board.name === values.title);
          if (existingBoard) {
              toast.error(`Board with name "${values.title}" already exists!`, {
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
              addNewBoard(values.title, selectedColor);
          }
      }
  }
  
  })

  useEffect(() => {
    getAllBoards();
  }, [sortBy, filterBy]);

  const getAllBoards = async () => {
    try {
      const response = await axios.get(`/board?userId=${currentUser?.id}`);
      let sortedBoards = response.data;

      if (sortBy === 'createdAt') {
        sortedBoards = response.data.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      } else if (sortBy === 'title') {
        sortedBoards = response.data.sort((a: any, b: any) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          } else {
            return 0;
          }
        });
      }

      if (filterBy === "favorites") {
        sortedBoards = response.data.filter((a: any) => {
          return a.favorite === true;
        })
      } else if (filterBy === 'archived') {
        const response = await axios.get(`/board/archived?userId=${currentUser?.id}`);
        sortedBoards = response.data;
      }
      setBoardsHere(sortedBoards);

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


  return (
    <div>
      <Card style={{ margin: 30, marginTop: 16, padding: 30}}>
      
      <div style={{ display: 'flex', padding: '40px', justifyContent: 'center', alignItems: 'center' }}>
        <img src={require('../images/ticked.png')} width='300px' alt='ticked' style={{ marginRight: '20px' }} />
        <Button style={{backgroundColor: '#0c66e4', color: 'white'}}><PersonAddAltIcon style={{marginRight: 10}} />Invite members</Button>
      </div>
      </Card>

      <Card style={{ margin: 30, padding: 30, paddingBottom: 60}}>

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
          <MenuItem value="archived">Archived</MenuItem>
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
                  error={formik.touched.title && Boolean(formik.errors.title || boards.find(board => board.name === formik.values.title))}
                  helperText={(formik.touched.title && formik.errors.title) || (formik.touched.title && boards.find(board => board.name === formik.values.title) ? `Board with name "${formik.values.title}" already exists` : '')}               
              />
              <Typography variant='body2'>Choose background</Typography>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center'}}>
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
          <Link to={`/home/boards/${board._id}`} style={{ textDecoration: 'none' }} onClick={() => dispatch(setSelectedBoardRedux(board))}>
            <BoardCard style={{backgroundImage: board.color}}>
              <Typography variant='body1'
                sx={{
                  color: board.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092'
                }}
              >{board.name}</Typography>
              {
                board.favorite
                ? <StarIcon style={{
                  color: board.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092',
                  marginLeft: 6
                }}/>
                : null
              }
            </BoardCard>
          </Link>
        ))}
      </Container>
      </Card>

    </div>
  )
}

export default AllBoards;
