const express = require("express");

const router = express.Router();

const playersController = require('../controllers/players.controller.js');
const { isAuth } = require('../middlewares/auth.js');
const validate = require("../utils/functions.js");
const { excelUploadMiddleware, processExcelMiddleware } = require("../middlewares/upload.js");
const imageUpload = require("../middlewares/uploadImage.js");


router.post('/', isAuth, excelUploadMiddleware, processExcelMiddleware, playersController.addGroups)

router.delete('/:id', isAuth, imageUpload.single('image'), playersController.removeGroups)




module.exports = router;