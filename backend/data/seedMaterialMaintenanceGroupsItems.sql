-- Insert Material Groups
INSERT INTO material_group ("group") VALUES 
('Óleos & Fluidos'),
('Filtros'),
('Freios'),
('Suspensão & Direção'),
('Motor'),
('Arrefecimento'),
('Elétrico'),
('Transmissão & Embreagem'),
('Ar-condicionado'),
('Acabamentos & Consumíveis');

-- Insert Materials
WITH material_groups AS (SELECT id, "group" FROM material_group) 
INSERT INTO material (name, group_id) VALUES
-- Óleos & Fluidos
('Óleo de motor 5W30 sintético', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Óleo de motor 5W40 sintético', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Óleo de motor 10W40 semissintético', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Óleo de motor 15W40 mineral', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Fluido de freio DOT4', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Fluido de freio DOT5.1', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Fluido de embreagem', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Líquido de arrefecimento concentrado', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Óleo de câmbio manual', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Óleo ATF câmbio automático', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Óleo de direção hidráulica', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),
('Graxa multiuso', (SELECT id FROM material_groups WHERE "group" = 'Óleos & Fluidos')),

-- Filtros
('Filtro de óleo', (SELECT id FROM material_groups WHERE "group" = 'Filtros')),
('Filtro de ar do motor', (SELECT id FROM material_groups WHERE "group" = 'Filtros')),
('Filtro de combustível gasolina', (SELECT id FROM material_groups WHERE "group" = 'Filtros')),
('Filtro de combustível diesel', (SELECT id FROM material_groups WHERE "group" = 'Filtros')),
('Filtro de cabine / ar-condicionado', (SELECT id FROM material_groups WHERE "group" = 'Filtros')),
('Filtro de transmissão automática', (SELECT id FROM material_groups WHERE "group" = 'Filtros')),

-- Freios
('Pastilha de freio dianteira', (SELECT id FROM material_groups WHERE "group" = 'Freios')),
('Pastilha de freio traseira', (SELECT id FROM material_groups WHERE "group" = 'Freios')),
('Lona de freio traseira', (SELECT id FROM material_groups WHERE "group" = 'Freios')),
('Disco de freio dianteiro', (SELECT id FROM material_groups WHERE "group" = 'Freios')),
('Disco de freio traseiro', (SELECT id FROM material_groups WHERE "group" = 'Freios')),
('Tambor de freio', (SELECT id FROM material_groups WHERE "group" = 'Freios')),
('Cilindro de roda', (SELECT id FROM material_groups WHERE "group" = 'Freios')),
('Cilindro mestre', (SELECT id FROM material_groups WHERE "group" = 'Freios')),
('Kit reparo de freio', (SELECT id FROM material_groups WHERE "group" = 'Freios')),

