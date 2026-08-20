-- Schema for MyCifras PostgreSQL database

-- Cifras table
CREATE TABLE IF NOT EXISTS cifras (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    artista VARCHAR(255) NOT NULL,
    tom VARCHAR(10) NOT NULL,
    instrumento VARCHAR(20) NOT NULL CHECK (instrumento IN ('VIOLAO', 'GUITARRA', 'TECLADO')),
    conteudo TEXT NOT NULL,
    fonte VARCHAR(500),
    observacoes TEXT,
    acordes_ids VARCHAR(500),
    favorito BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Listas table
CREATE TABLE IF NOT EXISTS listas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Join table for Lista <-> Cifra many-to-many
CREATE TABLE IF NOT EXISTS lista_cifras (
    lista_id BIGINT NOT NULL REFERENCES listas(id) ON DELETE CASCADE,
    cifra_id BIGINT NOT NULL REFERENCES cifras(id) ON DELETE CASCADE,
    PRIMARY KEY (lista_id, cifra_id)
);

-- Chord diagrams table
CREATE TABLE IF NOT EXISTS chord_diagrams (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    diagrama TEXT NOT NULL,
    instrumento VARCHAR(20) NOT NULL CHECK (instrumento IN ('VIOLAO', 'GUITARRA', 'TECLADO')),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cifras_titulo ON cifras(titulo);
CREATE INDEX IF NOT EXISTS idx_cifras_artista ON cifras(artista);
CREATE INDEX IF NOT EXISTS idx_cifras_instrumento ON cifras(instrumento);
CREATE INDEX IF NOT EXISTS idx_cifras_favorito ON cifras(favorito);
CREATE INDEX IF NOT EXISTS idx_listas_nome ON listas(nome);
CREATE INDEX IF NOT EXISTS idx_chord_diagrams_nome ON chord_diagrams(nome);
CREATE INDEX IF NOT EXISTS idx_chord_diagrams_instrumento ON chord_diagrams(instrumento);