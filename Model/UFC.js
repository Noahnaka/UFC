const Banco = require('./Banco');
const axios = require('axios');
const cheerio = require('cheerio');

class UFC {
  constructor() {
    this._idUFC = null;
    this._idUsuario = null;
    this._idAposta = null;
    this._idEvento = null;
    this._vencedor = '';
    this._metodo = '';
    this._rodada = '';
    this._evento = '';
    this._data = '';
    this._local = '';
    this._lutas = '';
  }

  async create_bet() {
    const conexao = Banco.getConexao();
  
    const metodoMapeado = {
      "Unanimous Decision": "U-DEC",
      "Submission": "SUB",
      "Split Decision": "S-DEC",
      "Knockout": "KO/TKO",
      "DRAW": "DRAW"
    }

    const metodoFinal = metodoMapeado[this._metodo] || this._metodo;
  
    const SQL = 'INSERT INTO apostasufc (idUsuario, idUFC, idEvento, vencedor, metodo, rodada) VALUES (?, ?, ?, ?, ?, ?);';
  
    try {
      const [result] = await conexao.promise().execute(SQL, [
        this._idUsuario,
        this._idUFC,
        this._idEvento,
        this._vencedor,
        metodoFinal,
        this._rodada
      ]);
      this._idAposta = result.insertId;
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao criar o aposta:', error);
      return false;
    }
  }
  

  async UFC_read_all() {
    const conexao = Banco.getConexao();
    const SQL = 'SELECT * FROM eventosufc;';
    try {
      const [rows] = await conexao.promise().execute(SQL);
      return rows.length > 0 ? rows : [];
    } catch (error) {
      console.error('Erro ao buscar eventos: ', error);
      return [];
    }
  }

  async UFC_read_by_id() {
    const conexao = Banco.getConexao(); 
    const SQL = 'SELECT * FROM eventosufc WHERE idUFC = ?;'; 
    try {
        const [rows] = await conexao.promise().execute(SQL, [this._idUFC]); 
        return rows;
    } catch (error) {
        console.error('Erro ao ler evento pelo ID:', error); 
        return null;
    }
  }

  async UFC_read_bets_by_id() {
    const conexao = Banco.getConexao(); 
    const SQL = 'SELECT idUFC, idEvento FROM apostasufc WHERE idUsuario = ?;';
    try {
      const [rows] = await conexao.promise().execute(SQL, [this._idUsuario]);
      return rows;
    } catch (error) {
      console.error('Erro ao ler idUFC pelo idUsuario:', error); 
      return null;
    }
  }

  async ufc_sync_events() {
    const conexao = Banco.getConexao();
  
    try {
      // 🔥 1. Deleta apostas do evento anterior
      await conexao.promise().execute('DELETE FROM apostasufc WHERE idEvento = 2');
  
      // 🔁 2. Promove o evento atual para "evento anterior"
      await conexao.promise().execute('UPDATE apostasufc SET idEvento = 2 WHERE idEvento = 1');
      await conexao.promise().execute('UPDATE eventosufc SET idUFC = 2 WHERE idUFC = 1');
  
      // 🧠 3. Calcula os pontos com base no evento finalizado
      const [rowsDB] = await conexao.promise().execute('SELECT * FROM eventosufc WHERE idUFC = 2');
      if (rowsDB.length > 0) {
        const evento = rowsDB[0];
        const lutas = JSON.parse(evento.lutas);
  
        const [apostas] = await conexao.promise().execute(
          'SELECT * FROM apostasufc WHERE idEvento = ?',
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
            await conexao.promise().execute(
              'UPDATE usuarios SET pontos = IFNULL(pontos, 0) + ? WHERE idUsuarios = ?',
              [pontos, aposta.idUsuario]
            );
          }
        }
      }
  
      // 🆕 4. Limpa eventos e scrapeia novos (evento futuro vira idUFC = 1)
      await conexao.promise().execute('DELETE FROM eventosufc;');
      await conexao.promise().execute('ALTER TABLE eventosufc AUTO_INCREMENT = 1');
  
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
        const [res] = await conexao.promise().execute(insertSQL, [
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
  }
  
  
  
  
  
  get idUFC() {
    return this._idUFC;
  }
  
  set idUFC(idUFC) {
    this._idUFC = idUFC;
  }
  
  get idEvento() {
    return this._idEvento;
  }
  
  set idEvento(idEvento) {
    this._idEvento = idEvento;
  }

  get idUsuario() {
    return this._idUsuario;
  }
  
  set idUsuario(idUsuario) {
    this._idUsuario = idUsuario;
  }
  
  get nome() {
    return this._evento;
  }
  set nome(nome) {
    this._evento = nome;
  }
  
  get vencedor() {
    return this._vencedor;
  }
  set vencedor(vencedor) {
    this._vencedor = vencedor;
  }
  
  get metodo() {
    return this._metodo;
  }
  set metodo(metodo) {
    this._metodo = metodo;
  }
  
  get rodada() {
    return this._rodada;
  }
  set rodada(rodada) {
    this._rodada = rodada;
  }
  
  get email() {
    return this._data;
  }
  set email(email) {
    this._data = email;
  }
  
  get senha() {
    return this._lutas;
  }
  set senha(senha) {
    this._lutas = senha;
  }
  
  get telefone() {
    return this._local;
  }
  set telefone(telefone) {
    this._local = telefone;
  }
}

module.exports = UFC;
