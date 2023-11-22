const express = require("express");

const router = express.Router();

const matchScheduleController = require('../controllers/matchSchedule.controller');
const { isAuth } = require('../middlewares/auth.js');
const validate = require("../utils/functions.js");


router.post('/' , validate.validateSchedule , isAuth , matchScheduleController.addMatchSchedule)

router.put('/:id' , validate.validateSchedule , validate.validateScheduleParams , isAuth , matchScheduleController.editMatchSchedule)

router.delete('/:id' , validate.validateScheduleParams , isAuth , matchScheduleController.deleteMatchSchedule)

router.get('/' , isAuth , matchScheduleController.getAllMatchSchedule)

module.exports = router;