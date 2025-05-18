const UfcModel = require('./ufcModel');
const { getDatabase } = require('../Db');
const axios = require('axios');
const cheerio = require('cheerio');

class UfcDAO extends UfcModel {

    static UFC_read_all = async () => {
        const pool = getDatabase();
        try {
            const result = await pool.query('SELECT * FROM unibet.tbl_ufc');
            return result.rows;
        } catch (err) {
            throw new Error('Erro ao buscar conta cliente');
        }
    };

    static UFC_read_by_id = async (id_ufc) => {
        const pool = getDatabase();

        if (!id_ufc) {
            throw new Error('O campo id_ufc é obrigatório');
        }
    
        try {
            const query = `SELECT * FROM unibet.tbl_ufc WHERE idUFC = $1`;
            const result = await pool.query(query, [id_ufc]);
            return result.rows[0]; 
        } catch (err) {
            throw new Error('Erro ao buscar UFC: ' + err.message);
        }
    };

    create_bet = async () => {
        const pool = getDatabase();
        const metodoMapeado = {
            "Unanimous Decision": "U-DEC",
            "Submission": "SUB",
            "Split Decision": "S-DEC",
            "Knockout": "KO/TKO",
            "DRAW": "DRAW"
        }

        const metodoFinal = metodoMapeado[this._metodo] || this._metodo;

        const query = `
        INSERT INTO unibet.tbl_ufc (idUsuario, idUFC, idEvento, vencedor, metodo, rodada)
        VALUES ($1, $2, $3, $4, $5, $6)
        ;
        `;
        try {
            const result = await pool.query(query, [
                this._idUsuario,
                this._idUFC,
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
        const pool = getDatabase();
  
    try {
      // 🔥 1. Deleta apostas do evento anterior
      await pool.query('DELETE FROM unibet.tbl_ufc WHERE idUFC = 2');
  
      // 🔁 2. Promove o evento atual para "evento anterior"
      await pool.query('UPDATE unibet.tbl_ufc SET idUFC = 2 WHERE idUFC = 1');
  
      // 🧠 3. Calcula os pontos com base no evento finalizado
      const [rowsDB] = await pool.query('SELECT * FROM unibet.tbl_ufc WHERE idUFC = 2');
      if (rowsDB.length > 0) {
        const evento = rowsDB[0];
        const lutas = JSON.parse(evento.lutas);
  
        const [apostas] = await pool.query(
          'SELECT * FROM unibet.tbl_ufc WHERE idUFC = ?',
          [evento.idUFC]
        );
  
        for (const aposta of apostas) {
          const luta = lutas.find(l => l.id === aposta.idUFC);
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
            await pool.query(
              'UPDATE usuarios SET pontos = IFNULL(pontos, 0) + ? WHERE idUsuarios = ?',
              [pontos, aposta.idUsuario]
            );
          }
        }
      }
  
      // 🆕 4. Limpa eventos e scrapeia novos (evento futuro vira idUFC = 1)
      await pool.query('DELETE FROM eventosufc;');
      await pool.query('ALTER TABLE eventosufc AUTO_INCREMENT = 1');
  
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
  
      const insertSQL = 'INSERT INTO eventosufc (evento, data, local, lutas) VALUES (?, ?, ?, ?)';
      for (const event of events) {
        const [res] = await pool.query(insertSQL, [
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
    
    /*

    update = async () => {
        const pool = getDatabase();
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (this._name) {
            updates.push(`name = $${paramCount}`);
            values.push(this._name);
            paramCount++;
        }
        if (this._email) {
            updates.push(`email = $${paramCount}`);
            values.push(this._email);
            paramCount++;
        }
        if (this._password) {
            updates.push(`password = $${paramCount}`);
            values.push(await ContaClienteDAO.hashPassword(this._password));
            paramCount++;
        }

        if (updates.length === 0) return false;

        values.push(this._id);
        const query = `
            UPDATE admin 
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id
        `;

        try {
            const result = await pool.query(query, values);
            return result.rowCount > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar administrador');
        }
    };
 
    patch = async () => {
        const pool = getDatabase();
        const query = `
            UPDATE admin 
            SET image = $1
            WHERE id = $2
            RETURNING id
        `;

        try {
            const result = await pool.query(query, [this._image, this._id]);
            return result.rowCount > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar a foto do administrador');
        }
    };

    delete = async () => {
        const pool = getDatabase();
        const query = `
            DELETE FROM admin 
            WHERE id = $1
            RETURNING id
        `;

        try {
            const result = await pool.query(query, [this._id]);
            return result.rowCount > 0;
        } catch (err) {
            throw new Error('Erro ao deletar administrador');
        }
    };

    static getAll = async () => {
        const pool = getDatabase();
        try {
            const result = await pool.query('SELECT * FROM admin');
            return result.rows;
        } catch (err) {
            throw new Error('Erro ao buscar administradores');
        }
    };

    static getById = async (id) => {
        if (!id) throw new Error('O campo "id" é obrigatório');
        const pool = getDatabase();
        try {
            const result = await pool.query('SELECT * FROM admin WHERE id = $1', [id]);
            return result.rows[0];
        } catch (err) {
            throw new Error('Erro ao buscar administrador');
        }
    };

    */

    login = async () => {
        const pool = getDatabase();
        const query = 'SELECT * FROM techfala2.tbl_conta_cliente WHERE email_conta_cliente = $1';
        
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
        const pool = getDatabase();
        try {
            const result = await pool.query(
                'SELECT id_cliente FROM techfala2.tbl_conta_cliente WHERE email_conta_cliente = $1', 
                [email_conta_cliente.toLowerCase().trim()]
            );
            return result.rows.length > 0;
        } catch (err) {
            throw new Error('Erro ao verificar e-mail duplicado');
        }
    };
}

module.exports = UfcDAO;