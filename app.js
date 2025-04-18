const express = require('express');
const path = require('path');

const roteadorCadastro = require('./Route/roteadorCadastro');
const roteadorLogin = require('./Route/roteadorLogin');
const roteadorUFC = require('./Route/roteadorUFC');
 
const app = express();
const porta = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'View')));

const routeCadastro = new roteadorCadastro();
const routeLogin = new roteadorLogin();
const routeUFC = new roteadorUFC();

// Requisições para imprimir coisas, login, qualquer coisa q nn seja o URL
app.use('/ufc',
    routeUFC.criarRotasUFC()
);

app.use('/Cadastro',
    routeCadastro.criarRotasCadastro()
);

app.use('/Login',
    routeLogin.criarRotasLogin()
);

// app para alterar URL para ficar naquele curto
app.get('/Main', (req, res) => {
    res.sendFile(path.join(__dirname, 'View', 'PaginaPrincipal.html'));
});

app.get('/Join', (req, res) => {
    res.sendFile(path.join(__dirname, 'View', 'Index.html'));
});

app.get('/ufc/bet', (req, res) => {
    res.sendFile(path.join(__dirname, 'View', '/UFC/LutasUFC.html'));
});

app.get('/ufc/bet/fight', (req, res) => {
    res.sendFile(path.join(__dirname, 'View', '/UFC/ApostaUFC.html'));
});




app.listen(porta, () => {
    console.log(`API rodando no endereço: http://localhost:${porta}/`)
});