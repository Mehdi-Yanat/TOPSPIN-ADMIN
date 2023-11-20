const moment = require("moment");
const { prisma } = require("../../prisma/prisma");

exports.addMatchSchedule = async (req, res) => {


    try {
        let { date } = req.body

        const formatDate = moment(date).toISOString();

        delete req.body.date

        await prisma.matchSchedule.create({
            data: {
                date: formatDate,
                ...req.body
            }
        })

        return res.status(201).json({
            success: false,
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

        let { date } = req.body
        const { id } = req.params

        const formatDate = moment(date).toISOString();

        delete req.body.date

        const isScheduleFound = await prisma.matchSchedule.findUnique({
            where: {
                id
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
                ...req.body
            }
        })

        return res.status(201).json({
            success: false,
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
            success: false,
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