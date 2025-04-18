const express = require('express');
const UFC = require('../Model/UFC');

module.exports = class ufcControle { 

    async ufc_get_events(request, response) {
        const ufc = new UFC();

        const resultado = await ufc.UFC_read_all();
    
        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado && resultado.length > 0 ? 'Eventos encontrados' : 'Nenhum evento encontrado',
            eventos: resultado
        };
    
        response.status(200).send(objResposta);
    }

    async ufc_get_events_by_id(request, response) {
        var ufc = new UFC();
        ufc.idUFC = request.query.idUFC;  
        const resultado = await ufc.UFC_read_by_id();
        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado ? 'UFC encontrado' : 'UFC não encontrado',
            ufc: resultado
        };
        response.status(200).send(objResposta);
    }
    

    async ufc_get_bets(request, response) {
        var ufc = new UFC();
        ufc.idUsuario = request.query.idUsuario;  
      
        const resultado = await ufc.UFC_read_bets_by_id();
      
        const objResposta = {
          cod: 1,
          status: true,
          msg: resultado && resultado.length > 0 ? 'UFC encontrado' : 'UFC não encontrado',
          ufc: resultado || []
        };
      
        response.status(200).send(objResposta);
      }
   
      
    
    async ufc_create_bet(request,response) {
        const { idUsuario, eventID, FightID, winner, round, method } = request.body;
        var ufc = new UFC();
        ufc.idUsuario = idUsuario;
        ufc.idUFC = eventID;
        ufc.idEvento = FightID;
        ufc.vencedor = winner;
        ufc.rodada = round;
        ufc.metodo = method;

        const isCreated = await ufc.create_bet();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Aposta criado com sucesso' : 'Erro ao criar aposta',
            idAposta: isCreated ? ufc._idAposta : null
        }

        response.status(200).send(objResposta);
    } 

    async ufc_sync_events(request, response) {
    
        var ufc = new UFC();
    
        try {
            const idUFC = await ufc.ufc_sync_events();

            const objResposta = {
                cod: 1,
                status: idUFC,
                msg: idUFC ? 'Eventos sync com sucesso' : 'Erro ao sync eventos',
                idCliente: idUFC,
            };
            response.status(200).send(objResposta);
        } catch (error) {
            console.error("Erro ao sync eventos:", error);
            response.status(500).json({ msg: "Erro no servidor ao sync eventos" });
        }
    }
};
