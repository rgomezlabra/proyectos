var path = require('path');
var Sequelize = require('sequelize');

// Acceso a BD.
// PostgreSQL: DATABASE_URL=postgres://usuario:clave@servidor:puerto/bd
// SQLite:     DATABASE_URL=sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user    = (url[2]||null);
var pwd     = (url[3]||null);
var protocol= (url[1]||null);
var port    = (url[5]||null);
var host    = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Elegir motor de BD.
var sequelize = new Sequelize(DB_name, user, pwd,
    { dialect: protocol, protocol: protocol, port: port, host: host,
      storage: storage, omitNull: true });

// Importar definición de la tabla.
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz;

// Inicializar la BD de preguntas.
sequelize.sync().then(function() {
	Quiz.count().then(function(count) {
		if (count === 0) {	// Rellenar tabla vacía.
			Quiz.create({ pregunta: 'Capital de Italia',
				      respuesta: 'Roma' });
			Quiz.create({ pregunta: 'Capital de Portugal',
				      respuesta: 'Lisboa' })
			    .then(function() {
				console.log('Base de datos inicializada.')
			    });
		}
	});
});
