var path = require('path'),
    http = require('http'),
    config = require('config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    routes = require('./app/routes');

var app = module.exports = express();
var env = process.env.NODE_ENV || 'development';


// connect mongDB
mongoose.connect(config.get('mongoDBURI'));


// --
// ExpressJS Configuration

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

if (env === 'development') {
    // @todo Find best solutoin for error handler
}


app.use('/', routes);


// Start Engine!
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
