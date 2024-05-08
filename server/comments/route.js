const express = require('express');
const commentController = require('./controller');
const router = express.Router();

router.get('/:id', commentController.getComments)

router.post('/', commentController.postComment)

module.exports = router;
