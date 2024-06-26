const express = require("express");
const { createURL, handleGetAnalytics, deleteURL } = require("../controller/urlController");
const urlModel = require("../model/urlModel");
const router = express.Router();

// GET requests
router.get('/', async (req, res) => {
    const allUrls = await urlModel.find({});
    return res.render("index", {
        urls: allUrls,
        isHome: true
    })
})
router.get('/:shortId', async (req, res) => {
    try{
        const shortId = req.params.shortId;
        if (shortId) {
            const entry = await urlModel.findOneAndUpdate(
                { shortId },
                {
                    $push: {
                        visitHistory: {
                            timestamp: Date.now()
                        }
                    }
                }
            )
            return res.redirect(entry?.redirectURL)
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            success: false,
            message: err.message
            })
    }
})

router.get('/analytics/:shortId', handleGetAnalytics)

// POST request
router.post('/createurl', createURL)
router.post("/:shortId", deleteURL)

module.exports = router