var express = require('express');
var router = express.Router();
var ctrl = {
    home: require('./controllers/home')
};


// define the home page route
router.get('/', ctrl.home.index);

router.get('*', ctrl.home.index);


module.exports = router;
