// const express = require('express');
import express from 'express'
const router = express.Router()
const userController = require('../userController');
const auth = require('../middleware/auth')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/get-profile', auth, userController.getProfile)
router.get('/get-all-profile', userController.getAllProfile)
router.put('/logout', auth,userController.logout)
router.post('/upload-image', userController.uploadImage)
router.post('/upload-file', userController.uploadPdf)
router.post('/upload-video', userController.uploadVideo)


module.exports = router;