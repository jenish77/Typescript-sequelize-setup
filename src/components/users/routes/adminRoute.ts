// const express = require('express');
import express from 'express'
const router = express.Router()
const adminController = require('../adminController');
const auth = require('../middleware/auth')

// router.post('/register', userController.register)
router.post('/login', adminController.login)
// router.get('/get-profile', auth, userController.getProfile)
// router.put('/logout', auth,userController.logout)
// router.post('/upload-image', userController.uploadImage)


module.exports = router;