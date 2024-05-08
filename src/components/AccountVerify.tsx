import { CircularProgress } from '@mui/material';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { CSSProperties } from 'styled-components';

export const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    successMessage: {
        textAlign: 'center',
        fontSize: '24px',
    },
    errorMessage: {
        textAlign: 'center',
        fontSize: '18px',
    },
    link: {
        textDecoration: 'none',
        color: 'blue',
        marginTop: '10px',
    },
};

const AccountVerify = () => {
    const params = useParams();
    const [validUrl, setValidUrl] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/user/${params.id}/verify/${params.token}`)
        .then((res) => {
            console.log(res)
            setValidUrl(true)
        })
        .catch((err) => {
            console.log(err)
            setValidUrl(false)
        })
    }, [params])


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={styles.container}>
            {loading ? (
                <div style={styles.progressContainer}>
                    <CircularProgress />
                </div>
            ) : (
                validUrl ? (
                    <div style={styles.successMessage}>
                        <p>Account verified!</p>
                        <a href="/" style={styles.link}>Return to login page</a>
                    </div>
                ) : (
                    <p style={styles.errorMessage}>404 not found</p>
                )
            )}
        </div>
  )
}

export default AccountVerify
