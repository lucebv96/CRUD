// Importa la conexión a la base de datos
const db = require('../db');

// Controlador para obtener la lista de programas
exports.obtenerProgramas = (req, res) => {
    const sql = "SELECT * FROM programas ORDER BY votos DESC";
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            // Si la respuesta es JSON (API), devuelve JSON; si no, renderiza la vista.
            if (res.json) {
                res.json(rows);  // Devuelve la lista de programas en formato JSON (para la API)
            } else {
                res.render('index', { programas: rows });  // Pasa 'programas' a la vista
            }
        }
    });
};


// Controlador para agregar un nuevo programa
exports.crearPrograma = (req, res) => {
    const { nombre } = req.body;
    const sql = "INSERT INTO programas (nombre, votos) VALUES (?, ?)";
    const params = [nombre, 0];  // Agrega el programa con 0 votos inicialmente

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, nombre, votos: 0 });  // Devuelve el nuevo programa creado
        }
    });
};

// Controlador para votar por un programa
exports.votarPrograma = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE programas SET votos = votos + 1 WHERE id = ?";

    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            db.get("SELECT * FROM programas WHERE id = ?", id, (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json(row);  // Devuelve el programa actualizado con el nuevo conteo de votos
                }
            });
        }
    });
};

// Controlador para actualizar los datos de un programa
exports.actualizarPrograma = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const sql = "UPDATE programas SET nombre = ? WHERE id = ?";
    const params = [nombre, id];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id, nombre });  // Devuelve el programa actualizado
        }
    });
};

// Controlador para eliminar un programa
exports.eliminarPrograma = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM programas WHERE id = ?";

    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ mensaje: "Programa eliminado" });  // Confirma la eliminación del programa
        }
    });
};
