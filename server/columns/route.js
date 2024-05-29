const express = require('express');
const columnController = require('./controller');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, columnController.getColumnsByBoardId)

router.get('/get-by-id/:id', authenticate, columnController.getColumnById)

router.put('/:id', authenticate, columnController.updateColumn)

router.post('/', authenticate, columnController.createColumn)

router.delete('/:id/:boardId', authenticate, columnController.deleteColumn)

module.exports = router;
