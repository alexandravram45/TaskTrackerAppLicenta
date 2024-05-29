const express = require('express');
const commentController = require('./controller');
const { authenticate } = require('../middleware/auth');
const router = express.Router();


router.get('/:id', authenticate, commentController.getComments)

router.post('/', authenticate, commentController.postComment)

module.exports = router;
