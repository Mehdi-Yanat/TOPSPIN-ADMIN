
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