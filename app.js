var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos.

// Registrar tiempo de cada conexión de la sesión autentificada.
app.use(function(req, res, next) {
	// Comprobar si el usuario está autentificado.
	if (req.session.user) {
		var aux = Date.now();
		// Borrar valores de sesión si el tiempo de la petición anterior es > 120 ms.
		if (req.session.time && (aux - req.session.time) > 120000) {
			delete req.session.user;
			delete req.session.time;
		} else {
			// Guardar timepo actual.
			req.session.time = aux;
		}
	}
	next();
});

app.use(function(req, res, next) {
  // Guardar path en session.redir tras login.
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  // Hacerlo visible en las vistas.
  res.locals.session = req.session;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
