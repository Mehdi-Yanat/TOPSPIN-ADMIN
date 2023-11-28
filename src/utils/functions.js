const { validationResult, body, param } = require("express-validator");

const validate = validations => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorsMessage = errors.array().map(el => el.msg)


        res.status(500).json({ success: false, message: errorsMessage });
    };
};


const validateAddAdmin = validate([
    body('email').isEmail(),
    body('password').isLength({ min: 4 }),
])

const validateEditAdmin = validate([
    body('email').isEmail(),
    body('password').isLength({ min: 4 }),
    body('mobile'),
    body('firstName').isLength({ min: 4 }),
    body('lastName').isLength({ min: 4 }),
])

const validateSchedule = validate([
    body('date').isDate(),
    body('day').isLength({ min: 2 }),
    body('hour').isLength({ max: 6 }),
    body('team1').isLength({ min: 1 }),
    body('team2').isLength({ min: 1 }),
    body('leagueId'),
])

const validateAddPlayOffTable = validate([
    body('identifierName').isLength({ min: 1 }),
    body('playoffNumber').isInt(),
])

const validateAddPlayOffRow = validate([
    body('team').isLength({ min: 1 }),
    body('result').isFloat(),
])

const validateAddLeagues = validate([
    body('leagueName').isLength({ min: 4 }),
])

const validateScheduleParams = validate([
    param('id').isInt().toInt(),
])

const validateLeagues = validate([
    param('id').isInt().toInt(),
])


module.exports = { validateSchedule, validateScheduleParams, 
    validateAddAdmin, validateEditAdmin, validateAddPlayOffTable , validateAddPlayOffRow , 
    validateAddLeagues, validateLeagues }