const { prisma } = require("../../prisma/prisma");

exports.addLeagues = async (req, res) => {

    try {
        let { leagueName } = req.body

        await prisma.leagues.create({
            data: {
                leagueName
            }
        })

        return res.status(201).json({
            success: true,
            message: 'League created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.editLeagues = async (req, res) => {
    try {

        const { id } = req.params
        const { leagueName } = req.body

        const isLeague = await prisma.leagues.findUnique({
            where: {
                id: parseInt(id),
            },
        })

        if (!isLeague) {
            throw new Error('League not found!')
        }

        await prisma.leagues.update({
            where: {
                id: isLeague.id
            },
            data: {
                leagueName
            }
        })

        return res.status(201).json({
            success: true,
            message: 'League updated successfully!'
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteLeagues = async (req, res) => {
    try {

        const { id } = req.params

        const isLeague = await prisma.leagues.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!isLeague) {
            throw new Error('League not found!')
        }

        await prisma.leagues.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(201).json({
            success: true,
            message: 'League deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getAllLeagues = async (req, res) => {
    try {

        const leagues = await prisma.leagues.findMany()

        return res.status(201).json({
            success: true,
            message: '',
            leagues
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.getOneLeagues = async (req, res) => {
    try {

        const { id } = req.params

        const leagues = await prisma.leagues.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                leagueName: true,
                playersGroup: true,
                matchSchedule: {
                    select: {
                        id: true,
                        date: true,
                        hour: true,
                        day: true,
                        team1: true,
                        team2: true,
                        team1MatchResult: true,
                        team2MatchResult: true,
                    }
                },
                classificationPoints: true,
                results: {
                    select: {
                        id: true,
                        identifierName: true,
                        date: true,
                        matches: {
                            select: {
                                id: true,
                                hour: true,
                                matchCode: true,
                                team1: {
                                    select: {
                                        id: true,
                                        teamCode: true,
                                        teamName: true,
                                        set1: true,
                                        set2: true,
                                        set3: true,
                                        matchPoint: true,
                                        matchScore: true,
                                        players: true
                                    }
                                },
                                team2: {
                                    select: {
                                        id: true,
                                        teamCode: true,
                                        teamName: true,
                                        set1: true,
                                        set2: true,
                                        set3: true,
                                        matchPoint: true,
                                        matchScore: true,
                                        players: true
                                    }
                                }
                            }
                        }
                    }
                }

            }
        })

        return res.status(201).json({
            success: true,
            message: '',
            leagues
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}