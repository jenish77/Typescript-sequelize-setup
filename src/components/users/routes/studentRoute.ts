const express = require('express');
const router = express.Router()
const userController = require('../userController');


router.post('/add-student', userController.addStudent)


module.exports = router;