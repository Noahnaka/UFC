const express = require('express');
const Login = require('../Model/Login');

module.exports = class loginControle { 

    async login_read(request, response) {
        const { email, senha } = request.body.data;

        var login = new Login();
        login.emailLogin = email;
        login.senhaLogin = senha;
        const resultado = await login.loginRead();
    
        const objResposta = {
            cod: 1,
            status: resultado ? true: false,
            msg: resultado ? 'Login encontrado' : 'Login não encontrado',
            cargo: resultado,
            idUsuario: resultado
        };
    
        response.status(200).send(objResposta);
    }
};