import { Box, Button, Card, Drawer, IconButton, Menu, TextField, Typography, styled, useMediaQuery } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import './styles.css'
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Close from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setBoards, setSelectedBoardRedux } from '../store';
import { Board } from './Home';
import MenuIcon from '@mui/icons-material/Menu';
import { backgroundColors } from '../colors';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { User } from '../App';
import Star from '@mui/icons-material/Star';

interface SideBarProps {
    user: User;
    onBoardSelect: (board: Board) => void;
}

interface MobileMenuButtonProps {
    onOpen: () => void;
  }

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onOpen }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 7, p: 2}}>
        <IconButton onClick={onOpen} size="large" edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
        </IconButton>
        </Box>
    );
  };

const SideContainer = styled(Card)`
    width: 240px; // Lățime fixă pentru container
    min-width: 240px;    
    background-color: rgb(255 255 255 / 16%);
    flex: 1;
    float: left;
    margin-top: 61px;
    border-right: 0.5px solid #ffffff73;
`;

const ListButton = styled(Button)`
    width: 100%;
    border-radius: 10px;


`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: background-color 0.3s;
  border-radius: 10px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.281);
  }
`;

export const CreateButton = styled(Button)`
    /* color: #000000; */
    width: 100%;
    /* background-color: #091e420f; */
    text-decoration: none;

    &:hover {
        background-color: #091e421f;

    }
`;

export const ColorButton = styled(Button)`
    width: 50px; 
    height: 50px;

    &:hover,
    &:active,
    &:visited {
        background-color: #061329ac;
    }
