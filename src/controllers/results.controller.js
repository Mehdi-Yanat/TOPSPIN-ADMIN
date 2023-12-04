
const moment = require("moment");
const { prisma } = require("../../prisma/prisma");

exports.addResults = async (req, res) => {

    try {
        let { date, identifierName, leagueId } = req.body

        const formatDate = moment(date).toISOString();

        await prisma.results.create({
            data: {
                identifierName,
                date: formatDate,
                leagues: {
                    connect: {
                        id: parseInt(leagueId)
                    }
                }
            },
        })

        return res.status(201).json({
            success: true,
            message: 'Results Table created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.editResults = async (req, res) => {

    try {
        let { id } = req.params
        let { date, identifierName, } = req.body

        const formatDate = moment(date).toISOString();

        await prisma.results.update({
            where: {
                id: parseInt(id)
            }, data: {
                date: formatDate,
                identifierName
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Results Table updated successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteResultsTable = async (req, res) => {

    try {
        let { id } = req.params

        await prisma.results.delete({
            where: {
                id: parseInt(id)
            },
        })

        return res.status(201).json({
            success: true,
            message: 'Results Table deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.addResultsMatchTableRow = async (req, res) => {
    try {

        const { hour, matchCode, team1Name, team1Code, team2Name, team2Code, team1, team2, set1, set2, set3, resultId } = req.body

        let team1Point = 0
        let team2Point = 0

        let team1Scores = 0
        let team2Scores = 0

        if (parseInt(set1.team1) > parseInt(set1.team2)) {
            team1Scores++
        } else {
            team2Scores++
        }

        if (parseInt(set2.team1) > parseInt(set2.team2)) {
            team1Scores++
        } else {
            team2Scores++
        }

        if (parseInt(set3.team1) > parseInt(set3.team2)) {
            team1Scores++
        } else {
            team2Scores++
        }

        if (team1Scores > team2Scores) {
            team1Point = 1
        } else {
            team2Point = 1
        }


        await prisma.matches.create({
            data: {
                results: {
                    connect: {
                        id: parseInt(resultId)
                    }
                },
                hour,
                matchCode,
                team1: {
                    create: {
                        teamName: team1Name,
                        teamCode: team1Code,
                        set1: parseInt(set1.team1),
                        set2: parseInt(set2.team1),
                        set3: parseInt(set3.team1),
                        players: {
                            createMany: {
                                data: team1
                            }
                        },
                        matchScore: team1Scores,
                        matchPoint: team1Point,
                        teamPoint: 0
                    }
                },
                team2: {
                    create: {
                        teamName: team2Name,
                        teamCode: team2Code,
                        set1: parseInt(set1.team2),
                        set2: parseInt(set2.team2),
                        set3: parseInt(set3.team2),
                        players: {
                            createMany: {
                                data: team2
                            }
                        },
                        matchScore: team2Scores,
                        matchPoint: team2Point,
                        teamPoint: 0
                    }
                },

            }
        })

        return res.status(201).json({
            success: true,
            message: 'Results row was created successfully!',
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.editResultsMatchTableRow = async (req, res) => {
    try {

        const { id } = req.params
        const { hour, matchCode, team1Name, team1Code, team2Name, team2Code, team1, team2, set1, set2, set3, team1Id, team2Id } = req.body

        let team1Point = 0
        let team2Point = 0

        let team1Scores = 0
        let team2Scores = 0

        if (parseInt(set1.team1) > parseInt(set1.team2)) {
            team1Scores++
        } else {
            team2Scores++
        }

        if (parseInt(set2.team1) > parseInt(set2.team2)) {
            team1Scores++
        } else {
            team2Scores++
        }

        if (parseInt(set3.team1) > parseInt(set3.team2)) {
            team1Scores++
        } else {
            team2Scores++
        }

        if (team1Scores > team2Scores) {
            team1Point = 1
        } else {
            team2Point = 1
        }


        await prisma.matches.update({
            where: {
                id: parseInt(id)
            },
            data: {
                hour,
                matchCode,
                team1: {
                    update: {
                        where: { id: parseInt(team1Id) },
                        data: {
                            teamName: team1Name,
                            teamCode: team1Code,
                            set1: parseInt(set1.team1),
                            set2: parseInt(set2.team1),
                            set3: parseInt(set3.team1),
                            players: {
                                upsert: team1.map(player => ({
                                    where: player.id ? { id: player.id } : { id: -1 },
                                    update: {
                                        playerName: player.playerName,
                                        categorie: player.categorie
                                        // Add other player properties you want to update
                                    },
                                    create: {
                                        playerName: player.playerName,
                                        categorie: player.categorie
                                        // Add other player properties you want to create
                                    }
                                }))
                            },
                            matchScore: team1Scores,
                            matchPoint: team1Point,
                            teamPoint: 0
                        }
                    }
                },
                team2: {
                    update: {
                        where: { id: parseInt(team2Id) },
                        data: {
                            teamName: team2Name,
                            teamCode: team2Code,
                            set1: parseInt(set1.team2),
                            set2: parseInt(set2.team2),
                            set3: parseInt(set3.team2),
                            players: {
                                upsert: team2.map(player => ({
                                    where: player.id ? { id: player.id } : { id: -1 },
                                    update: {
                                        playerName: player.playerName,
                                        categorie: player.categorie
                                        // Add other player properties you want to update
                                    },
                                    create: {
                                        playerName: player.playerName,
                                        categorie: player.categorie
                                        // Add other player properties you want to create
                                    }
                                }))
                            },
                            matchScore: team2Scores,
                            matchPoint: team2Point,
                            teamPoint: 0
                        }
                    }
                }
            }
        });

        const team1Data = await prisma.player.findMany({
            where: {
                team1Id: parseInt(team1Id)
            }
        })
        const team2Data = await prisma.player.findMany({
            where: {
                team2Id: parseInt(team2Id)
            }
        })


        const existingPlayerTeam1Ids = team1Data.map(player => player.playerName);
        const existingPlayerTeam2Ids = team2Data.map(player => player.playerName);

        const playersToRemoveTeam1Ids = existingPlayerTeam1Ids.filter(playerName => !team1.some(player => player.playerName === playerName));
        const playersToRemoveTeam2Ids = existingPlayerTeam2Ids.filter(playerName => !team2.some(player => player.playerName === playerName));


        await prisma.player.deleteMany({
            where: {
                playerName: {
                    in: playersToRemoveTeam1Ids
                }
            }
        });

        await prisma.player.deleteMany({
            where: {
                playerName: {
                    in: playersToRemoveTeam2Ids
                }
            }
        });


        return res.status(201).json({
            success: true,
            message: 'Results row was updated successfully!',
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteResultsMatchTableRow = async (req, res) => {
    try {

        const { id } = req.params


        await prisma.matches.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Result row was deleted successfully!',
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}