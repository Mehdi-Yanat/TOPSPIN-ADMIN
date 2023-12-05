const express = require("express");

const router = express.Router();

const leaguesController = require('../controllers/leagues.controller');
const { isAuth } = require('../middlewares/auth.js');
const validate = require("../utils/functions.js");


router.post('/', validate.validateAddLeagues, isAuth, leaguesController.addLeagues)

router.put('/:id', validate.validateAddLeagues, validate.validateLeagues, isAuth, leaguesController.editLeagues)

router.delete('/:id', validate.validateLeagues, isAuth, leaguesController.deleteLeagues)

router.get('/', leaguesController.getAllLeagues)

router.get('/:id/group/:groupId', validate.validateLeagues, leaguesController.getOneLeagues)



module.exports = router;