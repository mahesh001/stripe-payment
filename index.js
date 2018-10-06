
var express = require('express');
var path = require('path');
var routes = require('./routes/route');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');

var session = require('express-session');


var app = express();


try {
  var configJSON = fs.readFileSync(__dirname + "/config/config.json");
  var config = JSON.parse(configJSON.toString());
} catch (e) {
  console.error("File config.json not found or is invalid: " + e.message);
  process.exit(1);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', key: 'sid' }));

app.get('/', routes.index);
app.get('/subscription', routes.subscription);
app.post('/stripe/single-payment', routes.singlePayment);
app.post('/stripe/subscription', routes.subscriptionPayment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var port = Number(process.env.PORT || 5000);

http.createServer(app).listen(port, function () {
  console.log('Express server listening on port ' + port);
});