`;

const SideBar: React.FC<SideBarProps> = ({ user, onBoardSelect }) => {
    const [anchorBoard, setAnchorBoard] = useState<null | HTMLElement>(null);
    const location = useLocation();
    const [selectedColor, setSelectedColor] = useState("")
    const dispatch = useDispatch()
    const boards = useSelector((state: AppState) => state.boards);  
    const selectedBoard = useSelector((state: AppState) => state.selectedBoard);  
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:800px)');


    useEffect(() => {
        getAllBoards();
    }, [user.id, location.pathname, selectedBoard?.name, boards?.length, selectedBoard?.favorite]); //mai era boards aici nuj dc

    const handleOpenNewBoard = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorBoard(event.currentTarget);
    };
    
    const handleCloseNewBoard = () => {
        setAnchorBoard(null);
    };

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
      };
    
      const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
      };

    const addNewBoard = async (title: String, color: String) => {
        
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
    
    const getAllBoards = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/board?userId=${user.id}`);
            console.log("fetched boards: ", response.data);
            dispatch(setBoards(response.data));
        } catch (error) {
            console.error('Error fetching boards:', error);
        }
    };

    const handleBoardSelect = (board: Board) => {
        onBoardSelect(board);
        dispatch(setSelectedBoardRedux(board))
    };

    const setBackgroundColor = (boardId: string) => {
        if (location.pathname.includes(boardId)){
            return 'rgba(255, 255, 255, 0.281)'
        } else {
           return 'transparent'
        }
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string()
          .required('title is required')
          .test('unique-title', 'Board with this name already exists', function(value) {
            const boardExists = boards?.some(board => board.name === value);
            return !boardExists;
        })
      });
      
      let initialValues = {
        title: "",
      };
      
      const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values, { setFieldError }) => {
            addNewBoard(values.title, selectedColor)
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.message) {
                        setFieldError('title', error.response.data.message);
                    }
                });
        }
      })


  return (
    <>
        {isMobile ? (
            <>
                <MobileMenuButton onOpen={handleOpenDrawer} />
                <Drawer
                    anchor="left"
                    open={isDrawerOpen}
                    onClose={handleCloseDrawer}
                    ModalProps={{ keepMounted: true }}
                    PaperProps={{ sx: { backgroundColor: 'rgba(230, 230, 230, 0.882)' } }} // Setarea culorii transparente pentru drawer
                    >
                    <div style={{display: 'flex', flexDirection: 'column', padding: '20px', gap: 5, marginTop: '100px'}}>
                        <StyledLink to={'/boards'} >
                            <ListButton id='button-wrapper' >
                                <HomeIcon />
                                <Typography ml='8px'>Boards</Typography>
                            </ListButton>
                        </StyledLink>
                        <StyledLink to={'/boards/progress'} >
                            <ListButton id='button-wrapper' >
                                <AutoAwesomeIcon />
                                <Typography ml='8px'>Your progress</Typography>
                            </ListButton>
                        </StyledLink>
                       
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography variant='body2' fontWeight='bold'>
                                Your boards
                            </Typography>
                            <Box sx={{ ml: 1, textAlign: 'center'}}>
                                <ListButton onClick={handleOpenNewBoard} style={{ textDecoration: 'none', color: 'black'}} >
                                    <AddIcon  style={{ fontSize: '16px'}}/> 
                                </ListButton>
                                <Menu
                                    sx={{ ml: '26px' }}
                                    anchorEl={anchorBoard}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorBoard)}
                                    onClose={handleCloseNewBoard}
                                >    
                                    <Box sx={{ width: '266px', height: 'auto', padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Button onClick={handleCloseNewBoard} style={{alignSelf: 'flex-end' , color: 'black', marginRight: '-10px', marginTop: '-10px'}}>
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
                                    
                                        <CreateButton type='submit' onClick={handleCloseNewBoard}>
                                            Create board
                                        </CreateButton>
                                        </form>
                                    </Box>
                                </Menu>
                            </Box>
                        </div>
                            {boards && boards?.map((board: Board) => (
                                <StyledLink to={`/boards/${board._id}`} >
                                    <ListButton id='button-wrapper' key={board._id} onClick={() => handleBoardSelect(board)} style={{ backgroundColor: setBackgroundColor(board._id)}} >
                                        <Typography>
                                                {board.name}
                                        </Typography>
                                    </ListButton>
                                </StyledLink>
            
                            ))}
            
                    </div>
                </Drawer>
            </>
        ) : (
            <SideContainer>
            <div style={{display: 'flex', flexDirection: 'column', padding: '20px', gap: 5, marginTop: '70px',}}>
                {/* <div style={{ borderRadius: '50%', marginLeft: '46px', width: '100px', height: '100px', backgroundColor: 'rgba(255, 255, 255, 0.281)', position: 'relative', padding: 4, margin: 4, textAlign: 'center'}}>
                    <img src={require('../streak.png')} width='60px' alt='ticked' style={{  marginTop: '4px' }} />
                    <Typography style={{ top: '66px', left: '48px', position: 'absolute'}} variant='h5'>2</Typography>

                </div> */}
                <StyledLink to={'boards'} >
                    <ListButton id='button-wrapper' >
                        <HomeIcon />
                        <Typography ml='8px'>Boards</Typography>
                    </ListButton>
                </StyledLink>
                <StyledLink to={'progress'} >
                    <ListButton id='button-wrapper' >
                        <AutoAwesomeIcon />
                        <Typography ml='8px'>Your progress</Typography>
                    </ListButton>
                </StyledLink>
                
                
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='body2' fontWeight='bold'>
                        Your boards
                    </Typography>
                    <Box sx={{ ml: 1, textAlign: 'center'}}>
                        <ListButton onClick={handleOpenNewBoard} style={{ textDecoration: 'none', color: 'black'}} >
                            <AddIcon  style={{ fontSize: '16px'}}/> 
                        </ListButton>
                        <Menu
                            sx={{ ml: '20px' }}
                            anchorEl={anchorBoard}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            slotProps={{
                                paper: {
                                  style: {borderRadius: '10px'}
                                },
                              }}  
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorBoard)}
                            onClose={handleCloseNewBoard}
                        >    
                            <Box sx={{ width: '300px', height: 'auto', padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button onClick={handleCloseNewBoard} style={{alignSelf: 'flex-end' , color: 'black', marginRight: '-10px', marginTop: '-10px'}}>
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
                               
                                <CreateButton type='submit' onClick={handleCloseNewBoard}>
                                    Create board
                                </CreateButton>
                                </form>
                            </Box>
                        </Menu>
                    </Box>
                </div>
                    {boards && boards?.map((board: Board) => (
                        <StyledLink to={`/boards/${board._id}`} >
                            <ListButton id='button-wrapper' key={board._id} onClick={() => handleBoardSelect(board)} style={{ backgroundColor: setBackgroundColor(board._id)}} >
                                <Typography>
                                        {board.name}
                                </Typography>
                                {
                                    board.favorite === true 
                                    ? <Star style={{ marginLeft: 'auto', color: 'rgba(17, 17, 17, 0.503)'}}/>
                                    : null
                                }
                                
                            </ListButton>
                        </StyledLink>
    
                    ))}
    
            </div>
        </SideContainer>
        )}
 
    </>

  )
}

export default SideBar;
