// Modelos de datos.
var models = require('../models/models.js');

// Autocarga.
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error("No existe quizId=" + quizId));
		}
	}).catch(function(error) { next(error); });
};

// GET /quizes y /quizes?search=búsqueda
exports.index = function(req, res) {
	var querySearch = req.query.search || '';
	var like = '%' + querySearch.trim().replace(/\s+/g, '%') + '%';
	models.Quiz.findAll({ where: ['pregunta LIKE ?', like], order: 'pregunta ASC' })
		.then(function(quizes) {
			res.render('quizes/index', { quizes: quizes, srch: querySearch, errors: [] });
		}).catch(function(error) { next(error) });
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	if (req.query.respuesta === req.quiz.respuesta) {
		var resultado = "Correcto";
	} else {
		var resultado = "Incorrecto";
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build({ pregunta: 'Pregunta', respuesta: 'Respuesta' });
	res.render('quizes/new', { quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(function(err) {
		if (err) {
			res.render('quizes/new', { quiz: quiz, errors: err.errors });
		} else {
			quiz.save({ fields: ["pregunta", "respuesta"] })
				.then(function() {
					res.redirect('/quizes');
				});
		}
	});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;		// Autocarga de preguntas
	res.render('quizes/edit', { quiz: quiz, errors: [] });
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.validate().then(function(err) {
		if (err) {
			res.render('quizes/edit', { quiz: quiz, errors: err.errors });
		} else {
			req.quiz.save({ fields: ["pregunta", "respuesta"] })
				.then(function() {
					res.redirect('/quizes');
				});
		}
	});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function(err) {
		res.redirect('/quizes');
	}).catch(function(error) { next(error) });
};

