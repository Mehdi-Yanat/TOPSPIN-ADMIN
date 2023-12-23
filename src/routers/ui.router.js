const express = require("express");

const router = express.Router();

const uiController = require('../controllers/ui.controller.js');
const { isAuth } = require('../middlewares/auth.js');
const { upload, handleUpload } = require("../middlewares/uploadImage.js");


router.put('/popup', isAuth, upload.single("popupImage"), async (req, res) => {
    try {

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        await uiController.editPopup(req, res, cldRes);
    } catch (error) {
        console.error('Error in PUT /popup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/popup', uiController.getPopup)





module.exports = router;