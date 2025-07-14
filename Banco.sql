CREATE SCHEMA unibet;

CREATE TABLE unibet.tbl_cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome_cliente TEXT NOT NULL,
    email_cliente TEXT NOT NULL,
    senha_cliente TEXT NOT NULL,
    celular_cliente TEXT NOT NULL,
    pontos_cliente INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE unibet.tbl_eventos_ufc (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nome_evento TEXT NOT NULL,
    local_evento TEXT NOT NULL,
    data_evento TIMESTAMP NOT NULL,
    status_evento BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE unibet.tbl_lutas_ufc (
    id_luta INT PRIMARY KEY AUTO_INCREMENT,
    id_evento INT NOT NULL,
    red_fighter TEXT NOT NULL,
    blue_fighter TEXT NOT NULL,
    categoria TEXT NOT NULL,
	titulo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_evento) REFERENCES unibet.tbl_eventos_ufc(id_evento) ON DELETE CASCADE
);

CREATE TABLE unibet.tbl_apostas_ufc (
    id_aposta INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INTEGER NOT NULL,
    id_evento INTEGER NOT NULL,
    id_luta INTEGER NOT NULL,
    vencedor TEXT NOT NULL,
    metodo TEXT NOT NULL,
    rodada INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_cliente) REFERENCES unibet.tbl_cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_evento) REFERENCES unibet.tbl_eventos_ufc(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_luta) REFERENCES unibet.tbl_lutas_ufc(id_luta) ON DELETE CASCADE
);

CREATE TABLE unibet.tbl_vencedores_ufc (
    id_vencedor INT PRIMARY KEY AUTO_INCREMENT,
    id_evento INT NOT NULL,
    id_luta INT NOT NULL,
    vencedor TEXT NOT NULL,
    metodo TEXT NOT NULL,
    rodada INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_evento) REFERENCES unibet.tbl_eventos_ufc(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_luta) REFERENCES unibet.tbl_lutas_ufc(id_luta) ON DELETE CASCADE
);


CREATE TABLE unibet.tbl_admin (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    email_admin TEXT NOT NULL,
    senha_admin TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




