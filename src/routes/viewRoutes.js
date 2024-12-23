const express = require('express');
const router = express.Router();


router.get('/round-corners', (req, res) => {
    res.render('RoundCorners');
});

router.get('/round', (req, res) => {
    res.render('Round');
});


module.exports = router;