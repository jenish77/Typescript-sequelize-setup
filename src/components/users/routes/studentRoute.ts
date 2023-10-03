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
router.post('/add-category',userController.addCategory)
router.post('/edit-category',userController.editCategory)
router.get('/show-category',userController.showCategory)
router.get('/show-category-by-id',userController.showCategoryById)
router.get('/get-text-by-id',userController.getTextById)
router.delete('/delete-category',userController.deleteCategory)
router.post('/add-text',userController.addText)
router.post('/create-customer',userController.createNewCustomer)
router.post('/add-card',userController.addNewCard)
router.post('/charges',userController.charges)
router.post('/send-sms',userController.sendSMS)

module.exports = router;