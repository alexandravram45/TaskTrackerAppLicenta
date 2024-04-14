const express = require('express');
const boardController = require('./controller');
const router = express.Router();

router.get('/', boardController.getAllBoards)

router.post('/', boardController.createBoard)

router.get('/:id', boardController.getBoardById)

router.put('/:id', boardController.updateBoard)

router.put('/update-name/:id', boardController.updateBoardName)

router.put('/add-to-favorites/:id', boardController.addToFavorites)

router.get('/:boardId/join/:userId', boardController.addMemberToBoard)

module.exports = router;
