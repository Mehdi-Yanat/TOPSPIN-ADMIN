const moment = require("moment");
const { prisma } = require("../../prisma/prisma");

exports.addMatchSchedule = async (req, res) => {

    try {
        let { date, team1, day, hour, team2, leagueId } = req.body

        const formatDate = moment(date).toISOString();

        await prisma.matchSchedule.create({
            data: {
                leagues: {
                    connect: {
                        id: parseInt(leagueId)
                    }
                },
                date: formatDate,
                team1MatchResult: 0,
                team2MatchResult: 0,
                team1,
                team2,
                day,
                hour,
                results: {
                    create: {
                        date: formatDate,
                        identifierName: `${team1} - ${team2}`,
                        leagues: {
                            connect: {
                                id: parseInt(leagueId)
                            }
                        }
                    }
                }
            },
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

        let { date, day, team1, team2, hour, team1Result, team2Result } = req.body
        const { id } = req.params

        const formatDate = moment(date).toISOString();

        const isScheduleFound = await prisma.matchSchedule.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                results: {
                    select: {
                        id: true,
                    }
                }
            }
        })

        if (!isScheduleFound) {
            throw new Error('Schedule not found!')
        }

        await prisma.matchSchedule.update({
            where: {
                id
            },
            data: {
                date: formatDate,
                day,
                team1,
                team2,
                hour,
                team1MatchResult: parseInt(team1Result) || 0,
                team2MatchResult: parseInt(team2Result) || 0,
                results: {
                    update: {
                        where: {
                            id: isScheduleFound.results[0].id
                        },
                        data: {
                            date: formatDate,
                            identifierName: `${team1} - ${team2}`
                        }
                    }
                }
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
            },
        })

        await prisma.results.delete({
            where: {
                id: isScheduleFound.id
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

exports.getAllPlayOff = async (req, res) => {
    try {

        const playoff = await prisma.playoff.findMany({
            select: {
                id: true,
                identifierName: true,
                playoffNumber: true,
                playoffTable: {
                    select: {
                        id: true,
                        team: true,
                        result: true
                    }
                }
            }
        })

        return res.status(201).json({
            success: true,
            message: '',
            playoff
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.addPlayOffTable = async (req, res) => {
    try {

        const { identifierName, playoffNumber } = req.body

        await prisma.playoff.create({
            data: {
                identifierName,
                playoffNumber: parseInt(playoffNumber),
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Playoff table was created successfully!',
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.addPlayOffTableRow = async (req, res) => {
    try {

        const { id } = req.params
        const { team, result } = req.body

        await prisma.playoffTable.create({
            data: {
                team,
                result: parseFloat(result),
                playoff: {
                    connect: {
                        id: parseInt(id)
                    }
                }
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Playoff table row was created successfully!',
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.editPlayOffTableRow = async (req, res) => {
    try {

        const { rowId } = req.params
        const { team, result } = req.body

        await prisma.playoffTable.update({
            where: {
                id: parseInt(rowId)
            }, data: {
                team,
                result: parseFloat(result)
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Playoff table row was updated successfully!',
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deletePlayOffTable = async (req, res) => {
    try {

        const { id } = req.params

        await prisma.playoff.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Playoff table was deleted successfully!',
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deletePlayOffTableRow = async (req, res) => {
    try {

        const { rowId } = req.params

        await prisma.playoffTable.delete({
            where: {
                id: parseInt(rowId)
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Playoff table row was deleted successfully!',
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}