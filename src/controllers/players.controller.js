const { prisma } = require("../../prisma/prisma");
const xlsx = require('xlsx')


exports.addGroups = async (req, res) => {
    try {
        const { leagueGroupId, workbook } = req.body;
        const sheetData = workbook.Sheets.Sheet1;

        if (!sheetData || typeof sheetData !== 'object') {
            throw new Error('Invalid sheet data');
        }

        const JSONxlsx = xlsx.utils.sheet_to_json(sheetData);

        // Find the header row
        let headerRowIndex = -1;

        for (let i = 0; i < JSONxlsx.length; i++) {
            const row = JSONxlsx[i];
            if ('groupName' in row && 'groupCode' in row) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
            throw new Error('Header row not found');
        }

        const headers = JSONxlsx[headerRowIndex];
        const groupNameHeader = Object.keys(headers).find(header => /groupName/i.test(header));
        const groupCodeHeader = Object.keys(headers).find(header => /groupCode/i.test(header));
        const nestedHeaders = Object.keys(headers).filter(header => /__EMPTY/i.test(headers[header]));

        // Process the data
        const processedData = [];
        let currentTable = {};

        JSONxlsx.slice(headerRowIndex + 1).forEach(row => {
            if (groupNameHeader in row && groupCodeHeader in row) {
                // Starting a new table
                if (currentTable.groupName) {
                    processedData.push(currentTable);
                }

                currentTable = {
                    groupName: row[groupNameHeader],
                    groupCode: row[groupCodeHeader],
                    players: [],
                };
            } else {
                // Process nested headers
                nestedHeaders.forEach(nestedHeader => {
                    const playerName = row[nestedHeader];
                    const categorieHeader = nestedHeader.replace(/__EMPTY/i, 'categorie');
                    const categorie = row[categorieHeader];

                    if (playerName || categorie) {
                        currentTable.players.push({ playerName, categorie });
                    }
                });
            }
        });

        // Add the last table
        if (currentTable.groupName) {
            processedData.push(currentTable);
        }

        console.log('Processed Data:', processedData);

        return res.status(201).json({
            success: true,
            message: 'Groups Table created successfully!',
            data: processedData,
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
};


exports.removeGroups = async (req, res) => {

    try {

        const { id } = req.params

        await prisma.playersGroup.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Groups Table deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}