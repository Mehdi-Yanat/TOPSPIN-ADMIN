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

const validateResultsMatch = validate([
    body('hour').isLength({ min: 4 }),
    body('matchCode').isLength({ min: 1 }).withMessage('Match code is required'),
    body('team1Name').isLength({ min: 1 }).withMessage('Team Name is required'),
    body('team1Code').isLength({ min: 1 }).withMessage('Team Code is required'),
    body('team2Name').isLength({ min: 1 }).withMessage('Team Name is required'),
    body('team2Code').isLength({ min: 1 }).withMessage('Team Code is required'),
    body('resultId'),
    body('team1').isArray().withMessage('Team1 must be an array'),
    body('team1.*.playerName').isLength({ min: 1 }).withMessage('Each player in team1 must have a name'),
    body('team1.*.categorie').isLength({ min: 1 }).withMessage('Each player in team1 must have a category'),
    body('team2').isArray().withMessage('Team1 must be an array'),
    body('team2.*.playerName').isLength({ min: 1 }).withMessage('Each player in team1 must have a name'),
    body('team2.*.categorie').isLength({ min: 1 }).withMessage('Each player in team1 must have a category'),
    body('set1').isObject().withMessage('set1 must be an object'),
    body('set1.team1').isInt().withMessage('set1.team1 must be an integer'),
    body('set1.team2').isInt().withMessage('set1.team2 must be an integer'),
    body('set2').isObject().withMessage('set2 must be an object'),
    body('set2.team1').isInt().withMessage('set2.team1 must be an integer'),
    body('set2.team2').isInt().withMessage('set2.team2 must be an integer'),
    body('set3').isObject().withMessage('set3 must be an object'),
    body('set3.team1').isInt().withMessage('set3.team1 must be an integer'),
    body('set3.team2').isInt().withMessage('set3.team2 must be an integer'),
])


module.exports = {
    validateSchedule, validateScheduleParams,
    validateAddAdmin, validateEditAdmin, validateAddPlayOffTable, validateAddPlayOffRow,
    validateAddLeagues, validateLeagues, validateResults, validateResultsMatches, validateResultsMatchesTeams,
    validateResultsMatchesTeamsPlayers, validateResultParams, validateResultsMatch
}