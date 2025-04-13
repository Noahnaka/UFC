const express = require('express');
const Cadastro = require('../Model/Cadastro');

module.exports = class cadastroControle { 

    async cadastro_create(request,response) {
        const { nomeCadastro, emailCadastro,telefoneCadastro, senhaCadastro, nascimentoCadastro } = request.body.Cadastros;

        var cadastro = new Cadastro();
        cadastro.nomeCadastro = nomeCadastro;
        cadastro.emailCadastro = emailCadastro;
        cadastro.telefoneCadastro = telefoneCadastro;
        cadastro.senhaCadastro = senhaCadastro;
        cadastro.nascimentoCadastro = nascimentoCadastro;

        const isCreated = await cadastro.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Cadastro criado com sucesso' : 'Erro ao criar cadastro',
            idUsuario: isCreated ? cadastro.idUsuario : null
        }

        response.status(200).send(objResposta);
    } 
              
};