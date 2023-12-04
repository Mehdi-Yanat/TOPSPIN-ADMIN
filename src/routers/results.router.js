const express = require("express");

const router = express.Router();

const resultsController = require('../controllers/results.controller.js');
const { isAuth } = require('../middlewares/auth.js');
const validate = require("../utils/functions.js");


router.post('/', validate.validateResults, isAuth, resultsController.addResults)
router.post('/match', validate.validateResultsMatch, isAuth, resultsController.addResultsMatchTableRow)

router.put('/:id', validate.validateResultParams, validate.validateResults, isAuth, resultsController.editResults)
router.put('/match/:id', validate.validateResultParams, validate.validateResultsMatch, isAuth, resultsController.editResultsMatchTableRow)

router.delete('/:id', validate.validateResultParams, isAuth, resultsController.deleteResultsTable)
router.delete('/match/:id', validate.validateResultParams, isAuth, resultsController.deleteResultsMatchTableRow)



module.exports = router;