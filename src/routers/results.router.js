const express = require("express");

const router = express.Router();

const resultsController = require('../controllers/results.controller.js');
const { isAuth } = require('../middlewares/auth.js');
const validate = require("../utils/functions.js");


router.post('/', validate.validateResults, isAuth, resultsController.addResults)

router.put('/:id', validate.validateResultParams, validate.validateResults, isAuth, resultsController.editResults)

router.delete('/:id', validate.validateResultParams, isAuth, resultsController.deleteResultsTable)



module.exports = router;