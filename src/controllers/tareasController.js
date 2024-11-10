const db = require('../db');

// Mantener los controladores existentes
exports.obtenerProgramas = (req, res) => {
    const sql = "SELECT * FROM programas ORDER BY votos DESC";
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                res.json(rows);
            } else {
                res.render('index', { programas: rows });
            }
        }
    });
};

exports.crearPrograma = (req, res) => {
    const { nombre } = req.body;
    const sql = "INSERT INTO programas (nombre, votos) VALUES (?, ?)";
    const params = [nombre, 0];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, nombre, votos: 0 });
        }
    });
};

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
                    res.json(row);
                }
            });
        }
    });
};

// Añadir el controlador que faltaba
exports.actualizarPrograma = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const sql = "UPDATE programas SET nombre = ? WHERE id = ?";
    const params = [nombre, id];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: Number(id), nombre });
        }
    });
};

// Mantener el controlador de eliminación si existe
exports.eliminarPrograma = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM programas WHERE id = ?";

    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ mensaje: "Programa eliminado" });
        }
    });
};