const express = require('express');
const EntrarEvento = require('../Model/EntrarEvento');

module.exports = class entrarEventoControle { 

    async entrar_evento_read(request, response) {
        const codEvento = request.query.codigoEvento; 

        var evento = new EntrarEvento();
        evento.codEvento = codEvento;
        const resultado = await evento.entrarEventoRead();
    
        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado ? 'Entrar Evento encontrado' : 'Entrar evento não encontrado',
            idEvento: resultado
        };
    
        response.status(200).send(objResposta);
    }

    async entrar_evento_create(request, response){
        const { idUsuario, idEvento } = request.body;

        var evento = new EntrarEvento();
        evento.idUsuario = idUsuario;
        evento.codEvento = idEvento;

        const isCreated = await evento.entrarEventoCreate();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Evento entrado com sucesso' : 'Erro ao entrar evento'
        }

        response.status(200).send(objResposta);
    }
};