// Modelos de datos de estadísticas.
var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res) {
	// Inicializar estadísticas.
	var stats = {
		nQuestions: 0,
		nComments: 0,
		avgComments: 0,
		withComments: 0,
		withoutComments: 0
	};

	models.Quiz.count().then(function(count) {
		stats.nQuestions = count;
		models.Comment.count({ where: { publicado: true } }).then(function(count) {
			stats.nComments = count;
			if (stats.nQuestions > 0) {
				stats.avgComments = Number(stats.nComments / stats.nQuestions).toFixed(2);
			}
			models.Comment.count({ where: { quizId: 0 } }).then(function(count) {
				stats.withoutComments = count;
				stats.withComments = stats.nComments - count;
				res.render('quizes/statistics.ejs', { stats: stats, errors: [] });
			});
		});
	});
};

