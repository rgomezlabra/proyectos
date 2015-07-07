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

// GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index', { quizes: quizes });
	});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	if (req.query.respuesta === quiz.req.respuesta) {
		var resultado = "Correcto";
	} else {
		var resultado = "Incorrecto";
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};
