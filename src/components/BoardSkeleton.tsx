import { Skeleton } from '@mui/material'

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
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '20px'
        }}>
                <Skeleton variant="rounded" width={300} height={500} sx={{ borderRadius: '20px', padding: '10px', margin: '10px'}} />
                <Skeleton variant="rounded" width={300} height={350} sx={{ borderRadius: '20px', padding: '10px', margin: '10px'}}/>
                <Skeleton variant="rounded" width={300} height={400} sx={{ borderRadius: '20px', padding: '10px', margin: '10px'}}/>
                <Skeleton variant="rounded" width={300} height={30} sx={{ borderRadius: '20px', padding: '10px', margin: '10px'}}/>
            
        </div>
    </div>
  )
}

export default BoardSkeleton
