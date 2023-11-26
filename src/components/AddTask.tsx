import React, { useState } from 'react'
import { 
  Button, 
  CardContent, 
  TextField, 
  Typography, 
  Card 
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

const AddTask = () => {

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());
  const [description, setDescription] = useState("");


  const addNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await axios.post('http://localhost:5000/tasks', {
      title: title, 
      dueDate: dueDate, 
      description: description
    })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error.message)
      })

      setTitle('')
      setDueDate(dayjs())
      setDescription('')
      
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: '50%', marginLeft: '25%' }}>
        <CardContent sx={{ minWidth: 300, textAlign: 'center',  marginX: 10, padding: 10 }}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Add new task
          </Typography>
          <form onSubmit={addNewTask} style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <TextField id="standard-basic" label="Title" variant="outlined" fullWidth value={title} onChange={(e) => setTitle(e.target.value)}/>
            <DatePicker minDate={dayjs()} label="Due date" value={dueDate} onChange={(e) => setDueDate(e)}/>
            <TextField id="standard-basic" label="Description" variant="outlined" fullWidth multiline rows={5} value={description} onChange={(e) => setDescription(e.target.value)}/>
            <Button type='submit'>Add task</Button>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default AddTask