-- Suspensão & Direção
('Amortecedor dianteiro', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Amortecedor traseiro', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Mola dianteira', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Mola traseira', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Bucha de bandeja', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Bucha de barra estabilizadora', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Pivô de suspensão', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Terminal de direção', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Barra de direção', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Caixa de direção', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Rolamento de roda dianteiro', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Rolamento de roda traseiro', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),
('Kit manga de eixo', (SELECT id FROM material_groups WHERE "group" = 'Suspensão & Direção')),

-- Motor
('Correia dentada', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Esticador', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Kit correia dentada completo', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Correia de acessórios', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Tensor de correia', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Bomba de óleo', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Vela de ignição', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Kit velas de ignição', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Cabo de vela', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Bobina de ignição', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Junta da tampa de válvulas', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Junta do cabeçote', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Kit juntas motor', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Bico injetor', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Sensor MAP', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Sensor lambda/sonda', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Sensor de temperatura', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Sensor de rotação (CKP)', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Válvula EGR', (SELECT id FROM material_groups WHERE "group" = 'Motor')),
('Tampa de válvulas', (SELECT id FROM material_groups WHERE "group" = 'Motor')),

-- Arrefecimento
('Radiador', (SELECT id FROM material_groups WHERE "group" = 'Arrefecimento')),
('Termostato', (SELECT id FROM material_groups WHERE "group" = 'Arrefecimento')),
('Bomba d''água', (SELECT id FROM material_groups WHERE "group" = 'Arrefecimento')),
('Mangueira superior do radiador', (SELECT id FROM material_groups WHERE "group" = 'Arrefecimento')),
('Mangueira inferior do radiador', (SELECT id FROM material_groups WHERE "group" = 'Arrefecimento')),
('Reservatório de expansão', (SELECT id FROM material_groups WHERE "group" = 'Arrefecimento')),
('Eletroventilador', (SELECT id FROM material_groups WHERE "group" = 'Arrefecimento')),
('Tampa do radiador', (SELECT id FROM material_groups WHERE "group" = 'Arrefecimento')),

-- Elétrico
('Bateria 40Ah', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Bateria 45Ah', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Bateria 60Ah', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Bateria 70Ah', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Bateria 90Ah', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Alternador', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Motor de partida', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Lâmpada H4', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Lâmpada H7', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Lâmpada LED farol', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Fusível automotivo', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),
('Relé elétrico', (SELECT id FROM material_groups WHERE "group" = 'Elétrico')),

-- Transmissão & Embreagem
('Disco de embreagem', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),
('Platô de embreagem', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),
('Rolamento de embreagem', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),
('Kit embreagem completo', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),
('Semi-eixo esquerdo', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),
('Semi-eixo direito', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),
('Junta homocinética externa', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),
('Junta homocinética interna', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),
('Coifa de semi-eixo', (SELECT id FROM material_groups WHERE "group" = 'Transmissão & Embreagem')),

-- Ar-condicionado
('Gás R134a (kg)', (SELECT id FROM material_groups WHERE "group" = 'Ar-condicionado')),
('Gás R1234yf (kg)', (SELECT id FROM material_groups WHERE "group" = 'Ar-condicionado')),
('Compressor de A/C', (SELECT id FROM material_groups WHERE "group" = 'Ar-condicionado')),
('Condensador de A/C', (SELECT id FROM material_groups WHERE "group" = 'Ar-condicionado')),
('Filtro secador', (SELECT id FROM material_groups WHERE "group" = 'Ar-condicionado')),
('Válvula de expansão', (SELECT id FROM material_groups WHERE "group" = 'Ar-condicionado')),
('Óleo de compressor A/C', (SELECT id FROM material_groups WHERE "group" = 'Ar-condicionado')),

-- Acabamentos & Consumíveis
('Silicone automotivo', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Veda rosca', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Loctite trava-porca', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Líquido limpa-injetor', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Descarbonizante', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Limpa contato elétrico', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Spray lubrificante WD-40', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Disco de polimento', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Cera automotiva', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Parafuso', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Porca', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis')),
('Arruela', (SELECT id FROM material_groups WHERE "group" = 'Acabamentos & Consumíveis'));

-- Insert Maintenance Job Groups
INSERT INTO maintenancejob_group ("group") VALUES 
('Revisão & Manutenção'),
('Óleo & Filtros'),
('Freios'),
('Suspensão & Direção'),
('Motor'),
('Arrefecimento'),
('Sistema Elétrico'),
('Ar-condicionado'),
('Câmbio & Transmissão'),
('Diagnóstico'),
('Funilaria & Pintura');

-- Insert Maintenance Jobs
WITH job_groups AS (SELECT id, "group" FROM maintenancejob_group) 
INSERT INTO maintenancejob (name, group_id) VALUES
-- Revisão & Manutenção
('Revisão geral preventiva', (SELECT id FROM job_groups WHERE "group" = 'Revisão & Manutenção')),
('Revisão dos 10.000 km', (SELECT id FROM job_groups WHERE "group" = 'Revisão & Manutenção')),
('Revisão dos 20.000 km', (SELECT id FROM job_groups WHERE "group" = 'Revisão & Manutenção')),
('Revisão dos 30.000 km', (SELECT id FROM job_groups WHERE "group" = 'Revisão & Manutenção')),
('Revisão dos 40.000 km', (SELECT id FROM job_groups WHERE "group" = 'Revisão & Manutenção')),
('Revisão dos 50.000 km', (SELECT id FROM job_groups WHERE "group" = 'Revisão & Manutenção')),

-- Óleo & Filtros
('Troca de óleo do motor', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),
('Troca do filtro de óleo', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),
('Troca do filtro de ar', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),
('Troca do filtro de combustível', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),
('Troca do filtro de cabine', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),
('Troca do óleo de câmbio', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),
('Troca do óleo da caixa de direção', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),
('Troca do fluido de freio', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),
('Troca do fluido de embreagem', (SELECT id FROM job_groups WHERE "group" = 'Óleo & Filtros')),

-- Freios
('Substituição de pastilhas dianteiras', (SELECT id FROM job_groups WHERE "group" = 'Freios')),
('Substituição de pastilhas traseiras', (SELECT id FROM job_groups WHERE "group" = 'Freios')),
('Substituição de lonas de freio traseiras', (SELECT id FROM job_groups WHERE "group" = 'Freios')),
('Substituição de disco de freio dianteiro', (SELECT id FROM job_groups WHERE "group" = 'Freios')),
('Substituição de disco de freio traseiro', (SELECT id FROM job_groups WHERE "group" = 'Freios')),
('Retífica de tambor de freio', (SELECT id FROM job_groups WHERE "group" = 'Freios')),
('Reparo de cilindro mestre de freio', (SELECT id FROM job_groups WHERE "group" = 'Freios')),
('Sangria do sistema de freio', (SELECT id FROM job_groups WHERE "group" = 'Freios')),

-- Suspensão & Direção
('Substituição de amortecedor dianteiro', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Substituição de amortecedor traseiro', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Substituição de mola dianteira', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Substituição de mola traseira', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Substituição de barra estabilizadora', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Substituição de bucha de suspensão', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Substituição de pivô', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Substituição de terminal de direção', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Substituição de caixa de direção', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Alinhamento de direção', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),
('Balanceamento de rodas', (SELECT id FROM job_groups WHERE "group" = 'Suspensão & Direção')),

-- Motor
('Troca da correia dentada + esticador', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Troca da correia acessórios', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Troca do tensor da correia', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Troca da bomba d''água', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Troca da bomba de óleo', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Limpeza de bicos injetores', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Limpeza do corpo de borboleta', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Troca de velas de ignição', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Troca de cabos de ignição', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Troca da bobina de ignição', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Troca de junta da tampa de válvulas', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Retífica do cabeçote', (SELECT id FROM job_groups WHERE "group" = 'Motor')),
('Substituição da corrente do motor', (SELECT id FROM job_groups WHERE "group" = 'Motor')),

-- Arrefecimento
('Troca do líquido de arrefecimento', (SELECT id FROM job_groups WHERE "group" = 'Arrefecimento')),
('Substituição do radiador', (SELECT id FROM job_groups WHERE "group" = 'Arrefecimento')),
('Substituição do reservatório de expansão', (SELECT id FROM job_groups WHERE "group" = 'Arrefecimento')),
('Troca do termostato', (SELECT id FROM job_groups WHERE "group" = 'Arrefecimento')),
('Troca da mangueira do radiador', (SELECT id FROM job_groups WHERE "group" = 'Arrefecimento')),
('Substituição da bomba d''água', (SELECT id FROM job_groups WHERE "group" = 'Arrefecimento')),
('Limpeza do sistema de arrefecimento', (SELECT id FROM job_groups WHERE "group" = 'Arrefecimento')),

-- Sistema Elétrico
('Troca de bateria', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Revisão do sistema de carga', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Troca do alternador', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Troca do motor de partida', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Reparo de chicote elétrico', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Instalação de central multimídia', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Instalação de câmera de ré', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Troca de farol', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Troca de lâmpada', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),
('Diagnóstico elétrico', (SELECT id FROM job_groups WHERE "group" = 'Sistema Elétrico')),

-- Ar-condicionado
('Carga de gás R134a', (SELECT id FROM job_groups WHERE "group" = 'Ar-condicionado')),
('Troca do compressor de A/C', (SELECT id FROM job_groups WHERE "group" = 'Ar-condicionado')),
('Troca do filtro secador', (SELECT id FROM job_groups WHERE "group" = 'Ar-condicionado')),
('Troca da válvula de expansão', (SELECT id FROM job_groups WHERE "group" = 'Ar-condicionado')),
('Limpeza e higienização do A/C', (SELECT id FROM job_groups WHERE "group" = 'Ar-condicionado')),
('Troca do condensador', (SELECT id FROM job_groups WHERE "group" = 'Ar-condicionado')),

-- Câmbio & Transmissão
('Revisão da embreagem', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),
('Troca do disco de embreagem', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),
('Troca do platô de embreagem', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),
('Troca do rolamento de embreagem', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),
('Revisão da caixa de câmbio manual', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),
('Revisão da caixa automática', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),
('Troca do óleo do câmbio automático', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),
('Troca de semi-eixo', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),
('Troca de junta homocinética', (SELECT id FROM job_groups WHERE "group" = 'Câmbio & Transmissão')),

-- Diagnóstico
('Diagnóstico eletrônico (scanner)', (SELECT id FROM job_groups WHERE "group" = 'Diagnóstico')),
('Diagnóstico de motor', (SELECT id FROM job_groups WHERE "group" = 'Diagnóstico')),
('Diagnóstico de transmissão', (SELECT id FROM job_groups WHERE "group" = 'Diagnóstico')),
('Diagnóstico elétrico avançado', (SELECT id FROM job_groups WHERE "group" = 'Diagnóstico')),
('Teste de compressão de cilindros', (SELECT id FROM job_groups WHERE "group" = 'Diagnóstico')),

-- Funilaria & Pintura
('Polimento e lustração', (SELECT id FROM job_groups WHERE "group" = 'Funilaria & Pintura')),
('Higienização interna', (SELECT id FROM job_groups WHERE "group" = 'Funilaria & Pintura')),
('Lavagem completa', (SELECT id FROM job_groups WHERE "group" = 'Funilaria & Pintura')),
('Reparo de amassado pequeno', (SELECT id FROM job_groups WHERE "group" = 'Funilaria & Pintura')),
('Reparo de amassado médio', (SELECT id FROM job_groups WHERE "group" = 'Funilaria & Pintura'));