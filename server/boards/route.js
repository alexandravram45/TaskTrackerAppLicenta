const express = require('express');
const boardController = require('./controller');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, boardController.getAllBoards)

router.get('/archived', authenticate, boardController.getAllArchivedBoards)

router.post('/', authenticate, boardController.createBoard)

router.get('/:id', authenticate, boardController.getBoardById)

router.put('/:id', authenticate, boardController.updateBoard)

router.put('/update-name/:id', authenticate, boardController.updateBoardName)

router.put('/add-to-favorites/:id', authenticate, boardController.addToFavorites)

router.get('/:boardId/join/:userId', boardController.addMemberToBoard)

router.delete('/:id',authenticate, boardController.deleteBoard)

module.exports = router;
