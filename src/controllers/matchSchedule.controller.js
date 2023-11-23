const moment = require("moment");
const { prisma } = require("../../prisma/prisma");

exports.addMatchSchedule = async (req, res) => {

    try {
        let { date, team1, team2 } = req.body

        const formatDate = moment(date).toISOString();

        delete req.body.date
        delete req.body.team1MatchResultId
        delete req.body.team2MatchResultId
        delete req.body.team1Result
        delete req.body.team2Result

        await prisma.matchSchedule.create({
            data: {
                date: formatDate,
                team1MatchResult: {
                    create: {
                        result: 0,
                        team: team1
                    }
                },
                team2MatchResult: {
                    create: {
                        result: 0,
                        team: team2
                    }
                },
                ...req.body
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Schedule created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.editMatchSchedule = async (req, res) => {
    try {

        let { date, team1MatchResultId, team2MatchResultId, team1Result, team2Result } = req.body
        const { id } = req.params

        const formatDate = moment(date).toISOString();

        delete req.body.date

        const isScheduleFound = await prisma.matchSchedule.findUnique({
            where: {
                id
            }
        })

        delete req.body.team1MatchResultId
        delete req.body.team2MatchResultId
        delete req.body.team1Result
        delete req.body.team2Result

        if (!isScheduleFound) {
            throw new Error('Schedule not found!')
        }

        await prisma.matchSchedule.update({
            where: {
                id
            },
            data: {
                date: formatDate,
                team1MatchResult: {
                    update: {
                        where: {
                            id: team1MatchResultId
                        }, data: {
                            result: parseInt(team1Result)
                        }
                    }
                },
                team2MatchResult: {
                    update: {
                        where: {
                            id: team2MatchResultId
                        }, data: {
                            result: parseInt(team2Result)
                        }
                    }
                },
                ...req.body
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Schedule updated successfully!'
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteMatchSchedule = async (req, res) => {
    try {

        const { id } = req.params


        const isScheduleFound = await prisma.matchSchedule.findUnique({
            where: {
                id
            }
        })

        if (!isScheduleFound) {
            throw new Error('Schedule not found!')
        }

        await prisma.matchSchedule.delete({
            where: {
                id
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Schedule deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getAllMatchSchedule = async (req, res) => {
    try {

        const matches = await prisma.matchSchedule.findMany({
            select: {
                id: true,
                date: true,
                day: true,
                hour: true,
                team1: true,
                team2: true,
                team1MatchResult: true,
                team2MatchResult: true
            }
        })

        return res.status(201).json({
            success: true,
            message: '',
            matches
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}