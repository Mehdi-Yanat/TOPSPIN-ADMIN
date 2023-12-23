const { prisma } = require("../../prisma/prisma");

exports.editPopup = async (req, res, cldRes) => {
    try {
        const { headerEnglish, headerTurkish, text } = req.body;
        const fileName = req.file ? req.file.originalname : null;


        const popup = await prisma.popup.findUnique({
            where: {
                id: 1
            },
            include: {
                text: true, // Fetch related popupText items
            },
        });

        if (!popup) {
            throw new Error('Popup not found.');
        }

        // Function to remove items that are not present in the updated text
        const removeItems = async (existingItems, updatedItems) => {
            const itemsToRemove = existingItems?.filter(
                (existingItem) => !updatedItems.some((updatedItem) => existingItem.id === updatedItem.id)
            );

            // Assuming 'id' is the unique identifier
            await prisma.popupText.deleteMany({
                where: {
                    id: {
                        in: itemsToRemove.map((item) => item.id),
                    },
                },
            });
        };

        await removeItems(popup.text, JSON.parse(text));

        await prisma.popup.update({
            where: {
                id: popup.id
            },
            data: {
                headerEnglish,
                headerTurkish,
                text: {
                    upsert: JSON.parse(text).map((item) => ({
                        where: { id: parseInt(item.id) || 0 }, // Use 0 as the default value
                        create: {
                            englishTranslation: item.englishTranslation,
                            turkishTranslation: item.turkishTranslation,
                        },
                        update: {
                            englishTranslation: item.englishTranslation,
                            turkishTranslation: item.turkishTranslation,
                        },
                    })),
                },
                popupImage: cldRes ? cldRes.url : popup.popupImage
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Popup updated successfully!'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getPopup = async (req, res) => {
    try {

        const popup = await prisma.popup.findUnique({
            where: {
                id: 1
            },
            select: {
                popupImage: true,
                id: true,
                text: true,
                headerEnglish: true,
                headerTurkish: true
            }
        })

        return res.status(200).json({
            success: true,
            message: '',
            popup
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}