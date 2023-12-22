const { prisma } = require("../../prisma/prisma");

exports.addLeagues = async (req, res) => {

    try {
        let { leagueName, leaguesGroups } = req.body

        await prisma.leagues.create({
            data: {
                leagueName,
                leaguesGroups: {
                    createMany: {
                        data: leaguesGroups
                    }
                }
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
        const { leagueName, leaguesGroups } = req.body

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
                leagueName,
                leaguesGroups: {
                    upsert: leaguesGroups.map(group => ({
                        where: group.id ? { id: group.id } : { id: -1 },
                        update: {
                            groupIdentifier: group.groupIdentifier
                        },
                        create: {
                            groupIdentifier: group.groupIdentifier
                        },
                    }))
                }
            }
        })

        const leaguesGroupsData = await prisma.leaguesGroups.findMany({
            where: {
                leaguesId: parseInt(id)
            },
            select: {
                groupIdentifier: true
            }
        })

        const filterLeaguesGroupData = leaguesGroupsData.map(el => el.groupIdentifier)
        const goupsToRemove = filterLeaguesGroupData.filter(groupData => !leaguesGroups.some(group => group.groupIdentifier === groupData));


        await prisma.leaguesGroups.deleteMany({
            where: {
                groupIdentifier: {
                    in: goupsToRemove
                }
            }
        });


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

        const leagues = await prisma.leagues.findMany({
            select: {
                id: true,
                leagueName: true,
                leaguesGroups: true
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

exports.getOneLeagues = async (req, res) => {
    try {

        const { id, groupId } = req.params

        let leagues = await prisma.leagues.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                leaguesGroups: {
                    select: {
                        id: true,
                        groupIdentifier: true,
                        playersGroup: {
                            select: {
                                id: true,
                                identifierGroup: true,
                                players: true
                            }
                        },
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
                                results: {
                                    select: {
                                        matches: {
                                            select: {
                                                team1: {
                                                    select: {
                                                        matchPoint: true,
                                                    }
                                                },
                                                team2: {
                                                    select: {
                                                        matchPoint: true,
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
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
                }
            }
        })


        if (leagues) {
            const groups = await prisma.leaguesGroups.findUnique({
                where: {
                    id: parseInt(groupId)
                },
                select: {
                    matchSchedule: {
                        select: {
                            id: true,
                            results: {
                                select: {
                                    matches: {
                                        select: {
                                            team1: {
                                                select: {
                                                    matchPoint: true,
                                                }
                                            },
                                            team2: {
                                                select: {
                                                    matchPoint: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        }
                    },
                }
            })

            groups?.matchSchedule?.forEach(async (matchSchedule) => {
                let team1MatchResult = 0;
                let team2MatchResult = 0;

                matchSchedule.results?.forEach((result) => {
                    result.matches?.forEach((match) => {
                        match.team1?.forEach((team1) => {
                            team1MatchResult += team1.matchPoint || 0;
                        });

                        match.team2?.forEach((team2) => {
                            team2MatchResult += team2.matchPoint || 0;
                        });
                    });
                });

                await prisma.matchSchedule.update({
                    where: {
                        id: matchSchedule.id
                    },
                    data: {
                        team1MatchResult,
                        team2MatchResult
                    }
                });
            });
        }



        return res.status(201).json({
            success: true,
            message: '',
            leagues,
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}