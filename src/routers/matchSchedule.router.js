const express = require("express");

const router = express.Router();

const matchScheduleController = require('../controllers/matchSchedule.controller');
const { isAuth } = require('../middlewares/auth.js');
const validate = require("../utils/functions.js");


router.post('/', validate.validateSchedule, isAuth, matchScheduleController.addMatchSchedule)
router.post('/playoff', validate.validateAddPlayOffTable, isAuth, matchScheduleController.addPlayOffTable)
router.post('/playoff/:id/row/', validate.validateAddPlayOffRow, isAuth, matchScheduleController.addPlayOffTableRow)

router.put('/:id', validate.validateSchedule, validate.validateScheduleParams, isAuth, matchScheduleController.editMatchSchedule)
router.put('/playoff/row/:rowId', validate.validateAddPlayOffRow, isAuth, matchScheduleController.editPlayOffTableRow)

router.delete('/:id', validate.validateScheduleParams, isAuth, matchScheduleController.deleteMatchSchedule)
router.delete('/playoff/:id', isAuth, matchScheduleController.deletePlayOffTable)
router.delete('/playoff/row/:rowId', isAuth, matchScheduleController.deletePlayOffTableRow)

router.get('/', matchScheduleController.getAllMatchSchedule)
router.get('/playoff', matchScheduleController.getAllPlayOff)

module.exports = router;