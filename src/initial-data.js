const initialData = {
    tasks: {
      'task-1': { title: 'Take out the garbage', id: 'task-1' },
      'task-2': { title: 'Watch my favorite show', id: 'task-2' },
      'task-3': { title: 'Charge my phone', id: 'task-3' },
      'task-4': { title: 'Cook dinner', id: 'task-4' },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2', 'column-3'],
  };
  
  export default initialData;
  