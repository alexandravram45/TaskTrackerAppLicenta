const express = require('express');
const taskController = require('./controller');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/get-by-columnId/:id', authenticate, taskController.getTasksByColumnId)

router.get('/', authenticate, taskController.getAllTasks)
 
router.post('/', authenticate, taskController.addTask)

router.get('/get-by-id/:id',authenticate, taskController.getTaskById)

router.delete('/:id/:boardId',authenticate, taskController.deleteTask)

router.put('/:id', authenticate, taskController.updateTask)

module.exports = router;
