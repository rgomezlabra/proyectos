// Modelos de datos.
var models = require('../models/models.js');

// Autocarga.
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error("No existe quizId=" + quizId));
		}
	}).catch(function(error) { next(error); });
};

// GET /quizes?search=búsqueda
exports.index = function(req, res) {
	var querySearch = req.query.search || '';
	var like = '%' + querySearch.trim().replace(/\s+/g, '%') + '%';
	models.Quiz.findAll({ where: ['pregunta LIKE ?', like], order: 'pregunta ASC' })
		.then(function(quizes) {
			res.render('quizes/index', { quizes: quizes, srch: querySearch });
		});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	if (req.query.respuesta === req.quiz.respuesta) {
		var resultado = "Correcto";
	} else {
		var resultado = "Incorrecto";
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};
