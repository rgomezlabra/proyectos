// Lista de usuario predefinidos.
var users = { admin: { id: 1, username: "admin", password: "1234" },
	      usuario: { id: 2, username: "usuario", password: "0000" }
	    };

// Comprobar si el usuario está registrado.
exports.autenticar = function(login, password, callback) {
	if (users[login]) {
		if (password === users[login].password) {
			callback(null, users[login]);
		} else {
			callback(new Error('Clave incorrecta.'));
		}	
	} else {
		callback(new Error('No existe el usuario.'));
	}
}
