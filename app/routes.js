var express = require('express');
var router = express.Router();
var ctrl = {
    home: require('./controllers/home'),
    db: require('./controllers/dbAPI')
};


// define the home page route
router.get('/', ctrl.home.index);






/**
 * DB Common Services
 */
router.post('/api/db/find-all', ctrl.db.findAll);
router.post('/api/db/find-one', ctrl.db.findOne);
router.post('/api/db/insert', ctrl.db.insert);
router.post('/api/db/update', ctrl.db.update);
router.post('/api/db/delete', ctrl.db.delete);




// HTML5 base Route for angular 2.x
router.get('*', ctrl.home.index);


module.exports = router;
