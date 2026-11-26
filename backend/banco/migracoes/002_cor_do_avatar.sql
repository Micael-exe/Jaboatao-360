-- O DEFAULT vale para contas antigas e novas. A consulta permite retomar após uma interrupção do DDL.
SET @tem_avatar = (SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'contas' AND column_name = 'avatar');
SET @comando = IF(@tem_avatar = 0,
  'ALTER TABLE contas ADD COLUMN avatar VARCHAR(16) NOT NULL DEFAULT ''espuma''',
  'SELECT 1');
PREPARE adicionar_avatar FROM @comando;
EXECUTE adicionar_avatar;
DEALLOCATE PREPARE adicionar_avatar;
