const express = require('express');
const Login = require('../Model/Login');

module.exports = class loginControle { 

    async login_read(request, response) {
        const { emailCadastro, senhaCadastro } = request.body.Logins;

        var login = new Login();
        login.emailLogin = emailCadastro;
        login.senhaLogin = senhaCadastro;
        const resultado = await login.loginRead();
    
        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado ? 'Login encontrado' : 'Login não encontrado',
            cargo: resultado,
            idUsuario: resultado
        };
    
        response.status(200).send(objResposta);
    }
};