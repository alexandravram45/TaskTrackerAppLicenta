const express = require('express');
const tokenController = require('./controller');

const router = express.Router();

router.get('/:id', tokenController.getToken)

module.exports = router;