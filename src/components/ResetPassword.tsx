import { Card, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { StyledButton } from './AppMenuBar';
import KeyIcon from '@mui/icons-material/Key';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { styles } from './AccountVerify';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ResetContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const ResetPassword = () => {
    const params = useParams();
    const [validReset, setValidReset] = useState(true);
    const [buttonPressed, setButtonPressed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [passwordVisibility, setPasswordVisibility] = useState('password')
    const [userId, setUserId] = useState('')


    useEffect(() => {
        findUserToken(params.token)
    }, [])

    const findUserToken = async (id: string | undefined) => {
        await axios.get(`/token/${id}`).then((res) => {
           setValidReset(true)
           setUserId(res.data.userId)
        }).catch((err) => {
            setValidReset(false)
            setLoading(false)
            console.log(err.message)
        })
    }

    const handlePasswordReset = async (userId: string | undefined, newPassword: string, token: string | undefined) => {
        setButtonPressed(true)
        await axios.put(`/user/${userId}/resetPassword/${token}`, {
            password: newPassword
        }).then((res) => {
            toast.success('Password reset successfully!', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                draggable: true,
                theme: "light",
              });

            setValidReset(true)
            formik.resetForm();
        }).catch((err) => {
            setValidReset(false)
            console.log(err.message)
        })
    }

    const validationSchema = Yup.object().shape({
        newPassword: Yup.string()
          .required('password is required')
          .min(6, 'password must contain at least 6 characters')
          .max(50, 'password is too long!')
      });
      
      let initialValues = {
        newPassword: "",
      };
      
      const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
          handlePasswordReset(userId, values.newPassword, params.token)
        }
      })

      const handlePasswordVisibility = () => {
        passwordVisibility === 'text' ? setPasswordVisibility('password') : setPasswordVisibility('text')
    }
    
    
  return (
    <div style={styles.container}>
    <ResetContainer>
            {!buttonPressed && validReset ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center'}}>
                        <img src={require('../images/ticked.png')} width='350px' alt='ticked'/>
    
                        <Card style={{ backgroundColor: 'rgba(0, 0, 0, 0.032)', padding: '60px', height: '300px'}}>
                            <Typography variant="h5" style={{color: '#5B42F3', fontWeight: '700', fontFamily: 'Poppins', marginBottom: 20}}>Reset your password</Typography>
                            <form 
                                style={{ textAlign: 'center', display: 'flex', flexDirection: "column", alignItems: "center", gap: 20}}
                                onSubmit={formik.handleSubmit}
                            > 
                                <TextField id="newPassword" name='newPassword' label="New password" variant="standard" 
                                    type={passwordVisibility} 
                                    value={formik.values.newPassword} 
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <IconButton onClick={handlePasswordVisibility}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    )
                                    }}  
                                    style={{ width: 230 }}
                                />
                                <StyledButton type='submit'>
                                    <span>Reset</span>
                                </StyledButton>
                    
                            </form>
                        </Card>
                    </div>
                ) : validReset ? (
                        <div style={styles.successMessage}>
                            <p>Password reset!</p>
                            <a href="/" style={styles.link}>Return to login page</a>
                        </div>
                    ) : ( <p style={styles.errorMessage}>404 not found</p> )}
            
    </ResetContainer>
      
    </div>
  )
}

export default ResetPassword
