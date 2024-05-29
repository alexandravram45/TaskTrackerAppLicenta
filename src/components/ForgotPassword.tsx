import React, { useEffect, useState } from 'react';
import { InputAdornment, Link, Slide, TextField, Typography } from '@mui/material';
import { StyledButton } from './AppMenuBar';
import styled from 'styled-components';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


interface ForgotPasswordProps {
  handleToggleReset: () => void,
  landingEmail: string
}

const LoginContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const ForgotPassword:React.FC<ForgotPasswordProps> = ({ handleToggleReset, landingEmail }) => {

  const [userId, setUserId] = useState('')
  const [buttonPressed, setButtonPressed] = useState(false);

  const validationSchema = Yup.object().shape({
    resetEmail: Yup.string()
      .email("Enter a valid email")
      .required('email is required')
      .test('unique-title', 'You do not have an account', function(email) {
        return new Promise( (resolve, reject) => {
          axios.get(`/user/get-by-email/${email}`).then((res) => {
            resolve(true)
            setUserId(res.data._id)
          }).catch((err) => {
            resolve(false)
          })
        })
    })
  });

  let initialValues = {
    resetEmail: "" || landingEmail,
  };

  const handlePasswordReset = async (email: string) => {
      await axios.post(`/user/${userId}/sendResetPasswordEmail`, {
          email: email
      }).then((res) => {
          setButtonPressed(true)
      }).catch((err) => {
      console.log(err.message)
    })
  }

  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handlePasswordReset(values.resetEmail)
    }
  })

  return (
    <Slide in={true} direction="left" unmountOnExit>
    <LoginContainer>
      <>
        <Typography variant="h5" style={{color: '#5B42F3', fontWeight: '700', fontFamily: 'Poppins' }}>Find your account</Typography>
        <Typography variant="body2" style={{fontFamily: 'Poppins' }}>Please enter your email to search for your account.</Typography>

        <form 
            style={{ textAlign: 'center', display: 'flex', flexDirection: "column", alignItems: "center", gap: '20px'}}
            onSubmit={formik.handleSubmit}
            >  
            <TextField id="resetEmail" name="resetEmail" label="email" variant="standard" 
                value={formik.values.resetEmail} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.resetEmail && Boolean(formik.errors.resetEmail)}
                helperText={formik.touched.resetEmail && formik.errors.resetEmail}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                            <AlternateEmailIcon />
                    </InputAdornment>
                ),
                }}  
                style={{ width: 230 }}
              />

          {!buttonPressed ? (
            <>
              <Link component="button" onClick={handleToggleReset} style={{color: '#5B42F3'}} underline="hover">
              Back to login
              </Link>

              <StyledButton type='submit'>
              <span>Search</span>
              </StyledButton>
            </>
          ) : (
            <>
            <CheckCircleIcon style={{ color: '#5B42F3' }}/>
            <Typography variant='h5'>We've sent you an email</Typography>
            <Typography variant='body2'>To complete the password reset process, please verify your email address by clicking the link we've sent to your inbox.</Typography>
          </>
          )}

        </form>
      </>
    </LoginContainer>
    </Slide>
  );
}

export default ForgotPassword;
