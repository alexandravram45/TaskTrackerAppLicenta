const express = require('express');
const userController = require('./controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', userController.getUserById)

router.get('/get-by-email/:email', userController.getUserByEmail)

router.post('/register', userController.register)

router.post('/login', userController.login)

router.post('/logout', userController.logout)

router.get('/:id/verify/:token', userController.confirmEmail)

router.put('/:id/resetPassword/:token', userController.resetPassword)

router.post('/:id/sendResetPasswordEmail', userController.sendResetPasswordEmail)

router.post('/:userId/invite/:boardId', userController.sendInvitationLink)

router.post('/:userId/assign/:boardId', userController.sendAssignNotification)

router.get('/:userId/points', userController.getUserPoints);

module.exports = router;