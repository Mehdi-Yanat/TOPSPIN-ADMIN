const express = require("express");

const router = express.Router();

const authController = require('../controllers/auth.controller.js');
const { isAuth } = require('../middlewares/auth.js');
const { validateAddAdmin, validateEditAdmin } = require("../utils/functions.js");


router.get('/check-token', isAuth, authController.checkToken);
router.get("/logout", isAuth, authController.logout);
router.get('/admin/lists', isAuth, authController.adminLists)

router.put('/admin/edit', validateEditAdmin, isAuth, authController.update);

router.post('/admin/add', validateAddAdmin, isAuth, authController.addAdmin);
router.post('/login', authController.login);
router.post('/send-verification-code', authController.sendVerificationCode);

router.delete('/admin/delete/:id', isAuth, authController.deleteAdmin);


module.exports = router;