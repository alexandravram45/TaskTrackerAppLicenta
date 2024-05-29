import { Skeleton } from '@mui/material'
import React from 'react'
import { ColumnContainer } from './BoardComponents'

const BoardSkeleton = () => {
  return (
    <div>
        <div style={{ borderBottom: '0.5px solid #ffffff73',}}>
            <div style={{
                display: 'flex', 
                marginLeft: '20px',
                alignItems: 'center',
                padding: 15,
                marginTop: '20px',
                gap: 20,
                }}>
                <Skeleton variant="text" sx={{ width: '100px', fontSize: '16px' }} />
                <Skeleton variant="circular"  width={50} height={50} />
                <Skeleton variant="circular" width={50} height={50} />  
                <div style={{ flexGrow: 1}}></div>
                <Skeleton variant="rounded" width={80} height={40} sx={{}} />  
                <Skeleton variant="circular" width={30} height={30} sx={{}} />  

            </div>
        </div>

        <div style={{
            display: 'flex',
            padding: 30,
            gap: 20
        }}>
                <Skeleton variant="rounded" width={300} height={500} sx={{ borderRadius: 4}} />
                <Skeleton variant="rounded" width={300} height={350} sx={{ borderRadius: 4}}/>
                <Skeleton variant="rounded" width={300} height={400} sx={{ borderRadius: 4}}/>
                <Skeleton variant="rounded" width={300} height={50} sx={{ borderRadius: 4}}/>
            
        </div>
    </div>
  )
}

export default BoardSkeleton
