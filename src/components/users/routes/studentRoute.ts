const express = require('express');
const router = express.Router()
const userController = require('../userController');
const auth = require('../middleware/auth')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/get-profile', auth, userController.getProfile)
router.put('/logout', auth,userController.logout)
router.post('/upload-image', userController.uploadImage)


module.exports = router;