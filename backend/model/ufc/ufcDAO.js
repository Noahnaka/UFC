const UfcModel = require('./ufcModel');
const { getConexao } = require('../Db');
const axios = require('axios');
const cheerio = require('cheerio');

class UfcDAO extends UfcModel {

    UFC_read_all = async () => {
        const pool = getConexao();
        try {
            const [rows] = await pool.promise().execute('SELECT * FROM unibet.tbl_eventos_ufc');
            return rows;
        } catch (err) {
            throw new Error('Erro ao buscar apostas UFC');
        }
    };

    static UFC_read_by_id = async (id_ufc) => {
        const pool = getConexao();

        if (!id_ufc) {
            throw new Error('O campo id_ufc é obrigatório');
        }
    
        try {
            const query = `SELECT * FROM unibet.tbl_eventos_ufc WHERE id_evento = ?`;
            const [rows] = await pool.query(query, [id_ufc]);
            return rows[0]; 
        } catch (err) {
            throw new Error('Erro ao buscar UFC: ' + err.message);
        }
    };

    create_bet = async () => {
        const pool = getConexao();
        const metodoMapeado = {
            "Unanimous Decision": "U-DEC",
            "Submission": "SUB",
            "Split Decision": "S-DEC",
            "Knockout": "KO/TKO",
            "DRAW": "DRAW"
        }

        const metodoFinal = metodoMapeado[this._metodo] || this._metodo;

        const query = `
        INSERT INTO unibet.tbl_eventos_ufc (idUsuario, id_evento, idEvento, vencedor, metodo, rodada)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await pool.query(query, [
                this._idUsuario,
                this._id_evento,
                this._idEvento,
                this._vencedor,
                metodoFinal,
                this._rodada
            ]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao criar aposta: ' + err);
        }
    };

    ufc_sync_events = async () => {
        const pool = getConexao();
  
        try {
            const [tables] = await pool.promise().execute('SHOW TABLES LIKE "tbl_eventos_ufc"');
            if (tables.length === 0) {
                await pool.promise().execute(`
                    CREATE TABLE IF NOT EXISTS unibet.tbl_eventos_ufc (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        idUsuario INT,
                        id_evento INT,
                        idEvento INT,
                        vencedor VARCHAR(50),
                        metodo VARCHAR(50),
                        rodada INT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `);
            }

            const [checkRecords] = await pool.promise().execute('SELECT COUNT(*) as count FROM unibet.tbl_eventos_ufc');
            if (checkRecords[0].count > 0) {
                await pool.promise().execute('DELETE FROM unibet.tbl_eventos_ufc WHERE id_evento = 2');
                await pool.promise().execute('UPDATE unibet.tbl_eventos_ufc SET id_evento = 2 WHERE id_evento = 1');
            }

            const [rowsDB] = await pool.promise().execute('SELECT * FROM unibet.tbl_eventos_ufc WHERE id_evento = 2');
            if (rowsDB.length > 0) {
                const evento = rowsDB[0];
                const lutas = JSON.parse(evento.lutas);
  
                const [apostas] = await pool.promise().execute(
                    'SELECT * FROM unibet.tbl_eventos_ufc WHERE id_evento = ?',
                    [evento.id_evento]
                );
  
                for (const aposta of apostas) {
                    const luta = lutas.find(l => l.id === aposta.id_evento);
                    if (!luta) continue;
  
                    let pontos = 0;
  
                    const apostaVencedor = aposta.vencedor == 1 ? 'red' : 'blue';
                    if (apostaVencedor === luta.winner) {
                        pontos += 5;
                        console.log(`🟢 Usuário ${aposta.idUsuario} acertou o VENCEDOR!`);
                    } else {
                        console.log(`🔴 Usuário ${aposta.idUsuario} ERROU o VENCEDOR!`);
                    }
  
                    const metodoAposta = aposta.metodo.toUpperCase().trim();
                    let metodoReal = 'OUTRO';
                    const methodLower = luta.method.toLowerCase();
                    if (methodLower.includes('ko') || methodLower.includes('tko')) metodoReal = 'KO';
                    else if (methodLower.includes('sub')) metodoReal = 'SUB';
                    else if (methodLower.includes('dec')) metodoReal = 'DEC';
  
                    if (metodoAposta === metodoReal) {
                        pontos += 5;
                        console.log(`🟢 Usuário ${aposta.idUsuario} acertou o MÉTODO (${metodoReal}) na luta ${luta.redFighter} vs ${luta.blueFighter}`);
                    } else {
                        console.log(`🔴 Usuário ${aposta.idUsuario} ERROU o MÉTODO na luta ${luta.redFighter} vs ${luta.blueFighter}`);
                    }
  
                    if (aposta.rodada?.toString() === luta.round?.toString()) {
                        pontos += 5;
                        console.log(`🟢 Usuário ${aposta.idUsuario} acertou a RODADA na luta ${luta.redFighter} vs ${luta.blueFighter}`);
                    } else {
                        console.log(`🔴 Usuário ${aposta.idUsuario} ERROU a RODADA na luta ${luta.redFighter} vs ${luta.blueFighter}`);
                    }
  
                    console.log(`🎯 Total: ${pontos} pontos\n`);
  
                    if (pontos > 0) {
                        await pool.promise().execute(
                            'UPDATE usuarios SET pontos = COALESCE(pontos, 0) + ? WHERE idUsuarios = ?',
                            [pontos, aposta.idUsuario]
                        );
                    }
                }
            }
  
            await pool.promise().execute('DELETE FROM unibet.tbl_eventos_ufc');
            await pool.promise().execute('ALTER TABLE unibet.tbl_eventos_ufc AUTO_INCREMENT = 1');
  
            const eventPageResponse = await axios.get('http://ufcstats.com/statistics/events/completed');
            const $ = cheerio.load(eventPageResponse.data);
            const rowsTable = $('tr.b-statistics__table-row_type_first, tr.b-statistics__table-row').get();
  
            const extractEvent = ($, row) => {
                const tds = $(row).find('td');
                const link = tds.eq(0).find('a').attr('href');
                const name = tds.eq(0).text().trim().replace(/\s+/g, ' ');
                const date = tds.eq(0).find('span.b-statistics__date').text().trim();
                const location = tds.eq(1).text().trim();
                if (!link || !name || !date || !location) return null;
                return { name, date, location, link };
            };
  
            const scrapeFights = async (eventURL) => {
                const { data } = await axios.get(eventURL);
                const $ = cheerio.load(data);
                const fights = [];
                let fightId = 1;
  
                $('tbody.b-fight-details__table-body > tr').each((i, el) => {
                    const tds = $(el).find('td');
                    const fighterNames = tds.eq(1).find('a.b-link_style_black');
                    const redFighter = $(fighterNames[0]).text().trim();
                    const blueFighter = $(fighterNames[1]).text().trim();
  
                    const winnerTag = tds.eq(0).find('a.b-flag_style_green');
                    const winnerHref = winnerTag.attr('href') || '';
                    const redHref = $(fighterNames[0]).attr('href');
                    const winner = winnerHref === redHref ? 'red' : 'blue';
  
                    const weightClass = tds.eq(6).text().trim();
                    const method = tds.eq(7).find('p').first().text().trim();
                    const round = tds.eq(8).text().trim();
                    const time = tds.eq(9).text().trim();
  
                    if (redFighter && blueFighter) {
                        fights.push({
                            id: fightId++,
                            redFighter,
                            blueFighter,
                            weightClass,
                            method,
                            round,
                            time,
                            winner
                        });
                    }
                });
  
                return fights;
            };
  
            const events = [];
            const nextRow = rowsTable.find(row => $(row).find('img[src*="next.png"]').length);
            const nextEvent = nextRow ? extractEvent($, nextRow) : null;
  
            if (nextEvent) {
                const fights = await scrapeFights(nextEvent.link);
                events.push({ ...nextEvent, fights });
            }
  
            const insertSQL = 'INSERT INTO unibet.tbl_eventos_ufc (nome_evento, data_evento, local_evento, lutas_evento) VALUES (?, ?, ?, ?)';
            for (const event of events) {
                const [res] = await pool.promise().execute(insertSQL, [
                    event.name,
                    event.date,
                    event.location,
                    JSON.stringify(event.fights)
                ]);
                console.log(`✅ Novo evento '${event.name}' inserido com ID ${res.insertId}`);
            }
  
            return events.map(e => e.name);
  
        } catch (error) {
            console.error('Erro no ufc_sync_events:', error);
            return false;
        }
    };

    login = async () => {
        const pool = getConexao();
        const query = 'SELECT * FROM techfala2.tbl_conta_cliente WHERE email_conta_cliente = ?';
        
        try {
            const result = await pool.query(query, [this._email_conta_cliente]);
            const contaCliente = result.rows[0];
            
            if (!contaCliente) throw new Error('Credenciais inválidas');

            const passwordMatch = await ContaClienteDAO.comparePassword(this._senha_conta_cliente, contaCliente.senha_conta_cliente);
            if (!passwordMatch) throw new Error('Credenciais inválidas');

            this._id_cliente = contaCliente.id_cliente;
            this._nome_conta_cliente = contaCliente.nome_conta_cliente;
            this._sobrenome_conta_cliente = contaCliente.sobrenome_conta_cliente;
            this._email_conta_cliente = contaCliente.email_conta_cliente;
            this._cnpj_conta_cliente = contaCliente.cnpj_conta_cliente;
            this.celular_conta_cliente = contaCliente.celular_conta_cliente;
            this._status_conta_cliente = contaCliente.status_conta_cliente;
            
            return true;
        } catch (err) {
            throw new Error('Erro ao realizar login: ' + err);
        }
    };

    static isEmailTaken = async (email_conta_cliente) => {
        const pool = getConexao();
        try {
            const result = await pool.query(
                'SELECT id_cliente FROM techfala2.tbl_conta_cliente WHERE email_conta_cliente = ?', 
                [email_conta_cliente.toLowerCase().trim()]
            );
            return result.rows.length > 0;
        } catch (err) {
            throw new Error('Erro ao verificar e-mail duplicado');
        }
    };
}

module.exports = UfcDAO;