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

const validateResults = validate([
    body('identifierName').isLength({ min: 4 }),
    body('date').isDate(),
    body('leagueId'),
])

const validateResultsMatches = validate([
    body('hour').isLength({ min: 1 }),
    body('matchCode').isLength({ min: 1 }),
])

const validateResultsMatchesTeams = validate([
    body('teamCode').isLength({ min: 1 }),
    body('teamName').isLength({ min: 1 }),
    body('set1').isInt(),
    body('set2').isInt(),
    body('set3').isInt(),
    body('matchScore').isInt(),
    body('matchPoint').isInt(),
    body('teamPoint').isInt(),
])


const validateResultsMatchesTeamsPlayers = validate([
    body('playerName').isLength({ min: 1 }),
    body('categorie').isLength({ min: 1 }),
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

const validateResultParams = validate([
    param('id').isInt().toInt(),
])

const validateLeagues = validate([
    param('id').isInt().toInt(),
])


module.exports = {
    validateSchedule, validateScheduleParams,
    validateAddAdmin, validateEditAdmin, validateAddPlayOffTable, validateAddPlayOffRow,
    validateAddLeagues, validateLeagues, validateResults, validateResultsMatches, validateResultsMatchesTeams,
    validateResultsMatchesTeamsPlayers, validateResultParams
}