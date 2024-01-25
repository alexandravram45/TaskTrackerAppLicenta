import { Button, Card, List, Typography, styled } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import './styles.css'

const SideContainer = styled(Card)`
    width: 12%; 
    background-color: rgba(0, 0, 0, 0.034);
    flex: 1;
    float: left;
`;

const ListButton = styled(Button)`
    border-radius: 10px !important;
    transition: background-color 0.3s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.249);
    }
`;

const SideBar = () => {

  return (
    <SideContainer>
        <div style={{display: 'flex', flexDirection: 'column', padding: '20px', gap: 5}}>
            <ListButton id='button-wrapper' >
                <HomeIcon />
                <Typography ml='8px'>Boards</Typography>
            </ListButton>
            <ListButton id='button-wrapper'>
                <WorkspacePremiumIcon />
                <Typography ml='8px'>Members</Typography>
            </ListButton>
            <Typography variant='body2'>Your boards</Typography>
            <List>

            </List>
        </div>
    </SideContainer>
  )
}

export default SideBar
