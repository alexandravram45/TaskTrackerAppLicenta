const express = require('express');
const columnController = require('./controller');
const router = express.Router();

router.get('/', columnController.getColumnsByBoardId)

router.get('/get-by-id/:id', columnController.getColumnById)

router.put('/:id', columnController.updateColumn)

router.post('/', columnController.createColumn)

module.exports = router;
