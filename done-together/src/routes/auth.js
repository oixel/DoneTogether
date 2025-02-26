// Import express
var express = require('express');

var router = express.Router();

// On request for login, create a route to render the login page
router.get('/login', function (req, res, next) {
    res.render('login');
});

module.exports = router;