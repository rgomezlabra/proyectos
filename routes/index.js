var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz-controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});
router.get('/author', function(req, res, next) {
  res.render('author', { author: 'Ramón M. Gómez', photo: 'http://www.informatica.us.es/~ramon/ramon.jpg' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

module.exports = router;
