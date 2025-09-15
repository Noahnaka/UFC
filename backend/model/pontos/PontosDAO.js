const PontosModel = require('./PontosModel');
const { getConexao } = require('../Db');
const bcrypt = require('bcrypt');

class PontosDAO extends PontosModel {

    create = async (idEvento) => {
        const pool = getConexao();

        try {
            const queryVencedores = `
                SELECT * FROM tbl_vencedores_ufc WHERE id_evento = ?
            `;

            const queryApostas = `
                SELECT * FROM tbl_apostas_ufc WHERE id_evento = ?
            `;

            const queryClientes = `
                SELECT * FROM tbl_cliente
            `;

            const [vencedores] = await pool.promise().execute(queryVencedores, [idEvento]);
            const [apostas] = await pool.promise().execute(queryApostas, [idEvento]);
            const [clientes] = await pool.promise().execute(queryClientes);

            const resultadosMap = {};
            vencedores.forEach(resultado => {
                resultadosMap[resultado.id_luta] = {
                    vencedor: resultado.vencedor,
                    metodo: resultado.metodo,
                    rodada: resultado.rodada
                };
            });

            const pontosPorCliente = {};

            apostas.forEach(aposta => {
                const resultado = resultadosMap[aposta.id_luta];
                if (!resultado) return;

                let pontos = 0;

                if (aposta.vencedor === resultado.vencedor) {
                    pontos += 10;
                }

                if (aposta.metodo === resultado.metodo) {
                    pontos += 5;
                }

                if (aposta.rodada === resultado.rodada) {
                    pontos += 5;
                }

                if (pontos > 0) {
                    if (!pontosPorCliente[aposta.id_cliente]) {
                        pontosPorCliente[aposta.id_cliente] = 0;
                    }
                    pontosPorCliente[aposta.id_cliente] += pontos;
                }
            });

            const updateQuery = `
                UPDATE tbl_cliente 
                SET pontos_cliente = pontos_cliente + ? 
                WHERE id_cliente = ?
            `;

            for (const [idCliente, pontos] of Object.entries(pontosPorCliente)) {
                await pool.promise().execute(updateQuery, [pontos, idCliente]);
            }

            return {
                success: true,
                message: 'Pontos calculados e atualizados com sucesso',
                pontosAtualizados: pontosPorCliente
            };

        } catch (err) {
            throw new Error('Erro ao calcular pontos: ' + err.message);
        }
    };

    getPontosCliente = async (idCliente) => {
        const pool = getConexao();

        try {
            const query = `
                SELECT pontos_cliente FROM tbl_cliente WHERE id_cliente = ?
            `;

            const [result] = await pool.promise().execute(query, [idCliente]);
            
            if (result.length > 0) {
                return result[0].pontos_cliente;
            }
            
            return 0;
        } catch (err) {
            throw new Error('Erro ao buscar pontos do cliente: ' + err.message);
        }
    };

    getAllPontos = async () => {
        const pool = getConexao();

        try {
            const query = `
                SELECT id_cliente, nome_cliente, pontos_cliente 
                FROM tbl_cliente 
                ORDER BY pontos_cliente DESC
            `;

            const [result] = await pool.promise().execute(query);
            return result;
        } catch (err) {
            throw new Error('Erro ao buscar todos os pontos: ' + err.message);
        }
    };
}

module.exports = PontosDAO;