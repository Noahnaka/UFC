const express = require('express');
const Evento = require('../Model/Evento');

module.exports = class eventoControle { 

    async evento_create_control(request,response) {
        const { nomeEvento, codigoEvento,teams } = request.body;

        var evento = new Evento();
        evento.nomeEvento = nomeEvento;
        evento.codigoEvento = codigoEvento;
        evento.teams = teams;

        const isCreated = await evento.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Evento criado com sucesso' : 'Erro ao criar evento'
        }

        response.status(200).send(objResposta);
    } 
              
};