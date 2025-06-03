const mysql = require('mysql2');

class Banco {
    static HOST = process.env.DB_HOST;
    static USER = process.env.DB_USER;
    static PWD = process.env.DB_PASSWORD;
    static DB = process.env.DB_NAME;
    static PORT = process.env.DB_PORT;
    static CONEXAO = null;

    static conectar() {
        if (Banco.CONEXAO === null) {
            Banco.CONEXAO = mysql.createConnection({
                host: Banco.HOST,
                user: Banco.USER,
                password: Banco.PWD,
                database: Banco.DB,
                port: Banco.PORT
            });

            Banco.CONEXAO.connect((err) => {
                if (err) {
                    const objResposta = {
                        cod: 1,
                        msg: "Erro ao conectar no banco",
                        erro: err.message
                    };
                    console.error(JSON.stringify(objResposta));
                    process.exit(1); 
                }
            });
        }
    }

    static getConexao() {
        if (Banco.CONEXAO === null) {
            Banco.conectar();
        }
        return Banco.CONEXAO;
    }
}

module.exports = Banco;
