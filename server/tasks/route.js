const express = require('express');
const taskController = require('./controller');
const router = express.Router();

router.get('/get-by-columnId/:id', taskController.getAllTasks)
 
router.post('/', taskController.addTask)

router.get('/get-by-id/:id', taskController.getTaskById)

router.delete('/:id', taskController.deleteTask)

router.put('/:id', taskController.updateTask)

module.exports = router;
