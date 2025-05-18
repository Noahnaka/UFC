CREATE DATABASE unibet;

CREATE SCHEMA unibetv2;

CREATE TABLE unibetv2.tbl_cliente (
    id_cliente SERIAL PRIMARY KEY,
    nome_cliente TEXT NOT NULL,
    email_cliente TEXT NOT NULL,
    senha_cliente TEXT NOT NULL,
    celular_cliente TEXT NOT NULL,
    pontos_cliente INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE unibetv2.tbl_apostas_ufc (
    id_aposta SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_ufc INTEGER NOT NULL,
    id_evento INTEGER NOT NULL,
    id_luta INTEGER NOT NULL,
    id_vencedor INTEGER NOT NULL,
    valor_aposta DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE unibetv2.tbl_eventos_ufc (
    id_evento SERIAL PRIMARY KEY,
    nome_evento TEXT NOT NULL,
    local_evento TEXT NOT NULL,
    data_evento TIMESTAMP NOT NULL,
    lutas_evento TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



