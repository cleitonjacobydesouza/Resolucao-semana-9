const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para registrar informações sobre todas as solicitações
const logInfoMiddleware = (req, res, next) => {
    const now = new Date().toISOString();
    req.requestInfo = {
        timestamp: now,
        method: req.method,
        url: req.url,
    }
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
};

// Adiciona o middleware globalmente
app.use(logInfoMiddleware);

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware para servir arquivos estáticos
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Lista de usuários (simulando um banco de dados)
let users = [];

// Criação (Create): Rota para adicionar um novo usuário
app.post('/users', (req, res) => {
    const newUser = req.body; // Dados do novo usuário no corpo da requisição
    newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1; // Gera um ID incremental
    users.push(newUser); // Adiciona o novo usuário à lista
    res.status(201).json(newUser); // Retorna o usuário criado com status 201 (Created)
});

// Leitura (Read): Rota para obter a lista de usuários
app.get('/users', (req, res) => {
    res.json(users); // Retorna a lista de usuários
});

// Rota para obter detalhes de um usuário específico
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id); // Obtém o ID do usuário da URL
    const user = users.find(u => u.id === userId); // Procura o usuário na lista pelo ID

    if (user) {
        res.json(user); // Retorna os detalhes do usuário se encontrado
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' }); // Retorna status 404 se o usuário não for encontrado
    }
});

// Atualização (Update): Rota para atualizar os dados de um usuário existente
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id); // Obtém o ID do usuário da URL
    const updatedData = req.body; // Novos dados do usuário no corpo da requisição

    // Procura o usuário na lista pelo ID
    const index = users.findIndex(u => u.id === userId);

    if (index !== -1) {
        users[index] = { ...users[index], ...updatedData }; // Atualiza os dados do usuário
        res.status(200).json(users[index]); // Retorna os dados atualizados do usuário com status 200 (OK)
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' }); // Retorna status 404 se o usuário não for encontrado
    }
});

// Exclusão (Delete): Rota para excluir um usuário
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id); // Obtém o ID do usuário da URL

    // Filtra a lista de usuários para excluir o usuário com base no ID
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
        users.splice(index, 1);
        res.status(200).json({ message: 'Usuário excluído com sucesso' }); // Retorna mensagem de sucesso com status 200 (OK)
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' }); // Retorna status 404 se o usuário não for encontrado
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
