// Import express
var express = require('express');

var router = express.Router();

// On request for login, create a route to render the login page
router.get('/login', function (req, res, next) {
    res.render('login');
});

// On request for sign up// login, create a route that goes to auth0 here

module.exports = router;