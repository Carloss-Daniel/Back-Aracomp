const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Conectar ao banco de dados
const db = new sqlite3.Database('database.db');

// Criar tabela users
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )`);
});

// Middleware para permitir o uso do body parser para requisições POST
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo ao servidor com SQLite e Express!');
});

// Rota para cadastrar um usuário
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar usuário', error: err.message});
      }
      res.status(200).json({ message: 'Usuário cadastrado com sucesso', userId: this.lastID });
    }
  );
});

// Rota para mostrar todos os usuários cadastrados
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
    res.status(200).json({ users: rows });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
