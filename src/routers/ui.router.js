const express = require("express");

const router = express.Router();

const uiController = require('../controllers/ui.controller.js');
const { isAuth } = require('../middlewares/auth.js');
const imageUpload = require("../middlewares/uploadImage.js");


router.put('/popup', isAuth, imageUpload.single('popupImage'), uiController.editPopup);

router.get('/popup', uiController.getPopup)





module.exports = router;