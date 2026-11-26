CREATE TABLE IF NOT EXISTS contas (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  senha_hash VARCHAR(220) NOT NULL,
  nome VARCHAR(160) NOT NULL,
  cidade VARCHAR(120) NOT NULL DEFAULT '',
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Turista','Empreendedor','Empresa')),
  revisao INT UNSIGNED NOT NULL DEFAULT 0,
  criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS negocios (
  conta_id CHAR(36) PRIMARY KEY,
  nome VARCHAR(180) NOT NULL,
  ramo VARCHAR(100) NOT NULL DEFAULT '',
  bairro VARCHAR(120) NOT NULL DEFAULT '',
  cnpj VARCHAR(14),
  FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sessoes (
  token_hash CHAR(64) PRIMARY KEY,
  conta_id CHAR(36) NOT NULL,
  expira_em BIGINT NOT NULL,
  INDEX (expira_em),
  FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS preferencias (
  conta_id CHAR(36) PRIMARY KEY,
  ritmo VARCHAR(20) NOT NULL DEFAULT 'moderado',
  orcamento VARCHAR(3) NOT NULL DEFAULT '$$',
  novidades BOOLEAN NOT NULL DEFAULT TRUE,
  lembretes_roteiros BOOLEAN NOT NULL DEFAULT TRUE,
  ofertas_comercio BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS interesses_conta (
  conta_id CHAR(36) NOT NULL,
  interesse VARCHAR(60) NOT NULL,
  PRIMARY KEY (conta_id, interesse),
  FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS locais (
  id VARCHAR(64) PRIMARY KEY,
  nome VARCHAR(190) NOT NULL,
  origem VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS favoritos (
  conta_id CHAR(36) NOT NULL,
  local_id VARCHAR(64) NOT NULL,
  PRIMARY KEY (conta_id, local_id),
  FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
  FOREIGN KEY (local_id) REFERENCES locais(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS visitas (
  conta_id CHAR(36) NOT NULL,
  id VARCHAR(100) NOT NULL,
  local_id VARCHAR(64) NOT NULL,
  dia DATE NOT NULL,
  nota TEXT NOT NULL,
  PRIMARY KEY (conta_id, id),
  INDEX (conta_id, dia),
  FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
  FOREIGN KEY (local_id) REFERENCES locais(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS roteiros (
  conta_id CHAR(36) NOT NULL,
  id VARCHAR(110) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  dia DATE,
  posicao INT UNSIGNED NOT NULL,
  edita_id VARCHAR(110),
  PRIMARY KEY (conta_id, id),
  FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS paradas (
  conta_id CHAR(36) NOT NULL,
  roteiro_id VARCHAR(110) NOT NULL,
  uid VARCHAR(110) NOT NULL,
  local_id VARCHAR(64),
  referencia_externa VARCHAR(255),
  nome_externo VARCHAR(190),
  CHECK ((local_id IS NOT NULL AND referencia_externa IS NULL AND nome_externo IS NULL)
      OR (local_id IS NULL AND referencia_externa IS NOT NULL AND nome_externo IS NOT NULL)),
  horario TIME,
  posicao INT UNSIGNED NOT NULL,
  PRIMARY KEY (conta_id, roteiro_id, uid),
  INDEX (conta_id, roteiro_id, posicao),
  FOREIGN KEY (conta_id, roteiro_id) REFERENCES roteiros(conta_id, id) ON DELETE CASCADE,
  FOREIGN KEY (local_id) REFERENCES locais(id)
) ENGINE=InnoDB;
