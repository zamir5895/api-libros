const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sqlite = require('sqlite3').verbose();
let sql;
const db = new sqlite.Database('./libros.db', 
    sqlite.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conectado a la base de datos.');
    }
);
app.use(bodyParser.json());

app.post('/libros', (req, res) => {
    try {
        console.log(req.body.titulo);
        const { titulo, autor } = req.body;
        sql = 'INSERT INTO libros (titulo, autor) VALUES (?, ?)';
        db.run(sql, [titulo, autor], (err) => {
            if (err) {
                return res.json({
                    status: 300,
                    success: false,
                    error: err.message
                });
            }
            console.log('Registro insertado con éxito', titulo, autor);
            return res.json({
                status: 200,
                success: true,
            });
        });
    } 
    catch (error) {
        console.error(error);
        return res.json({
            status: 400,
            success: false,
        });
    }
});

app.get('/libros', (req, res) => {
    sql = 'SELECT * FROM libros';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.json({
                status: 300,
                success: false,
                error: err.message
            });
        }
        return res.json({
            status: 200,
            success: true,
            data: rows
        });
    });
});

app.get('/libros/:id', (req, res) => {
    const { id } = req.params;
    sql = 'SELECT * FROM libros WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.json({
                status: 300,
                success: false,
                error: err.message
            });
        }
        return res.json({
            status: 200,
            success: true,
            data: row
        });
    });
});

app.delete('/libros/:id', (req, res) => {
    const { id } = req.params;
    sql = 'DELETE FROM libros WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            return res.json({
                status: 300,
                success: false,
                error: err.message
            });
        }
        return res.json({
            status: 200,
            success: true,
            message: `Libro con ID ${id} eliminado`
        });
    });
});

app.put('/libros/:id', (req, res) => {
    const { id } = req.params;
    const { autor } = req.body;
    sql = 'UPDATE libros SET autor = ? WHERE id = ?';
    db.run(sql, [autor, id], function(err) {
        if (err) {
            return res.json({
                status: 300,
                success: false,
                error: err.message
            });
        }
        if (this.changes === 0) {
            return res.json({
                status: 404,
                success: false,
                message: `No se encontró el libro con ID ${id}`
            });
        }
        return res.json({
            status: 200,
            success: true,
            message: `Autor del libro con ID ${id} actualizado`
        });
    });
});

app.listen(8001, () => {
    console.log('Servidor iniciado en http://localhost:8001');
});