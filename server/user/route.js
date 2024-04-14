const express = require('express');
const userController = require('./controller');

const router = express.Router();

router.get('/:id', userController.getUserById)

router.post('/register', userController.register)

router.post('/login', userController.login)

router.post('/logout', userController.logout)

router.get('/:id/verify/:token', userController.confirmEmail)

router.post('/:userId/invite/:boardId', userController.sendInvitationLink)

module.exports = router;