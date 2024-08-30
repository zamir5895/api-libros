const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./libros.db', 
    sqlite.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conectado a la base de datos.');
    });
const sql = 'CREATE TABLE IF NOT EXISTS libros (id INTEGER PRIMARY KEY, titulo TEXT, autor TEXT)';
db.run(sql);