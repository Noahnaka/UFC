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

  async create_bet(){
    const conexao = Banco.getConexao(); 
    const SQL = 'INSERT INTO apostasufc (idUsuario, idUFC, idEvento, vencedor, metodo, rodada) VALUES (?, ?, ?, ?, ?, ?);'; 
    try {
        const [result] = await conexao.promise().execute(SQL, [this._idUsuario, this._idUFC, this._idEvento, this._vencedor, this._metodo, this._rodada]);
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
      console.log("Response:", rows);
      return rows;
    } catch (error) {
      console.error('Erro ao ler idUFC pelo idUsuario:', error); 
      return null;
    }
  }

  async ufc_sync_events() {
    const conexao = Banco.getConexao();
  
    try {
      const SQL = 'SELECT * FROM eventosufc;';
      const [rowsDB] = await conexao.promise().execute(SQL);
      if (rowsDB.length > 0) {
        const evento = rowsDB[0];
  
        const idUFC = evento.idUFC;
        const lutas = JSON.parse(evento.lutas); 
  
        console.log({ idUFC, lutas});
      }

      const SQLapostas = 'select * from apostasufc';
      const [rowsDB2] = await conexao.promise().execute(SQLapostas);
      if (rowsDB2.length > 0) {
        const evento = rowsDB2[0];
  
        const idUFC = evento.idUFC;
        const lutas = JSON.parse(evento.lutas); 
  
        console.log({ idUFC, lutas});
      }
      await conexao.promise().execute('DELETE FROM eventosufc;');
      await conexao.promise().execute('ALTER TABLE eventosufc AUTO_INCREMENT = 1;');
  
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
          const fighterNames = tds.eq(1)
            .find('p.b-fight-details__table-text a')
            .map((i, e) => $(e).text().trim())
            .get();
          const redFighter = fighterNames[0] || '';
          const blueFighter = fighterNames[1] || '';
          const weightClass = tds.eq(6).text().trim();
          const method = tds.eq(7).text().trim();
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
              time
            });
          }
        });
        return fights;
      };
  
      let events = [];
  
      const nextRow = rowsTable.find(row => $(row).find('img[src*="next.png"]').length);
      const nextEvent = nextRow ? extractEvent($, nextRow) : null;
  
      const completedRows = rowsTable.filter(row => !$(row).find('img[src*="next.png"]').length);
      let lastCompletedEvent = null;
      for (const row of completedRows) {
        const candidate = extractEvent($, row);
        if (!candidate) continue;
        const fights = await scrapeFights(candidate.link);
        if (fights.length > 0) {
          lastCompletedEvent = { ...candidate, fights };
          break;
        }
      }
  
      if (!lastCompletedEvent && completedRows.length > 0) {
        const candidate = extractEvent($, completedRows[0]);
        const fights = await scrapeFights(candidate.link);
        lastCompletedEvent = { ...candidate, fights };
      }
  
      if (nextEvent) {
        const fights = await scrapeFights(nextEvent.link);
        events.push({ ...nextEvent, fights });
      }
  
      if (lastCompletedEvent) {
        events.push(lastCompletedEvent);
      }
  
      const SQLInsert = 'INSERT INTO eventosufc (evento, data, local, lutas) VALUES (?, ?, ?, ?);';
      for (const event of events) {
        const [result] = await conexao.promise().execute(
          SQLInsert,
          [event.name, event.date, event.location, JSON.stringify(event.fights)]
        );
        console.log(`Event '${event.name}' inserted with id ${result.insertId}`);
      }
  
      return events.map(event => event.name);
  
    } catch (error) {
      console.error('Erro ao sync eventos:', error);
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
