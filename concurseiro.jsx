import { useState, useEffect, useRef, useMemo } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Space+Mono:wght@400;700&display=swap');`;

const CONCURSOS = ["Polícia Rodoviária Federal (PRF)","Polícia Federal (PF)","Polícia Civil","Polícia Militar","Bombeiros","Receita Federal","Tribunal Regional Federal (TRF)","Tribunal Regional do Trabalho (TRT)","INSS","Caixa Econômica Federal","Banco do Brasil","BNDES","Tribunal de Contas (TCU / TCE)","Ministério Público","Defensoria Pública","ANATEL / ANEEL / ANS / ANVISA","Prefeitura / Municipal","Governo Estadual","Outro"];

const BADGES_DEF = [
  {id:"start",   n:"01",label:"Primeiro passo"},
  {id:"streak3", n:"02",label:"3 em sequência"},
  {id:"streak5", n:"03",label:"5 em sequência"},
  {id:"streak10",n:"04",label:"10 em sequência"},
  {id:"half",    n:"05",label:"Metade concluída"},
  {id:"complete",n:"06",label:"Simulado completo"},
  {id:"pass",    n:"07",label:"Aprovado ≥ 70%"},
  {id:"ace",     n:"08",label:"100% de acerto"},
];

const MARQUEE = ["LÍNGUA PORTUGUESA","MATEMÁTICA","RACIOCÍNIO LÓGICO","DIREITO CONSTITUCIONAL","DIREITO ADMINISTRATIVO","INFORMÁTICA","LEGISLAÇÃO DE TRÂNSITO","ATUALIDADES","DIREITO PENAL","FÍSICA","QUÍMICA","GEOGRAFIA"];

const MOTIVATIONAL = ["Constância vence talento.","Cada questão é um passo à frente.","Quem estuda todo dia, passa.","Aprovação é método, não sorte.","O próximo simulado será melhor."];

const BANCAS = [
  "CESPE/CEBRASPE", "FCC", "VUNESP", "AOCP", "FGV", "IBFC",
  "QUADRIX", "IDECAN", "IADES", "FEPESE", "COPS-UEL", "FUNCAB",
  "CONSULPLAN", "OBJETIVA", "NC-UFPR", "INSTITUTO AOCP", "Outro",
];

const DISCIPLINAS = [
  "Língua Portuguesa", "Matemática", "Raciocínio Lógico",
  "Direito Constitucional", "Direito Administrativo", "Direito Penal",
  "Direito Processual Penal", "Direito Civil", "Direito do Trabalho",
  "Legislação de Trânsito", "Informática", "Atualidades",
  "Geografia do Brasil", "História do Brasil", "Física", "Química",
  "Biologia", "Estatística", "Contabilidade",
  "Administração Pública", "Legislação Específica",
];

const NUMEROS = ["5","10","15","20","25","30"];

const SINT_CATS = ["Adjunto Adnominal","Complemento Nominal","Sujeito","Objeto Direto","Predicativo do Sujeito","Predicativo do Objeto","Adjunto Adverbial","Agente da Passiva","Objeto Indireto","Aposto"];

const SINTAXE_EXERCICIOS = [
  // ── ADJUNTO ADNOMINAL (5) ──
  {
    id: 1, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "construção"',
    frase: "A construção do renomado engenheiro responsável pela obra impressionou profundamente a todos os membros da comissão avaliadora.",
    blocos: [
      { id: "b1", texto: "A", funcao: "Artigo definido", cor: "#6b9fff" },
      { id: "b2", texto: "construção", funcao: "Núcleo do sujeito", cor: "#a78bfa" },
      { id: "b3", texto: "do renomado engenheiro responsável pela obra", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b4", texto: "impressionou profundamente", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b5", texto: "a todos os membros da comissão avaliadora", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b3",
    explicacao: 'O sintagma "do renomado engenheiro responsável pela obra" é preposicionado e qualifica o substantivo "construção" (indica autoria). Termos preposicionados que modificam um nome — sem serem exigidos por ele — são adjuntos adnominais.',
  },
  // ── ADJUNTO ADNOMINAL 2-5 ──
  {
    id: 2, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "viatura"',
    frase: "A viatura da Polícia Rodoviária Federal abordou o veículo suspeito carregado de mercadoria ilegal.",
    blocos: [
      { id: "b1", texto: "A viatura", funcao: "Sujeito (art. + núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "da Polícia Rodoviária Federal", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b3", texto: "abordou", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b4", texto: "o veículo suspeito carregado de mercadoria ilegal", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b2",
    explicacao: '"Da Polícia Rodoviária Federal" especifica a qual instituição pertence a viatura — relação de pertencimento. Sintagmas preposicionados que qualificam um substantivo sem serem exigidos por ele são adjuntos adnominais.',
  },
  {
    id: 3, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "agentes"',
    frase: "Os agentes federais altamente treinados realizaram a busca minuciosa no local do crime investigado.",
    blocos: [
      { id: "b1", texto: "Os agentes", funcao: "Núcleo do sujeito + art.", cor: "#a78bfa" },
      { id: "b2", texto: "federais altamente treinados", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b3", texto: "realizaram", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b4", texto: "a busca minuciosa", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b5", texto: "no local do crime investigado", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b2",
    explicacao: '"Federais altamente treinados" é locução adjetiva que qualifica diretamente "agentes". Adjetivos e locuções que modificam um nome sem a mediação de verbo de ligação são adjuntos adnominais.',
  },
  {
    id: 4, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "advogado"',
    frase: "O advogado do réu acusado de corrupção apresentou os documentos comprobatórios ao juiz federal responsável pelo caso.",
    blocos: [
      { id: "b1", texto: "O advogado", funcao: "Núcleo do sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "do réu acusado de corrupção", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b3", texto: "apresentou", funcao: "Verbo (VTDI)", cor: "#f97316" },
      { id: "b4", texto: "os documentos comprobatórios", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b5", texto: "ao juiz federal responsável pelo caso", funcao: "Objeto Indireto", cor: "#6b9fff" },
    ],
    resposta: "b2",
    explicacao: '"Do réu acusado de corrupção" indica de quem é o advogado — posse. Não confunda com complemento nominal: o CN é exigido por nomes que expressam ação/sentimento; o adj. adnominal é acessório e pode ser retirado sem tornar o nome incompleto.',
  },
  {
    id: 5, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "candidatos"',
    frase: "Os candidatos aprovados na fase objetiva receberam a convocação oficial para a posse do cargo.",
    blocos: [
      { id: "b1", texto: "Os candidatos", funcao: "Núcleo do sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "aprovados na fase objetiva", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b3", texto: "receberam", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b4", texto: "a convocação oficial para a posse do cargo", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b2",
    explicacao: '"Aprovados na fase objetiva" é particípio com valor adjetival que qualifica "candidatos". Mesmo sendo forma verbal, funciona como adjetivo aqui — portanto, adjunto adnominal.',
  },
  // ── COMPLEMENTO NOMINAL (5) ──
  {
    id: 6, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "favorável"',
    frase: "O candidato experiente era favorável à proposta apresentada pela banca examinadora ao longo da reunião.",
    blocos: [
      { id: "b1", texto: "O candidato experiente", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "era", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "favorável", funcao: "Predicativo do sujeito", cor: "#6b9fff" },
      { id: "b4", texto: "à proposta apresentada pela banca examinadora ao longo da reunião", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"À proposta apresentada pela banca examinadora" completa o adjetivo "favorável": favorável *a quê*? CNs são exigidos por nomes (subst., adj., adv.) e sempre vêm com preposição. Diferem do adj. adnominal por serem obrigatórios para completar o sentido.',
  },
  {
    id: 7, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "necessidade"',
    frase: "A sociedade brasileira contemporânea tem necessidade de novos policiais capacitados e bem remunerados.",
    blocos: [
      { id: "b1", texto: "A sociedade brasileira contemporânea", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "tem", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "necessidade", funcao: "Objeto Direto (núcleo)", cor: "#6b9fff" },
      { id: "b4", texto: "de novos policiais capacitados e bem remunerados", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"De novos policiais capacitados e bem remunerados" completa o substantivo "necessidade" (necessidade *de quê*?). Substantivos que expressam ação, sentimento ou estado frequentemente exigem CN com preposição.',
  },
  {
    id: 8, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "apto"',
    frase: "O servidor concursado mostrou-se apto ao cargo de auditor fiscal recém criado pelo órgão.",
    blocos: [
      { id: "b1", texto: "O servidor concursado", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "mostrou-se", funcao: "Verbo de ligação (pronominal)", cor: "#f97316" },
      { id: "b3", texto: "apto", funcao: "Predicativo do sujeito", cor: "#6b9fff" },
      { id: "b4", texto: "ao cargo de auditor fiscal recém criado pelo órgão", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Ao cargo de auditor fiscal recém criado pelo órgão" completa o adjetivo "apto": apto *a quê*? Adjetivos como apto, contrário, favorável, propício, ávido exigem CN com preposição. Padrão altamente cobrado no CESPE/CEBRASPE.',
  },
  {
    id: 9, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "certo"',
    frase: "O candidato veterano estava certo de sua aprovação definitiva no concurso público federal.",
    blocos: [
      { id: "b1", texto: "O candidato veterano", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "estava", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "certo", funcao: "Predicativo do sujeito", cor: "#6b9fff" },
      { id: "b4", texto: "de sua aprovação definitiva no concurso público federal", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"De sua aprovação definitiva no concurso público federal" completa "certo" no sentido de "convicto/seguro" — certo *de quê*? O adjetivo "certo" nessa acepção exige CN com "de". CN é exigido; adj. adnominal é facultativo.',
  },
  {
    id: 10, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "contrário"',
    frase: "O agente penitenciário era contrário à nova resolução administrativa expedida pela direção regional.",
    blocos: [
      { id: "b1", texto: "O agente penitenciário", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "era", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "contrário", funcao: "Predicativo do sujeito", cor: "#6b9fff" },
      { id: "b4", texto: "à nova resolução administrativa expedida pela direção regional", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"À nova resolução administrativa expedida pela direção regional" completa "contrário": contrário *a quê*? Sem o CN a frase ficaria semanticamente incompleta. Adjetivos "contrário", "favorável", "apto", "propenso" sempre exigem CN com preposição.',
  },
  // ── SUJEITO (5) ──
  {
    id: 11, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração",
    frase: "Os policiais federais de plantão cumpriram as ordens superiores transmitidas pelo comandante.",
    blocos: [
      { id: "b1", texto: "Os policiais federais de plantão", funcao: "Sujeito", cor: "#c8f000" },
      { id: "b2", texto: "cumpriram", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b3", texto: "as ordens superiores transmitidas pelo comandante", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b1",
    explicacao: '"Os policiais federais de plantão" é o sujeito: ser sobre o qual se declara algo, com o qual o verbo concorda. Núcleo "policiais" + adj. adnominal "federais de plantão" + artigo "Os".',
  },
  {
    id: 12, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração (atenção: voz passiva)",
    frase: "O edital do concurso público para auditor fiscal foi publicado no Diário Oficial da União.",
    blocos: [
      { id: "b1", texto: "O edital do concurso público para auditor fiscal", funcao: "Sujeito paciente", cor: "#c8f000" },
      { id: "b2", texto: "foi publicado", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "no Diário Oficial da União", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b1",
    explicacao: 'Na voz passiva o sujeito é o ser que sofre a ação (sujeito paciente). "O edital do concurso público para auditor fiscal" sofre a ação de ser publicado — é o sujeito. O verbo "foi publicado" concorda com ele.',
  },
  {
    id: 13, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração",
    frase: "A banca examinadora contratada pelo órgão divulgou o resultado preliminar da fase discursiva.",
    blocos: [
      { id: "b1", texto: "A banca examinadora contratada pelo órgão", funcao: "Sujeito", cor: "#c8f000" },
      { id: "b2", texto: "divulgou", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b3", texto: "o resultado preliminar da fase discursiva", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b1",
    explicacao: '"A banca examinadora contratada pelo órgão" é o sujeito simples: núcleo "banca" + determinante "A" + adj. adnominal "examinadora contratada pelo órgão". O sujeito inclui todos os seus modificadores.',
  },
  {
    id: 14, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração",
    frase: "O delegado de polícia responsável pelo caso instaurou o inquérito policial para apurar os fatos.",
    blocos: [
      { id: "b1", texto: "O delegado de polícia responsável pelo caso", funcao: "Sujeito", cor: "#c8f000" },
      { id: "b2", texto: "instaurou", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b3", texto: "o inquérito policial para apurar os fatos", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b1",
    explicacao: '"O delegado de polícia responsável pelo caso" é o sujeito. "De polícia responsável pelo caso" é adj. adnominal de "delegado". O sujeito simples tem um único núcleo nominal — aqui "delegado".',
  },
  {
    id: 15, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração",
    frase: "Os candidatos aprovados na primeira fase aguardavam a convocação para a etapa seguinte ansiosamente.",
    blocos: [
      { id: "b1", texto: "Os candidatos aprovados na primeira fase", funcao: "Sujeito", cor: "#c8f000" },
      { id: "b2", texto: "aguardavam", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b3", texto: "a convocação para a etapa seguinte", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "ansiosamente", funcao: "Adjunto Adverbial de Modo", cor: "#6b9fff" },
    ],
    resposta: "b1",
    explicacao: '"Os candidatos aprovados na primeira fase" é o sujeito. "Aprovados na primeira fase" é adj. adnominal de "candidatos". A concordância verbal se dá com o núcleo: "candidatos aguardavam".',
  },
  // ── OBJETO DIRETO (5) ──
  {
    id: 16, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "multar"',
    frase: "O fiscal de tributos multou o motorista imprudente que avançou o sinal vermelho na rodovia.",
    blocos: [
      { id: "b1", texto: "O fiscal de tributos", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "multou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "o motorista imprudente que avançou o sinal vermelho na rodovia", funcao: "Objeto Direto", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"O motorista imprudente que avançou o sinal vermelho na rodovia" completa "multar" sem preposição. VTD pede complemento sem preposição = OD. Pergunte: o fiscal multou *quem*? → o motorista.',
  },
  {
    id: 17, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "apreender"',
    frase: "O agente de trânsito apreendeu o veículo irregular com documentação vencida na rodovia federal.",
    blocos: [
      { id: "b1", texto: "O agente de trânsito", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "apreendeu", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "o veículo irregular com documentação vencida", funcao: "Objeto Direto", cor: "#c8f000" },
      { id: "b4", texto: "na rodovia federal", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"O veículo irregular com documentação vencida" é o OD — responde *o quê* foi apreendido, sem preposição. "Na rodovia federal" é adj. adverbial de lugar (acessório).',
  },
  {
    id: 18, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "analisar"',
    frase: "O auditor fiscal da receita analisou os documentos fiscais apresentados pela empresa com extrema atenção.",
    blocos: [
      { id: "b1", texto: "O auditor fiscal da receita", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "analisou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "os documentos fiscais apresentados pela empresa", funcao: "Objeto Direto", cor: "#c8f000" },
      { id: "b4", texto: "com extrema atenção", funcao: "Adjunto Adverbial de Modo", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Os documentos fiscais apresentados pela empresa" é o OD — complemento verbal sem preposição. Pergunte: o auditor analisou *o quê*? → os documentos.',
  },
  {
    id: 19, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "deflagrar"',
    frase: "A Polícia Rodoviária Federal deflagrou a operação integrada de combate ao tráfico nas estradas.",
    blocos: [
      { id: "b1", texto: "A Polícia Rodoviária Federal", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "deflagrou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "a operação integrada", funcao: "Objeto Direto", cor: "#c8f000" },
      { id: "b4", texto: "de combate ao tráfico nas estradas", funcao: "Adjunto Adnominal", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"A operação integrada" é o OD de "deflagrar". "De combate ao tráfico nas estradas" é adj. adnominal de "operação" — especifica o tipo. O OD é apenas o núcleo do sintagma complemento.',
  },
  {
    id: 20, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "divulgar"',
    frase: "A banca organizadora do certame divulgou o resultado preliminar contestado do concurso público.",
    blocos: [
      { id: "b1", texto: "A banca organizadora do certame", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "divulgou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "o resultado preliminar contestado", funcao: "Objeto Direto", cor: "#c8f000" },
      { id: "b4", texto: "do concurso público", funcao: "Adjunto Adnominal", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"O resultado preliminar contestado" é o OD. "Do concurso público" é adj. adnominal de "resultado". Pergunte: a banca divulgou *o quê*? → o resultado. Sem preposição antes = OD.',
  },
  // ── PREDICATIVO DO SUJEITO (5) ──
  {
    id: 21, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "O concurseiro dedicado ficou animado e confiante com o resultado da prova objetiva divulgado ontem.",
    blocos: [
      { id: "b1", texto: "O concurseiro dedicado", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "ficou", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "animado e confiante", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "b4", texto: "com o resultado da prova objetiva divulgado ontem", funcao: "Adjunto Adverbial de Causa", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Animado e confiante" são adjetivos ligados ao sujeito pelo VL "ficou". Pred. do sujeito ocorre com VL (ser, estar, ficar, parecer, tornar-se, continuar). Concorda em gênero e número com o sujeito.',
  },
  {
    id: 22, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "A apresentação presencial dos documentos originais devidamente autenticados é obrigatória.",
    blocos: [
      { id: "b1", texto: "A apresentação presencial dos documentos originais devidamente autenticados", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "é", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "obrigatória", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"Obrigatória" atribui qualidade ao sujeito pelo VL "é". A concordância confirma: "apresentação" [fem. sing.] → "obrigatória" [fem. sing.]. Pred. do sujeito = estado/qualidade atribuída ao sujeito via VL.',
  },
  {
    id: 23, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "O policial rodoviário federal de plantão se mostrou extremamente eficiente na abordagem ao veículo suspeito.",
    blocos: [
      { id: "b1", texto: "O policial rodoviário federal de plantão", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "se mostrou", funcao: "Verbo de ligação (pronominal)", cor: "#f97316" },
      { id: "b3", texto: "extremamente eficiente", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "b4", texto: "na abordagem ao veículo suspeito", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Extremamente eficiente" é pred. do sujeito. "Mostrar-se" é VL pronominal — equivale a "revelar-se/parecer". Verbos como mostrar-se, revelar-se, tornar-se também funcionam como VL, exigindo predicativo.',
  },
  {
    id: 24, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "O complexo processo seletivo para delegado federal se tornou muito mais rigoroso naquela edição polêmica.",
    blocos: [
      { id: "b1", texto: "O complexo processo seletivo para delegado federal", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "se tornou", funcao: "Verbo de ligação (pronominal)", cor: "#f97316" },
      { id: "b3", texto: "muito mais rigoroso", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "b4", texto: "naquela edição polêmica", funcao: "Adjunto Adverbial de Tempo", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Muito mais rigoroso" é pred. do sujeito — estado atribuído ao sujeito pelo VL "se tornou". Predicativos do sujeito podem ser adjetivos, substantivos ou locuções. Distinguem-se do adj. adnominal por dependerem do VL.',
  },
  {
    id: 25, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "O extenso edital do concurso pareceu claro e bem redigido aos candidatos mais experientes.",
    blocos: [
      { id: "b1", texto: "O extenso edital do concurso", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "pareceu", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "claro e bem redigido", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "b4", texto: "aos candidatos mais experientes", funcao: "Objeto Indireto", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Claro e bem redigido" é pred. do sujeito — atribui qualidade ao sujeito "edital" via VL "pareceu". "Aos candidatos mais experientes" é OI do verbo "parecer" nessa construção. Não confunda OI com adj. adverbial.',
  },
  // ── PREDICATIVO DO OBJETO (5) ──
  {
    id: 26, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "O inspetor responsável pelo setor considerou o relatório pericial apresentado totalmente inconsistente.",
    blocos: [
      { id: "b1", texto: "O inspetor responsável pelo setor", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "considerou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "o relatório pericial apresentado", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "totalmente inconsistente", funcao: "Predicativo do Objeto", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Totalmente inconsistente" é pred. do objeto: adjetivo que se refere ao OD ("relatório") exigido por "considerar". Estrutura: VTD + OD + adj. = pred. do objeto. Verbos: considerar, julgar, eleger, nomear, achar, declarar.',
  },
  {
    id: 27, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "O júri popular julgou o réu acusado de homicídio culpado de todos os crimes.",
    blocos: [
      { id: "b1", texto: "O júri popular", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "julgou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "o réu acusado de homicídio", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "culpado", funcao: "Predicativo do Objeto", cor: "#c8f000" },
      { id: "b5", texto: "de todos os crimes atribuídos na denúncia", funcao: "Complemento Nominal de 'culpado'", cor: "#6b9fff" },
    ],
    resposta: "b4",
    explicacao: '"Culpado" é pred. do objeto — qualifica o OD "réu" e é requerido por "julgar". "De todos os crimes atribuídos na denúncia" é CN de "culpado". Dupla estrutura: pred. do objeto + CN — frequente em questões CESPE.',
  },
  {
    id: 28, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "A banca examinadora do concurso declarou o candidato inscrito na etapa final inapto na rigorosa prova física.",
    blocos: [
      { id: "b1", texto: "A banca examinadora do concurso", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "declarou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "o candidato inscrito na etapa final", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "inapto", funcao: "Predicativo do Objeto", cor: "#c8f000" },
      { id: "b5", texto: "na rigorosa prova física", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b4",
    explicacao: '"Inapto" é pred. do objeto: refere-se ao OD "candidato" e é exigido por "declarar". Na voz passiva — "O candidato foi declarado inapto" — "inapto" vira pred. do sujeito paciente. Fique atento à conversão!',
  },
  {
    id: 29, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "O agente de fiscalização considerou o veículo pesado parado no acostamento irregular para circular à noite.",
    blocos: [
      { id: "b1", texto: "O agente de fiscalização", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "considerou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "o veículo pesado parado no acostamento", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "irregular", funcao: "Predicativo do Objeto", cor: "#c8f000" },
      { id: "b5", texto: "para circular à noite", funcao: "Adjunto Adverbial de Finalidade", cor: "#6b9fff" },
    ],
    resposta: "b4",
    explicacao: '"Irregular" é pred. do objeto. Teste: substitua por "O agente achou o veículo [como?] irregular" — a estrutura pred. do objeto fica clara. "Para circular à noite" é adj. adverbial de finalidade (acessório).',
  },
  {
    id: 30, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "O auditor fiscal da Receita Federal julgou a extensa documentação tributária apresentada incompleta.",
    blocos: [
      { id: "b1", texto: "O auditor fiscal da Receita Federal", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "julgou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "a extensa documentação tributária apresentada", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "incompleta", funcao: "Predicativo do Objeto", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Incompleta" é pred. do objeto — concorda com o OD "documentação" [fem. sing.]. Na voz passiva — "A documentação foi julgada incompleta" — vira pred. do sujeito paciente. A função muda com a voz verbal.',
  },
  // ── ADJUNTO ADVERBIAL (5) ──
  {
    id: 31, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de finalidade</em>",
    frase: "O candidato dedicado ao concurso estudou muito e com afinco para a prova objetiva de português.",
    blocos: [
      { id: "b1", texto: "O candidato dedicado ao concurso", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "estudou", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b3", texto: "muito e com afinco", funcao: "Adjunto Adverbial de Intensidade", cor: "#6b9fff" },
      { id: "b4", texto: "para a prova objetiva de português", funcao: "Adjunto Adverbial de Finalidade", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Para a prova objetiva de português" indica *para quê* o candidato estudou. Sintagmas com "para" + substantivo frequentemente expressam finalidade. Adj. adverbiais são acessórios — a frase é gramaticalmente completa sem eles.',
  },
  {
    id: 32, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de modo</em>",
    frase: "O fiscal de posturas municipais atuou com rigor e imparcialidade nas fiscalizações de trânsito do período chuvoso.",
    blocos: [
      { id: "b1", texto: "O fiscal de posturas municipais", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "atuou", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b3", texto: "com rigor e imparcialidade", funcao: "Adjunto Adverbial de Modo", cor: "#c8f000" },
      { id: "b4", texto: "nas fiscalizações de trânsito do período chuvoso", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Com rigor e imparcialidade" indica *como* o fiscal atuou. Sintagmas "com" + subst. abstrato frequentemente expressam modo. Podem ser substituídos por advérbio em -mente: "rigorosamente".',
  },
  {
    id: 33, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de tempo</em>",
    frase: "O agente rodoviário experiente abordou mais de vinte veículos suspeitos durante a extensa blitz de fim de semana.",
    blocos: [
      { id: "b1", texto: "O agente rodoviário experiente", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "abordou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "mais de vinte veículos suspeitos", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "durante a extensa blitz de fim de semana", funcao: "Adjunto Adverbial de Tempo", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Durante a extensa blitz de fim de semana" indica *quando* os veículos foram abordados. A preposição "durante" + valor temporal = adj. adverbial de tempo. Acessório: pode ser retirado sem tornar a frase agramatical.',
  },
  {
    id: 34, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de lugar</em>",
    frase: "A Polícia Rodoviária Federal intensificou as operações de fiscalização na região de fronteira com o Paraguai.",
    blocos: [
      { id: "b1", texto: "A Polícia Rodoviária Federal", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "intensificou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "as operações de fiscalização", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "na região de fronteira com o Paraguai", funcao: "Adjunto Adverbial de Lugar", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Na região de fronteira com o Paraguai" indica *onde* as operações foram intensificadas. Sintagmas "em/na/no" + lugar = valor locativo. Adj. adverbiais de lugar respondem à pergunta "onde?".',
  },
  {
    id: 35, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de tempo</em>",
    frase: "O concurseiro ansioso aguardava a tão esperada nomeação para o cargo desde o dia de sua aprovação.",
    blocos: [
      { id: "b1", texto: "O concurseiro ansioso", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "aguardava", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "a tão esperada nomeação para o cargo", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "desde o dia de sua aprovação", funcao: "Adjunto Adverbial de Tempo", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Desde o dia de sua aprovação" indica o ponto de partida temporal da espera. A preposição "desde" marca origem no tempo. Adj. adverbiais são acessórios — podem ser retirados sem tornar a frase agramatical.',
  },
  // ── AGENTE DA PASSIVA (5) ──
  {
    id: 36, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "O suspeito de tráfico de drogas foi detido em flagrante pelos agentes federais durante a operação.",
    blocos: [
      { id: "b1", texto: "O suspeito de tráfico de drogas", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi detido em flagrante", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pelos agentes federais durante a operação", funcao: "Agente da Passiva", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"Pelos agentes federais durante a operação" é o agente da passiva: quem pratica a ação. Sempre introduzido por "por" (pelo/pela/pelos). Na voz ativa: "Os agentes federais detiveram o suspeito em flagrante."',
  },
  {
    id: 37, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "A sentença condenatória definitiva foi proferida pelo juiz federal titular da vara criminal.",
    blocos: [
      { id: "b1", texto: "A sentença condenatória definitiva", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi proferida", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pelo juiz federal titular da vara criminal", funcao: "Agente da Passiva", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"Pelo juiz federal titular da vara criminal" é o agente da passiva. Na ativa: "O juiz federal titular da vara criminal proferiu a sentença condenatória definitiva." O agente é facultativo — a frase é gramatical sem ele.',
  },
  {
    id: 38, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "O veículo com carga suspeita foi apreendido pela equipe da PRF na rodovia federal.",
    blocos: [
      { id: "b1", texto: "O veículo com carga suspeita", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi apreendido", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pela equipe da PRF", funcao: "Agente da Passiva", cor: "#c8f000" },
      { id: "b4", texto: "na rodovia federal", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Pela equipe da PRF" é o agente da passiva. "Na rodovia federal" é adj. adv. de lugar. Distinção: *por quem?* → pela equipe da PRF (agente) vs *onde?* → na rodovia (adj. adv.). Não confunda os dois sintagmas.',
  },
  {
    id: 39, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "O inquérito policial sigiloso foi instaurado de imediato pelo delegado de plantão responsável pelo caso.",
    blocos: [
      { id: "b1", texto: "O inquérito policial sigiloso", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi instaurado de imediato", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pelo delegado de plantão responsável pelo caso", funcao: "Agente da Passiva", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"Pelo delegado de plantão responsável pelo caso" é o agente da passiva. Na ativa: "O delegado de plantão responsável pelo caso instaurou o inquérito policial sigiloso de imediato."',
  },
  {
    id: 40, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "O gabarito definitivo e oficial foi divulgado pela banca organizadora do concurso no prazo legal.",
    blocos: [
      { id: "b1", texto: "O gabarito definitivo e oficial", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi divulgado", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pela banca organizadora do concurso", funcao: "Agente da Passiva", cor: "#c8f000" },
      { id: "b4", texto: "no prazo legal", funcao: "Adjunto Adverbial de Tempo", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Pela banca organizadora do concurso" é o agente da passiva. "No prazo legal" é adj. adv. de tempo. Pergunte: *por quem?* → pela banca; *quando?* → no prazo. Distinguir os dois sintagmas é ponto frequente em provas.',
  },
  // ── OBJETO INDIRETO (5) ──
  {
    id: 41, categoria: "Objeto Indireto",
    instrucao: "Encontre o <em>objeto indireto</em>",
    frase: "O candidato criterioso obedeceu rigorosamente às instruções detalhadas do edital publicado pela banca.",
    blocos: [
      { id: "b1", texto: "O candidato criterioso", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "obedeceu rigorosamente", funcao: "Verbo transitivo indireto", cor: "#f97316" },
      { id: "b3", texto: "às instruções detalhadas", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "do edital publicado pela banca", funcao: "Adjunto Adnominal", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Às instruções detalhadas" é OI de "obedecer" — VTI que exige preposição. "Obedecer" não admite OD — erro clássico em provas. "Do edital publicado pela banca" é adj. adnominal de "instruções".',
  },
  {
    id: 42, categoria: "Objeto Indireto",
    instrucao: 'Encontre o <em>objeto indireto</em> do verbo "assistir" (presenciar)',
    frase: "O advogado constituído pelo réu assistiu atentamente ao longo e complexo processo judicial.",
    blocos: [
      { id: "b1", texto: "O advogado constituído pelo réu", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "assistiu atentamente", funcao: "Verbo transitivo indireto", cor: "#f97316" },
      { id: "b3", texto: "ao longo e complexo processo judicial", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "com atenção redobrada aos detalhes", funcao: "Adjunto Adverbial de Modo", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Ao longo e complexo processo judicial" é OI de "assistir" no sentido de "presenciar" — VTI. "Com atenção redobrada" é adj. adv. de modo. Outros VTI comuns: gostar de, precisar de, depender de, obedecer a.',
  },
  {
    id: 43, categoria: "Objeto Indireto",
    instrucao: "Encontre o <em>objeto indireto</em> (a quem se concedeu)",
    frase: "O juiz federal da comarca concedeu ao réu primário sem antecedentes o direito de interpor recurso.",
    blocos: [
      { id: "b1", texto: "O juiz federal da comarca", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "concedeu", funcao: "Verbo transitivo direto e indireto", cor: "#f97316" },
      { id: "b3", texto: "ao réu primário sem antecedentes", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "o direito de interpor recurso", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b3",
    explicacao: '"Ao réu primário sem antecedentes" é OI (concedeu *a quem*?). "O direito de interpor recurso" é OD. "Conceder" é VTDI. A ordem OI/OD pode variar, mas OI sempre tem preposição; OD, não.',
  },
  {
    id: 44, categoria: "Objeto Indireto",
    instrucao: 'Encontre o <em>objeto indireto</em> do verbo "duvidar"',
    frase: "Ninguém entre os presentes duvida seriamente da reconhecida honestidade do servidor público de carreira.",
    blocos: [
      { id: "b1", texto: "Ninguém entre os presentes", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "duvida seriamente", funcao: "Verbo transitivo indireto", cor: "#f97316" },
      { id: "b3", texto: "da reconhecida honestidade", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "do servidor público de carreira", funcao: "Adjunto Adnominal", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Da reconhecida honestidade" é OI de "duvidar" — VTI com "de". "Do servidor público de carreira" é adj. adnominal de "honestidade". Outros VTI com "de": gostar, precisar, depender, lembrar-se.',
  },
  {
    id: 45, categoria: "Objeto Indireto",
    instrucao: 'Encontre o <em>objeto indireto</em> do verbo "comunicar"',
    frase: "O agente de segurança comunicou imediatamente ao seu superior hierárquico a grave ocorrência registrada no turno.",
    blocos: [
      { id: "b1", texto: "O agente de segurança", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "comunicou imediatamente", funcao: "Verbo transitivo direto e indireto", cor: "#f97316" },
      { id: "b3", texto: "ao seu superior hierárquico", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "a grave ocorrência registrada no turno", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b3",
    explicacao: '"Ao seu superior hierárquico" é OI (comunicou *a quem*?). "A grave ocorrência registrada no turno" é OD. "Comunicar" é VTDI. Regra geral: OI sempre tem preposição; OD não tem preposição.',
  },
  // ── APOSTO (5) ──
  {
    id: 46, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "O CESPE, banca organizadora e gestora do concurso nacional, divulgou inesperadamente o gabarito oficial da prova objetiva.",
    blocos: [
      { id: "b1", texto: "O CESPE", funcao: "Sujeito (núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "banca organizadora e gestora do concurso nacional", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "divulgou inesperadamente", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b4", texto: "o gabarito oficial da prova objetiva", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b2",
    explicacao: '"Banca organizadora do concurso" é aposto de "CESPE": explica/detalha o termo anterior. Apostos entre vírgulas são denominativos. Diferem do adj. adnominal por serem locuções substantivas — não adjetivos.',
  },
  {
    id: 47, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "A PRF, órgão de segurança pública federal vinculado ao Ministério da Justiça, atua nas principais rodovias do país.",
    blocos: [
      { id: "b1", texto: "A PRF", funcao: "Sujeito (núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "órgão de segurança pública federal vinculado ao Ministério da Justiça", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "atua", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b4", texto: "nas principais rodovias do país", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b2",
    explicacao: '"Órgão de segurança pública federal" é aposto de "PRF": esclarece a natureza institucional. Sua remoção não afeta a estrutura: "A PRF atua nas rodovias." Apostos são sempre termos explicativos e acessórios.',
  },
  {
    id: 48, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "Em Brasília, capital federal e sede dos três poderes da República, fica a sede nacional da PRF.",
    blocos: [
      { id: "b1", texto: "Em Brasília", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
      { id: "b2", texto: "capital federal e sede dos três poderes da República", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "fica", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b4", texto: "a sede nacional da PRF", funcao: "Sujeito", cor: "#a78bfa" },
    ],
    resposta: "b2",
    explicacao: '"Capital federal" é aposto de "Brasília": define o status político. Apostos podem se referir a qualquer termo da oração — aqui ao adj. adverbial de lugar. Atenção: o sujeito está posposto — "a sede da PRF fica".',
  },
  {
    id: 49, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "O réu, principal investigado e réu confesso do caso emblemático, compareceu ao tribunal federal para a audiência.",
    blocos: [
      { id: "b1", texto: "O réu", funcao: "Sujeito (núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "principal investigado e réu confesso do caso emblemático", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "compareceu", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b4", texto: "ao tribunal federal para a audiência", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b2",
    explicacao: '"Principal investigado do caso" é aposto de "réu": acrescenta informação descritiva. Apostos descritivos são comuns em linguagem jornalística e jurídica — exatamente o estilo das questões de concurso.',
  },
  {
    id: 50, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "O edital, documento público obrigatório e norteador de todo o processo seletivo, foi publicado com atraso.",
    blocos: [
      { id: "b1", texto: "O edital", funcao: "Sujeito (núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "documento público obrigatório e norteador de todo o processo seletivo", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "foi publicado com atraso", funcao: "Verbo (voz passiva)", cor: "#f97316" },
    ],
    resposta: "b2",
    explicacao: '"Documento obrigatório do processo seletivo" é aposto de "edital": define/caracteriza. A voz passiva sem agente expresso = agente indeterminado. O aposto pode preceder ou seguir o termo a que se refere.',
  },
];

const CONSTRUCAO_EXERCICIOS = [
  {
    id: 1,
    descricao: "Monte a oração colocando cada bloco no slot correto",
    frase_resultado: "O policial rodoviário multou o motorista imprudente na rodovia.",
    blocos: [
      { id: "b1", texto: "O policial rodoviário", funcao: "Sujeito" },
      { id: "b2", texto: "multou", funcao: "VTD" },
      { id: "b3", texto: "o motorista", funcao: "Objeto Direto" },
      { id: "b4", texto: "imprudente", funcao: "Adj. Adnominal" },
      { id: "b5", texto: "na rodovia", funcao: "Adj. Adverbial de Lugar" },
    ],
    slots: [
      { id: "s1", funcao: "Sujeito", resposta: "b1", cor: "#a78bfa" },
      { id: "s2", funcao: "VTD", resposta: "b2", cor: "#f97316" },
      { id: "s3", funcao: "Objeto Direto", resposta: "b3", cor: "#ff6b6b" },
      { id: "s4", funcao: "Adj. Adnominal", resposta: "b4", cor: "#c8f000" },
      { id: "s5", funcao: "Adj. Adverbial de Lugar", resposta: "b5", cor: "#6b9fff" },
    ],
    explicacao: 'Sujeito "O policial rodoviário" pratica a ação. "Multou" é VTD — pede OD sem preposição. "O motorista" é o OD (multou quem?). "Imprudente" é adj. adnominal de "motorista" (qualifica). "Na rodovia" é adj. adv. de lugar (onde?).',
  },
  {
    id: 2,
    descricao: "Monte a oração com Objeto Direto e Predicativo do Objeto",
    frase_resultado: "Os agentes federais consideraram o suspeito culpado.",
    blocos: [
      { id: "b1", texto: "Os agentes federais", funcao: "Sujeito" },
      { id: "b2", texto: "consideraram", funcao: "VTD" },
      { id: "b3", texto: "o suspeito", funcao: "Objeto Direto" },
      { id: "b4", texto: "culpado", funcao: "Predicativo do Objeto" },
    ],
    slots: [
      { id: "s1", funcao: "Sujeito", resposta: "b1", cor: "#a78bfa" },
      { id: "s2", funcao: "VTD", resposta: "b2", cor: "#f97316" },
      { id: "s3", funcao: "Objeto Direto", resposta: "b3", cor: "#ff6b6b" },
      { id: "s4", funcao: "Predicativo do Objeto", resposta: "b4", cor: "#c8f000" },
    ],
    explicacao: '"Consideraram" + OD + adj. forma a estrutura de predicativo do objeto. "O suspeito" é o OD. "Culpado" é o predicativo: adjetivo que caracteriza o OD e é exigido pelo verbo nesse sentido. Verbos como considerar, julgar, eleger, nomear cobram muito essa estrutura.',
  },
  {
    id: 3,
    descricao: "Monte a oração com Objeto Direto e Objeto Indireto (verbo bitransitivo)",
    frase_resultado: "O servidor entregou o requerimento à chefia imediata.",
    blocos: [
      { id: "b1", texto: "O servidor", funcao: "Sujeito" },
      { id: "b2", texto: "entregou", funcao: "VTDI" },
      { id: "b3", texto: "o requerimento", funcao: "Objeto Direto" },
      { id: "b4", texto: "à chefia imediata", funcao: "Objeto Indireto" },
    ],
    slots: [
      { id: "s1", funcao: "Sujeito", resposta: "b1", cor: "#a78bfa" },
      { id: "s2", funcao: "VTDI", resposta: "b2", cor: "#f97316" },
      { id: "s3", funcao: "Objeto Direto", resposta: "b3", cor: "#ff6b6b" },
      { id: "s4", funcao: "Objeto Indireto", resposta: "b4", cor: "#c8f000" },
    ],
    explicacao: '"Entregar" é VTDI: exige OD (o que se entrega) + OI (a quem). "O requerimento" é OD — sem preposição. "À chefia imediata" é OI — com preposição "a". Diferença crucial: OD não tem preposição; OI tem.',
  },
  {
    id: 4,
    descricao: "Monte a oração na voz passiva identificando o Agente da Passiva",
    frase_resultado: "O inquérito foi instaurado pelo delegado federal.",
    blocos: [
      { id: "b1", texto: "O inquérito", funcao: "Sujeito Paciente" },
      { id: "b2", texto: "foi instaurado", funcao: "Verbo (Voz Passiva)" },
      { id: "b3", texto: "pelo delegado federal", funcao: "Agente da Passiva" },
    ],
    slots: [
      { id: "s1", funcao: "Sujeito Paciente", resposta: "b1", cor: "#a78bfa" },
      { id: "s2", funcao: "Verbo (Voz Passiva)", resposta: "b2", cor: "#f97316" },
      { id: "s3", funcao: "Agente da Passiva", resposta: "b3", cor: "#c8f000" },
    ],
    explicacao: 'Na voz passiva o sujeito sofre a ação (sujeito paciente). "Foi instaurado" = auxiliar + particípio. "Pelo delegado federal" é o agente da passiva — quem pratica a ação, introduzido por "por". Na voz ativa: "O delegado federal instaurou o inquérito."',
  },
  {
    id: 5,
    descricao: "Monte a oração com Predicativo do Sujeito e Adjunto Adverbial",
    frase_resultado: "O auditor fiscal ficou satisfeito com o resultado da perícia.",
    blocos: [
      { id: "b1", texto: "O auditor fiscal", funcao: "Sujeito" },
      { id: "b2", texto: "ficou", funcao: "Verbo de Ligação" },
      { id: "b3", texto: "satisfeito", funcao: "Predicativo do Sujeito" },
      { id: "b4", texto: "com o resultado da perícia", funcao: "Adj. Adverbial de Causa" },
    ],
    slots: [
      { id: "s1", funcao: "Sujeito", resposta: "b1", cor: "#a78bfa" },
      { id: "s2", funcao: "Verbo de Ligação", resposta: "b2", cor: "#f97316" },
      { id: "s3", funcao: "Predicativo do Sujeito", resposta: "b3", cor: "#c8f000" },
      { id: "s4", funcao: "Adj. Adverbial de Causa", resposta: "b4", cor: "#6b9fff" },
    ],
    explicacao: '"Ficou" é verbo de ligação — estabelece relação entre sujeito e predicativo. "Satisfeito" é predicativo do sujeito: adjetivo que atribui qualidade/estado ao sujeito. "Com o resultado da perícia" é adj. adverbial de causa (por que ficou satisfeito?).',
  },
];

const SINT_DICAS = {
  "Sujeito":                "Pergunte ao verbo: 'quem pratica ou sofre a ação?'. Geralmente antes do verbo. Concorda com ele em número e pessoa. Pode ser omitido (sujeito oculto).",
  "Sujeito Paciente":       "Na voz passiva, sofre a ação. Corresponde ao OD da voz ativa. Identificar: verbo passivo (ser/estar + particípio) → o sujeito está sofrendo.",
  "Verbo de Ligação":       "Ser, estar, ficar, parecer, tornar-se, permanecer. Não transmitem ação — apenas ligam o sujeito ao predicativo. Substitua por 'ser': se fizer sentido, é VL.",
  "Predicativo do Sujeito": "Após VL, qualifica ou identifica o sujeito. Geralmente adjetivo ou substantivo. Sem preposição. Se tirar o predicativo, a oração fica incompleta.",
  "Verbo Passivo":          "Auxiliar (ser/estar/ficar) + particípio (-ado/-ido). Ex: 'foi instaurado', 'foi concluído'. Na voz ativa seria apenas o verbo principal.",
  "VTD":                    "Verbo transitivo direto: pede complemento sem preposição. Pergunte 'verbo + o quê?' ou 'verbo + quem?'. Resposta sem preposição = OD.",
  "VTDI":                   "Bitransitivo: pede OD (sem prep.) E OI (com prep.) juntos. Ex: entregar algo a alguém, informar algo a alguém.",
  "Objeto Direto":          "Complemento de VTD, sem preposição. Responde 'o quê?' ou 'quem?' ao verbo. Cuidado: se tiver preposição, é OI ou CN.",
  "Objeto Indireto":        "Complemento com preposição 'a' ou 'para'. Pergunte 'a quem?', 'para quem?'. Diferença do agente: OI usa 'a/para'; agente usa 'por'.",
  "Agente da Passiva":      "Introduzido por 'por/pelo/pela'. Praticou a ação na voz passiva. Teste: converta para voz ativa — o agente vira sujeito.",
  "Predicativo do Objeto":  "Qualifica o OD — exigido por verbos como considerar, julgar, eleger, nomear, tornar, declarar. Concorda com o OD, não com o sujeito.",
  "Adj. Adnominal":         "Adjetivo que acompanha diretamente um substantivo. Pode ser retirado sem comprometer o verbo. Concorda em gênero e número com o substantivo.",
  "Complemento Nominal":    "Preposição + SN completando substantivo, adjetivo ou advérbio abstrato. Ex: 'ciente DO prazo' (ciente de quê?). Diferença do OI: CN completa nome, OI completa verbo.",
  "Adj. Adverbial":         "Circunstância do verbo — responde quando?, onde?, como?, por quê?. Pode ser retirado sem comprometer o núcleo. É acessório, nunca obrigatório.",
  "Adj. Adv. de Modo":      "Responde 'como?'. Advérbios em -mente (meticulosamente) ou 'com + substantivo' (com rigor). Modifica o verbo, não o sujeito.",
  "Adj. Adv. de Lugar":     "Responde 'onde?'. Locuções como 'no laboratório', 'na sede', 'no local'. Modifica o verbo indicando o lugar da ação.",
};

const EXPERT_EXERCICIOS = [
  {
    id: 1,
    descricao: "Monte uma oração com Predicativo do Sujeito. Há múltiplas combinações válidas.",
    dica: "Verbo de ligação + adjetivo/substantivo = predicativo do sujeito. O predicativo nunca é introduzido por preposição — isso o distingue do OI.",
    slots: [
      { id: "s1", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "s2", funcao: "Verbo de Ligação", cor: "#f97316" },
      { id: "s3", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "s4", funcao: "Adj. Adverbial", cor: "#6b9fff" },
    ],
    blocos: [
      { id: "b01", texto: "O candidato",           funcoes: ["Sujeito"] },
      { id: "b02", texto: "A servidora",            funcoes: ["Sujeito"] },
      { id: "b03", texto: "O policial rodoviário",  funcoes: ["Sujeito"] },
      { id: "b04", texto: "A auditora federal",     funcoes: ["Sujeito"] },
      { id: "b05", texto: "O inspetor",             funcoes: ["Sujeito"] },
      { id: "b06", texto: "ficou",                  funcoes: ["Verbo de Ligação"] },
      { id: "b07", texto: "permaneceu",             funcoes: ["Verbo de Ligação"] },
      { id: "b08", texto: "tornou-se",              funcoes: ["Verbo de Ligação"] },
      { id: "b09", texto: "estava",                 funcoes: ["Verbo de Ligação"] },
      { id: "b10", texto: "aprovado",               funcoes: ["Predicativo do Sujeito"] },
      { id: "b11", texto: "satisfeito",             funcoes: ["Predicativo do Sujeito"] },
      { id: "b12", texto: "apto",                   funcoes: ["Predicativo do Sujeito"] },
      { id: "b13", texto: "habilitado",             funcoes: ["Predicativo do Sujeito"] },
      { id: "b14", texto: "no certame",             funcoes: ["Adj. Adverbial"] },
      { id: "b15", texto: "no concurso",            funcoes: ["Adj. Adverbial"] },
      { id: "b16", texto: "com distinção",          funcoes: ["Adj. Adverbial"] },
      { id: "b17", texto: "rapidamente",            funcoes: ["Adj. Adverbial"] },
      { id: "b18", texto: "ontem",                  funcoes: ["Adj. Adverbial"] },
      { id: "b19", texto: "autuou",                 funcoes: ["VTD"] },
      { id: "b20", texto: "o suspeito",             funcoes: ["Objeto Direto"] },
      { id: "b21", texto: "ao diretor",             funcoes: ["Objeto Indireto"] },
      { id: "b22", texto: "pelo chefe",             funcoes: ["Agente da Passiva"] },
    ],
    explicacao: "Verbos de ligação (ser, estar, ficar, permanecer, tornar-se, parecer) exigem predicativo do sujeito — adjetivo ou substantivo que qualifica o sujeito. Nunca o predicativo é introduzido por preposição; isso o distingue do OI. O adj. adverbial (\"no certame\", \"rapidamente\") é acessório — pode ser omitido.",
  },
  {
    id: 2,
    descricao: "Monte uma oração com VTD, Objeto Direto e Adjunto Adnominal que qualifica o OD.",
    dica: "VTD pede objeto sem preposição. O adj. adnominal é o adjetivo que acompanha diretamente o substantivo — responde 'qual?' antes do nome.",
    slots: [
      { id: "s1", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "s2", funcao: "VTD", cor: "#f97316" },
      { id: "s3", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "s4", funcao: "Adj. Adnominal", cor: "#c8f000" },
    ],
    blocos: [
      { id: "b01", texto: "O delegado",             funcoes: ["Sujeito"] },
      { id: "b02", texto: "A fiscal tributária",     funcoes: ["Sujeito"] },
      { id: "b03", texto: "Os agentes",              funcoes: ["Sujeito"] },
      { id: "b04", texto: "A coordenadora",          funcoes: ["Sujeito"] },
      { id: "b05", texto: "O promotor",              funcoes: ["Sujeito"] },
      { id: "b06", texto: "autuou",                  funcoes: ["VTD"] },
      { id: "b07", texto: "multou",                  funcoes: ["VTD"] },
      { id: "b08", texto: "prendeu",                 funcoes: ["VTD"] },
      { id: "b09", texto: "identificou",             funcoes: ["VTD"] },
      { id: "b10", texto: "o infrator",              funcoes: ["Objeto Direto"] },
      { id: "b11", texto: "o motorista",             funcoes: ["Objeto Direto"] },
      { id: "b12", texto: "o suspeito",              funcoes: ["Objeto Direto"] },
      { id: "b13", texto: "o condutor",              funcoes: ["Objeto Direto"] },
      { id: "b14", texto: "reincidente",             funcoes: ["Adj. Adnominal"] },
      { id: "b15", texto: "imprudente",              funcoes: ["Adj. Adnominal"] },
      { id: "b16", texto: "embriagado",              funcoes: ["Adj. Adnominal"] },
      { id: "b17", texto: "contumaz",                funcoes: ["Adj. Adnominal"] },
      { id: "b18", texto: "ficou",                   funcoes: ["Verbo de Ligação"] },
      { id: "b19", texto: "satisfeito",              funcoes: ["Predicativo do Sujeito"] },
      { id: "b20", texto: "pela promotora",          funcoes: ["Agente da Passiva"] },
      { id: "b21", texto: "ao juiz",                 funcoes: ["Objeto Indireto"] },
      { id: "b22", texto: "na rodovia",              funcoes: ["Adj. Adverbial"] },
    ],
    explicacao: "VTD exige OD sem preposição (autuou quem? o motorista). O adj. adnominal responde 'qual motorista?' — é adjetivo que acompanha diretamente o substantivo. Não confunda com predicativo: este surge ligado ao sujeito via VL; o adj. adnominal está junto ao nome sem verbo de ligação.",
  },
  {
    id: 3,
    descricao: "Monte uma oração na voz passiva analítica com Agente da Passiva.",
    dica: "Voz passiva = auxiliar (ser/estar) + particípio. O agente usa 'por/pelo/pela'. Cuidado: 'ao diretor' (OI) também tem preposição, mas usa 'a', não 'por'.",
    slots: [
      { id: "s1", funcao: "Sujeito Paciente", cor: "#a78bfa" },
      { id: "s2", funcao: "Verbo Passivo", cor: "#f97316" },
      { id: "s3", funcao: "Agente da Passiva", cor: "#c8f000" },
      { id: "s4", funcao: "Adj. Adverbial", cor: "#6b9fff" },
    ],
    blocos: [
      { id: "b01", texto: "O inquérito",            funcoes: ["Sujeito Paciente"] },
      { id: "b02", texto: "O processo",             funcoes: ["Sujeito Paciente"] },
      { id: "b03", texto: "A denúncia",             funcoes: ["Sujeito Paciente"] },
      { id: "b04", texto: "O relatório",            funcoes: ["Sujeito Paciente"] },
      { id: "b05", texto: "A portaria",             funcoes: ["Sujeito Paciente"] },
      { id: "b06", texto: "foi instaurado",         funcoes: ["Verbo Passivo"] },
      { id: "b07", texto: "foi concluído",          funcoes: ["Verbo Passivo"] },
      { id: "b08", texto: "foi arquivado",          funcoes: ["Verbo Passivo"] },
      { id: "b09", texto: "foi assinado",           funcoes: ["Verbo Passivo"] },
      { id: "b10", texto: "pelo delegado",          funcoes: ["Agente da Passiva"] },
      { id: "b11", texto: "pelo promotor",          funcoes: ["Agente da Passiva"] },
      { id: "b12", texto: "pelo juiz",              funcoes: ["Agente da Passiva"] },
      { id: "b13", texto: "pela autoridade",        funcoes: ["Agente da Passiva"] },
      { id: "b14", texto: "imediatamente",          funcoes: ["Adj. Adverbial"] },
      { id: "b15", texto: "no prazo legal",         funcoes: ["Adj. Adverbial"] },
      { id: "b16", texto: "ontem",                  funcoes: ["Adj. Adverbial"] },
      { id: "b17", texto: "em seguida",             funcoes: ["Adj. Adverbial"] },
      { id: "b18", texto: "o suspeito",             funcoes: ["Objeto Direto"] },
      { id: "b19", texto: "multou",                 funcoes: ["VTD"] },
      { id: "b20", texto: "ao diretor",             funcoes: ["Objeto Indireto"] },
      { id: "b21", texto: "ficou",                  funcoes: ["Verbo de Ligação"] },
      { id: "b22", texto: "aprovado",               funcoes: ["Predicativo do Sujeito"] },
    ],
    explicacao: "Voz passiva analítica = aux. (foi) + particípio. O sujeito paciente sofre a ação. O agente usa sempre preposição 'por'. Armadilha: 'ao diretor' também tem preposição, mas é OI (prep. 'a') — completaria um verbo bitransitivo, não um passivo.",
  },
  {
    id: 4,
    descricao: "Monte uma oração com VTDI — verbo bitransitivo que pede OD e OI simultaneamente.",
    dica: "Pergunte duas vezes: 'entregou o quê?' (OD, sem prep.) e 'a quem?' (OI, com prep. 'a'). Se tiver 'por', é agente da passiva, não OI.",
    slots: [
      { id: "s1", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "s2", funcao: "VTDI", cor: "#f97316" },
      { id: "s3", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "s4", funcao: "Objeto Indireto", cor: "#c8f000" },
    ],
    blocos: [
      { id: "b01", texto: "O servidor",             funcoes: ["Sujeito"] },
      { id: "b02", texto: "A coordenadora",         funcoes: ["Sujeito"] },
      { id: "b03", texto: "O fiscal",               funcoes: ["Sujeito"] },
      { id: "b04", texto: "A secretária",           funcoes: ["Sujeito"] },
      { id: "b05", texto: "O auditor",              funcoes: ["Sujeito"] },
      { id: "b06", texto: "entregou",               funcoes: ["VTDI"] },
      { id: "b07", texto: "enviou",                 funcoes: ["VTDI"] },
      { id: "b08", texto: "encaminhou",             funcoes: ["VTDI"] },
      { id: "b09", texto: "comunicou",              funcoes: ["VTDI"] },
      { id: "b10", texto: "o relatório",            funcoes: ["Objeto Direto"] },
      { id: "b11", texto: "o ofício",               funcoes: ["Objeto Direto"] },
      { id: "b12", texto: "o requerimento",         funcoes: ["Objeto Direto"] },
      { id: "b13", texto: "a decisão",              funcoes: ["Objeto Direto"] },
      { id: "b14", texto: "à chefia",               funcoes: ["Objeto Indireto"] },
      { id: "b15", texto: "ao diretor",             funcoes: ["Objeto Indireto"] },
      { id: "b16", texto: "ao departamento",        funcoes: ["Objeto Indireto"] },
      { id: "b17", texto: "ao superior",            funcoes: ["Objeto Indireto"] },
      { id: "b18", texto: "ficou",                  funcoes: ["Verbo de Ligação"] },
      { id: "b19", texto: "aprovado",               funcoes: ["Predicativo do Sujeito"] },
      { id: "b20", texto: "pelo chefe",             funcoes: ["Agente da Passiva"] },
      { id: "b21", texto: "na reunião",             funcoes: ["Adj. Adverbial"] },
      { id: "b22", texto: "urgentemente",           funcoes: ["Adj. Adverbial"] },
    ],
    explicacao: "VTDI pede OD (sem prep.) + OI (com prep. 'a/para'). Cuidado: 'pelo chefe' tem preposição, mas é 'por' → agente da passiva, não OI. 'Na reunião' modifica o verbo (adj. adv.), não é complemento exigido pelo verbo.",
  },
  {
    id: 5,
    descricao: "Monte uma oração com Predicativo do Objeto — adjetivo que qualifica o OD exigido pelo verbo.",
    dica: "Verbos como considerar, julgar, declarar, eleger exigem OD + predicativo do objeto. O pred. do objeto qualifica o OD, não o sujeito.",
    slots: [
      { id: "s1", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "s2", funcao: "VTD", cor: "#f97316" },
      { id: "s3", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "s4", funcao: "Predicativo do Objeto", cor: "#c8f000" },
    ],
    blocos: [
      { id: "b01", texto: "Os agentes",             funcoes: ["Sujeito"] },
      { id: "b02", texto: "O tribunal",             funcoes: ["Sujeito"] },
      { id: "b03", texto: "A comissão",             funcoes: ["Sujeito"] },
      { id: "b04", texto: "O juiz",                 funcoes: ["Sujeito"] },
      { id: "b05", texto: "A banca",                funcoes: ["Sujeito"] },
      { id: "b06", texto: "consideraram",           funcoes: ["VTD"] },
      { id: "b07", texto: "julgaram",               funcoes: ["VTD"] },
      { id: "b08", texto: "declararam",             funcoes: ["VTD"] },
      { id: "b09", texto: "elegeram",               funcoes: ["VTD"] },
      { id: "b10", texto: "o suspeito",             funcoes: ["Objeto Direto"] },
      { id: "b11", texto: "o réu",                  funcoes: ["Objeto Direto"] },
      { id: "b12", texto: "o candidato",            funcoes: ["Objeto Direto"] },
      { id: "b13", texto: "o servidor",             funcoes: ["Objeto Direto"] },
      { id: "b14", texto: "culpado",                funcoes: ["Predicativo do Objeto"] },
      { id: "b15", texto: "inocente",               funcoes: ["Predicativo do Objeto"] },
      { id: "b16", texto: "aprovado",               funcoes: ["Predicativo do Objeto", "Predicativo do Sujeito"] },
      { id: "b17", texto: "inidôneo",               funcoes: ["Predicativo do Objeto"] },
      { id: "b18", texto: "ficou",                  funcoes: ["Verbo de Ligação"] },
      { id: "b19", texto: "satisfeito",             funcoes: ["Predicativo do Sujeito"] },
      { id: "b20", texto: "rapidamente",            funcoes: ["Adj. Adverbial"] },
      { id: "b21", texto: "ao promotor",            funcoes: ["Objeto Indireto"] },
      { id: "b22", texto: "pelo delegado",          funcoes: ["Agente da Passiva"] },
    ],
    explicacao: "Predicativo do objeto qualifica o OD — exigido pelos verbos considerar, julgar, declarar, eleger. Confusão comum: 'ficou satisfeito' → pred. do sujeito (VL + adj. qualifica o sujeito). 'Consideraram o réu culpado' → pred. do objeto (VTD especial + adj. qualifica o OD).",
  },
  {
    id: 6,
    descricao: "Monte uma oração com Complemento Nominal — distinguindo-o do Objeto Indireto.",
    dica: "CN completa nome/adjetivo abstrato ('ciente de', 'necessidade de'). OI completa verbo ('entregar a', 'informar a'). Ambos têm preposição — identifique o que está sendo completado.",
    slots: [
      { id: "s1", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "s2", funcao: "Verbo de Ligação", cor: "#f97316" },
      { id: "s3", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "s4", funcao: "Complemento Nominal", cor: "#f472b6" },
    ],
    blocos: [
      { id: "b01", texto: "O servidor",             funcoes: ["Sujeito"] },
      { id: "b02", texto: "O candidato",            funcoes: ["Sujeito"] },
      { id: "b03", texto: "A auditora",             funcoes: ["Sujeito"] },
      { id: "b04", texto: "O inspetor",             funcoes: ["Sujeito"] },
      { id: "b05", texto: "A fiscal",               funcoes: ["Sujeito"] },
      { id: "b06", texto: "estava",                 funcoes: ["Verbo de Ligação"] },
      { id: "b07", texto: "ficou",                  funcoes: ["Verbo de Ligação"] },
      { id: "b08", texto: "permanecia",             funcoes: ["Verbo de Ligação"] },
      { id: "b09", texto: "mostrou-se",             funcoes: ["Verbo de Ligação"] },
      { id: "b10", texto: "ciente",                 funcoes: ["Predicativo do Sujeito"] },
      { id: "b11", texto: "consciente",             funcoes: ["Predicativo do Sujeito"] },
      { id: "b12", texto: "seguro",                 funcoes: ["Predicativo do Sujeito"] },
      { id: "b13", texto: "atento",                 funcoes: ["Predicativo do Sujeito"] },
      { id: "b14", texto: "do prazo",               funcoes: ["Complemento Nominal"] },
      { id: "b15", texto: "da responsabilidade",    funcoes: ["Complemento Nominal"] },
      { id: "b16", texto: "dos procedimentos",      funcoes: ["Complemento Nominal"] },
      { id: "b17", texto: "das normas",             funcoes: ["Complemento Nominal"] },
      { id: "b18", texto: "multou",                 funcoes: ["VTD"] },
      { id: "b19", texto: "ao juiz",                funcoes: ["Objeto Indireto"] },
      { id: "b20", texto: "pelo chefe",             funcoes: ["Agente da Passiva"] },
      { id: "b21", texto: "rapidamente",            funcoes: ["Adj. Adverbial"] },
      { id: "b22", texto: "o motorista",            funcoes: ["Objeto Direto"] },
    ],
    explicacao: "CN completa adjetivos abstratos: 'ciente DO PRAZO' (ciente de quê?), 'consciente DA RESPONSABILIDADE'. Diferença crucial do OI: o OI completa verbos; o CN completa nomes/adjetivos. Ambos têm preposição — a armadilha de concurso é justamente essa semelhança formal.",
  },
  {
    id: 7,
    descricao: "Monte uma oração com Adjunto Adverbial de modo e de lugar — distinguindo-os de complementos verbais.",
    dica: "Adj. adverbiais são acessórios: podem ser retirados sem comprometer o verbo. Teste: retire o bloco — a oração continua fazendo sentido? Então é adj. adverbial.",
    slots: [
      { id: "s1", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "s2", funcao: "VTD", cor: "#f97316" },
      { id: "s3", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "s4", funcao: "Adj. Adv. de Modo", cor: "#6b9fff" },
      { id: "s5", funcao: "Adj. Adv. de Lugar", cor: "#34d399" },
    ],
    blocos: [
      { id: "b01", texto: "A equipe",               funcoes: ["Sujeito"] },
      { id: "b02", texto: "O perito",               funcoes: ["Sujeito"] },
      { id: "b03", texto: "O inspetor",             funcoes: ["Sujeito"] },
      { id: "b04", texto: "O auditor",              funcoes: ["Sujeito"] },
      { id: "b05", texto: "A delegada",             funcoes: ["Sujeito"] },
      { id: "b06", texto: "analisou",               funcoes: ["VTD"] },
      { id: "b07", texto: "realizou",               funcoes: ["VTD"] },
      { id: "b08", texto: "examinou",               funcoes: ["VTD"] },
      { id: "b09", texto: "revisou",                funcoes: ["VTD"] },
      { id: "b10", texto: "as evidências",          funcoes: ["Objeto Direto"] },
      { id: "b11", texto: "o laudo",                funcoes: ["Objeto Direto"] },
      { id: "b12", texto: "o material",             funcoes: ["Objeto Direto"] },
      { id: "b13", texto: "os documentos",          funcoes: ["Objeto Direto"] },
      { id: "b14", texto: "meticulosamente",        funcoes: ["Adj. Adv. de Modo"] },
      { id: "b15", texto: "cuidadosamente",         funcoes: ["Adj. Adv. de Modo"] },
      { id: "b16", texto: "com rigor",              funcoes: ["Adj. Adv. de Modo"] },
      { id: "b17", texto: "com precisão",           funcoes: ["Adj. Adv. de Modo"] },
      { id: "b18", texto: "no laboratório",         funcoes: ["Adj. Adv. de Lugar"] },
      { id: "b19", texto: "na sede",                funcoes: ["Adj. Adv. de Lugar"] },
      { id: "b20", texto: "no local do crime",      funcoes: ["Adj. Adv. de Lugar"] },
      { id: "b21", texto: "na delegacia",           funcoes: ["Adj. Adv. de Lugar"] },
      { id: "b22", texto: "ficou",                  funcoes: ["Verbo de Ligação"] },
      { id: "b23", texto: "aprovado",               funcoes: ["Predicativo do Sujeito"] },
    ],
    explicacao: "Adj. adverbial de modo responde 'como?' (meticulosamente, com rigor); de lugar responde 'onde?' (no laboratório, na delegacia). Ambos são circunstanciais — retire-os e a oração continua completa. Isso os distingue do OD e OI, que são exigidos pelo verbo.",
  },
];

const PROMPT_TEMPLATE = `Você é um especialista em concursos públicos brasileiros e gerador de questões.
Gere [NÚMERO] questões MISTAS para o concurso [CARGO/ÓRGÃO], disciplina [DISCIPLINA][TEMA].
Distribua assim: ~40% questões oficiais de provas reais, ~60% criadas/adaptadas.

Substitua os campos entre colchetes antes de enviar. Exemplo:
• [NÚMERO]      → 10
• [BANCA]       → CESPE/CEBRASPE
• [CARGO/ÓRGÃO] → Polícia Rodoviária Federal
• [DISCIPLINA]  → Língua Portuguesa

⚠️ Retorne SOMENTE o JSON a seguir, sem nenhum texto antes ou depois,
   sem blocos de código markdown (sem \`\`\`json):

{
  "metadata": {
    "titulo": "Simulado Misto [BANCA] — [DISCIPLINA]",
    "banca": "[BANCA]",
    "concurso": "[CARGO/ÓRGÃO]",
    "cargo": "[Cargo específico]",
    "disciplina": "[DISCIPLINA]",
    "geradoEm": "[YYYY-MM-DD]"
  },
  "questoes": [
    {
      "id": "q1",
      "numero": 1,
      "tipo": "certo_errado",
      "enunciado": "Texto completo da questão.",
      "alternativas": [
        { "id": "certo", "texto": "Certo" },
        { "id": "errado", "texto": "Errado" }
      ],
      "gabarito": "certo",
      "categoria": {
        "disciplina": "Língua Portuguesa",
        "topico": "Sintaxe",
        "subtopico": "Concordância verbal"
      },
      "nivel": "medio",
      "explicacao": "Explicação detalhada citando a regra aplicada.",
      "fonte": {
        "banca": "[BANCA]",
        "ano": "[ANO DA PROVA ou null]",
        "cargo_origem": "[CARGO DA PROVA ORIGINAL ou null]",
        "autenticidade": "original",
        "nota": "Questão oficial — [BANCA], [CARGO], [ANO]."
      }
    }
  ]
}

TIPOS DE AUTENTICIDADE — use o correto em cada questão:
• "original"  → Questão reproduzida fielmente de prova oficial. Preencha banca, ano e cargo_origem.
• "variacao"  → Questão real adaptada (enunciado reescrito, contexto trocado, gabarito mantido).
• "baseada"   → Questão criada do zero no estilo da banca, sem base em prova específica.

DISTRIBUIÇÃO RECOMENDADA por simulado de [NÚMERO] questões:
• ~40% "original"  — busque questões reais de provas [BANCA] dos últimos 5 anos
• ~35% "variacao"  — adapte questões reais trocando nomes, contextos e exemplos
• ~25% "baseada"   — crie questões originais cobrindo subtópicos ainda não abordados

REGRAS GERAIS:
1. CESPE/CEBRASPE → "certo_errado" (~80% das questões do simulado)
2. FCC, VUNESP, AOCP → "multipla_escolha" com ids: a, b, c, d, e
3. Varie os subtópicos — não repita o mesmo assunto em sequência
4. "nivel": distribua entre "facil", "medio" e "dificil"
5. Para questões "original": reproduza o enunciado com fidelidade, incluindo texto-base se houver
6. Para questões "variacao": mantenha o conceito e gabarito, mude apenas o contexto/exemplos
7. "explicacao" deve sempre citar a regra ou fundamento, independente do tipo`;

const PROVIDERS = [
  {
    id:"groq", label:"Groq", tag:"Gratuito",
    placeholder:"gsk_...", hint:"console.groq.com — sem cartão de crédito",
    models:[{id:"llama-3.3-70b-versatile",label:"Llama 3.3 70B"},{id:"llama-3.1-8b-instant",label:"Llama 3.1 8B"},{id:"gemma2-9b-it",label:"Gemma 2 9B"}],
    call:async(p,k,m,maxTok=800)=>{const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${k}`},body:JSON.stringify({model:m,max_tokens:maxTok,messages:[{role:"user",content:p}]})});if(!r.ok)throw new Error(`Groq ${r.status}`);const d=await r.json();if(d.error)throw new Error(d.error.message);return d.choices?.[0]?.message?.content||"";},
  },
  {
    id:"anthropic", label:"Claude", tag:"Pago",
    placeholder:"sk-ant-...", hint:"console.anthropic.com — ~$0,0003 por análise",
    models:[{id:"claude-haiku-4-5-20251001",label:"Claude Haiku"},{id:"claude-sonnet-4-6",label:"Claude Sonnet"}],
    call:async(p,k,m,maxTok=800)=>{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":k,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:m,max_tokens:maxTok,messages:[{role:"user",content:p}]})});if(!r.ok)throw new Error(`Anthropic ${r.status}`);const d=await r.json();if(d.error)throw new Error(d.error.message);return d.content?.[0]?.text||"";},
  },
  {
    id:"openai", label:"ChatGPT", tag:"Pago",
    placeholder:"sk-...", hint:"platform.openai.com",
    models:[{id:"gpt-4o-mini",label:"GPT-4o mini"},{id:"gpt-4o",label:"GPT-4o"}],
    call:async(p,k,m,maxTok=800)=>{const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${k}`},body:JSON.stringify({model:m,max_tokens:maxTok,messages:[{role:"user",content:p}]})});if(!r.ok)throw new Error(`OpenAI ${r.status}`);const d=await r.json();if(d.error)throw new Error(d.error.message);return d.choices?.[0]?.message?.content||"";},
  },
  {
    id:"gemini", label:"Gemini", tag:"Grátis*",
    placeholder:"AIza...", hint:"aistudio.google.com — tier gratuito disponível",
    models:[{id:"gemini-1.5-flash",label:"Gemini 1.5 Flash"},{id:"gemini-1.5-pro",label:"Gemini 1.5 Pro"}],
    call:async(p,k,m,maxTok=800)=>{const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:p}]}],generationConfig:{maxOutputTokens:maxTok}})});if(!r.ok)throw new Error(`Gemini ${r.status}`);const d=await r.json();if(d.error)throw new Error(d.error.message);return d.candidates?.[0]?.content?.parts?.[0]?.text||"";},
  },
];

const calcLevel = xp => ({ level: Math.floor(xp/500)+1, progress: (xp%500)/500, xpIn: xp%500 });
const getEarned = s => { const e=new Set(); if(s.total>=1)e.add("start"); if(s.maxStreak>=3)e.add("streak3"); if(s.maxStreak>=5)e.add("streak5"); if(s.maxStreak>=10)e.add("streak10"); if(s.total>=Math.ceil(s.totalQ/2))e.add("half"); if(s.total>=s.totalQ)e.add("complete"); if(s.pct>=70)e.add("pass"); if(s.pct===100)e.add("ace"); return e; };
const loadUser = () => { try { return JSON.parse(localStorage.getItem("cq_v2")||"null"); } catch { return null; } };
const saveUser = u => localStorage.setItem("cq_v2", JSON.stringify(u));
const buildPrompt = (wrongs, user) => {
  const lines = wrongs.map(q=>`• Tópico: ${q.categoria?.subtopico||q.categoria?.topico||"Geral"}\n  Enunciado: ${q.enunciado?.slice(0,200)}\n  Marcou: "${q.userAlt?.texto}" | Correto: "${q.correctAlt?.texto}"\n  Explicação da questão: ${q.explicacao||"—"}`).join("\n\n");
  return `Você é professor especialista em concursos públicos brasileiros, didático e objetivo.\n\nCandidato: ${user.name} — Concurso: ${user.concurso}\n\nQuestões que ${user.name} errou:\n${lines||"Nenhuma — simulado perfeito!"}\n\nPara cada tópico em que o candidato errou:\n1. Explique brevemente a regra ou conceito (2-3 linhas)\n2. Dê 1 exemplo prático e concreto que ilustre a regra\n3. Aponte o erro específico que levou à resposta errada\n\nNão faça listas genéricas. Ensine de verdade, como um professor explicando no quadro.\nSe errou mais de uma questão do mesmo tópico, agrupe e aprofunde a explicação.\nFinalize com uma frase motivacional curta e direta.\nMáximo 500 palavras.`;
};

function useClock() {
  const [t,setT]=useState(new Date());
  useEffect(()=>{const id=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(id);},[]);
  return t.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
}

const S = `
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#090909;--s1:#111;--s2:#181818;
  --b1:#222;--b2:#333;
  --tx:#f0ece4;--t2:#999;--t3:#555;
  --ac:#c8f000;
  --ok:#c8f000;--ok-bg:rgba(200,240,0,.07);--ok-b:rgba(200,240,0,.25);
  --er:#ff4545;--er-bg:rgba(255,69,69,.07);--er-b:rgba(255,69,69,.22);
  --F:'Syne',sans-serif;--B:'DM Sans',sans-serif;--M:'Space Mono',monospace;
}
html{scroll-behavior:smooth}
body{background:var(--bg);font-family:var(--B);color:var(--tx);min-height:100vh}
::-webkit-scrollbar{width:2px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--b2)}

.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px);
  background-size:60px 60px}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes slideR{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:none}}
@keyframes slideL{from{opacity:0;transform:translateX(-36px)}to{opacity:1;transform:none}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
@keyframes popOk{0%{transform:scale(.95);opacity:.4}60%{transform:scale(1.02)}100%{transform:scale(1);opacity:1}}
@keyframes xpUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-44px)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes blink{0%,100%{opacity:0}50%{opacity:1}}

.screen{animation:fadeUp .38s cubic-bezier(.22,1,.36,1)}
.slide-r{animation:slideR .3s cubic-bezier(.22,1,.36,1)}
.slide-l{animation:slideL .3s cubic-bezier(.22,1,.36,1)}

.xp-float{position:fixed;pointer-events:none;z-index:9000;font-family:var(--M);font-size:.78rem;font-weight:700;color:var(--ac);animation:xpUp 1s ease forwards}

/* ── WELCOME ── */
.welcome{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto;position:relative;overflow:hidden}
.w-top{display:flex;align-items:center;justify-content:space-between;padding:1.4rem 2.5rem;border-bottom:1px solid var(--b1);position:relative;z-index:1}
.w-brand{font-family:var(--F);font-size:.8rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.w-brand b{color:var(--ac)}
.w-time{font-family:var(--M);font-size:.68rem;color:var(--t3)}
.w-hero{display:flex;flex-direction:column;justify-content:center;padding:4rem 2.5rem 2rem;position:relative;z-index:1}
.w-eyebrow{font-family:var(--M);font-size:.62rem;color:var(--t3);letter-spacing:.18em;text-transform:uppercase;margin-bottom:1.75rem;display:flex;align-items:center;gap:.75rem}
.w-eyebrow::before{content:'';width:24px;height:1px;background:var(--b2)}
.w-h1{font-family:var(--F);font-weight:800;font-size:clamp(3.5rem,10vw,9rem);line-height:.92;letter-spacing:-.04em;margin-bottom:3rem;max-width:900px}
.w-h1 em{font-style:italic;color:var(--ac)}
.w-form{display:grid;grid-template-columns:1fr 1fr 1fr auto;border-top:1px solid var(--b1);position:relative;z-index:1}
@media(max-width:760px){.w-form{grid-template-columns:1fr 1fr;}}
@media(max-width:480px){.w-form{grid-template-columns:1fr}}
.w-field{padding:1.5rem 2rem;border-right:1px solid var(--b1);display:flex;flex-direction:column;gap:.4rem}
@media(max-width:760px){.w-field:nth-child(2){border-right:none}.w-field:nth-child(3){border-top:1px solid var(--b1);border-right:1px solid var(--b1)}}
@media(max-width:480px){.w-field{border-right:none;border-bottom:1px solid var(--b1)}}
.w-field-meta{gap:.55rem}
.w-meta-row{display:flex;align-items:baseline;gap:.5rem}
.w-meta-num{width:64px;font-size:1.4rem;font-weight:700;color:var(--ac)}
.w-meta-sep{font-family:var(--M);font-size:.68rem;color:var(--t3);white-space:nowrap}
.w-periodo-tabs{display:flex;gap:0;border:1px solid var(--b2);width:fit-content}
.w-periodo-tab{padding:.22rem .65rem;border:none;background:transparent;color:var(--t3);font-family:var(--M);font-size:.6rem;text-transform:uppercase;letter-spacing:.08em;cursor:pointer;transition:all .15s;border-right:1px solid var(--b2)}
.w-periodo-tab:last-child{border-right:none}
.w-periodo-tab:hover{color:var(--t2)}
.w-periodo-on{background:var(--ac);color:#090909;font-weight:700}
.w-flabel{font-family:var(--M);font-size:.56rem;text-transform:uppercase;letter-spacing:.14em;color:var(--t3)}
.w-input,.w-select{background:transparent;border:none;outline:none;font-family:var(--B);font-size:1rem;color:var(--tx);width:100%}
.w-input::placeholder{color:var(--t3)}
.w-select{cursor:pointer;-webkit-appearance:none}
.w-select option{background:#111}
.w-btn{padding:1.5rem 2.5rem;background:var(--ac);border:none;cursor:pointer;font-family:var(--F);font-size:.82rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#090909;transition:opacity .15s;white-space:nowrap}
.w-btn:hover:not(:disabled){opacity:.85}
.w-btn:disabled{opacity:.3;cursor:not-allowed;background:var(--b2);color:var(--t3)}
.w-bottom{padding:1.1rem 2.5rem;border-top:1px solid var(--b1);display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1}
.w-tagline{font-family:var(--M);font-size:.6rem;color:var(--t3);display:flex;gap:2rem;flex-wrap:wrap}

/* ── HOW TO ── */
.howto{max-width:900px;margin:0 auto;padding:3rem 2rem 6rem;position:relative;z-index:1}
.ht-top{display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:2rem;border-bottom:1px solid var(--b1);margin-bottom:3rem;flex-wrap:wrap;gap:1rem}
.ht-h1{font-family:var(--F);font-weight:800;font-size:clamp(2rem,5vw,4rem);letter-spacing:-.04em;line-height:1}
.ht-h1 em{font-style:italic;color:var(--ac)}
.ht-sub{font-family:var(--M);font-size:.62rem;color:var(--t3);max-width:200px;line-height:1.75}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));border:1px solid var(--b1);margin-bottom:3rem}
.step{padding:2rem 1.5rem;border-right:1px solid var(--b1);transition:background .18s}
.step:last-child{border-right:none}
.step:hover{background:var(--s1)}
.step-n{font-family:var(--F);font-size:3.5rem;font-weight:800;color:var(--b2);line-height:1;margin-bottom:1rem}
.step-t{font-family:var(--F);font-size:.88rem;font-weight:700;margin-bottom:.45rem}
.step-d{font-size:.81rem;color:var(--t2);line-height:1.65}
.prompt-wrap{border:1px solid var(--b1);margin-bottom:2.5rem}
.prompt-bar{padding:1rem 1.5rem;border-bottom:1px solid var(--b1);display:flex;align-items:center;justify-content:space-between}
.prompt-bar-t{font-family:var(--F);font-size:.85rem;font-weight:700}
.prompt-bar-t em{font-style:italic;color:var(--ac)}
.btn-copy{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;padding:.28rem .72rem;border:1px solid var(--b2);background:transparent;color:var(--t3);cursor:pointer;transition:all .15s}
.btn-copy:hover{border-color:var(--ac);color:var(--ac)}
.btn-copy.ok{border-color:var(--ok);color:var(--ok)}
.prompt-code{padding:1.5rem;font-family:var(--M);font-size:.71rem;color:var(--t2);line-height:1.9;white-space:pre-wrap;max-height:280px;overflow-y:auto}

/* ── PROMPT BUILDER ── */
.pb-fields{display:grid;grid-template-columns:1fr 1fr;gap:0;border-bottom:1px solid var(--b1)}
@media(max-width:560px){.pb-fields{grid-template-columns:1fr}}
.pb-field{padding:1.25rem 1.5rem;border-right:1px solid var(--b1);border-bottom:1px solid var(--b1);display:flex;flex-direction:column;gap:.55rem}
.pb-field:nth-child(even){border-right:none}
@media(max-width:560px){.pb-field{border-right:none}}
.pb-label{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.12em;color:var(--t3);display:flex;align-items:center;gap:.5rem}
.pb-auto{color:var(--ac);font-size:.52rem;letter-spacing:.06em}
.pb-readonly{font-family:var(--B);font-size:.9rem;color:var(--ac);padding:.5rem 0;border-bottom:1px solid var(--b1)}
.pb-select{background:var(--s2);border:1px solid var(--b2);color:var(--tx);font-family:var(--B);font-size:.9rem;padding:.5rem .75rem;outline:none;cursor:pointer;-webkit-appearance:none;transition:border-color .15s;width:100%}
.pb-select:focus{border-color:var(--ac)}
.pb-select option{background:#181818}
.pb-num-row{display:flex;flex-wrap:wrap;gap:.35rem}
.pb-num-btn{padding:.35rem .75rem;border:1px solid var(--b2);background:transparent;color:var(--t3);font-family:var(--M);font-size:.72rem;font-weight:700;cursor:pointer;transition:all .15s}
.pb-num-btn:hover{border-color:var(--t2);color:var(--t2)}
.pb-num-on{border-color:var(--ac);background:rgba(200,240,0,.08);color:var(--ac)}
.pb-custom-num{margin-top:.35rem;width:100%;padding:.5rem .75rem;background:var(--s2);border:1px solid var(--ac);color:var(--ac);font-family:var(--M);font-size:.9rem;outline:none}
.info-wrap{border:1px solid var(--b1);padding:1.5rem;margin-bottom:3rem}
.info-label{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.14em;color:var(--ac);margin-bottom:1rem}
.info-items{display:flex;flex-direction:column;gap:.5rem}
.info-item{font-size:.83rem;color:var(--t2);line-height:1.6;display:flex;gap:.75rem}
.info-item::before{content:'—';color:var(--t3);flex-shrink:0}
.ht-nav{display:flex;gap:.75rem}
.btn-ghost{padding:.72rem 1.4rem;border:1px solid var(--b2);background:transparent;color:var(--t2);font-family:var(--F);font-size:.78rem;font-weight:700;cursor:pointer;transition:all .15s}
.btn-ghost:hover{border-color:var(--tx);color:var(--tx)}
.btn-primary{padding:.72rem 1.8rem;border:1px solid var(--ac);background:var(--ac);color:#090909;font-family:var(--F);font-size:.78rem;font-weight:800;cursor:pointer;transition:opacity .15s;text-transform:uppercase;letter-spacing:.04em}
.btn-primary:hover{opacity:.85}

/* ── DROP ── */
.drop-screen{min-height:calc(100vh - 61px);display:flex;align-items:center;justify-content:center;padding:2rem;position:relative;z-index:1}
.drop-card{width:100%;max-width:540px}
.drop-card-wide{max-width:720px}
.drop-h{font-family:var(--F);font-weight:800;font-size:clamp(2rem,5vw,3.5rem);letter-spacing:-.04em;margin-bottom:.5rem}
.drop-h em{font-style:italic;color:var(--ac)}
.drop-sub{font-size:.87rem;color:var(--t2);margin-bottom:1.25rem;line-height:1.65}

/* tabs */
.drop-tabs{display:flex;border:1px solid var(--b1);margin-bottom:0}
.drop-tab{flex:1;padding:.75rem .5rem;border:none;border-right:1px solid var(--b1);background:transparent;color:var(--t3);font-family:var(--M);font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;cursor:pointer;transition:all .15s}
.drop-tab:last-child{border-right:none}
.drop-tab:hover{background:var(--s1);color:var(--t2)}
.drop-tab-on{background:var(--s2);color:var(--ac);border-bottom:2px solid var(--ac)}

/* generate form */
.gen-form{border:1px solid var(--b1);border-top:none;padding:1.5rem}
.gen-row{display:grid;grid-template-columns:1fr 1fr auto;gap:.75rem}
@media(max-width:560px){.gen-row{grid-template-columns:1fr}}
.gen-field{display:flex;flex-direction:column;gap:.35rem}
.gen-field-sm{min-width:90px;max-width:120px}
@media(max-width:560px){.gen-field-sm{max-width:100%}}
.gen-label{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.12em;color:var(--t3)}
.gen-label-hint{font-size:.55rem;color:var(--t3);text-transform:none;letter-spacing:0;opacity:.7}
.gen-select,.gen-input{padding:.65rem .9rem;background:var(--s1);border:1px solid var(--b1);color:var(--tx);font-family:var(--B);font-size:.88rem;outline:none;transition:border-color .15s;width:100%}
.gen-select{cursor:pointer;-webkit-appearance:none}
.gen-select option{background:#111}
.gen-select:focus,.gen-input:focus{border-color:var(--ac)}
.gen-input::placeholder{color:var(--t3);font-family:var(--M);font-size:.75rem}
.gen-summary{margin-top:1rem;padding:.85rem 1rem;background:var(--s1);border:1px solid var(--b1);border-left:2px solid var(--ac);font-size:.82rem;color:var(--t2);line-height:1.6}
.gen-summary b{color:var(--tx);font-weight:600}
.gen-btn{width:100%;margin-top:.85rem;padding:1rem;border:none;background:var(--ac);color:#090909;font-family:var(--F);font-size:.88rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:opacity .15s;display:flex;align-items:center;justify-content:center;gap:.5rem}
.gen-btn:hover:not(:disabled){opacity:.86}
.gen-btn:disabled{opacity:.35;cursor:not-allowed}

.drop-zone{border:1px solid var(--b2);padding:3.5rem 2rem;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;position:relative;overflow:hidden}
.drop-zone:hover,.drop-zone.over{border-color:var(--ac);background:rgba(200,240,0,.03)}
.drop-icon{display:block;font-size:2rem;margin-bottom:1rem;transition:transform .25s}
.drop-zone:hover .drop-icon,.drop-zone.over .drop-icon{transform:translateY(-5px)}
.drop-zone-t{font-family:var(--F);font-weight:700;font-size:1rem;margin-bottom:.3rem}
.drop-zone-hint{font-family:var(--M);font-size:.67rem;color:var(--t3)}
.drop-err{margin-top:1rem;padding:.68rem 1rem;border:1px solid var(--er-b);background:var(--er-bg);color:var(--er);font-family:var(--M);font-size:.73rem}
.drop-or{display:flex;align-items:center;gap:1rem;margin:1.5rem 0;font-family:var(--M);font-size:.6rem;color:var(--t3);text-transform:uppercase;letter-spacing:.1em}
.drop-or::before,.drop-or::after{content:'';flex:1;height:1px;background:var(--b1)}
.drop-link{width:100%;padding:.85rem;border:1px solid var(--b1);background:transparent;color:var(--t2);font-family:var(--B);font-size:.87rem;cursor:pointer;transition:all .15s;text-align:center}
.drop-link:hover{border-color:var(--b2);color:var(--tx)}
.drop-paste{width:100%;padding:1rem;background:var(--s1);border:1px solid var(--b1);color:var(--tx);font-family:var(--M);font-size:.72rem;line-height:1.7;resize:vertical;min-height:130px;outline:none;transition:border-color .15s;display:block}
.drop-paste:focus{border-color:var(--ac)}
.drop-paste::placeholder{color:var(--t3)}
.drop-paste-btn{width:100%;padding:.85rem;margin-top:.5rem;border:1px solid var(--ac);background:transparent;color:var(--ac);font-family:var(--F);font-size:.8rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;transition:all .15s}
.drop-paste-btn:hover:not(:disabled){background:var(--ac);color:#090909}
.drop-paste-btn:disabled{opacity:.3;cursor:not-allowed;border-color:var(--b2);color:var(--t3)}

/* ── TOPBAR ── */
.topbar{position:sticky;top:0;z-index:100;background:rgba(9,9,9,.96);backdrop-filter:blur(10px)}
.topbar-row{display:flex;align-items:center;gap:1rem;padding:0 2rem;height:50px;border-bottom:1px solid var(--b1)}
.tb-brand{font-family:var(--F);font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--t2);flex-shrink:0}
.tb-brand b{color:var(--ac)}
.xp-bar-wrap{flex:1;max-width:150px;display:none;flex-direction:column;gap:3px}
@media(min-width:500px){.xp-bar-wrap{display:flex}}
.xp-bar-meta{font-family:var(--M);font-size:.54rem;color:var(--t3);display:flex;justify-content:space-between}
.xp-track{height:2px;background:var(--b2)}
.xp-fill{height:100%;background:var(--ac);transition:width .6s cubic-bezier(.22,1,.36,1)}
.tb-counters{display:flex;gap:.3rem;margin-left:auto}
.tbc{display:flex;align-items:center;gap:.22rem;padding:.2rem .52rem;border:1px solid var(--b1);font-family:var(--M);font-size:.7rem;font-weight:700}
.tbc-ok{border-color:var(--ok-b);color:var(--ok);background:var(--ok-bg)}
.tbc-er{border-color:var(--er-b);color:var(--er);background:var(--er-bg)}
.tbc-st{border-color:var(--b2);color:var(--ac)}
.tbc-st.hot{border-color:var(--ok-b);background:var(--ok-bg)}
.tbc-n{font-size:.88rem}
.tbc-meta{border-color:rgba(200,240,0,.2);color:var(--t2);gap:.2rem;display:none}
@media(min-width:600px){.tbc-meta{display:flex}}
.tb-meta-sep{color:var(--t3)}
.tb-meta-per{font-size:.6rem;color:var(--t3)}
.marquee-wrap{overflow:hidden;border-bottom:1px solid var(--b1);height:26px;background:var(--s1)}
.marquee-track{display:flex;animation:marquee 28s linear infinite;white-space:nowrap}
.mq-item{font-family:var(--M);font-size:.56rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);padding:0 2rem;line-height:26px;flex-shrink:0}
.prog-line{height:1.5px;background:var(--b1)}
.prog-fill{height:100%;background:var(--ac);transition:width .42s cubic-bezier(.22,1,.36,1)}

/* ── QUIZ ── */
.quiz-wrap{max-width:750px;margin:0 auto;padding:2.5rem 2rem 8rem;position:relative;z-index:1}
.q-meta{display:flex;flex-wrap:wrap;gap:.38rem;margin-bottom:1.4rem;align-items:center}
.qtag{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;padding:.18rem .48rem;border:1px solid var(--b2);color:var(--t3)}
.qtag-b{border-color:rgba(200,240,0,.22);color:rgba(200,240,0,.65)}
.qtag-oficial{border-color:rgba(200,240,0,.4);color:var(--ac);background:rgba(200,240,0,.07);font-weight:700}
.qtag-var{border-color:rgba(150,150,255,.22);color:rgba(150,150,255,.7)}
.qtag-f{border-color:rgba(200,240,0,.18);color:rgba(200,240,0,.55)}
.qtag-m{border-color:rgba(255,170,0,.2);color:rgba(255,170,0,.65)}
.qtag-d{border-color:rgba(255,69,69,.2);color:rgba(255,69,69,.65)}
.q-pos{font-family:var(--M);font-size:.6rem;color:var(--t3);margin-left:auto}
.q-card{border:1px solid var(--b1);padding:2.5rem;margin-bottom:1rem;position:relative;overflow:hidden;background:var(--s1)}
.q-watermark{position:absolute;right:-1rem;bottom:-2rem;font-family:var(--F);font-size:11rem;font-weight:800;color:rgba(255,255,255,0.04);line-height:1;pointer-events:none;user-select:none}
.q-type-row{display:flex;align-items:center;gap:.75rem;margin-bottom:1.2rem}
.q-type-lbl{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--t3)}
.q-type-line{flex:1;height:1px;background:var(--b1)}
.q-text{font-family:var(--B);font-size:1rem;line-height:1.85;color:var(--tx);white-space:pre-line;position:relative;z-index:1}

/* alternatives — CERTO/ERRADO side by side */
.alts-ce{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--b1);margin-bottom:1rem}
.alt-ce{padding:1.75rem 1rem;text-align:center;cursor:pointer;border:none;border-right:1px solid var(--b1);background:transparent;color:var(--t2);font-family:var(--F);font-size:1rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;transition:background .14s,color .14s;position:relative;overflow:hidden}
.alt-ce:last-child{border-right:none}
.alt-ce:hover:not(:disabled){background:var(--s2);color:var(--tx)}
.alt-ce:disabled{cursor:default}
.alt-ce.ac{background:var(--ok-bg);color:var(--ok);border-color:var(--ok-b);animation:popOk .32s ease}
.alt-ce.aw{background:var(--er-bg);color:var(--er);border-color:var(--er-b);animation:shake .32s ease}
.alt-ce.rc{background:rgba(200,240,0,.04);color:rgba(200,240,0,.55)}

/* alternatives — MÚLTIPLA ESCOLHA */
.alts-mc{display:flex;flex-direction:column;border:1px solid var(--b1);margin-bottom:1rem}
.alt-mc{display:flex;align-items:center;gap:1rem;padding:1rem 1.4rem;cursor:pointer;border:none;border-bottom:1px solid var(--b1);background:transparent;color:var(--t2);font-family:var(--B);font-size:.94rem;text-align:left;width:100%;transition:background .14s,color .14s;animation:fadeUp .28s cubic-bezier(.22,1,.36,1) both}
.alt-mc:last-child{border-bottom:none}
.alt-mc:nth-child(1){animation-delay:.03s}.alt-mc:nth-child(2){animation-delay:.07s}.alt-mc:nth-child(3){animation-delay:.11s}.alt-mc:nth-child(4){animation-delay:.15s}.alt-mc:nth-child(5){animation-delay:.19s}
.alt-mc:hover:not(:disabled){background:var(--s2);color:var(--tx)}
.alt-mc:disabled{cursor:default}
.alt-mc.ac{background:var(--ok-bg);color:var(--ok);animation:popOk .32s ease}
.alt-mc.aw{background:var(--er-bg);color:var(--er);animation:shake .32s ease}
.alt-mc.rc{background:rgba(200,240,0,.03);color:rgba(200,240,0,.5)}
.alt-letter{font-family:var(--M);font-size:.63rem;font-weight:700;text-transform:uppercase;min-width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:1px solid var(--b2);color:var(--t3);flex-shrink:0;transition:all .14s}
.ac .alt-letter{border-color:var(--ok);color:var(--ok)}
.aw .alt-letter{border-color:var(--er);color:var(--er)}
.rc .alt-letter{border-color:rgba(200,240,0,.28);color:rgba(200,240,0,.5)}
.kbd-hint{font-family:var(--M);font-size:.56rem;color:var(--t3);margin-bottom:.75rem;letter-spacing:.06em}
.expl{border:1px solid var(--b1);border-left:3px solid var(--b1);padding:1.4rem;margin-bottom:1rem;animation:fadeUp .26s ease}
.expl.c{border-left-color:var(--ok);background:var(--ok-bg)}
.expl.w{border-left-color:var(--er);background:var(--er-bg)}
.expl-head{font-family:var(--F);font-size:.76rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin-bottom:.55rem}
.expl.c .expl-head{color:var(--ok)}.expl.w .expl-head{color:var(--er)}
.expl-body{font-size:.87rem;line-height:1.78;color:var(--t2)}
.expl-note{font-family:var(--M);font-size:.58rem;color:var(--t3);margin-top:.7rem;padding-top:.7rem;border-top:1px solid var(--b1)}
.btn-next{width:100%;padding:1.1rem;border:none;background:var(--ac);color:#090909;font-family:var(--F);font-size:.86rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:opacity .15s;margin-top:.25rem}
.btn-next:hover{opacity:.85}

/* ── ANALYSIS ── */
.anl-wrap{max-width:900px;margin:0 auto;padding:3rem 2rem 8rem;position:relative;z-index:1}
.anl-hero{display:grid;grid-template-columns:auto 1fr;border:1px solid var(--b1);margin-bottom:2.5rem;overflow:hidden}
@media(max-width:580px){.anl-hero{grid-template-columns:1fr}}
.anl-score-block{padding:3rem;border-right:1px solid var(--b1);display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
@media(max-width:580px){.anl-score-block{border-right:none;border-bottom:1px solid var(--b1)}}
.anl-score-eye{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.18em;color:var(--t3);margin-bottom:.4rem}
.anl-score-big{font-family:var(--F);font-size:clamp(4rem,13vw,8rem);font-weight:800;line-height:1;letter-spacing:-.04em}
.sg{color:var(--ok)}.sy{color:#ffaa00}.sr{color:var(--er)}
.anl-right{padding:2rem 2.5rem;display:flex;flex-direction:column;justify-content:space-between;gap:1.5rem}
.anl-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--b1);border:1px solid var(--b1)}
.anl-stat{background:var(--s1);padding:1.2rem 1rem}
.anl-stat-n{font-family:var(--M);font-size:1.55rem;font-weight:700;line-height:1;margin-bottom:.22rem}
.anl-stat-l{font-family:var(--M);font-size:.55rem;text-transform:uppercase;letter-spacing:.1em;color:var(--t3)}
.anl-meta{font-family:var(--M);font-size:.62rem;color:var(--t3);line-height:1.85}
.anl-meta b{color:var(--t2);font-weight:400}
.sec-t{font-family:var(--F);font-size:.76rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--t3);padding:.9rem 0;border-bottom:1px solid var(--b1);margin-bottom:1rem;margin-top:2.5rem;display:flex;align-items:center;gap:1rem}
.sec-t em{color:var(--ac);font-style:normal}
.sec-t::after{content:'';flex:1;height:1px;background:var(--b1)}
.motivational{font-family:var(--F);font-size:1.1rem;font-weight:700;font-style:italic;color:var(--t3);padding:1.75rem 0;border-top:1px solid var(--b1);border-bottom:1px solid var(--b1);margin:2rem 0}
.badges-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));border:1px solid var(--b1)}
.badge-item{padding:.9rem 1.2rem;border-right:1px solid var(--b1);border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:.7rem;opacity:.22;transition:opacity .2s}
.badge-item.on{opacity:1}
.badge-num{font-family:var(--M);font-size:.62rem;font-weight:700;color:var(--ac);min-width:18px}
.badge-lbl{font-size:.78rem;color:var(--t2)}
.badge-item.on .badge-lbl{color:var(--tx)}
.ai-panel{border:1px solid var(--b1);margin-bottom:.5rem}
.ai-top{padding:1rem 1.5rem;border-bottom:1px solid var(--b1);background:var(--s1)}
.ai-top-t{font-family:var(--F);font-size:.86rem;font-weight:700}
.ai-top-t em{font-style:italic;color:var(--ac)}
.ai-body{padding:1.5rem}
.ai-note{font-size:.82rem;color:var(--t2);margin-bottom:1.2rem;line-height:1.65}
.prov-tabs{display:flex;border:1px solid var(--b1);margin-bottom:1.2rem}
.prov-tab{flex:1;padding:.6rem .4rem;text-align:center;border:none;border-right:1px solid var(--b1);background:transparent;cursor:pointer;font-family:var(--M);font-size:.57rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--t3);transition:all .14s;display:flex;flex-direction:column;align-items:center;gap:.22rem}
.prov-tab:last-child{border-right:none}
.prov-tab:hover{background:var(--s1);color:var(--t2)}
.prov-tab.on{background:var(--s2);color:var(--tx)}
.prov-free{font-size:.5rem;color:var(--ok);font-weight:700}
.prov-hint{font-family:var(--M);font-size:.66rem;color:var(--t3);margin-bottom:.75rem;line-height:1.6}
.ai-select,.ai-input{width:100%;padding:.72rem 1rem;background:var(--s1);border:1px solid var(--b1);color:var(--tx);font-family:var(--M);font-size:.76rem;outline:none;margin-bottom:.55rem;transition:border-color .14s}
.ai-select:focus,.ai-input:focus{border-color:var(--ac)}
.ai-select{cursor:pointer;-webkit-appearance:none}
.ai-select option{background:#111}
.btn-ai{padding:.7rem 1.4rem;border:1px solid var(--b2);background:transparent;color:var(--t2);font-family:var(--F);font-size:.76rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:.45rem}
.btn-ai:hover:not(:disabled){border-color:var(--ac);color:var(--ac)}
.btn-ai:disabled{opacity:.4;cursor:not-allowed}
.ai-err{margin-top:.7rem;font-family:var(--M);font-size:.7rem;color:var(--er)}
.ai-resp{margin-top:1.2rem;padding:1.2rem;background:var(--s1);border-left:2px solid var(--ac);font-size:.87rem;line-height:1.8;color:var(--t2);white-space:pre-line}
.dots span{animation:blink 1.2s infinite;opacity:0}
.dots span:nth-child(2){animation-delay:.2s}
.dots span:nth-child(3){animation-delay:.4s}
.cat-block{border:1px solid var(--b1);margin-bottom:.45rem}
.cat-hdr{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.88rem 1.2rem;border-bottom:1px solid var(--b1);background:var(--s1)}
.cat-name{font-family:var(--F);font-size:.84rem;font-weight:700}
.cat-right{display:flex;align-items:center;gap:.55rem;flex-shrink:0}
.cat-frac{font-family:var(--M);font-size:.63rem;color:var(--t3)}
.bar-t{width:58px;height:2px;background:var(--b2)}
.bar-f{height:100%}.bar-ok{background:var(--ok)}.bar-mid{background:#ffaa00}.bar-bad{background:var(--er)}
.sub-row{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.58rem 1.2rem;border-bottom:1px solid rgba(34,34,34,.55)}
.sub-row:last-child{border-bottom:none}
.sub-n{font-size:.8rem;color:var(--t3);flex:1}
.sub-badges{display:flex;gap:.28rem}
.mb{font-family:var(--M);font-size:.57rem;font-weight:700;padding:.1rem .36rem}
.mb-ok{background:var(--ok-bg);color:var(--ok)}.mb-er{background:var(--er-bg);color:var(--er)}
.rv{border:1px solid var(--b1);margin-bottom:.38rem;border-left:3px solid var(--b1);transition:border-left-color .14s}
.rv:hover{border-left-color:var(--b2)}
.rv.c{border-left-color:var(--ok)}.rv.e{border-left-color:var(--er)}
.rv-inner{padding:.88rem 1.2rem}
.rv-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.32rem}
.rv-qn{font-family:var(--M);font-size:.58rem;color:var(--t3);text-transform:uppercase;letter-spacing:.08em}
.rv-b{font-family:var(--M);font-size:.58rem;font-weight:700;padding:.1rem .38rem;text-transform:uppercase}
.rv-b.c{background:var(--ok-bg);color:var(--ok)}.rv-b.e{background:var(--er-bg);color:var(--er)}
.rv-text{font-size:.81rem;color:var(--t3);line-height:1.55;margin-bottom:.32rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.rv-ans{font-family:var(--M);font-size:.66rem;display:flex;gap:1.5rem;flex-wrap:wrap}
.rv-w{color:var(--er)}.rv-ok{color:var(--ok)}
.rv-expl{font-size:.8rem;color:var(--t2);line-height:1.7;margin-top:.6rem;padding-top:.6rem;border-top:1px solid var(--b1)}
.btn-restart{width:100%;padding:.95rem;border:1px solid var(--b2);background:transparent;color:var(--t2);font-family:var(--F);font-size:.82rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;transition:all .15s;margin-top:2rem}
.btn-restart:hover{border-color:var(--tx);color:var(--tx)}
.mindmap-loading{font-family:var(--M);font-size:.72rem;color:var(--t3);display:flex;align-items:center;gap:.4rem}

/* ── MIND MAP ── */
.mm-outer{border:1px solid var(--b1);background:var(--s1);padding:2rem 1.5rem;overflow-x:auto}
.mm-root-row{display:flex;justify-content:center;margin-bottom:0}
.mm-root{display:inline-flex;flex-direction:column;align-items:center;gap:.3rem;padding:.85rem 1.75rem;border:1px solid var(--ac);background:rgba(200,240,0,.06);text-align:center}
.mm-root-label{font-family:var(--F);font-size:.88rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--ac)}
.mm-root-count{font-family:var(--M);font-size:.6rem;color:var(--t3)}
.mm-vline-center{width:1px;height:20px;background:var(--b2);margin:0 auto}
.mm-hline-topics{height:1px;background:var(--b2);margin:0 auto}
.mm-topics-row{display:flex;justify-content:center;gap:0;align-items:flex-start}
.mm-topic-col{display:flex;flex-direction:column;align-items:center;flex:1;min-width:160px;max-width:280px;padding:0 .75rem}
.mm-vline-short{width:1px;height:16px;background:var(--b2);margin:0 auto}
.mm-topic-node{display:flex;flex-direction:column;align-items:center;gap:.25rem;padding:.65rem 1rem;border:1px solid var(--b2);background:var(--s2);width:100%;text-align:center}
.mm-topic-label{font-family:var(--F);font-size:.8rem;font-weight:700;color:var(--tx)}
.mm-topic-count{font-family:var(--M);font-size:.58rem;color:var(--t3)}
.mm-subs-col{display:flex;flex-direction:column;gap:.35rem;width:100%}
.mm-sub-wrap{display:flex;flex-direction:column}
.mm-sub-node{width:100%;padding:.6rem .9rem;border:1px solid var(--b1);background:transparent;color:var(--t2);cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:.2rem;transition:all .15s}
.mm-sub-node:hover{background:var(--s2);border-color:var(--b2);color:var(--tx)}
.mm-sub-node.mm-open{border-color:var(--ac);background:rgba(200,240,0,.04)}
.mm-sev-low{border-left:2px solid rgba(255,170,0,.5)}
.mm-sev-mid{border-left:2px solid rgba(255,100,0,.6)}
.mm-sev-high{border-left:2px solid var(--er)}
.mm-sub-label{font-family:var(--B);font-size:.8rem;color:inherit}
.mm-sub-meta{font-family:var(--M);font-size:.58rem;color:var(--t3)}
.mm-sub-node.mm-open .mm-sub-meta{color:var(--ac)}

/* Detail panel */
.mm-detail{border:1px solid var(--b1);border-top:none;background:var(--bg);display:flex;flex-direction:column;gap:0}
.mm-detail-q{padding:1rem 1rem;border-bottom:1px solid var(--b1)}
.mm-detail-q:last-child{border-bottom:none}
.mm-detail-num{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--t3);margin-bottom:.4rem}
.mm-detail-enunciado{font-size:.82rem;color:var(--t2);line-height:1.6;margin-bottom:.6rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.mm-detail-ans{font-family:var(--M);font-size:.65rem;display:flex;flex-direction:column;gap:.2rem;margin-bottom:.7rem}
.mm-wrong-ans{color:var(--er)}.mm-right-ans{color:var(--ok)}
.mm-detail-expl{font-size:.82rem;color:var(--t2);line-height:1.7;padding:.75rem;background:var(--s1);border-left:2px solid var(--ac)}

/* ── SINTAXE ── */
.sint-screen{min-height:100vh;display:flex;flex-direction:column}
.sint-header{display:flex;align-items:center;justify-content:space-between;padding:1.4rem 2.5rem;border-bottom:1px solid var(--b1)}
.sint-back{font-family:var(--M);font-size:.7rem;color:var(--t2);background:none;border:none;cursor:pointer;letter-spacing:.06em}
.sint-back:hover{color:var(--tx)}
.sint-title{font-family:var(--F);font-size:.85rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.sint-prog{font-family:var(--M);font-size:.68rem;color:var(--t3)}
.sint-body{flex:1;max-width:720px;margin:0 auto;padding:3rem 2rem;width:100%}
.sint-ex-nav{display:flex;align-items:center;gap:1rem;margin-bottom:2rem}
.sint-nav-btn{font-family:var(--M);font-size:1.1rem;background:none;border:1px solid var(--b2);color:var(--t2);width:32px;height:32px;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.sint-nav-btn:hover{border-color:var(--b1);color:var(--tx)}
.sint-ex-num{font-family:var(--M);font-size:.65rem;color:var(--t3);letter-spacing:.1em;text-transform:uppercase}
.sint-instrucao{font-size:1rem;color:var(--t2);margin-bottom:1rem;line-height:1.5}
.sint-instrucao em{font-style:italic;color:var(--ac)}
.sint-frase{font-family:var(--M);font-size:1rem;color:var(--tx);margin-bottom:2.5rem;padding:1rem 1.25rem;border:1px solid var(--b1);border-radius:6px;background:var(--s1);line-height:1.6}
.sint-section-label{font-family:var(--M);font-size:.6rem;color:var(--t3);letter-spacing:.15em;text-transform:uppercase;margin-bottom:.75rem}
.sint-pool{margin-bottom:1.5rem;min-height:56px}
.sint-blocos{display:flex;flex-wrap:wrap;gap:.6rem}
.sint-bloco{font-family:var(--M);font-size:.85rem;color:var(--tx);background:var(--s2);border:1px solid var(--b2);padding:.5rem 1rem;border-radius:6px;cursor:grab;user-select:none;transition:border-color .15s,transform .1s}
.sint-bloco:hover{border-color:var(--ac);transform:translateY(-2px)}
.sint-bloco:active{cursor:grabbing}
.sint-pool-empty{font-family:var(--M);font-size:.65rem;color:var(--t3)}
.sint-zona{min-height:130px;border:2px dashed var(--b2);border-radius:10px;padding:1.5rem;display:flex;align-items:center;justify-content:center;transition:border-color .2s,background .2s;margin-bottom:1.5rem}
.sint-zona.zona-ok{border-color:var(--ok);background:var(--ok-bg)}
.sint-zona.zona-err{border-color:var(--er);background:var(--er-bg)}
.sint-zona-vazia{font-family:var(--M);font-size:.68rem;color:var(--t3);letter-spacing:.08em}
.sint-zona-inner{display:flex;flex-direction:column;align-items:center;gap:.75rem;width:100%}
.sint-bloco-zona{font-family:var(--M);font-size:1rem;color:var(--tx);padding:.6rem 1.4rem;border:2px solid;border-radius:8px;background:var(--s1);cursor:pointer;user-select:none}
.sint-bloco-zona:hover{opacity:.85}
.sint-funcao{font-family:var(--F);font-weight:700;font-size:1.25rem;text-transform:uppercase;letter-spacing:.04em;text-align:center}
.sint-badge-ok{font-family:var(--M);font-size:.7rem;font-weight:400;color:var(--ok);border:1px solid var(--ok-b);padding:.15rem .5rem;border-radius:4px;margin-left:.5rem;vertical-align:middle}
.sint-dica{font-size:.82rem;color:var(--t2);text-align:center}
.sint-exp-btn{font-family:var(--M);font-size:.7rem;color:var(--ac);background:none;border:1px solid rgba(200,240,0,.3);padding:.4rem .9rem;border-radius:4px;cursor:pointer;letter-spacing:.08em}
.sint-exp-btn:hover{background:rgba(200,240,0,.07)}
.sint-explicacao{font-size:.86rem;line-height:1.65;color:var(--t2);text-align:left;max-width:520px;padding:1rem 1.25rem;background:var(--s1);border:1px solid var(--b1);border-radius:8px;border-left:2px solid var(--ac)}
.sint-actions{display:flex;gap:.75rem}
.sint-btn-pri{font-family:var(--M);font-size:.72rem;background:var(--ac);border:none;color:#000;padding:.6rem 1.4rem;border-radius:5px;cursor:pointer;letter-spacing:.06em;font-weight:700}
.sint-btn-pri:hover{opacity:.9}
.sint-link{font-family:var(--M);font-size:.65rem;color:var(--t3);background:none;border:none;cursor:pointer;letter-spacing:.08em;text-decoration:underline}
.sint-link:hover{color:var(--t2)}
.sint-tabs{display:flex;border-bottom:1px solid var(--b1);overflow-x:auto;scrollbar-width:none}
.sint-tabs::-webkit-scrollbar{display:none}
.sint-tab{font-family:var(--M);font-size:.6rem;padding:.85rem 1.25rem;background:none;border:none;cursor:pointer;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .15s;white-space:nowrap}
.sint-tab.active{color:var(--ac);border-bottom-color:var(--ac)}
.sint-tab:hover:not(.active){color:var(--t2)}
.def-opt{width:100%;text-align:left;background:var(--ca);border:2px solid transparent;border-radius:.75rem;padding:.75rem 1rem;font-family:var(--S);font-size:.85rem;color:var(--tx);cursor:pointer;transition:border-color .15s,background .15s;line-height:1.45}
.def-opt:hover:not(:disabled){border-color:var(--ac)}
.def-opt-ok{border-color:#4ade80!important;background:rgba(74,222,128,.08)!important}
.def-opt-err{border-color:var(--er)!important;background:rgba(239,68,68,.08)!important}
.def-opt-dim{opacity:.4}
.sint-slots{display:flex;flex-wrap:wrap;gap:.6rem;margin-bottom:1.5rem}
.sint-slot{flex:1;min-width:110px;border:2px dashed;border-radius:8px;padding:.75rem .6rem;display:flex;flex-direction:column;align-items:center;gap:.5rem;min-height:76px;transition:border-color .2s,background .2s;cursor:default}
.sint-slot.slot-ok{border-style:solid;background:var(--ok-bg)}
.sint-slot.slot-err{border-style:solid;background:var(--er-bg)}
.sint-slot-label{font-family:var(--M);font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;text-align:center;line-height:1.3}
.sint-slot-content{font-family:var(--M);font-size:.8rem;color:var(--tx);text-align:center;cursor:pointer;line-height:1.3}
.sint-slot-content:hover{opacity:.75}
.sint-slot-empty{font-family:var(--M);font-size:.6rem;color:var(--b2);letter-spacing:.05em}
.sint-result{padding:1.25rem 1.5rem;border:1px solid var(--ok-b);background:var(--ok-bg);border-radius:8px;margin-bottom:1.25rem}
.sint-result-label{font-family:var(--M);font-size:.58rem;color:var(--ok);letter-spacing:.12em;text-transform:uppercase;margin-bottom:.5rem}
.sint-result-frase{font-family:var(--M);font-size:1rem;color:var(--tx);line-height:1.6}
.sint-nivel-row{display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem}
.sint-nivel-btn{font-family:var(--M);font-size:.6rem;font-weight:700;letter-spacing:.12em;padding:.3rem .85rem;border-radius:4px;border:1px solid var(--b2);background:transparent;cursor:pointer;color:var(--t3);transition:all .15s}
.sint-nivel-btn:hover{color:var(--t2)}
.sint-nivel-btn.active-easy{background:rgba(200,240,0,.12);border-color:var(--ok);color:var(--ok)}
.sint-nivel-btn.active-hard{background:rgba(255,69,69,.12);border-color:var(--er);color:var(--er)}
.sint-nivel-btn.active-expert{background:rgba(251,191,36,.12);border-color:#fbbf24;color:#fbbf24}
.sint-nivel-hint{font-family:var(--M);font-size:.58rem;color:var(--t3);opacity:.8}
.sint-multi-hint{font-family:var(--M);font-size:.65rem;color:var(--t3);margin-bottom:.5rem;letter-spacing:.04em}
.bloco-sel{background:rgba(200,240,0,.12)!important;border-color:var(--ok)!important;color:var(--ok)!important}
.bloco-ok{background:var(--ok-bg)!important;border-color:var(--ok)!important;color:var(--ok)!important}
.bloco-err{background:var(--er-bg)!important;border-color:var(--er)!important;color:var(--er)!important}
.bloco-perdido{border-color:#fbbf2488!important;color:#fbbf24!important;border-style:dashed!important}
.sint-gerar{padding:1.5rem;display:flex;flex-direction:column;gap:1.25rem;max-width:700px;margin:0 auto}
.sint-gerar-section{display:flex;flex-direction:column;gap:.5rem}
.sint-gerar-label{font-family:var(--M);font-size:.6rem;text-transform:uppercase;letter-spacing:.14em;color:var(--t3)}
.sint-gerar-row{display:flex;gap:1rem;flex-wrap:wrap}
.sint-provider-tabs{display:flex;gap:.4rem;flex-wrap:wrap}
.sint-provider-tab{font-family:var(--M);font-size:.65rem;padding:.4rem .9rem;background:var(--s1);border:1px solid var(--b2);border-radius:5px;cursor:pointer;color:var(--t2);letter-spacing:.06em;transition:all .15s;display:flex;align-items:center;gap:.4rem}
.sint-provider-tab.active{background:rgba(200,240,0,.1);border-color:var(--ac);color:var(--ac)}
.sint-provider-tab:hover:not(.active){border-color:var(--b2);color:var(--tx)}
.sint-tag{font-size:.5rem;background:var(--b2);padding:.1rem .35rem;border-radius:3px;color:var(--t3)}
.sint-gerar-input,.sint-gerar-select{background:var(--s1);border:1px solid var(--b2);border-radius:5px;padding:.55rem .9rem;font-family:var(--M);font-size:.8rem;color:var(--tx);outline:none;width:100%;transition:border-color .15s}
.sint-gerar-input:focus,.sint-gerar-select:focus{border-color:var(--ac)}
.sint-gerar-select{cursor:pointer;-webkit-appearance:none}
.sint-gerar-select option{background:#111}
.sint-gerar-hint{font-family:var(--M);font-size:.58rem;color:var(--t3);letter-spacing:.04em}
.sint-tipo-tabs{display:flex;gap:0;border:1px solid var(--b2);width:fit-content;border-radius:5px;overflow:hidden}
.sint-tipo-tab{font-family:var(--M);font-size:.65rem;padding:.4rem 1rem;background:transparent;border:none;cursor:pointer;color:var(--t3);letter-spacing:.08em;text-transform:uppercase;transition:all .15s;border-right:1px solid var(--b2)}
.sint-tipo-tab:last-child{border-right:none}
.sint-tipo-tab.active{background:var(--ac);color:#000;font-weight:700}
.sint-tipo-tab:hover:not(.active){color:var(--t2)}
.sint-gerar-btn{font-family:var(--M);font-size:.75rem;background:var(--ac);border:none;color:#000;padding:.75rem 1.5rem;border-radius:5px;cursor:pointer;font-weight:700;letter-spacing:.08em;transition:opacity .15s;align-self:flex-start}
.sint-gerar-btn:hover:not(:disabled){opacity:.85}
.sint-gerar-btn:disabled{opacity:.4;cursor:not-allowed}
.sint-gerar-erro{font-family:var(--M);font-size:.75rem;color:var(--er);padding:.75rem 1rem;background:var(--er-bg);border:1px solid var(--er-b);border-radius:5px}
.sint-gerar-preview{border:1px solid var(--b2);border-radius:8px;padding:1.25rem;background:var(--s1);display:flex;flex-direction:column;gap:.75rem}
.sint-gerar-preview-label{font-family:var(--M);font-size:.58rem;text-transform:uppercase;letter-spacing:.14em;color:var(--t3)}
.sint-gerar-preview-frase{font-family:var(--M);font-size:.88rem;color:var(--tx);line-height:1.6}
.sint-gerar-preview-exp{font-family:var(--B);font-size:.82rem;color:var(--t2);line-height:1.65;border-left:2px solid var(--b2);padding-left:.75rem}
.sint-gerar-add{font-family:var(--M);font-size:.7rem;background:rgba(200,240,0,.1);border:1px solid rgba(200,240,0,.3);color:var(--ac);padding:.5rem 1.1rem;border-radius:5px;cursor:pointer;letter-spacing:.06em;align-self:flex-start;transition:all .15s}
.sint-gerar-add:hover{background:rgba(200,240,0,.18)}

/* ── EXPERT MODE ── */
.sint-tab-badge{font-family:var(--M);font-size:.48rem;background:var(--ac);color:#000;padding:.1rem .3rem;border-radius:3px;font-weight:700;vertical-align:middle;margin-left:.3rem}
.expert-dica-row{display:flex;flex-direction:column;gap:.6rem;margin-bottom:.75rem}
.expert-dicas-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.6rem}
.expert-dica-card{background:var(--s1);border:1px solid var(--b2);border-radius:6px;padding:.7rem .9rem;display:flex;flex-direction:column;gap:.35rem}
.expert-dica-funcao{font-family:var(--M);font-size:.6rem;text-transform:uppercase;letter-spacing:.12em;font-weight:700}
.expert-dica-texto{font-family:var(--B);font-size:.78rem;color:var(--t2);line-height:1.65}
.expert-bloco{background:var(--s2);border:1px solid var(--b2);border-radius:7px;padding:.5rem .85rem;cursor:grab;transition:border-color .15s,background .15s;user-select:none;min-width:80px;display:flex;align-items:center;justify-content:center}
.expert-bloco:hover{border-color:var(--b2);background:var(--b1)}
.expert-bloco:active{cursor:grabbing}
.expert-texto{font-family:var(--M);font-size:.82rem;color:var(--tx);line-height:1.3;text-align:center}
.expert-slot{min-height:76px;min-width:120px}
.expert-slot-inner{cursor:pointer;text-align:center;align-items:center;display:flex;justify-content:center}
.expert-slot-inner:hover{opacity:.75}
.expert-slot-inner span{font-family:var(--M);font-size:.8rem;color:var(--tx)}
`;

function WelcomeScreen({ onStart, onPortugues, savedUser }) {
  const [name,      setName]      = useState(savedUser?.name      || "");
  const [concurso,  setConcurso]  = useState(savedUser?.concurso  || "");
  const [periodo,   setPeriodo]   = useState(savedUser?.meta?.periodo  || "diaria");
  const [quantidade,setQuantidade]= useState(savedUser?.meta?.quantidade || "10");
  const time = useClock();

  const metaLabel = { diaria: "por dia", semanal: "por semana", mensal: "por mês" };

  const handleStart = () => {
    if (!name.trim() || !concurso) return;
    onStart({ name, concurso, meta: { periodo, quantidade: Number(quantidade) } });
  };

  return (
    <div className="screen welcome">
      <div className="grid-bg" />
      <div className="w-top">
        <div className="w-brand">Concurseiro<b>.</b></div>
        <div className="w-time">{time}</div>
      </div>
      <div className="w-hero">
        <div className="w-eyebrow">Plataforma de simulados</div>
        <h1 className="w-h1">Estude<br />com <em>eficiência.</em></h1>
      </div>

      <div className="w-form">
        {/* Nome */}
        <div className="w-field">
          <span className="w-flabel">Seu nome</span>
          <input className="w-input" type="text" placeholder="Como chamamos você?"
            value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleStart()} />
        </div>

        {/* Concurso */}
        <div className="w-field">
          <span className="w-flabel">Concurso alvo</span>
          <select className="w-select" value={concurso} onChange={e => setConcurso(e.target.value)}>
            <option value="">Selecione...</option>
            {CONCURSOS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Meta */}
        <div className="w-field w-field-meta">
          <span className="w-flabel">Meta de questões</span>
          <div className="w-meta-row">
            <input
              className="w-input w-meta-num"
              type="number" min="1" max="999"
              value={quantidade}
              onChange={e => setQuantidade(e.target.value)}
            />
            <span className="w-meta-sep">{metaLabel[periodo]}</span>
          </div>
          <div className="w-periodo-tabs">
            {["diaria","semanal","mensal"].map(p => (
              <button
                key={p}
                className={`w-periodo-tab ${periodo === p ? "w-periodo-on" : ""}`}
                onClick={() => setPeriodo(p)}
              >{p}</button>
            ))}
          </div>
        </div>

        <button className="w-btn" onClick={handleStart} disabled={!name.trim() || !concurso}>
          Começar →
        </button>
      </div>

      <div className="w-bottom">
        <div className="w-tagline">
          <span>Questões geradas por IA</span>
          <span>Análise personalizada</span>
          <span>Multi-provedor</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <button className="sint-link" onClick={onPortugues}>Português →</button>
          <span style={{fontFamily:"var(--M)",fontSize:".6rem",color:"var(--t3)",letterSpacing:".08em"}}>feito por Gustavo C L</span>
        </div>
      </div>
    </div>
  );
}

function HowToScreen({ onNext, onBack, user }) {
  const [copied,     setCopied]     = useState(false);
  const [numero,     setNumero]     = useState("10");
  const [banca,      setBanca]      = useState("CESPE/CEBRASPE");
  const [disciplina, setDisciplina] = useState("Língua Portuguesa");
  const [tema,       setTema]       = useState("");
  const [numCustom,  setNumCustom]  = useState("");

  const concurso = user?.concurso || "[CARGO/ÓRGÃO]";
  const qtd      = numero === "outro" ? (numCustom || "[NÚMERO]") : numero;

  const generatedPrompt = buildGeneratePrompt(banca, disciplina, qtd, concurso, tema);

  const copyText = (text) => {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); })
        .catch(fallback);
    } else { fallback(); }
  };

  const steps = [
    { t: "Configure o prompt",    d: "Preencha os campos abaixo: número de questões, banca e disciplina. O prompt é gerado automaticamente." },
    { t: "Copie e cole na IA",    d: "Clique em Copiar e cole em qualquer IA (Groq, ChatGPT, Gemini, Claude). Ela retorna o JSON pronto." },
    { t: "Carregue o simulado",   d: "Se a IA gerar um arquivo, faça upload. Se não, copie o texto retornado e cole no campo da tela seguinte." },
    { t: "Responda as questões",  d: "Para Certo/Errado tecle C ou E. Para múltipla escolha tecle A, B, C, D ou E. Após responder, tecle Enter ou Espaço para avançar. Você consegue fazer o simulado inteiro sem usar o mouse." },
    { t: "Análise por IA",        d: "A IA identifica seus pontos fracos e gera um plano de estudo personalizado com base nos seus erros." },
  ];

  return (
    <div className="screen howto">
      <div className="grid-bg" />
      <div className="ht-top">
        <h1 className="ht-h1">Gerar <em>simulado</em></h1>
        <p className="ht-sub">Configure abaixo e copie o prompt pronto para qualquer IA.</p>
      </div>

      {/* STEPS */}
      <div className="steps">
        {steps.map((s, i) => (
          <div key={i} className="step" style={{ animationDelay: `${i * .06}s` }}>
            <div className="step-n">{String(i+1).padStart(2,"0")}</div>
            <div className="step-t">{s.t}</div>
            <div className="step-d">{s.d}</div>
          </div>
        ))}
      </div>

      {/* PROMPT BUILDER */}
      <div className="prompt-wrap">
        <div className="prompt-bar">
          <span className="prompt-bar-t">Configure o <em>prompt</em></span>
        </div>

        {/* FIELDS GRID */}
        <div className="pb-fields">

          {/* Concurso — readonly, já preenchido */}
          <div className="pb-field">
            <label className="pb-label">Concurso <span className="pb-auto">preenchido automaticamente</span></label>
            <div className="pb-readonly">{concurso}</div>
          </div>

          {/* Banca */}
          <div className="pb-field">
            <label className="pb-label">Banca</label>
            <select className="pb-select" value={banca} onChange={e => setBanca(e.target.value)}>
              {BANCAS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Disciplina */}
          <div className="pb-field">
            <label className="pb-label">Disciplina</label>
            <select className="pb-select" value={disciplina} onChange={e => setDisciplina(e.target.value)}>
              {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Tema livre */}
          <div className="pb-field">
            <label className="pb-label">Tema <span className="pb-auto">opcional</span></label>
            <input
              className="pb-select"
              type="text"
              placeholder="Ex: Sintaxe, Morfologia, Juros simples..."
              value={tema}
              onChange={e => setTema(e.target.value)}
              style={{background:"var(--s2)",border:"1px solid var(--b2)",color:"var(--tx)",padding:".5rem .75rem",outline:"none",width:"100%",fontFamily:"var(--B)",fontSize:".9rem"}}
            />
          </div>

          {/* Número de questões */}
          <div className="pb-field">
            <label className="pb-label">Número de questões</label>
            <div className="pb-num-row">
              {NUMEROS.map(n => (
                <button
                  key={n}
                  className={`pb-num-btn ${numero === n ? "pb-num-on" : ""}`}
                  onClick={() => { setNumero(n); setNumCustom(""); }}
                >{n}</button>
              ))}
              <button
                className={`pb-num-btn ${numero === "outro" ? "pb-num-on" : ""}`}
                onClick={() => setNumero("outro")}
              >outro</button>
            </div>
            {numero === "outro" && (
              <input
                className="pb-custom-num"
                type="number" min="1" max="100"
                placeholder="Quantidade..."
                value={numCustom}
                onChange={e => setNumCustom(e.target.value)}
                autoFocus
              />
            )}
          </div>
        </div>

        {/* PREVIEW + COPY */}
        <div className="prompt-bar" style={{ borderTop: "1px solid var(--b1)", borderBottom: "none" }}>
          <span className="prompt-bar-t">Prompt <em>gerado</em></span>
          <button className={`btn-copy ${copied ? "ok" : ""}`} onClick={() => copyText(generatedPrompt)}>
            {copied ? "✓ Copiado" : "Copiar prompt"}
          </button>
        </div>
        <div className="prompt-code">{generatedPrompt}</div>
      </div>

      {/* NOTES */}
      <div className="info-wrap">
        <div className="info-label">Notas</div>
        <div className="info-items">
          {[
            "~40% questões oficiais de provas reais, ~35% adaptadas, ~25% criadas por IA.",
            "O JSON fica com você. Crie quantos simulados quiser em qualquer IA.",
            "XP e progresso salvos automaticamente no navegador.",
            "A análise por IA funciona com Groq (gratuito), Anthropic, OpenAI ou Gemini.",
            "Atalhos: C/E para Certo·Errado, A–E para múltipla escolha, Enter para avançar.",
          ].map((t, i) => <div key={i} className="info-item">{t}</div>)}
        </div>
      </div>

      <div className="ht-nav">
        <button className="btn-ghost" onClick={onBack}>← Voltar</button>
        <button className="btn-primary" onClick={onNext}>Carregar simulado →</button>
      </div>
    </div>
  );
}


function buildGeneratePrompt(banca, disciplina, numero, concurso, tema) {
  return PROMPT_TEMPLATE
    .replace(/\[CARGO\/ÓRGÃO\]/g, concurso || "[CARGO/ÓRGÃO]")
    .replace(/\[NÚMERO\]/g, String(numero))
    .replace(/\[BANCA\]/g, banca)
    .replace(/\[DISCIPLINA\]/g, disciplina)
    .replace(/\[TEMA\]/g, tema?.trim() ? `, com foco em ${tema.trim()}` : "");
}

function DropScreen({ onLoad, onHowTo, user }) {
  const [tab,      setTab]      = useState("colar"); // colar | upload | gerar
  const [over,     setOver]     = useState(false);
  const [err,      setErr]      = useState(null);
  const [pasted,   setPasted]   = useState("");
  const [pasteErr, setPasteErr] = useState(null);

  // Generate form state
  const [banca,      setBanca]      = useState("CESPE/CEBRASPE");
  const [disciplina, setDisciplina] = useState("Língua Portuguesa");
  const [tema,       setTema]       = useState("");
  const [numero,     setNumero]     = useState(10);
  const [genPid,     setGenPid]     = useState("groq");
  const [genMid,     setGenMid]     = useState(PROVIDERS[0].models[0].id);
  const [genKey,     setGenKey]     = useState("");
  const [genLoad,    setGenLoad]    = useState(false);
  const [genErr,     setGenErr]     = useState(null);
  const [genStatus,  setGenStatus]  = useState("");

  const genProvider = PROVIDERS.find(p => p.id === genPid) || PROVIDERS[0];
  const switchGenProv = id => { setGenPid(id); setGenMid(PROVIDERS.find(p=>p.id===id).models[0].id); setGenErr(null); };

  const validate = (d, onFail) => {
    if (!d?.questoes?.length) { onFail("JSON inválido: campo 'questoes' ausente ou vazio."); return false; }
    return true;
  };

  const process = (file) => {
    const r = new FileReader();
    r.onload = e => {
      try {
        const d = JSON.parse(e.target.result);
        if (!validate(d, msg => setErr(msg))) return;
        setErr(null); onLoad(d);
      } catch { setErr("Arquivo inválido — verifique se é um JSON bem formado."); }
    };
    r.readAsText(file);
  };

  const handlePaste = () => {
    try {
      const d = JSON.parse(pasted.trim());
      if (!validate(d, msg => setPasteErr(msg))) return;
      setPasteErr(null); onLoad(d);
    } catch { setPasteErr("JSON inválido — verifique a sintaxe e tente novamente."); }
  };

  const handleGenerate = async () => {
    if (!genKey.trim()) { setGenErr("Informe a chave de API."); return; }
    setGenLoad(true); setGenErr(null);
    const steps = [
      "Conectando com a IA...",
      "Gerando questões...",
      "Processando respostas...",
      "Montando simulado...",
    ];
    let si = 0;
    setGenStatus(steps[si]);
    const interval = setInterval(() => {
      si = Math.min(si + 1, steps.length - 1);
      setGenStatus(steps[si]);
    }, 2200);

    try {
      const prompt = buildGeneratePrompt(banca, disciplina, numero, user?.concurso, tema);
      const raw = await genProvider.call(prompt, genKey.trim(), genMid, 8192);
      clearInterval(interval);

      // Strip markdown fences if present
      const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      const d = JSON.parse(clean);
      if (!validate(d, msg => { setGenErr(msg); setGenLoad(false); })) return;
      onLoad(d);
    } catch (e) {
      clearInterval(interval);
      setGenErr(`Erro: ${e.message}. Verifique a chave e tente novamente.`);
    } finally {
      setGenLoad(false);
      setGenStatus("");
    }
  };

  const TABS = [
    { id:"colar",  label:"⌘ Colar JSON" },
    { id:"upload", label:"↑ Upload" },
    { id:"gerar",  label:"✦ Gerar com IA" },
  ];

  return (
    <div className="drop-screen screen">
      <div className="grid-bg" />
      <div className="drop-card drop-card-wide">
        <h2 className="drop-h">Carregar <em>simulado</em></h2>
        <p className="drop-sub">Gere questões diretamente com IA, faça upload ou cole o JSON.</p>

        {/* TABS */}
        <div className="drop-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`drop-tab ${tab===t.id?"drop-tab-on":""}`} onClick={() => { setTab(t.id); setErr(null); setPasteErr(null); setGenErr(null); }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: GERAR COM IA */}
        {tab === "gerar" && (
          <div className="gen-form">

            {/* Row 1: banca + disciplina + número */}
            <div className="gen-row">
              <div className="gen-field">
                <span className="gen-label">Banca</span>
                <select className="gen-select" value={banca} onChange={e => setBanca(e.target.value)}>
                  {BANCAS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="gen-field">
                <span className="gen-label">Disciplina</span>
                <select className="gen-select" value={disciplina} onChange={e => setDisciplina(e.target.value)}>
                  {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="gen-field">
                <span className="gen-label">Tema <span className="gen-label-hint">— opcional</span></span>
                <input className="gen-input" type="text" placeholder="Ex: Sintaxe, Morfologia, Juros simples..." value={tema} onChange={e => setTema(e.target.value)} />
              </div>
              <div className="gen-field gen-field-sm">
                <span className="gen-label">Questões</span>
                <select className="gen-select" value={numero} onChange={e => setNumero(Number(e.target.value))}>
                  {NUMEROS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: provider */}
            <div className="gen-field" style={{marginTop:".75rem"}}>
              <span className="gen-label">Provedor de IA</span>
              <div className="prov-tabs" style={{marginTop:".35rem",marginBottom:0}}>
                {PROVIDERS.map(p => (
                  <button key={p.id} className={`prov-tab ${genPid===p.id?"on":""}`} onClick={() => switchGenProv(p.id)}>
                    {p.label}<span className="prov-free">{p.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: model + key */}
            <div className="gen-row" style={{marginTop:".75rem"}}>
              <div className="gen-field gen-field-sm">
                <span className="gen-label">Modelo</span>
                <select className="gen-select" value={genMid} onChange={e => setGenMid(e.target.value)}>
                  {genProvider.models.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
              <div className="gen-field">
                <span className="gen-label">Chave de API <span className="gen-label-hint">— {genProvider.hint}</span></span>
                <input className="gen-input" type="password" placeholder={genProvider.placeholder} value={genKey} onChange={e => setGenKey(e.target.value)} />
              </div>
            </div>

            {/* Summary */}
            <div className="gen-summary">
              Gerar <b>{numero}</b> questões de <b>{disciplina}</b> no estilo <b>{banca}</b>
              {user?.concurso ? <> para <b>{user.concurso}</b></> : ""} via <b>{genProvider.label}</b>
            </div>

            {genErr && <div className="drop-err" style={{marginTop:".5rem"}}>— {genErr}</div>}

            <button className="gen-btn" onClick={handleGenerate} disabled={genLoad || !genKey.trim()}>
              {genLoad
                ? <><span className="dots"><span>.</span><span>.</span><span>.</span></span> {genStatus}</>
                : `✦ Gerar simulado com ${genProvider.label} →`}
            </button>
          </div>
        )}

        {/* TAB: UPLOAD */}
        {tab === "upload" && (
          <>
            <label style={{display:"block",marginTop:"1rem"}}>
              <div className={`drop-zone ${over?"over":""}`}
                onDragOver={e=>{e.preventDefault();setOver(true);}}
                onDragLeave={()=>setOver(false)}
                onDrop={e=>{e.preventDefault();setOver(false);const f=e.dataTransfer.files[0];if(f)process(f);}}>
                <span className="drop-icon">↑</span>
                <div className="drop-zone-t">Arraste o JSON aqui</div>
                <div className="drop-zone-hint">ou clique para selecionar o arquivo</div>
              </div>
              <input type="file" accept=".json" style={{display:"none"}} onChange={e=>{if(e.target.files[0])process(e.target.files[0]);}} />
            </label>
            {err && <div className="drop-err">— {err}</div>}
          </>
        )}

        {/* TAB: COLAR */}
        {tab === "colar" && (
          <>
            <textarea
              className="drop-paste" style={{marginTop:"1rem"}}
              placeholder={'{\n  "metadata": { ... },\n  "questoes": [ ... ]\n}'}
              value={pasted}
              onChange={e=>{setPasted(e.target.value);setPasteErr(null);}}
              spellCheck={false}
            />
            {pasteErr && <div className="drop-err">— {pasteErr}</div>}
            <button className="drop-paste-btn" onClick={handlePaste} disabled={!pasted.trim()}>
              Carregar JSON colado →
            </button>
          </>
        )}

        <div className="drop-or">ou</div>
        <button className="drop-link" onClick={onHowTo}>Ver como funciona →</button>
      </div>
    </div>
  );
}

function TopBar({ xp, streak, acertos, erros, progress, meta, onBack }) {
  const { level, progress: xpPct, xpIn } = calcLevel(xp);
  const items = [...MARQUEE, ...MARQUEE];
  const metaLabel = { diaria: "/ dia", semanal: "/ sem", mensal: "/ mês" };
  const totalDone = acertos + erros;
  return (
    <div className="topbar">
      <div className="topbar-row">
        <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
          <div className="tb-brand">Concurseiro<b>.</b></div>
          {onBack && <button onClick={onBack} style={{fontFamily:"var(--M)",fontSize:".58rem",textTransform:"uppercase",letterSpacing:".08em",padding:".22rem .65rem",border:"1px solid var(--b2)",background:"transparent",color:"var(--t3)",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>{e.target.style.borderColor="var(--tx)";e.target.style.color="var(--tx)"}} onMouseLeave={e=>{e.target.style.borderColor="var(--b2)";e.target.style.color="var(--t3)"}}>← Voltar</button>}
        </div>
        <div className="xp-bar-wrap">
          <div className="xp-bar-meta"><span>NV {level}</span><span>{xpIn}/500</span></div>
          <div className="xp-track"><div className="xp-fill" style={{ width:`${xpPct*100}%` }} /></div>
        </div>
        {meta?.quantidade && (
          <div className="tbc tbc-meta" title={`Meta: ${meta.quantidade} questões ${metaLabel[meta.periodo]}`}>
            <span>{totalDone}</span>
            <span className="tb-meta-sep">/</span>
            <span>{meta.quantidade}</span>
            <span className="tb-meta-per">{metaLabel[meta.periodo]}</span>
          </div>
        )}
        <div className="tb-counters">
          {streak > 0 && <div className={`tbc tbc-st ${streak >= 3 ? "hot" : ""}`}>🔥 <span className="tbc-n">{streak}</span></div>}
          <div className="tbc tbc-ok">✓ <span className="tbc-n">{acertos}</span></div>
          <div className="tbc tbc-er">✗ <span className="tbc-n">{erros}</span></div>
        </div>
      </div>
      <div className="marquee-wrap">
        <div className="marquee-track">
          {items.map((item, i) => <span key={i} className="mq-item">{item} ·&nbsp;</span>)}
        </div>
      </div>
      <div className="prog-line"><div className="prog-fill" style={{ width:`${progress*100}%` }} /></div>
    </div>
  );
}

function QuizScreen({ data, user, answers, setAnswers, xp, setXp, streak, setStreak, maxStreak, setMaxStreak, onFinish, onBack }) {
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState("r");
  const [xpFs, setXpFs] = useState([]);

  const questoes = data.questoes;
  const q        = questoes[cur];
  const answered = answers[q.id];
  const acertos  = Object.keys(answers).filter(id => { const qq = questoes.find(x => x.id===id); return qq && answers[id]===qq.gabarito; }).length;
  const erros    = Object.keys(answers).length - acertos;

  const spawnXp = val => { const id = Date.now(); setXpFs(p=>[...p,{id,val,x:80+Math.random()*200,y:280+Math.random()*80}]); setTimeout(()=>setXpFs(p=>p.filter(f=>f.id!==id)),1100); };

  const handleAnswer = altId => {
    if (answered) return;
    const ok = altId === q.gabarito;
    setAnswers(p => ({ ...p, [q.id]: altId }));
    if (ok) { const g = 150 + streak*10; setXp(p=>p+g); setStreak(p=>{const ns=p+1;setMaxStreak(m=>Math.max(m,ns));return ns;}); spawnXp(`+${g} xp`); }
    else { setStreak(0); }
  };

  const handleNext = () => { if (cur+1 < questoes.length) { setDir("r"); setCur(c=>c+1); } else onFinish(); };

  useEffect(() => {
    const h = e => {
      if (answered) { if (e.key==="Enter"||e.key===" ") { e.preventDefault(); handleNext(); } return; }
      if (q.tipo==="certo_errado") { if(e.key.toLowerCase()==="c") handleAnswer("certo"); if(e.key.toLowerCase()==="e") handleAnswer("errado"); }
      else { const m={a:"a",b:"b",c:"c",d:"d",e:"e"}; if(m[e.key.toLowerCase()]) handleAnswer(m[e.key.toLowerCase()]); }
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [q, answered, cur, streak]);

  const cls = id => { if(!answered)return""; if(id===q.gabarito&&id===answered)return"ac"; if(id===answered&&id!==q.gabarito)return"aw"; if(id===q.gabarito)return"rc"; return""; };
  const nivelMap = { facil:"qtag-f", medio:"qtag-m", dificil:"qtag-d" };
  const isCE = q.tipo === "certo_errado";

  return (
    <>
      <TopBar xp={xp} streak={streak} acertos={acertos} erros={erros} progress={cur/questoes.length} meta={user?.meta} onBack={onBack} />
      <div className="quiz-wrap">
        <div className="q-meta">
          {q.fonte?.banca && <span className="qtag qtag-b">{q.fonte.banca}{q.fonte.ano ? ` · ${q.fonte.ano}` : ""}</span>}
          {q.fonte?.autenticidade === "original"  && <span className="qtag qtag-oficial">questão oficial</span>}
          {q.fonte?.autenticidade === "variacao"  && <span className="qtag qtag-var">adaptada</span>}
          {q.fonte?.autenticidade === "baseada"   && <span className="qtag">criada por IA</span>}
          {q.categoria?.topico && <span className="qtag">{q.categoria.topico}</span>}
          {q.categoria?.subtopico && <span className="qtag">{q.categoria.subtopico}</span>}
          {q.nivel && <span className={`qtag ${nivelMap[q.nivel]||""}`}>{q.nivel}</span>}
          <span className="q-pos">{cur+1} / {questoes.length}</span>
        </div>

        <div key={q.id} className={`q-card slide-${dir}`}>
          <div className="q-watermark">{String(cur+1).padStart(2,"0")}</div>
          <div className="q-type-row">
            <span className="q-type-lbl">{isCE ? "Certo ou Errado" : "Múltipla Escolha"}</span>
            <div className="q-type-line" />
          </div>
          <div className="q-text">{q.enunciado}</div>
        </div>

        {isCE ? (
          <div className="alts-ce">
            {q.alternativas.map(alt => (
              <button key={alt.id} className={`alt-ce ${cls(alt.id)}`} onClick={() => handleAnswer(alt.id)} disabled={!!answered}>{alt.texto}</button>
            ))}
          </div>
        ) : (
          <div className="alts-mc">
            {q.alternativas.map(alt => (
              <button key={alt.id} className={`alt-mc ${cls(alt.id)}`} onClick={() => handleAnswer(alt.id)} disabled={!!answered}>
                <span className="alt-letter">{alt.id}</span>{alt.texto}
              </button>
            ))}
          </div>
        )}

        {!answered && <p className="kbd-hint">{isCE ? "Atalho: C = Certo · E = Errado" : "Atalho: A · B · C · D · E"}</p>}

        {answered && (
          <div className={`expl ${answered===q.gabarito?"c":"w"}`}>
            <div className="expl-head">
              {answered===q.gabarito ? "Correto" : "Incorreto"}
              {streak>1&&answered===q.gabarito && <span style={{marginLeft:".75rem",color:"var(--ac)",fontFamily:"var(--M)",fontSize:".65rem"}}>— sequência de {streak}</span>}
            </div>
            <div className="expl-body">{q.explicacao}</div>
            {q.fonte?.nota && <div className="expl-note">{q.fonte.nota}</div>}
          </div>
        )}

        {answered && <button className="btn-next" onClick={handleNext}>{cur+1===questoes.length ? "Ver análise →" : "Próxima →"}</button>}
      </div>
      {xpFs.map(f => <div key={f.id} className="xp-float" style={{left:f.x,top:f.y}}>{f.val}</div>)}
    </>
  );
}

function MindMap({ grouped, questoes, answers }) {
  const [selected, setSelected] = useState(null); // "topico|||sub"

  // Build error map with actual wrong questions per subtópico
  const errorMap = {};
  Object.entries(grouped).forEach(([topico, subs]) => {
    Object.entries(subs).forEach(([sub, st]) => {
      if (st.e > 0) {
        if (!errorMap[topico]) errorMap[topico] = {};
        errorMap[topico][sub] = {
          count: st.e,
          questions: questoes.filter(q =>
            q.categoria?.topico === topico &&
            q.categoria?.subtopico === sub &&
            answers[q.id] !== q.gabarito
          ),
        };
      }
    });
  });

  const topics = Object.keys(errorMap);
  if (topics.length === 0) return null;

  const totalErrors = topics.reduce((sum, t) =>
    sum + Object.values(errorMap[t]).reduce((s, v) => s + v.count, 0), 0
  );

  const toggle = key => setSelected(s => s === key ? null : key);

  return (
    <>
      <div className="sec-t"><em>Mapa mental</em> · pontos a reforçar</div>
      <div className="mm-outer">

        {/* ROOT */}
        <div className="mm-root-row">
          <div className="mm-root">
            <span className="mm-root-label">Pontos a Reforçar</span>
            <span className="mm-root-count">{totalErrors} erro{totalErrors !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* CONNECTOR ROOT → TOPICS */}
        <div className="mm-vline-center" />
        <div className="mm-hline-topics" style={{ width: topics.length === 1 ? "2px" : "100%" }} />

        {/* TOPICS */}
        <div className="mm-topics-row">
          {topics.map(topico => {
            const subs     = Object.entries(errorMap[topico]);
            const topicErr = subs.reduce((s, [, v]) => s + v.count, 0);
            return (
              <div key={topico} className="mm-topic-col">
                <div className="mm-vline-short" />
                <div className="mm-topic-node">
                  <span className="mm-topic-label">{topico}</span>
                  <span className="mm-topic-count">{topicErr} erro{topicErr !== 1 ? "s" : ""}</span>
                </div>
                <div className="mm-vline-short" />

                {/* SUBTOPICS */}
                <div className="mm-subs-col">
                  {subs.map(([sub, data]) => {
                    const key      = `${topico}|||${sub}`;
                    const isOpen   = selected === key;
                    const severity = data.count >= 3 ? "high" : data.count === 2 ? "mid" : "low";
                    return (
                      <div key={sub} className="mm-sub-wrap">
                        <button
                          className={`mm-sub-node mm-sev-${severity} ${isOpen ? "mm-open" : ""}`}
                          onClick={() => toggle(key)}
                        >
                          <span className="mm-sub-label">{sub}</span>
                          <span className="mm-sub-meta">
                            {data.count} ✗ · {isOpen ? "fechar ↑" : "ver ↓"}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="mm-detail">
                            {data.questions.map((q, i) => {
                              const userAlt    = q.alternativas.find(a => a.id === answers[q.id]);
                              const correctAlt = q.alternativas.find(a => a.id === q.gabarito);
                              return (
                                <div key={q.id} className="mm-detail-q">
                                  <div className="mm-detail-num">Questão {q.numero}</div>
                                  <div className="mm-detail-enunciado">{q.enunciado}</div>
                                  <div className="mm-detail-ans">
                                    <span className="mm-wrong-ans">✗ {userAlt?.id?.toUpperCase()} — {userAlt?.texto}</span>
                                    <span className="mm-right-ans">✓ {correctAlt?.id?.toUpperCase()} — {correctAlt?.texto}</span>
                                  </div>
                                  <div className="mm-detail-expl">{q.explicacao}</div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AnalysisScreen({ data, answers, user, xp, maxStreak, onRestart }) {
  const [pid, setPid] = useState("groq");
  const [mid, setMid] = useState(PROVIDERS[0].models[0].id);
  const [key, setKey] = useState("");
  const [resp, setResp] = useState("");
  const [load, setLoad] = useState(false);
  const [aiErr, setAiErr] = useState("");

  const provider = PROVIDERS.find(p => p.id===pid) || PROVIDERS[0];
  const switchProv = id => { setPid(id); setMid(PROVIDERS.find(p=>p.id===id).models[0].id); setResp(""); setAiErr(""); };

  const questoes = data.questoes;
  const total    = questoes.length;
  const acertos  = questoes.filter(q => answers[q.id]===q.gabarito).length;
  const erros    = total - acertos;
  const pct      = Math.round((acertos/total)*100);
  const sc       = pct>=70?"sg":pct>=50?"sy":"sr";
  const { level }= calcLevel(xp);
  const earned   = getEarned({ total, totalQ:total, pct, maxStreak });

  const grouped = {};
  questoes.forEach(q => {
    const t = q.categoria?.topico||"Outros";
    const s = q.categoria?.subtopico||"Geral";
    if(!grouped[t]) grouped[t]={};
    if(!grouped[t][s]) grouped[t][s]={c:0,e:0};
    answers[q.id]===q.gabarito ? grouped[t][s].c++ : grouped[t][s].e++;
  });

  const wrongs = questoes.filter(q=>answers[q.id]!==q.gabarito).map(q=>({ ...q, userAlt:q.alternativas.find(a=>a.id===answers[q.id]), correctAlt:q.alternativas.find(a=>a.id===q.gabarito) }));

  const handleAI = async () => {
    if(!key.trim()){setAiErr("Informe a chave do provedor.");return;}
    setLoad(true);setAiErr("");setResp("");
    try{setResp(await provider.call(buildPrompt(wrongs,user),key.trim(),mid));}
    catch(e){setAiErr(`Erro: ${e.message}`);}
    finally{setLoad(false);}
  };

  const mot = MOTIVATIONAL[Math.floor(Math.random()*MOTIVATIONAL.length)];

  return (
    <>
      <TopBar xp={xp} streak={maxStreak} acertos={acertos} erros={erros} progress={1} meta={user?.meta} />
      <div className="anl-wrap screen">
        <div className="grid-bg" />
        <div className="anl-hero">
          <div className="anl-score-block">
            <div className="anl-score-eye">Aproveitamento</div>
            <div className={`anl-score-big ${sc}`}>{pct}%</div>
          </div>
          <div className="anl-right">
            <div className="anl-stats">
              <div className="anl-stat"><div className="anl-stat-n" style={{color:"var(--ok)"}}>{acertos}</div><div className="anl-stat-l">Acertos</div></div>
              <div className="anl-stat"><div className="anl-stat-n" style={{color:"var(--er)"}}>{erros}</div><div className="anl-stat-l">Erros</div></div>
              <div className="anl-stat"><div className="anl-stat-n" style={{color:"var(--ac)"}}>{maxStreak}</div><div className="anl-stat-l">Melhor seq.</div></div>
              <div className="anl-stat"><div className="anl-stat-n" style={{color:"var(--t2)"}}>{xp}</div><div className="anl-stat-l">XP total</div></div>
            </div>
            <div className="anl-meta">
              <b>{data.metadata?.titulo||"Simulado"}</b><br/>
              {user.name} · {user.concurso}<br/>Nível {level}
            </div>
          </div>
        </div>

        <div className="motivational">"{mot}"</div>

        <div className="sec-t"><em>Conquistas</em></div>
        <div className="badges-grid">
          {BADGES_DEF.map(b => (
            <div key={b.id} className={`badge-item ${earned.has(b.id)?"on":""}`}>
              <span className="badge-num">{b.n}</span>
              <span className="badge-lbl">{b.label}</span>
            </div>
          ))}
        </div>

        <div className="sec-t"><em>Análise por IA</em></div>
        <div className="ai-panel">
          <div className="ai-top"><div className="ai-top-t">Feedback <em>personalizado</em></div></div>
          <div className="ai-body">
            <p className="ai-note">Escolha o provedor, cole a chave e receba um diagnóstico dos seus erros.</p>
            <div className="prov-tabs">
              {PROVIDERS.map(p => (
                <button key={p.id} className={`prov-tab ${pid===p.id?"on":""}`} onClick={() => switchProv(p.id)}>
                  {p.label}<span className="prov-free">{p.tag}</span>
                </button>
              ))}
            </div>
            <p className="prov-hint">— {provider.hint}</p>
            <select className="ai-select" value={mid} onChange={e=>setMid(e.target.value)}>
              {provider.models.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <input className="ai-input" type="password" placeholder={provider.placeholder} value={key} onChange={e=>setKey(e.target.value)} />
            <button className="btn-ai" onClick={handleAI} disabled={load||!key}>
              {load?<><span className="dots"><span>.</span><span>.</span><span>.</span></span>&nbsp;Analisando</>:`→ Gerar análise · ${provider.label}`}
            </button>
            {aiErr && <div className="ai-err">{aiErr}</div>}
            {resp  && <div className="ai-resp">{resp}</div>}
          </div>
        </div>

        <div className="sec-t"><em>Desempenho</em> por tópico</div>
        {Object.entries(grouped).map(([topico,subs])=>{
          const tc=Object.values(subs).reduce((s,v)=>s+v.c,0);
          const te=Object.values(subs).reduce((s,v)=>s+v.e,0);
          const tp=tc+te; const p=Math.round((tc/tp)*100);
          const bc=p>=70?"bar-ok":p>=50?"bar-mid":"bar-bad";
          return(
            <div key={topico} className="cat-block">
              <div className="cat-hdr">
                <span className="cat-name">{topico}</span>
                <div className="cat-right">
                  <span className="cat-frac">{tc}/{tp}</span>
                  <div className="bar-t"><div className={`bar-f ${bc}`} style={{width:`${p}%`}}/></div>
                  <span className="cat-frac" style={{minWidth:32,textAlign:"right"}}>{p}%</span>
                </div>
              </div>
              {Object.entries(subs).map(([sub,st])=>(
                <div key={sub} className="sub-row">
                  <span className="sub-n">{sub}</span>
                  <div className="sub-badges">
                    {st.c>0&&<span className="mb mb-ok">✓ {st.c}</span>}
                    {st.e>0&&<span className="mb mb-er">✗ {st.e}</span>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <MindMap grouped={grouped} questoes={questoes} answers={answers} />

        <div className="sec-t"><em>Revisão</em> questão a questão</div>
        {questoes.map(q=>{
          const ua=answers[q.id]; const ok=ua===q.gabarito;
          const uA=q.alternativas.find(a=>a.id===ua);
          const cA=q.alternativas.find(a=>a.id===q.gabarito);
          return(
            <div key={q.id} className={`rv ${ok?"c":"e"}`}>
              <div className="rv-inner">
                <div className="rv-top">
                  <span className="rv-qn">Q{q.numero} · {q.categoria?.subtopico||q.categoria?.topico}</span>
                  <span className={`rv-b ${ok?"c":"e"}`}>{ok?"✓ Certo":"✗ Errado"}</span>
                </div>
                <div className="rv-text">{q.enunciado}</div>
                {!ok&&<div className="rv-ans"><span className="rv-w">Sua: {uA?.id?.toUpperCase()} — {uA?.texto}</span><span className="rv-ok">Gabarito: {cA?.id?.toUpperCase()} — {cA?.texto}</span></div>}
                {!ok&&q.explicacao&&<div className="rv-expl">{q.explicacao}</div>}
              </div>
            </div>
          );
        })}
        <button className="btn-restart" onClick={onRestart}>← Novo simulado</button>
      </div>
    </>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ── ORAÇÕES DATA ── */
const TODOS_TIPOS_ORACAO = [
  "Coordenada Assindética",
  "Coordenada Sindética Aditiva","Coordenada Sindética Adversativa","Coordenada Sindética Alternativa",
  "Coordenada Sindética Conclusiva","Coordenada Sindética Explicativa",
  "Subordinada Substantiva Subjetiva","Subordinada Substantiva Objetiva Direta",
  "Subordinada Substantiva Objetiva Indireta","Subordinada Substantiva Completiva Nominal",
  "Subordinada Substantiva Predicativa","Subordinada Substantiva Apositiva",
  "Subordinada Adjetiva Restritiva","Subordinada Adjetiva Explicativa",
  "Subordinada Adverbial Causal","Subordinada Adverbial Consecutiva","Subordinada Adverbial Concessiva",
  "Subordinada Adverbial Condicional","Subordinada Adverbial Conformativa","Subordinada Adverbial Comparativa",
  "Subordinada Adverbial Temporal","Subordinada Adverbial Final","Subordinada Adverbial Proporcional",
];

const PERIODO_EXERCICIOS = [
  // ── COORDENADAS ──
  { id:1, categoria:"Coordenada Adversativa",
    periodo:'O candidato estudou bastante, [mas não foi aprovado na fase objetiva].',
    destaque:"mas não foi aprovado na fase objetiva", resposta:"Coordenada Sindética Adversativa",
    explicacao:'"Mas" expressa oposição ou contraste. Equivalentes: porém, contudo, entretanto, todavia, no entanto. A ideia da 2ª oração contraria ou restringe a da 1ª.' },
  { id:2, categoria:"Coordenada Aditiva",
    periodo:'A PRF fiscalizou os veículos [e apreendeu as mercadorias irregulares].',
    destaque:"e apreendeu as mercadorias irregulares", resposta:"Coordenada Sindética Aditiva",
    explicacao:'"E" acrescenta uma ideia à outra. Equivalentes: nem (aditiva negativa), não só...mas também, tanto...quanto.' },
  { id:3, categoria:"Coordenada Conclusiva",
    periodo:'Dedicou-se muito ao estudo, [portanto merece ser aprovado].',
    destaque:"portanto merece ser aprovado", resposta:"Coordenada Sindética Conclusiva",
    explicacao:'"Portanto" conclui ou resume o raciocínio anterior. Equivalentes: logo, assim, então, pois (posposto ao verbo), por conseguinte, de modo que.' },
  { id:4, categoria:"Coordenada Explicativa",
    periodo:'Revise o conteúdo, [pois a prova está próxima].',
    destaque:"pois a prova está próxima", resposta:"Coordenada Sindética Explicativa",
    explicacao:'"Pois" antes do verbo é explicativo — justifica a oração anterior. Equivalentes: porque, que (explicativo). Cuidado: "pois" após o verbo = conclusivo.' },
  { id:5, categoria:"Coordenada Alternativa",
    periodo:'O servidor ou cumpre as normas [ou será demitido do cargo].',
    destaque:"ou será demitido do cargo", resposta:"Coordenada Sindética Alternativa",
    explicacao:'"Ou...ou" expressa alternância, exclusão ou equivalência entre opções. Equivalentes: ora...ora, quer...quer, já...já.' },
  { id:6, categoria:"Coordenada Assindética",
    periodo:'O agente chegou, [cumprimentou os colegas], retomou o trabalho.',
    destaque:"cumprimentou os colegas", resposta:"Coordenada Assindética",
    explicacao:'Sem conjunção — as orações se ligam apenas por vírgula ou ponto e vírgula. A ausência da conjunção é a marca definidora da assindética.' },
  // ── SUBORDINADAS SUBSTANTIVAS ──
  { id:7, categoria:"Subst. Subjetiva",
    periodo:'É necessário [que todos os candidatos apresentem os documentos].',
    destaque:"que todos os candidatos apresentem os documentos", resposta:"Subordinada Substantiva Subjetiva",
    explicacao:'Exerce função de SUJEITO da principal. O verbo impessoal "é necessário" não tem sujeito explícito — a oração subordinada é o sujeito. Verbos como convir, importar, ser preciso costumam introduzir subjetivas.' },
  { id:8, categoria:"Subst. Objetiva Direta",
    periodo:'O perito confirmou [que o documento era falso].',
    destaque:"que o documento era falso", resposta:"Subordinada Substantiva Objetiva Direta",
    explicacao:'Exerce função de OBJETO DIRETO. "Confirmou o quê?" → a oração subordinada. Sem preposição antes da conjunção integrante "que". Pode ser substituída por "isso".' },
  { id:9, categoria:"Subst. Objetiva Indireta",
    periodo:'O inspetor necessita [de que os relatórios sejam enviados hoje].',
    destaque:"de que os relatórios sejam enviados hoje", resposta:"Subordinada Substantiva Objetiva Indireta",
    explicacao:'Exerce função de OBJETO INDIRETO. Sempre com preposição antes da conjunção ("de que", "a que"). "Necessitar de quê?" → da oração subordinada.' },
  { id:10, categoria:"Subst. Predicativa",
    periodo:'O objetivo da banca era [que todos fossem avaliados com rigor].',
    destaque:"que todos fossem avaliados com rigor", resposta:"Subordinada Substantiva Predicativa",
    explicacao:'Exerce função de PREDICATIVO DO SUJEITO — ocorre após verbo de ligação "ser". "O objetivo era o quê?" → a oração subordinada.' },
  { id:11, categoria:"Subst. Completiva Nominal",
    periodo:'O agente tinha certeza [de que o suspeito mentia deliberadamente].',
    destaque:"de que o suspeito mentia deliberadamente", resposta:"Subordinada Substantiva Completiva Nominal",
    explicacao:'Exerce função de COMPLEMENTO NOMINAL — completa um nome (substantivo, adjetivo ou advérbio). "Certeza de quê?" → da oração. Sempre com preposição.' },
  { id:12, categoria:"Subst. Apositiva",
    periodo:'O delegado fez um pedido: [que todos colaborassem com as investigações].',
    destaque:"que todos colaborassem com as investigações", resposta:"Subordinada Substantiva Apositiva",
    explicacao:'Exerce função de APOSTO — explica ou detalha um termo anterior. Geralmente introduzida por dois pontos. "Um pedido: o quê?" → a oração apositiva.' },
  // ── SUBORDINADAS ADJETIVAS ──
  { id:13, categoria:"Adjetiva Restritiva",
    periodo:'Os candidatos [que estudaram com dedicação] foram aprovados.',
    destaque:"que estudaram com dedicação", resposta:"Subordinada Adjetiva Restritiva",
    explicacao:'Sem vírgulas — restringe o antecedente, identificando quais indivíduos. Não pode ser removida sem mudar o sentido: "Os candidatos foram aprovados" é diferente.' },
  { id:14, categoria:"Adjetiva Explicativa",
    periodo:'O policial rodoviário, [que estava de plantão], deteve o suspeito.',
    destaque:"que estava de plantão", resposta:"Subordinada Adjetiva Explicativa",
    explicacao:'Com vírgulas — acrescenta informação acessória sobre o antecedente. Pode ser removida sem alterar o sentido essencial. Equivale a um aposto.' },
  // ── SUBORDINADAS ADVERBIAIS ──
  { id:15, categoria:"Adverbial Causal",
    periodo:'O candidato não foi aprovado [porque não estudou o suficiente].',
    destaque:"porque não estudou o suficiente", resposta:"Subordinada Adverbial Causal",
    explicacao:'"Porque" indica a causa do resultado da principal. Equivalentes: como (início), já que, uma vez que, visto que, dado que.' },
  { id:16, categoria:"Adverbial Concessiva",
    periodo:'O concurseiro passou, [embora tivesse estudado muito pouco].',
    destaque:"embora tivesse estudado muito pouco", resposta:"Subordinada Adverbial Concessiva",
    explicacao:'"Embora" introduz concessão — fato que não impediu o resultado. Sempre subjuntivo. Equivalentes: ainda que, mesmo que, apesar de que, por mais que.' },
  { id:17, categoria:"Adverbial Condicional",
    periodo:'[Se o candidato estudar regularmente], conseguirá a aprovação.',
    destaque:"Se o candidato estudar regularmente", resposta:"Subordinada Adverbial Condicional",
    explicacao:'"Se" introduz hipótese ou condição. Equivalentes: caso, desde que, contanto que, a menos que, salvo se. Uso do futuro do subjuntivo.' },
  { id:18, categoria:"Adverbial Temporal",
    periodo:'[Quando o resultado foi divulgado], os candidatos comemoraram efusivamente.',
    destaque:"Quando o resultado foi divulgado", resposta:"Subordinada Adverbial Temporal",
    explicacao:'"Quando" indica o tempo da ação principal. Equivalentes: enquanto, assim que, logo que, desde que, antes que, depois que, até que.' },
  { id:19, categoria:"Adverbial Final",
    periodo:'O fiscal estudou os manuais [para que pudesse aplicar as normas corretamente].',
    destaque:"para que pudesse aplicar as normas corretamente", resposta:"Subordinada Adverbial Final",
    explicacao:'"Para que" indica finalidade ou objetivo. Equivalente: a fim de que. Sempre usa o subjuntivo. Responde "para quê?".' },
  { id:20, categoria:"Adverbial Consecutiva",
    periodo:'O edital era tão extenso [que levamos dias para lê-lo integralmente].',
    destaque:"que levamos dias para lê-lo integralmente", resposta:"Subordinada Adverbial Consecutiva",
    explicacao:'"Tão...que" indica consequência de intensidade. A principal traz o intensificador (tão, tanto, tal, tamanho) e a subordinada traz o resultado. Equivalentes: de modo que, de forma que.' },
  { id:21, categoria:"Adverbial Conformativa",
    periodo:'O agente agiu [conforme o regulamento interno determinava].',
    destaque:"conforme o regulamento interno determinava", resposta:"Subordinada Adverbial Conformativa",
    explicacao:'"Conforme" indica conformidade ou acordo. Equivalentes: segundo, como, consoante. A oração indica o padrão ou referência seguido.' },
  { id:22, categoria:"Adverbial Comparativa",
    periodo:'O novo auditor trabalhou [como os mais experientes da equipe faziam].',
    destaque:"como os mais experientes da equipe faziam", resposta:"Subordinada Adverbial Comparativa",
    explicacao:'"Como" (modo) indica comparação. Equivalentes: quanto, tal qual, assim como. O verbo costuma aparecer elíptico (subentendido).' },
  { id:23, categoria:"Adverbial Proporcional",
    periodo:'[À medida que o candidato estudava], melhorava seu desempenho nas simulações.',
    destaque:"À medida que o candidato estudava", resposta:"Subordinada Adverbial Proporcional",
    explicacao:'"À medida que" expressa proporcionalidade — duas ações que evoluem simultaneamente. Equivalente: à proporção que. Atenção: "na medida em que" geralmente é causal.' },
];

const CONJUNCOES_DATA = [
  {palavra:"e",          tipo:"Coordenada Sindética Aditiva",       exemplo:"A PRF fiscalizou e autuou os infratores."},
  {palavra:"nem",        tipo:"Coordenada Sindética Aditiva",       exemplo:"Não estudou nem foi aprovado."},
  {palavra:"mas",        tipo:"Coordenada Sindética Adversativa",   exemplo:"Estudou muito, mas não foi aprovado."},
  {palavra:"porém",      tipo:"Coordenada Sindética Adversativa",   exemplo:"Tentou, porém não conseguiu."},
  {palavra:"contudo",    tipo:"Coordenada Sindética Adversativa",   exemplo:"Correu muito, contudo chegou tarde."},
  {palavra:"entretanto", tipo:"Coordenada Sindética Adversativa",   exemplo:"Prometeu, entretanto não cumpriu."},
  {palavra:"todavia",    tipo:"Coordenada Sindética Adversativa",   exemplo:"Estudou bastante, todavia não passou."},
  {palavra:"ou...ou",    tipo:"Coordenada Sindética Alternativa",   exemplo:"Ou estuda ou repete a prova."},
  {palavra:"ora...ora",  tipo:"Coordenada Sindética Alternativa",   exemplo:"Ora chove, ora faz sol."},
  {palavra:"portanto",   tipo:"Coordenada Sindética Conclusiva",    exemplo:"Estudou muito, portanto foi aprovado."},
  {palavra:"logo",       tipo:"Coordenada Sindética Conclusiva",    exemplo:"Penso, logo existo."},
  {palavra:"assim",      tipo:"Coordenada Sindética Conclusiva",    exemplo:"Dedicou-se, assim conquistou a vaga."},
  {palavra:"pois (antes do verbo)", tipo:"Coordenada Sindética Explicativa", exemplo:"Estude, pois a prova é amanhã."},
  {palavra:"porque (no meio da frase)", tipo:"Coordenada Sindética Explicativa", exemplo:"Fique, porque você é necessário."},
  {palavra:"embora",     tipo:"Subordinada Adverbial Concessiva",   exemplo:"Embora cansado, continuou estudando."},
  {palavra:"ainda que",  tipo:"Subordinada Adverbial Concessiva",   exemplo:"Ainda que chova, irei trabalhar."},
  {palavra:"mesmo que",  tipo:"Subordinada Adverbial Concessiva",   exemplo:"Mesmo que tente, não conseguirá."},
  {palavra:"se",         tipo:"Subordinada Adverbial Condicional",  exemplo:"Se estudar, será aprovado."},
  {palavra:"caso",       tipo:"Subordinada Adverbial Condicional",  exemplo:"Caso chova, não iremos."},
  {palavra:"contanto que",tipo:"Subordinada Adverbial Condicional", exemplo:"Pode sair, contanto que volte cedo."},
  {palavra:"porque (início da frase causal)",tipo:"Subordinada Adverbial Causal",exemplo:"Porque estudou, foi aprovado."},
  {palavra:"como (causal)",tipo:"Subordinada Adverbial Causal",     exemplo:"Como não estudou, reprovou."},
  {palavra:"já que",     tipo:"Subordinada Adverbial Causal",       exemplo:"Já que está aqui, pode ajudar."},
  {palavra:"uma vez que",tipo:"Subordinada Adverbial Causal",       exemplo:"Uma vez que chegou, começamos."},
  {palavra:"quando",     tipo:"Subordinada Adverbial Temporal",     exemplo:"Quando chegar, avise-me."},
  {palavra:"enquanto",   tipo:"Subordinada Adverbial Temporal",     exemplo:"Enquanto estuda, ouve música."},
  {palavra:"assim que",  tipo:"Subordinada Adverbial Temporal",     exemplo:"Assim que terminar, sairemos."},
  {palavra:"para que",   tipo:"Subordinada Adverbial Final",        exemplo:"Estuda para que passe no concurso."},
  {palavra:"a fim de que",tipo:"Subordinada Adverbial Final",       exemplo:"Correu a fim de que chegasse a tempo."},
  {palavra:"tão...que",  tipo:"Subordinada Adverbial Consecutiva",  exemplo:"Era tão difícil que poucos passaram."},
  {palavra:"tanto...que",tipo:"Subordinada Adverbial Consecutiva",  exemplo:"Estudou tanto que ficou exausto."},
  {palavra:"conforme",   tipo:"Subordinada Adverbial Conformativa", exemplo:"Agiu conforme o regulamento."},
  {palavra:"segundo",    tipo:"Subordinada Adverbial Conformativa", exemplo:"Fez segundo as instruções recebidas."},
  {palavra:"como (comparativa)",tipo:"Subordinada Adverbial Comparativa",exemplo:"Agiu como esperávamos."},
  {palavra:"à medida que",tipo:"Subordinada Adverbial Proporcional",exemplo:"À medida que estudava, melhorava."},
  {palavra:"que (sem vírgula)",tipo:"Subordinada Adjetiva Restritiva",exemplo:"O candidato que estudou passou."},
  {palavra:"que (com vírgula)",tipo:"Subordinada Adjetiva Explicativa",exemplo:"O candidato, que estudou, passou."},
];

const DEFINICOES_ORACOES = [
  { funcao:"Coordenada Assindética",
    descricao:"Oração coordenada sem conjunção. As orações se ligam apenas pela pontuação (vírgula ou ponto e vírgula) e têm o mesmo nível sintático.",
    dicas:["Sem conjunção", "Ligadas por vírgula ou ponto e vírgula", "Mesma autonomia sintática"] },
  { funcao:"Coordenada Sindética Aditiva",
    descricao:"Liga orações acrescentando uma ideia à outra. Conjunções: e, nem, não só...mas também, tanto...quanto.",
    dicas:["'E' é a principal conjunção", "'Nem' é aditiva negativa", "Poderia substituir por 'além disso'"] },
  { funcao:"Coordenada Sindética Adversativa",
    descricao:"Exprime oposição, contraste ou restrição entre duas orações. Conjunções: mas, porém, contudo, entretanto, todavia, no entanto.",
    dicas:["Ideia de 'apesar disso'", "'Mas' é a mais cobrada", "A 2ª oração contraria ou limita a 1ª"] },
  { funcao:"Coordenada Sindética Alternativa",
    descricao:"Exprime alternância, exclusão ou equivalência entre duas possibilidades. Conjunções: ou, ou...ou, ora...ora, quer...quer, já...já.",
    dicas:["Ideia de escolha entre opções", "'Ou' é a principal conjunção", "Pode ser inclusiva ou exclusiva"] },
  { funcao:"Coordenada Sindética Conclusiva",
    descricao:"Introduz uma conclusão tirada a partir da oração anterior. Conjunções: portanto, logo, assim, então, pois (posposto), por conseguinte.",
    dicas:["Ideia de 'por causa disso'", "'Portanto' e 'logo' são as mais cobradas", "Pode substituir por 'por isso'"] },
  { funcao:"Coordenada Sindética Explicativa",
    descricao:"Justifica ou explica o que foi dito na oração anterior. Conjunções: pois (anteposto ao verbo), porque, que, porquanto.",
    dicas:["'Pois' antes do verbo = explicativa", "'Pois' após o verbo = conclusiva", "Justifica um pedido ou afirmação"] },
  { funcao:"Subordinada Substantiva Subjetiva",
    descricao:"Exerce a função de SUJEITO da oração principal. Frequente com verbos impessoais (convir, importar, ser necessário/preciso). Introduzida por 'que' ou 'se'.",
    dicas:["Substitua por 'isso' antes do verbo", "Verbo principal costuma ser impessoal", "Pergunte 'quem?' ou 'o quê?' antes do verbo"] },
  { funcao:"Subordinada Substantiva Objetiva Direta",
    descricao:"Exerce a função de OBJETO DIRETO da oração principal. Sem preposição antes da conjunção integrante 'que'. Pode ser substituída pelo pronome 'isso'.",
    dicas:["Sem preposição antes de 'que'", "Pergunte 'o quê?' ao verbo", "Substitua por 'isso': funcionou? é OD"] },
  { funcao:"Subordinada Substantiva Objetiva Indireta",
    descricao:"Exerce a função de OBJETO INDIRETO da oração principal. Sempre com preposição antes da conjunção integrante ('de que', 'a que'). Introduzida por verbo transitivo indireto.",
    dicas:["Sempre com preposição antes de 'que'", "Verbo principal é transitivo indireto", "Pergunte 'a quem?' ou 'de quê?' ao verbo"] },
  { funcao:"Subordinada Substantiva Completiva Nominal",
    descricao:"Exerce a função de COMPLEMENTO NOMINAL — completa um substantivo, adjetivo ou advérbio que expressa sentimento ou ação. Sempre com preposição.",
    dicas:["Completa um NOME, não um verbo", "Sempre com preposição", "Ex.: certeza de que, necessidade de que"] },
  { funcao:"Subordinada Substantiva Predicativa",
    descricao:"Exerce a função de PREDICATIVO DO SUJEITO. Aparece após verbo de ligação 'ser'. O sujeito da principal geralmente é um nome vago (objetivo, desejo, meta).",
    dicas:["Após verbo de ligação 'ser'", "Sujeito é vago: objetivo, meta, desejo", "Substitua por 'isso': A meta era isso"] },
  { funcao:"Subordinada Substantiva Apositiva",
    descricao:"Exerce a função de APOSTO de um termo da oração principal. Geralmente introduzida por dois pontos. Explica ou detalha um substantivo anteriormente mencionado.",
    dicas:["Introduzida por dois pontos", "Equivale a um aposto", "Explica ou resume o termo anterior"] },
  { funcao:"Subordinada Adjetiva Restritiva",
    descricao:"Modifica e restringe o antecedente, delimitando quais elementos estão sendo referidos. Sem vírgulas. Não pode ser removida sem alterar o sentido.",
    dicas:["Sem vírgulas", "Não pode ser removida", "Restringe: indica 'quais' elementos"] },
  { funcao:"Subordinada Adjetiva Explicativa",
    descricao:"Acrescenta informação acessória sobre o antecedente, sem restringi-lo. Com vírgulas. Pode ser removida sem alterar o sentido essencial da frase.",
    dicas:["Com vírgulas", "Pode ser removida", "Explica ou comenta — não restringe"] },
  { funcao:"Subordinada Adverbial Causal",
    descricao:"Indica a causa ou motivo do fato expresso na oração principal. Conjunções: porque, como (anteposto), já que, uma vez que, visto que.",
    dicas:["Responde 'por quê?' ou 'qual a causa?'", "'Como' causal vem antes da principal", "Atenção: 'porque' pode ser explicativa (coord.)"] },
  { funcao:"Subordinada Adverbial Concessiva",
    descricao:"Exprime uma concessão — fato que poderia impedir a ação principal, mas não a impede. Conjunções: embora, ainda que, mesmo que, por mais que. Usam subjuntivo.",
    dicas:["Ideia de 'apesar de'", "Sempre com subjuntivo", "Não impediu — mas poderia ter impedido"] },
  { funcao:"Subordinada Adverbial Condicional",
    descricao:"Exprime a condição ou hipótese necessária para que o fato da principal ocorra. Conjunções: se, caso, desde que, contanto que, a menos que.",
    dicas:["Condição para o resultado", "'Se' é a principal conjunção", "Usa futuro do subjuntivo"] },
  { funcao:"Subordinada Adverbial Temporal",
    descricao:"Indica o tempo em que ocorre o fato da oração principal. Conjunções: quando, enquanto, assim que, logo que, antes que, depois que, desde que.",
    dicas:["Responde 'quando?'", "'Quando' é a mais cobrada", "Pode ser simultânea, anterior ou posterior"] },
  { funcao:"Subordinada Adverbial Final",
    descricao:"Exprime a finalidade ou objetivo da ação principal. Conjunções: para que, a fim de que. Usam sempre o subjuntivo.",
    dicas:["Responde 'para quê?'", "Sempre com subjuntivo", "'Para que' e 'a fim de que'"] },
  { funcao:"Subordinada Adverbial Consecutiva",
    descricao:"Exprime uma consequência resultado de intensidade expressa na principal. A principal traz intensificadores (tão, tanto, tal, tamanho) e a subordinada traz a consequência.",
    dicas:["Par: tão/tanto/tal...que", "A consequência fica na subordinada", "Responde 'com que resultado?'"] },
  { funcao:"Subordinada Adverbial Conformativa",
    descricao:"Indica conformidade ou acordo com uma norma ou referência. Conjunções: conforme, segundo, como, consoante.",
    dicas:["Indica o padrão ou referência seguido", "'Conforme' e 'segundo' são as principais", "Responde 'segundo o quê?'"] },
  { funcao:"Subordinada Adverbial Comparativa",
    descricao:"Estabelece uma comparação entre a ação da principal e outro elemento. Conjunções: como, quanto, tal qual, assim como. Geralmente com verbo elíptico.",
    dicas:["Verbo costuma estar oculto (elíptico)", "'Como' comparativo indica modo", "Responde 'comparado a quê?'"] },
  { funcao:"Subordinada Adverbial Proporcional",
    descricao:"Indica que duas ações evoluem simultaneamente, de forma proporcional. Conjunções: à medida que, à proporção que, quanto mais...mais.",
    dicas:["Duas ações simultâneas e proporcionais", "'À medida que' é a mais cobrada", "Atenção: 'na medida em que' pode ser causal"] },
];

function PeriodoMode() {
  const [shuffled, setShuffled] = useState(() => shuffle([...PERIODO_EXERCICIOS]));
  const [idx, setIdx]           = useState(0);
  const [opcoes, setOpcoes]     = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [acertos, setAcertos]   = useState(0);
  const [erros, setErros]       = useState(0);

  const ex = shuffled[idx % shuffled.length];

  useEffect(() => {
    const outros = TODOS_TIPOS_ORACAO.filter(t => t !== ex.resposta);
    // pick distractors from same "family" when possible, then fill with random
    const familia = ex.resposta.includes("Coord") ? TODOS_TIPOS_ORACAO.filter(t=>t.includes("Coord"))
                  : ex.resposta.includes("Subst") ? TODOS_TIPOS_ORACAO.filter(t=>t.includes("Subst"))
                  : ex.resposta.includes("Adjet") ? TODOS_TIPOS_ORACAO.filter(t=>t.includes("Adjet"))
                  : TODOS_TIPOS_ORACAO.filter(t=>t.includes("Adver"));
    const famOther = familia.filter(t => t !== ex.resposta);
    const rest     = outros.filter(t => !famOther.includes(t));
    const distr    = [...shuffle(famOther).slice(0, 2), ...shuffle(rest)].slice(0, 3);
    setOpcoes(shuffle([ex.resposta, ...distr]));
    setSelecionado(null);
  }, [idx]);

  const responder = (opt) => {
    if (selecionado) return;
    setSelecionado(opt);
    const ok = opt === ex.resposta;
    if (ok) setAcertos(a => a+1); else setErros(e => e+1);
    recordResult(ex.categoria, ok);
  };

  const proximo = () => {
    if (idx + 1 >= shuffled.length) setShuffled(shuffle([...PERIODO_EXERCICIOS]));
    setIdx(i => i+1);
  };

  const total = acertos + erros;

  // render sentence with highlighted part
  const renderPeriodo = () => {
    const txt = ex.periodo;
    const parts = txt.split(/\[|\]/);
    return (
      <span>
        {parts.map((p, i) =>
          i % 2 === 1
            ? <mark key={i} style={{background:'var(--ac)',color:'#000',borderRadius:'.25rem',padding:'0 .2rem'}}>{p}</mark>
            : <span key={i}>{p}</span>
        )}
      </span>
    );
  };

  return (
    <div className="sint-body">
      <div className="sint-ex-nav" style={{marginBottom:'.5rem'}}>
        <span className="sint-ex-num" style={{flex:1,textAlign:'left'}}>
          {total > 0 ? `${acertos}/${total} · ${Math.round(acertos/total*100)}%` : 'Classifique a oração destacada'}
        </span>
      </div>
      <div style={{background:'var(--ca)',borderRadius:'1rem',padding:'1.25rem 1.5rem',marginBottom:'1rem'}}>
        <div style={{fontFamily:'var(--M)',fontSize:'.6rem',color:'var(--ac)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.75rem'}}>
          Classifique a oração destacada
        </div>
        <div style={{fontFamily:'var(--S)',fontSize:'1rem',color:'var(--tx)',lineHeight:1.7}}>{renderPeriodo()}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'1rem'}}>
        {opcoes.map(opt => {
          let cls = "def-opt";
          if (selecionado) {
            if (opt === ex.resposta) cls = "def-opt def-opt-ok";
            else if (opt === selecionado) cls = "def-opt def-opt-err";
            else cls = "def-opt def-opt-dim";
          }
          return (
            <button key={opt} className={cls} onClick={() => responder(opt)} disabled={!!selecionado}>
              {opt}
            </button>
          );
        })}
      </div>
      {selecionado && (
        <>
          <div style={{background:'var(--ca)',borderRadius:'.75rem',padding:'.75rem 1rem',marginBottom:'1rem',fontFamily:'var(--S)',fontSize:'.85rem',color:'var(--t2)',lineHeight:1.6,borderLeft:`3px solid ${selecionado===ex.resposta?'#4ade80':'var(--er)'}`}}>
            {ex.explicacao}
          </div>
          <div className="sint-actions">
            <button className="sint-btn-pri" onClick={proximo}>Próxima →</button>
          </div>
        </>
      )}
    </div>
  );
}

function ConjuncaoMode() {
  const [shuffled, setShuffled] = useState(() => shuffle([...CONJUNCOES_DATA]));
  const [idx, setIdx]           = useState(0);
  const [opcoes, setOpcoes]     = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [acertos, setAcertos]   = useState(0);
  const [erros, setErros]       = useState(0);
  const [inverso, setInverso]   = useState(false);

  const ex = shuffled[idx % shuffled.length];

  useEffect(() => {
    const outros = CONJUNCOES_DATA.filter(c => c.tipo !== ex.tipo);
    const tipos  = [...new Set(outros.map(c => c.tipo))];
    const distr  = shuffle(tipos).slice(0, 3);
    setOpcoes(shuffle([ex.tipo, ...distr]));
    setSelecionado(null);
  }, [idx]);

  const responder = (opt) => {
    if (selecionado) return;
    setSelecionado(opt);
    const ok = opt === ex.tipo;
    if (ok) setAcertos(a => a+1); else setErros(e => e+1);
    recordResult("Conjunções", ok);
  };

  const proximo = () => {
    if (idx + 1 >= shuffled.length) setShuffled(shuffle([...CONJUNCOES_DATA]));
    setIdx(i => i+1);
  };

  const total = acertos + erros;

  return (
    <div className="sint-body">
      <div className="sint-ex-nav" style={{marginBottom:'.5rem'}}>
        <span className="sint-ex-num" style={{flex:1,textAlign:'left'}}>
          {total > 0 ? `${acertos}/${total}` : 'Classifique a conjunção'}
        </span>
        <button className="sint-exp-btn" style={{fontSize:'.65rem',padding:'.25rem .6rem'}} onClick={() => { setInverso(v=>!v); setSelecionado(null); }}>
          {inverso ? 'Palavra → tipo' : 'Tipo → palavra'}
        </button>
      </div>
      <div style={{background:'var(--ca)',borderRadius:'1rem',padding:'1.5rem',marginBottom:'1rem',textAlign:'center'}}>
        {!inverso ? (
          <>
            <div style={{fontFamily:'var(--M)',fontSize:'2rem',color:'var(--ac)',letterSpacing:'.05em',marginBottom:'.5rem'}}>{ex.palavra}</div>
            <div style={{fontFamily:'var(--S)',fontSize:'.85rem',color:'var(--t2)',fontStyle:'italic'}}>"{ex.exemplo}"</div>
          </>
        ) : (
          <>
            <div style={{fontFamily:'var(--M)',fontSize:'.6rem',color:'var(--ac)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.5rem'}}>Qual conjunção introduz esta oração?</div>
            <div style={{fontFamily:'var(--M)',fontSize:'1.1rem',color:'var(--tx)'}}>{ex.tipo}</div>
            <div style={{fontFamily:'var(--S)',fontSize:'.8rem',color:'var(--t2)',fontStyle:'italic',marginTop:'.5rem'}}>"{ex.exemplo.replace(ex.palavra,'___')}"</div>
          </>
        )}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'1rem'}}>
        {opcoes.map(opt => {
          let cls = "def-opt";
          if (selecionado) {
            if (opt === ex.tipo) cls = "def-opt def-opt-ok";
            else if (opt === selecionado) cls = "def-opt def-opt-err";
            else cls = "def-opt def-opt-dim";
          }
          return (
            <button key={opt} className={cls} onClick={() => responder(opt)} disabled={!!selecionado}>
              {inverso ? (CONJUNCOES_DATA.find(c=>c.tipo===opt)?.palavra || opt) : opt}
            </button>
          );
        })}
      </div>
      {selecionado && (
        <>
          <div style={{fontFamily:'var(--M)',fontSize:'.8rem',color:selecionado===ex.tipo?'#4ade80':'var(--er)',marginBottom:'.5rem'}}>
            {selecionado === ex.tipo ? 'Correto ✓' : `Errado — tipo correto: ${ex.tipo}`}
          </div>
          <div className="sint-actions">
            <button className="sint-btn-pri" onClick={proximo}>Próxima →</button>
          </div>
        </>
      )}
    </div>
  );
}

function DefinicaoOracoesMode() {
  const [shuffled, setShuffled] = useState(() => shuffle([...DEFINICOES_ORACOES]));
  const [idx, setIdx]           = useState(0);
  const [opcoes, setOpcoes]     = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [acertos, setAcertos]   = useState(0);
  const [erros, setErros]       = useState(0);
  const [mostrarDica, setMostrarDica] = useState(false);

  const ex = shuffled[idx % shuffled.length];

  useEffect(() => {
    const outros = DEFINICOES_ORACOES.filter(d => d.funcao !== ex.funcao);
    const distr  = shuffle(outros).slice(0, 3);
    setOpcoes(shuffle([ex, ...distr]));
    setSelecionado(null);
    setMostrarDica(false);
  }, [idx]);

  const responder = (opt) => {
    if (selecionado) return;
    setSelecionado(opt.funcao);
    const ok = opt.funcao === ex.funcao;
    if (ok) setAcertos(a=>a+1); else setErros(e=>e+1);
    recordResult("Definições Orações", ok);
  };

  const proximo = () => {
    if (idx + 1 >= shuffled.length) setShuffled(shuffle([...DEFINICOES_ORACOES]));
    setIdx(i => i+1);
  };

  const total = acertos + erros;

  return (
    <div className="sint-body">
      <div className="sint-ex-nav" style={{marginBottom:'.5rem'}}>
        <span className="sint-ex-num" style={{flex:1,textAlign:'left'}}>
          {total > 0 ? `${acertos}/${total}` : 'Qual oração se descreve?'}
        </span>
      </div>
      <div style={{background:'var(--ca)',borderRadius:'1rem',padding:'1.25rem 1.5rem',marginBottom:'1rem',minHeight:110}}>
        <div style={{fontFamily:'var(--M)',fontSize:'.6rem',color:'var(--ac)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.5rem'}}>Qual tipo de oração se descreve abaixo?</div>
        <div style={{fontFamily:'var(--S)',fontSize:'.9rem',color:'var(--tx)',lineHeight:1.55}}>{ex.descricao}</div>
        {!selecionado && (
          <button className="sint-exp-btn" style={{marginTop:'.75rem',fontSize:'.65rem'}} onClick={() => setMostrarDica(v=>!v)}>
            {mostrarDica ? 'Ocultar dica' : '💡 Dica'}
          </button>
        )}
        {mostrarDica && !selecionado && (
          <ul style={{margin:'.5rem 0 0',paddingLeft:'1.2rem',fontFamily:'var(--S)',fontSize:'.8rem',color:'var(--t2)',lineHeight:1.6}}>
            {ex.dicas.map((d,i) => <li key={i}>{d}</li>)}
          </ul>
        )}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'1rem'}}>
        {opcoes.map(opt => {
          let cls = "def-opt";
          if (selecionado) {
            if (opt.funcao === ex.funcao) cls = "def-opt def-opt-ok";
            else if (opt.funcao === selecionado) cls = "def-opt def-opt-err";
            else cls = "def-opt def-opt-dim";
          }
          return <button key={opt.funcao} className={cls} onClick={() => responder(opt)} disabled={!!selecionado}>{opt.funcao}</button>;
        })}
      </div>
      {selecionado && (
        <>
          <div style={{fontFamily:'var(--M)',fontSize:'.8rem',color:selecionado===ex.funcao?'#4ade80':'var(--er)',marginBottom:'.5rem'}}>
            {selecionado === ex.funcao ? 'Correto ✓' : `Errado — era: ${ex.funcao}`}
          </div>
          <ul style={{margin:'0 0 .75rem',paddingLeft:'1.2rem',fontFamily:'var(--S)',fontSize:'.8rem',color:'var(--t2)',lineHeight:1.6}}>
            {ex.dicas.map((d,i) => <li key={i}>{d}</li>)}
          </ul>
          <div className="sint-actions">
            <button className="sint-btn-pri" onClick={proximo}>Próxima →</button>
          </div>
        </>
      )}
    </div>
  );
}

function OracoesPanel() {
  const [modo, setModo] = useState("periodo");
  return (
    <>
      <div className="sint-tabs">
        <button className={`sint-tab${modo==="periodo"?" active":""}`}    onClick={() => setModo("periodo")}>Períodos</button>
        <button className={`sint-tab${modo==="conjuncoes"?" active":""}`} onClick={() => setModo("conjuncoes")}>Conjunções</button>
        <button className={`sint-tab${modo==="definicoes"?" active":""}`} onClick={() => setModo("definicoes")}>Definições</button>
        <button className={`sint-tab${modo==="stats"?" active":""}`}      onClick={() => setModo("stats")}>Estatísticas</button>
      </div>
      {modo === "periodo"    && <PeriodoMode />}
      {modo === "conjuncoes" && <ConjuncaoMode />}
      {modo === "definicoes" && <DefinicaoOracoesMode />}
      {modo === "stats"      && <EstatisticasMode />}
    </>
  );
}
function OracoesScreen({ onBack }) {
  return (
    <div className="sint-screen screen">
      <div className="sint-header">
        <button className="sint-back" onClick={onBack}>← Voltar</button>
        <div className="sint-title">Orações</div>
        <div style={{width:"80px"}} />
      </div>
      <OracoesPanel />
    </div>
  );
}

/* ── STATS ── */
const STATS_KEY = 'sint_stats_v2';
const loadStats = () => { try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch { return {}; } };
const recordResult = (categoria, correto) => {
  const s = loadStats();
  if (!s[categoria]) s[categoria] = { acertos: 0, tentativas: 0 };
  s[categoria].tentativas++;
  if (correto) s[categoria].acertos++;
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
};
const clearStats = () => localStorage.removeItem(STATS_KEY);

/* ── DEFINIÇÕES DAS FUNÇÕES SINTÁTICAS ── */
const DEFINICOES_FUNCOES = [
  {
    funcao: "Sujeito",
    descricao: "Ser sobre o qual o predicado declara algo. Concorda em pessoa e número com o verbo. Na voz passiva, sofre a ação verbal (sujeito paciente).",
    dicas: ["Pergunte 'quem?' ou 'o quê?' antes do verbo", "O verbo concorda com este termo", "Na voz passiva, ele sofre a ação"],
  },
  {
    funcao: "Objeto Direto",
    descricao: "Complemento de verbos transitivos diretos, sem preposição obrigatória. Responde 'o quê?' ou 'quem?' ao verbo. Pode ser substituído pelos pronomes 'o, a, os, as'.",
    dicas: ["Sem preposição obrigatória", "Pergunte 'o quê?' ao verbo", "Pode virar pronome: o/a/os/as"],
  },
  {
    funcao: "Objeto Indireto",
    descricao: "Complemento de verbos transitivos indiretos, sempre com preposição (a, de, em, com). Responde 'a quem?', 'de quê?', 'em quê?' ao verbo.",
    dicas: ["Sempre introduzido por preposição", "Exigido pelo verbo — não é acessório", "Pode virar pronome: lhe, lhes"],
  },
  {
    funcao: "Adjunto Adnominal",
    descricao: "Termo acessório que modifica ou qualifica um nome (substantivo). Pode ser adjetivo, locução adjetiva, artigo, numeral ou pronome adjetivo. Nunca é exigido pelo nome.",
    dicas: ["Modifica um substantivo", "É acessório — pode ser retirado", "Diferente do complemento nominal: não é exigido"],
  },
  {
    funcao: "Adjunto Adverbial",
    descricao: "Termo acessório que modifica o verbo, adjetivo ou advérbio, indicando circunstância: lugar, tempo, modo, causa, finalidade, concessão etc. Pode ser removido sem tornar a frase incompleta.",
    dicas: ["Indica circunstância (onde, quando, como, por quê)", "É sempre acessório — pode ser removido", "Não é exigido pelo verbo"],
  },
  {
    funcao: "Predicativo do Sujeito",
    descricao: "Atribui qualidade, estado ou identidade ao sujeito por meio de um verbo de ligação (ser, estar, ficar, parecer, tornar-se, continuar). Concorda em gênero e número com o sujeito.",
    dicas: ["Ocorre após verbo de ligação", "Concorda com o sujeito", "Diferente do adj. adnominal: depende do VL"],
  },
  {
    funcao: "Predicativo do Objeto",
    descricao: "Atribui qualidade ou estado ao objeto direto. Ocorre com verbos como considerar, julgar, eleger, nomear, declarar, achar. Na voz passiva, converte-se em predicativo do sujeito.",
    dicas: ["Vem após o objeto direto", "Concorda com o OD", "Verbos: considerar, julgar, declarar, nomear"],
  },
  {
    funcao: "Complemento Nominal",
    descricao: "Complemento obrigatório exigido por substantivos, adjetivos ou advérbios que expressam ação, sentimento ou estado. Sempre introduzido por preposição. Sem ele, o nome fica semanticamente incompleto.",
    dicas: ["Completa um NOME, não um verbo", "Sempre com preposição", "É exigido — sem ele o nome fica incompleto"],
  },
  {
    funcao: "Agente da Passiva",
    descricao: "Ser que pratica a ação na oração passiva analítica. Introduzido pela preposição 'por' (pelo/pela/pelos/pelas). Equivale ao sujeito da oração na voz ativa.",
    dicas: ["Sempre com a preposição 'por'", "Só existe na voz passiva", "Na voz ativa, vira o sujeito da oração"],
  },
  {
    funcao: "Aposto",
    descricao: "Termo que explica, resume, especifica ou desenvolve outro termo da oração. Geralmente separado por vírgulas, travessão ou parênteses. É acessório — pode ser removido sem comprometer a estrutura.",
    dicas: ["Explica ou detalha outro termo", "Geralmente entre vírgulas ou travessões", "É acessório — pode ser retirado"],
  },
];

function DefinicaoMode() {
  const [shuffled, setShuffled]     = useState(() => shuffle([...DEFINICOES_FUNCOES]));
  const [idx, setIdx]               = useState(0);
  const [opcoes, setOpcoes]         = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [acertos, setAcertos]       = useState(0);
  const [erros, setErros]           = useState(0);
  const [inverso, setInverso]       = useState(false); // false: ver def → adivinhar nome; true: ver nome → adivinhar def
  const [mostrarDica, setMostrarDica] = useState(false);

  const ex = shuffled[idx % shuffled.length];

  useEffect(() => {
    const outros = DEFINICOES_FUNCOES.filter(d => d.funcao !== ex.funcao);
    const distr  = shuffle(outros).slice(0, 3);
    setOpcoes(shuffle([ex, ...distr]));
    setSelecionado(null);
    setMostrarDica(false);
  }, [idx]);

  const responder = (opt) => {
    if (selecionado) return;
    setSelecionado(opt.funcao);
    const ok = opt.funcao === ex.funcao;
    if (ok) setAcertos(a => a + 1); else setErros(e => e + 1);
    recordResult("Definições", ok);
  };

  const proximo = () => {
    if (idx + 1 >= shuffled.length) setShuffled(shuffle([...DEFINICOES_FUNCOES]));
    setIdx(i => i + 1);
  };

  const optClass = (opt) => {
    if (!selecionado) return "def-opt";
    if (opt.funcao === ex.funcao) return "def-opt def-opt-ok";
    if (opt.funcao === selecionado) return "def-opt def-opt-err";
    return "def-opt def-opt-dim";
  };

  const total = acertos + erros;

  return (
    <div className="sint-body">
      <div className="sint-ex-nav" style={{marginBottom:'.5rem'}}>
        <span className="sint-ex-num" style={{flex:1,textAlign:'left'}}>
          {total > 0 ? `${acertos}/${total} corretas` : 'Pronto para começar'}
        </span>
        <button
          className="sint-exp-btn"
          style={{fontSize:'.65rem',padding:'.25rem .6rem'}}
          onClick={() => { setInverso(v => !v); setSelecionado(null); setMostrarDica(false); }}
        >
          {inverso ? 'Ver definição → nome' : 'Ver nome → definição'}
        </button>
      </div>

      <div style={{background:'var(--ca)',borderRadius:'1rem',padding:'1.25rem 1.5rem',marginBottom:'1rem',minHeight:120}}>
        {!inverso ? (
          <>
            <div style={{fontFamily:'var(--M)',fontSize:'.6rem',color:'var(--ac)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.5rem'}}>Qual função sintática se descreve abaixo?</div>
            <div style={{fontFamily:'var(--S)',fontSize:'.95rem',color:'var(--tx)',lineHeight:1.55}}>{ex.descricao}</div>
          </>
        ) : (
          <>
            <div style={{fontFamily:'var(--M)',fontSize:'.6rem',color:'var(--ac)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.5rem'}}>Qual descrição define corretamente esta função?</div>
            <div style={{fontFamily:'var(--M)',fontSize:'1.3rem',color:'var(--tx)',fontWeight:600}}>{ex.funcao}</div>
          </>
        )}
        {!selecionado && (
          <button className="sint-exp-btn" style={{marginTop:'.75rem',fontSize:'.65rem'}} onClick={() => setMostrarDica(v => !v)}>
            {mostrarDica ? 'Ocultar dica' : '💡 Dica'}
          </button>
        )}
        {mostrarDica && !selecionado && (
          <ul style={{margin:'.5rem 0 0',paddingLeft:'1.2rem',fontFamily:'var(--S)',fontSize:'.8rem',color:'var(--t2)',lineHeight:1.6}}>
            {ex.dicas.map((d,i) => <li key={i}>{d}</li>)}
          </ul>
        )}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'1rem'}}>
        {opcoes.map(opt => (
          <button
            key={opt.funcao}
            className={optClass(opt)}
            onClick={() => responder(opt)}
            disabled={!!selecionado}
          >
            {inverso ? opt.descricao : opt.funcao}
          </button>
        ))}
      </div>

      {selecionado && (
        <div style={{marginBottom:'1rem'}}>
          {selecionado === ex.funcao
            ? <div style={{fontFamily:'var(--M)',fontSize:'.8rem',color:'#4ade80',marginBottom:'.5rem'}}>Correto ✓</div>
            : <div style={{fontFamily:'var(--M)',fontSize:'.8rem',color:'var(--er)',marginBottom:'.5rem'}}>Errado — a resposta é <strong>{ex.funcao}</strong></div>
          }
          <ul style={{margin:0,paddingLeft:'1.2rem',fontFamily:'var(--S)',fontSize:'.8rem',color:'var(--t2)',lineHeight:1.6}}>
            {ex.dicas.map((d,i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      )}

      {selecionado && (
        <div className="sint-actions">
          <button className="sint-btn-pri" onClick={proximo}>Próxima →</button>
        </div>
      )}
    </div>
  );
}

function EstatisticasMode({ onClear }) {
  const [stats, setStats] = useState(loadStats);
  const categorias = Object.keys(stats).sort();
  const total = categorias.reduce((s,c) => s + stats[c].tentativas, 0);
  const acertosTotal = categorias.reduce((s,c) => s + stats[c].acertos, 0);

  if (categorias.length === 0) {
    return (
      <div className="sint-body" style={{textAlign:'center',paddingTop:'3rem'}}>
        <div style={{fontFamily:'var(--M)',fontSize:'1rem',color:'var(--t2)'}}>Nenhum dado ainda.</div>
        <div style={{fontFamily:'var(--S)',fontSize:'.85rem',color:'var(--t2)',marginTop:'.5rem'}}>Pratique nos outros modos para ver suas estatísticas aqui.</div>
      </div>
    );
  }

  return (
    <div className="sint-body">
      <div style={{background:'var(--ca)',borderRadius:'1rem',padding:'1rem 1.25rem',marginBottom:'1rem',display:'flex',gap:'2rem',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'var(--M)',fontSize:'1.4rem',color:'var(--ac)'}}>{total}</div>
          <div style={{fontFamily:'var(--S)',fontSize:'.7rem',color:'var(--t2)'}}>tentativas</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'var(--M)',fontSize:'1.4rem',color:'#4ade80'}}>{acertosTotal}</div>
          <div style={{fontFamily:'var(--S)',fontSize:'.7rem',color:'var(--t2)'}}>acertos</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'var(--M)',fontSize:'1.4rem',color:acertosTotal/total>=0.7?'#4ade80':'var(--er)'}}>
            {total > 0 ? Math.round(acertosTotal/total*100) : 0}%
          </div>
          <div style={{fontFamily:'var(--S)',fontSize:'.7rem',color:'var(--t2)'}}>aproveitamento</div>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'.6rem',marginBottom:'1rem'}}>
        {categorias.map(cat => {
          const s = stats[cat];
          const pct = Math.round(s.acertos / s.tentativas * 100);
          const cor = pct >= 70 ? '#4ade80' : pct >= 40 ? '#f97316' : 'var(--er)';
          return (
            <div key={cat} style={{background:'var(--ca)',borderRadius:'.75rem',padding:'.75rem 1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.4rem'}}>
                <span style={{fontFamily:'var(--M)',fontSize:'.75rem',color:'var(--tx)'}}>{cat}</span>
                <span style={{fontFamily:'var(--M)',fontSize:'.75rem',color:cor}}>{pct}% · {s.acertos}/{s.tentativas}</span>
              </div>
              <div style={{height:6,borderRadius:3,background:'var(--bg)',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${pct}%`,background:cor,borderRadius:3,transition:'width .4s'}} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sint-actions">
        <button className="sint-exp-btn" style={{color:'var(--er)'}} onClick={() => { clearStats(); setStats({}); if (onClear) onClear(); }}>
          Zerar estatísticas
        </button>
      </div>
    </div>
  );
}

function IdentificarMode({ exercicios }) {
  const [exIdx, setExIdx] = useState(0);
  const [selecionados, setSelecionados] = useState(new Set());
  const [verificado, setVerificado] = useState(false);
  const [mostrarExp, setMostrarExp] = useState(false);
  const [concluidos, setConcluidos] = useState(new Set());
  const [shuffledBlocos, setShuffledBlocos] = useState([]);
  const [targetFuncoes, setTargetFuncoes] = useState([]);

  const total = exercicios.length;
  const ex = exercicios[exIdx];

  const targetIds = ex.blocos.filter(b => targetFuncoes.includes(b.funcao)).map(b => b.id);

  useEffect(() => {
    setShuffledBlocos(shuffle(ex.blocos));
    setSelecionados(new Set());
    setVerificado(false);
    setMostrarExp(false);
    const funcoes = [...new Set(ex.blocos.map(b => b.funcao))];
    const r = Math.random();
    const n = r < 0.25 ? 1 : r < 0.6 ? 2 : 3;
    setTargetFuncoes(shuffle(funcoes).slice(0, Math.min(n, funcoes.length)));
  }, [ex.id]);

  const buildInstrucao = () => {
    if (!targetFuncoes.length) return "";
    const fmt = (f) => `<em>${f.toLowerCase()}</em>`;
    if (targetFuncoes.length === 1) return `Encontre o ${fmt(targetFuncoes[0])} na frase`;
    if (targetFuncoes.length === 2) return `Encontre o ${fmt(targetFuncoes[0])} e o ${fmt(targetFuncoes[1])} na frase`;
    return `Encontre o ${fmt(targetFuncoes[0])}, o ${fmt(targetFuncoes[1])} e o ${fmt(targetFuncoes[2])} na frase`;
  };

  const toggle = (id) => {
    setSelecionados(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setVerificado(false);
  };

  const targetSet = new Set(targetIds);
  const isAllCorrect = verificado &&
    targetIds.every(id => selecionados.has(id)) &&
    [...selecionados].every(id => targetSet.has(id));

  const verificar = () => {
    setVerificado(true);
    const ok = targetIds.every(id => selecionados.has(id)) && [...selecionados].every(id => targetSet.has(id));
    if (ok) setConcluidos(prev => new Set([...prev, ex.id]));
    recordResult(ex.categoria || "Identificar", ok);
  };

  const getBlocoClass = (b) => {
    if (!verificado) return selecionados.has(b.id) ? " bloco-sel" : "";
    if (targetSet.has(b.id) && selecionados.has(b.id)) return " bloco-ok";
    if (!targetSet.has(b.id) && selecionados.has(b.id)) return " bloco-err";
    if (targetSet.has(b.id) && !selecionados.has(b.id)) return " bloco-perdido";
    return "";
  };

  const goTo = (idx) => { setExIdx(idx); setSelecionados(new Set()); setVerificado(false); setMostrarExp(false); };

  return (
    <div className="sint-body">
      <div className="sint-ex-nav">
        <button className="sint-nav-btn" onClick={() => goTo((exIdx - 1 + total) % total)}>‹</button>
        <span className="sint-ex-num">{exIdx + 1} / {total} · {concluidos.size} acertos</span>
        <button className="sint-nav-btn" onClick={() => goTo((exIdx + 1) % total)}>›</button>
      </div>
      <div className="sint-instrucao" dangerouslySetInnerHTML={{ __html: buildInstrucao() }} />
      {targetFuncoes.length > 1 && (
        <div className="sint-multi-hint">Selecione {targetIds.length} bloco{targetIds.length > 1 ? "s" : ""} — clique para marcar/desmarcar</div>
      )}
      <div className="sint-frase">{ex.frase}</div>
      <div className="sint-section-label" style={{marginBottom:'.6rem'}}>Blocos — clique para selecionar</div>
      <div className="sint-blocos" style={{marginBottom:'1rem'}}>
        {shuffledBlocos.map(b => (
          <div key={b.id} className={`sint-bloco${getBlocoClass(b)}`} onClick={() => toggle(b.id)}>
            {b.texto}
          </div>
        ))}
      </div>

      {!isAllCorrect && (
        <div className="sint-actions">
          <button className="sint-btn-pri" onClick={verificar} disabled={selecionados.size === 0} style={selecionados.size===0?{opacity:.4,cursor:"not-allowed"}:{}}>
            Verificar
          </button>
          {verificado && !isAllCorrect && (
            <span style={{fontFamily:"var(--M)",fontSize:".7rem",color:"var(--er)"}}>
              {[...selecionados].filter(id => !targetSet.has(id)).length > 0 && "bloco indevido · "}
              {targetIds.filter(id => !selecionados.has(id)).length > 0 && "bloco faltando"}
            </span>
          )}
        </div>
      )}

      {isAllCorrect && (
        <>
          <div className="sint-result">
            <div className="sint-result-label">Correto ✓</div>
            {targetFuncoes.map(f => {
              const b = ex.blocos.find(bl => bl.funcao === f);
              return b ? (
                <div key={f} style={{display:"flex",alignItems:"center",gap:".6rem",marginTop:".5rem"}}>
                  <span style={{fontFamily:"var(--M)",fontSize:".65rem",color:b.cor,textTransform:"uppercase",letterSpacing:".1em",minWidth:130}}>{f}</span>
                  <span style={{fontFamily:"var(--M)",fontSize:".85rem",color:"var(--tx)"}}>{b.texto}</span>
                </div>
              ) : null;
            })}
            {mostrarExp && <div className="sint-explicacao" style={{marginTop:'.75rem',borderLeft:'2px solid var(--ac)',paddingLeft:'1rem'}}>{ex.explicacao}</div>}
          </div>
          <div className="sint-actions">
            {!mostrarExp && <button className="sint-exp-btn" onClick={() => setMostrarExp(true)}>Ver explicação</button>}
            <button className="sint-btn-pri" onClick={() => goTo((exIdx + 1) % total)}>Próximo →</button>
          </div>
        </>
      )}
    </div>
  );
}

function ConstruirMode({ exercicios }) {
  const [nivel, setNivel] = useState("easy");
  const [exIdx, setExIdx] = useState(0);
  const [expertIdx, setExpertIdx] = useState(0);
  const [slots, setSlots] = useState({});
  const [mostrarExp, setMostrarExp] = useState(false);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [concluidos, setConcluidos] = useState(new Set());
  const [allBlocos, setAllBlocos] = useState([]);
  const [erros, setErros] = useState(new Set());
  const [verificado, setVerificado] = useState(false);

  const isExpert = nivel === "expert";
  const activeExercicios = isExpert ? EXPERT_EXERCICIOS : exercicios;
  const activeIdx = isExpert ? expertIdx : exIdx;
  const setActiveIdx = isExpert ? setExpertIdx : setExIdx;
  const ex = activeExercicios[activeIdx];
  const total = activeExercicios.length;
  const blocosEmSlots = new Set(Object.values(slots));

  useEffect(() => {
    setSlots({}); setMostrarExp(false); setMostrarDica(false); setErros(new Set()); setVerificado(false);
    if (isExpert) {
      setAllBlocos(shuffle(ex.blocos));
    } else if (nivel === "easy") {
      setAllBlocos(shuffle(ex.blocos));
    } else {
      const others = exercicios.filter(e => e.id !== ex.id);
      const dists = shuffle(others.flatMap(e => e.blocos)).slice(0, 4).map((b, i) => ({ ...b, id: `dist_${i}_${b.id}` }));
      setAllBlocos(shuffle([...ex.blocos, ...dists]));
    }
  }, [ex.id, nivel]);

  const pool = allBlocos.filter(b => !blocosEmSlots.has(b.id));
  const getBlocoById = (id) => allBlocos.find(b => b.id === id);

  const slotOk = (slotId) => {
    const slot = ex.slots.find(s => s.id === slotId);
    const blocoId = slots[slotId];
    if (!slot || blocoId === undefined) return null;
    const bloco = getBlocoById(blocoId);
    if (bloco?.funcoes) return bloco.funcoes.includes(slot.funcao);
    return bloco?.funcao ? bloco.funcao === slot.funcao : blocoId === slot.resposta;
  };

  const tudoCorreto = ex.slots.every(s => {
    const bloco = getBlocoById(slots[s.id]);
    if (!bloco) return false;
    if (bloco.funcoes) return bloco.funcoes.includes(s.funcao);
    return bloco.funcao ? bloco.funcao === s.funcao : slots[s.id] === s.resposta;
  });

  const tudoPreenchido = ex.slots.every(s => slots[s.id] !== undefined);

  const placeInSlot = (slotId, blocoId) => {
    setSlots(prev => { const n={...prev}; for(const s in n){if(n[s]===blocoId)delete n[s];} n[slotId]=blocoId; return n; });
    if (isExpert) { setErros(new Set()); setVerificado(false); }
  };
  const removeFromSlot = (slotId) => {
    setSlots(prev => { const n={...prev}; delete n[slotId]; return n; });
    if (isExpert) { setErros(new Set()); setVerificado(false); }
  };
  const clickBlock = (blocoId) => { const empty = ex.slots.find(s => !slots[s.id]); if (empty) placeInSlot(empty.id, blocoId); };
  const goTo = (idx) => { setActiveIdx(idx); setSlots({}); setMostrarExp(false); setMostrarDica(false); setErros(new Set()); setVerificado(false); };

  useEffect(() => { if (!isExpert && tudoCorreto) setConcluidos(p => new Set([...p, ex.id])); }, [tudoCorreto, ex.id, isExpert]);

  const verificarExpert = () => {
    const errs = new Set();
    ex.slots.forEach(s => { if (slotOk(s.id) !== true) errs.add(s.id); });
    setErros(errs);
    setVerificado(true);
    if (errs.size === 0) setConcluidos(p => new Set([...p, ex.id]));
  };

  const onDragStart = (e, id) => e.dataTransfer.setData("bid", id);
  const onDragOver  = (e) => e.preventDefault();
  const onDropSlot  = (e, slotId) => { e.preventDefault(); const id=e.dataTransfer.getData("bid"); if(id) placeInSlot(slotId, id); };
  const onDropPool  = (e) => { e.preventDefault(); const id=e.dataTransfer.getData("bid"); if(id) setSlots(prev=>{const n={...prev};for(const s in n){if(n[s]===id)delete n[s];}return n;}); };

  const getSlotStatus = (slotId) => {
    if (isExpert) {
      if (!verificado) return "";
      if (slotOk(slotId) === true) return "slot-ok";
      if (erros.has(slotId)) return "slot-err";
      return "";
    }
    const ok = slotOk(slotId);
    if (ok === true) return "slot-ok";
    if (ok === false) return "slot-err";
    return "";
  };

  return (
    <div className="sint-body">
      <div className="sint-ex-nav">
        <button className="sint-nav-btn" onClick={() => goTo((activeIdx - 1 + total) % total)}>‹</button>
        <span className="sint-ex-num">{activeIdx + 1} / {total} · {concluidos.size} acertos</span>
        <button className="sint-nav-btn" onClick={() => goTo((activeIdx + 1) % total)}>›</button>
      </div>

      <div className="sint-nivel-row">
        <button className={`sint-nivel-btn${nivel==="easy"?" active-easy":""}`} onClick={() => setNivel("easy")}>EASY</button>
        <button className={`sint-nivel-btn${nivel==="hard"?" active-hard":""}`} onClick={() => setNivel("hard")}>HARD</button>
        <button className={`sint-nivel-btn${nivel==="expert"?" active-expert":""}`} onClick={() => setNivel("expert")}>EXPERT</button>
        {nivel==="hard" && <span className="sint-nivel-hint">+4 distratores</span>}
        {nivel==="expert" && <span className="sint-nivel-hint">múltiplas respostas válidas</span>}
      </div>

      <div className="sint-instrucao">{ex.descricao}</div>

      {isExpert && (
        <div className="expert-dica-row">
          <button className="sint-link" onClick={() => setMostrarDica(v => !v)}>
            {mostrarDica ? "▲ ocultar dicas" : "▼ como identificar cada função?"}
          </button>
          {mostrarDica && (
            <div className="expert-dicas-panel">
              {ex.slots.map(s => SINT_DICAS[s.funcao] ? (
                <div key={s.id} className="expert-dica-card">
                  <div className="expert-dica-funcao" style={{color: s.cor}}>{s.funcao}</div>
                  <div className="expert-dica-texto">{SINT_DICAS[s.funcao]}</div>
                </div>
              ) : null)}
            </div>
          )}
        </div>
      )}

      <div className="sint-pool" onDrop={onDropPool} onDragOver={onDragOver}>
        <div className="sint-section-label">
          {isExpert ? "Blocos disponíveis — arraste ou clique" : "Blocos disponíveis — arraste ou clique"}
        </div>
        <div className="sint-blocos">
          {pool.map(b => isExpert ? (
            <div key={b.id} className="expert-bloco" draggable onDragStart={e => onDragStart(e, b.id)} onClick={() => clickBlock(b.id)}>
              <span className="expert-texto">{b.texto}</span>
            </div>
          ) : (
            <div key={b.id} className="sint-bloco" draggable onDragStart={e => onDragStart(e, b.id)} onClick={() => clickBlock(b.id)}>{b.texto}</div>
          ))}
          {pool.length === 0 && <span className="sint-pool-empty">Todos posicionados — clique em slot para remover</span>}
        </div>
      </div>

      <div className="sint-section-label" style={{marginBottom:'.75rem'}}>Estrutura da oração</div>
      <div className="sint-slots">
        {ex.slots.map(slot => {
          const blocoId = slots[slot.id];
          const bloco = blocoId !== undefined ? getBlocoById(blocoId) : null;
          const status = getSlotStatus(slot.id);
          return (
            <div key={slot.id}
              className={`sint-slot${isExpert?" expert-slot":""}${status?" "+status:""}`}
              style={{ borderColor: status==="slot-ok"?"var(--ok)":status==="slot-err"?"var(--er)":slot.cor+"66" }}
              onDrop={e => onDropSlot(e, slot.id)} onDragOver={onDragOver}
            >
              <div className="sint-slot-label" style={{ color: slot.cor }}>{slot.funcao}</div>
              {bloco ? (
                isExpert ? (
                  <div className="expert-slot-inner" draggable onDragStart={e => onDragStart(e, bloco.id)} onClick={() => removeFromSlot(slot.id)} title="Clique para devolver">
                    <span>{bloco.texto}</span>
                  </div>
                ) : (
                  <div className="sint-slot-content" draggable onDragStart={e => onDragStart(e, bloco.id)} onClick={() => removeFromSlot(slot.id)} title="Clique para remover">{bloco.texto}</div>
                )
              ) : <div className="sint-slot-empty">drop</div>}
            </div>
          );
        })}
      </div>

      {isExpert && !(verificado && erros.size === 0) && (
        <div className="sint-actions">
          <button className="sint-btn-pri" onClick={verificarExpert} disabled={!tudoPreenchido} style={!tudoPreenchido?{opacity:.4,cursor:"not-allowed"}:{}}>
            Verificar
          </button>
          {verificado && erros.size > 0 && <span style={{fontFamily:"var(--M)",fontSize:".7rem",color:"var(--er)"}}>{erros.size} slot{erros.size>1?"s":""} incorreto{erros.size>1?"s":""} — reposicione e tente novamente</span>}
        </div>
      )}

      {(!isExpert && tudoCorreto) || (isExpert && verificado && erros.size === 0) ? (
        <>
          <div className="sint-result">
            <div className="sint-result-label">Oração montada ✓</div>
            <div className="sint-result-frase">
              {isExpert ? ex.slots.map(s => getBlocoById(slots[s.id])?.texto).filter(Boolean).join(" ") : ex.frase_resultado}
            </div>
            {mostrarExp && <div className="sint-explicacao" style={{marginTop:'.75rem',borderLeft:'2px solid var(--ac)',paddingLeft:'1rem'}}>{ex.explicacao}</div>}
          </div>
          <div className="sint-actions">
            {!mostrarExp && <button className="sint-exp-btn" onClick={() => setMostrarExp(true)}>Ver {isExpert?"explicação":"análise"}</button>}
            <button className="sint-btn-pri" onClick={() => goTo((activeIdx + 1) % total)}>Próximo →</button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function GerarIAMode({ onAddIdentificar, onAddConstruir }) {
  const [provIdx, setProvIdx] = useState(0);
  const [apiKeys, setApiKeys] = useState(() => {
    const k = {};
    PROVIDERS.forEach(p => { k[p.id] = localStorage.getItem(`sint_key_${p.id}`) || ""; });
    return k;
  });
  const [modelId, setModelId] = useState(PROVIDERS[0].models[0].id);
  const [tipoEx, setTipoEx] = useState("identificar");
  const [categoria, setCategoria] = useState(SINT_CATS[0]);
  const [quantidade, setQuantidade] = useState(3);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [previews, setPreviews] = useState([]);
  const [adicionados, setAdicionados] = useState(new Set());

  const prov = PROVIDERS[provIdx];
  const apiKey = apiKeys[prov.id] || "";

  const setApiKey = (val) => {
    localStorage.setItem(`sint_key_${prov.id}`, val);
    setApiKeys(prev => ({ ...prev, [prov.id]: val }));
  };

  const handleProvChange = (i) => {
    setProvIdx(i);
    setModelId(PROVIDERS[i].models[0].id);
    setPreviews([]);
    setAdicionados(new Set());
    setErro("");
  };

  const buildSintPrompt = () => {
    if (tipoEx === "identificar") {
      return `Gere ${quantidade} exercícios DIFERENTES de análise sintática do português brasileiro sobre "${categoria}" no formato JSON. Use frases simples e didáticas de nível concurso público. Retorne APENAS um array JSON, sem markdown, sem texto extra.\n\n[\n  {\n    "id": 1,\n    "categoria": "${categoria}",\n    "instrucao": "Encontre o <em>${categoria.toLowerCase()}</em> na frase",\n    "frase": "...",\n    "blocos": [\n      { "id": "b1", "texto": "...", "funcao": "Sujeito", "cor": "#a78bfa" },\n      { "id": "b2", "texto": "...", "funcao": "${categoria}", "cor": "#c8f000" }\n    ],\n    "resposta": ["b2"],\n    "explicacao": "..."\n  }\n]\n\nRegras: cores por função: Sujeito=#a78bfa, Predicado=#60a5fa, ${categoria}=#c8f000, outros=#f472b6. Cada bloco 1-4 palavras. Mínimo 3 blocos por exercício. resposta contém apenas ids dos blocos "${categoria}". Gere exatamente ${quantidade} exercícios com frases variadas.`;
    } else {
      return `Gere ${quantidade} exercícios DIFERENTES de construção sintática do português brasileiro. Cada exercício tem slots que o usuário preenche com blocos para montar uma frase. Use "${categoria}" como um dos slots em cada exercício. Retorne APENAS um array JSON, sem markdown, sem texto extra.\n\n[\n  {\n    "id": 1,\n    "descricao": "Monte a frase colocando cada termo no slot correto",\n    "frase_resultado": "...",\n    "blocos": [\n      { "id": "b1", "texto": "..." },\n      { "id": "b2", "texto": "..." }\n    ],\n    "slots": [\n      { "id": "s1", "funcao": "Sujeito", "resposta": "b1", "cor": "#a78bfa" },\n      { "id": "s2", "funcao": "${categoria}", "resposta": "b2", "cor": "#c8f000" }\n    ],\n    "explicacao": "..."\n  }\n]\n\nRegras: mínimo 3 blocos e 3 slots por exercício. Cada bloco 1-4 palavras. slot.resposta deve ser um id de bloco válido. Gere exatamente ${quantidade} exercícios com frases variadas.`;
    }
  };

  const gerar = async () => {
    if (!apiKey.trim()) { setErro("Insira a chave de API."); return; }
    setLoading(true);
    setErro("");
    setPreviews([]);
    setAdicionados(new Set());
    try {
      const maxTok = 400 + quantidade * 500;
      const raw = await prov.call(buildSintPrompt(), apiKey.trim(), modelId, maxTok);
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Resposta não contém array JSON válido.");
      const arr = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(arr)) throw new Error("Resposta não é um array.");
      const stamped = arr.map((obj, i) => ({ ...obj, id: Date.now() + i }));
      setPreviews(stamped);
    } catch (e) {
      setErro("Erro: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const adicionar = (ex) => {
    if (tipoEx === "identificar") onAddIdentificar(ex);
    else onAddConstruir(ex);
    setAdicionados(prev => new Set([...prev, ex.id]));
  };

  const adicionarTodos = () => {
    previews.forEach(ex => {
      if (!adicionados.has(ex.id)) adicionar(ex);
    });
  };

  return (
    <div className="sint-gerar">
      <div className="sint-gerar-section">
        <div className="sint-gerar-label">Provedor</div>
        <div className="sint-provider-tabs">
          {PROVIDERS.map((p, i) => (
            <button key={p.id} className={`sint-provider-tab${i===provIdx?" active":""}`} onClick={() => handleProvChange(i)}>
              {p.label} <span className="sint-tag">{p.tag}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sint-gerar-row">
        <div className="sint-gerar-section" style={{flex:1}}>
          <div className="sint-gerar-label">Chave de API <span style={{color:"var(--ok)",fontSize:".55rem"}}>salva automaticamente</span></div>
          <input
            className="sint-gerar-input"
            type="password"
            placeholder={prov.placeholder}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
          <div className="sint-gerar-hint">{prov.hint}</div>
        </div>
        <div className="sint-gerar-section" style={{minWidth:160}}>
          <div className="sint-gerar-label">Modelo</div>
          <select className="sint-gerar-select" value={modelId} onChange={e => setModelId(e.target.value)}>
            {prov.models.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="sint-gerar-row">
        <div className="sint-gerar-section" style={{flex:1}}>
          <div className="sint-gerar-label">Tipo de exercício</div>
          <div className="sint-tipo-tabs">
            <button className={`sint-tipo-tab${tipoEx==="identificar"?" active":""}`} onClick={() => setTipoEx("identificar")}>Identificar</button>
            <button className={`sint-tipo-tab${tipoEx==="construir"?" active":""}`} onClick={() => setTipoEx("construir")}>Construir</button>
          </div>
        </div>
        <div className="sint-gerar-section" style={{flex:1}}>
          <div className="sint-gerar-label">Categoria</div>
          <select className="sint-gerar-select" value={categoria} onChange={e => setCategoria(e.target.value)}>
            {SINT_CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sint-gerar-section" style={{minWidth:120}}>
          <div className="sint-gerar-label">Quantidade</div>
          <div className="sint-tipo-tabs">
            {[1,3,5].map(n => (
              <button key={n} className={`sint-tipo-tab${quantidade===n?" active":""}`} onClick={() => setQuantidade(n)}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      <button className="sint-gerar-btn" onClick={gerar} disabled={loading}>
        {loading ? `Gerando ${quantidade} exercício${quantidade>1?"s":""}...` : `Gerar ${quantidade} exercício${quantidade>1?"s":""} com IA →`}
      </button>

      {erro && <div className="sint-gerar-erro">{erro}</div>}

      {previews.length > 0 && (
        <div style={{display:"flex",flexDirection:"column",gap:".75rem"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div className="sint-gerar-label">{previews.length} exercício{previews.length>1?"s":""} gerado{previews.length>1?"s":""}</div>
            {previews.length > 1 && (
              <button className="sint-gerar-add" onClick={adicionarTodos}>
                + Adicionar todos ({previews.length - adicionados.size} restantes)
              </button>
            )}
          </div>
          {previews.map((ex, idx) => (
            <div key={ex.id} className="sint-gerar-preview">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div className="sint-gerar-preview-label">Exercício {idx + 1}</div>
                {adicionados.has(ex.id)
                  ? <span style={{fontFamily:"var(--M)",fontSize:".65rem",color:"var(--ok)"}}>✓ adicionado</span>
                  : <button className="sint-gerar-add" onClick={() => adicionar(ex)}>+ Adicionar</button>
                }
              </div>
              {tipoEx === "identificar" ? (
                <>
                  <div className="sint-gerar-preview-frase" dangerouslySetInnerHTML={{__html: ex.instrucao}} />
                  <div className="sint-gerar-preview-frase" style={{color:"var(--t2)"}}>{ex.frase}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:".5rem",marginTop:".5rem"}}>
                    {(ex.blocos||[]).map(b => (
                      <span key={b.id} style={{background:b.cor+"22",border:`1px solid ${b.cor}55`,color:b.cor,padding:".2rem .65rem",borderRadius:"4px",fontSize:".78rem"}}>{b.texto}</span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="sint-gerar-preview-frase">{ex.descricao}</div>
                  <div className="sint-gerar-preview-frase" style={{color:"var(--t2)"}}>{ex.frase_resultado}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:".5rem",marginTop:".5rem"}}>
                    {(ex.slots||[]).map(s => (
                      <span key={s.id} style={{background:s.cor+"22",border:`1px solid ${s.cor}55`,color:s.cor,padding:".2rem .65rem",borderRadius:"4px",fontSize:".78rem"}}>{s.funcao}</span>
                    ))}
                  </div>
                </>
              )}
              <div className="sint-gerar-preview-exp">{ex.explicacao}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExpertMode({ exercicios }) {
  const [exIdx, setExIdx] = useState(0);
  const [slots, setSlots] = useState({});
  const [mostrarExp, setMostrarExp] = useState(false);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [concluidos, setConcluidos] = useState(new Set());
  const [allBlocos, setAllBlocos] = useState([]);
  const [erros, setErros] = useState(new Set());

  const ex = exercicios[exIdx];
  const total = exercicios.length;
  const blocosEmSlots = new Set(Object.values(slots));

  useEffect(() => { setAllBlocos(shuffle(ex.blocos)); setSlots({}); setMostrarExp(false); setMostrarDica(false); setErros(new Set()); }, [ex.id]);

  const getBlocoById = (id) => allBlocos.find(b => b.id === id);
  const slotCorreto = (slotId) => {
    const slot = ex.slots.find(s => s.id === slotId);
    const blocoId = slots[slotId];
    if (!slot || blocoId === undefined) return null;
    const bloco = getBlocoById(blocoId);
    return bloco?.funcoes?.includes(slot.funcao) ?? false;
  };
  const tudoPreenchido = ex.slots.every(s => slots[s.id] !== undefined);
  const tudoCorreto = ex.slots.every(s => {
    const bloco = getBlocoById(slots[s.id]);
    return bloco?.funcoes?.includes(s.funcao) ?? false;
  });

  const pool = allBlocos.filter(b => !blocosEmSlots.has(b.id));

  const placeInSlot = (slotId, blocoId) => {
    setSlots(prev => {
      const next = { ...prev };
      for (const sid in next) { if (next[sid] === blocoId) delete next[sid]; }
      next[slotId] = blocoId;
      return next;
    });
  };
  const removeFromSlot = (slotId) => setSlots(prev => { const n = { ...prev }; delete n[slotId]; return n; });
  const clickBlock = (blocoId) => { const empty = ex.slots.find(s => slots[s.id] === undefined); if (empty) placeInSlot(empty.id, blocoId); };
  const goTo = (idx) => { setExIdx(idx); setSlots({}); setMostrarExp(false); setMostrarDica(false); setErros(new Set()); };

  const verificar = () => {
    const novosErros = new Set();
    ex.slots.forEach(s => {
      const bloco = getBlocoById(slots[s.id]);
      if (!bloco?.funcoes?.includes(s.funcao)) novosErros.add(s.id);
    });
    setErros(novosErros);
    if (novosErros.size === 0) setConcluidos(prev => new Set([...prev, ex.id]));
  };

  const onDragStart = (e, id) => e.dataTransfer.setData("bid", id);
  const onDragOver  = (e) => e.preventDefault();
  const onDropSlot  = (e, slotId) => { e.preventDefault(); const id = e.dataTransfer.getData("bid"); if (id) placeInSlot(slotId, id); };
  const onDropPool  = (e) => { e.preventDefault(); const id = e.dataTransfer.getData("bid"); if (id) setSlots(prev => { const n={...prev}; for(const s in n){if(n[s]===id)delete n[s];} return n; }); };

  const slotStatus = (slotId) => {
    const ok = slotCorreto(slotId);
    if (ok === true) return "slot-ok";
    if (erros.has(slotId) && ok === false) return "slot-err";
    return "";
  };

  return (
    <div className="sint-body">
      <div className="sint-ex-nav">
        <button className="sint-nav-btn" onClick={() => goTo((exIdx - 1 + total) % total)}>‹</button>
        <span className="sint-ex-num">{exIdx + 1} / {total} · {concluidos.size} completos</span>
        <button className="sint-nav-btn" onClick={() => goTo((exIdx + 1) % total)}>›</button>
      </div>

      <div className="expert-instrucao">{ex.descricao}</div>

      <div className="expert-dica-row">
        <button className="sint-link" onClick={() => setMostrarDica(v => !v)}>
          {mostrarDica ? "▲ ocultar dica" : "▼ ver dica"}
        </button>
        {mostrarDica && <div className="expert-dica">{ex.dica}</div>}
      </div>

      <div className="sint-pool" onDrop={onDropPool} onDragOver={onDragOver}>
        <div className="sint-section-label">Pool de blocos — cada bloco mostra sua classe gramatical</div>
        <div className="sint-blocos">
          {pool.map(b => (
            <div key={b.id} className="expert-bloco" draggable onDragStart={e => onDragStart(e, b.id)} onClick={() => clickBlock(b.id)}>
              <span className="expert-classe">{b.classe}</span>
              <span className="expert-texto">{b.texto}</span>
            </div>
          ))}
          {pool.length === 0 && <span className="sint-pool-empty">Todos os blocos posicionados — clique em um slot para remover</span>}
        </div>
      </div>

      <div className="sint-section-label" style={{marginBottom:'.75rem'}}>Estrutura da oração — arraste os blocos para os slots</div>
      <div className="sint-slots">
        {ex.slots.map(slot => {
          const blocoId = slots[slot.id];
          const bloco = blocoId !== undefined ? getBlocoById(blocoId) : null;
          const status = slotStatus(slot.id);
          return (
            <div
              key={slot.id}
              className={`sint-slot expert-slot${status ? " "+status : ""}`}
              style={{ borderColor: status==="slot-ok" ? "var(--ok)" : status==="slot-err" ? "var(--er)" : slot.cor+"66" }}
              onDrop={e => onDropSlot(e, slot.id)}
              onDragOver={onDragOver}
            >
              <div className="sint-slot-label" style={{ color: slot.cor }}>{slot.funcao}</div>
              {bloco ? (
                <div className="expert-slot-inner" draggable onDragStart={e => onDragStart(e, bloco.id)} onClick={() => removeFromSlot(slot.id)} title="Clique para devolver">
                  <span className="expert-classe expert-classe-sm">{bloco.classe}</span>
                  <span>{bloco.texto}</span>
                </div>
              ) : (
                <div className="sint-slot-empty">drop</div>
              )}
            </div>
          );
        })}
      </div>

      {!tudoCorreto && (
        <div className="sint-actions">
          <button
            className="sint-btn-pri"
            onClick={verificar}
            disabled={!tudoPreenchido}
            style={!tudoPreenchido ? {opacity:.4,cursor:"not-allowed"} : {}}
          >
            Verificar
          </button>
          {erros.size > 0 && (
            <span style={{fontFamily:"var(--M)",fontSize:".7rem",color:"var(--er)"}}>
              {erros.size} slot{erros.size > 1 ? "s" : ""} incorreto{erros.size > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {tudoCorreto && (
        <>
          <div className="sint-result">
            <div className="sint-result-label">Oração montada corretamente ✓</div>
            <div className="sint-result-frase">
              {ex.slots.map(s => getBlocoById(slots[s.id])?.texto).filter(Boolean).join(" ")}
            </div>
            {mostrarExp && (
              <div className="sint-explicacao" style={{marginTop:'.75rem',borderLeft:'2px solid var(--ac)',paddingLeft:'1rem'}}>
                {ex.explicacao}
              </div>
            )}
          </div>
          <div className="sint-actions">
            {!mostrarExp && <button className="sint-exp-btn" onClick={() => setMostrarExp(true)}>Ver explicação</button>}
            <button className="sint-btn-pri" onClick={() => goTo((exIdx + 1) % total)}>Próximo →</button>
          </div>
        </>
      )}
    </div>
  );
}

function SintaxePanel() {
  const [modo, setModo] = useState("identificar");
  const [extraIdentificar, setExtraIdentificar] = useState([]);
  const [extraConstruir, setExtraConstruir] = useState([]);

  const todosIdentificar = useMemo(() => shuffle([...SINTAXE_EXERCICIOS, ...extraIdentificar]), [extraIdentificar.length]);
  const todosConstruir = useMemo(() => shuffle([...CONSTRUCAO_EXERCICIOS, ...extraConstruir]), [extraConstruir.length]);

  return (
    <>
      <div className="sint-tabs">
        <button className={`sint-tab${modo==="identificar"?" active":""}`} onClick={() => setModo("identificar")}>Identificar</button>
        <button className={`sint-tab${modo==="construir"?" active":""}`} onClick={() => setModo("construir")}>Construir</button>
        <button className={`sint-tab${modo==="definicoes"?" active":""}`} onClick={() => setModo("definicoes")}>Definições</button>
        <button className={`sint-tab${modo==="stats"?" active":""}`} onClick={() => setModo("stats")}>Estatísticas</button>
        <button className={`sint-tab${modo==="ia"?" active":""}`} onClick={() => setModo("ia")}>Gerar com IA</button>
      </div>
      {modo === "identificar"  && <IdentificarMode exercicios={todosIdentificar} />}
      {modo === "construir"    && <ConstruirMode exercicios={todosConstruir} />}
      {modo === "definicoes"   && <DefinicaoMode />}
      {modo === "stats"        && <EstatisticasMode />}
      {modo === "ia"           && <GerarIAMode onAddIdentificar={ex => setExtraIdentificar(p => [...p, ex])} onAddConstruir={ex => setExtraConstruir(p => [...p, ex])} />}
    </>
  );
}

/* ══════════════════════════════════════════════
   MORFOLOGIA — dados e modos
══════════════════════════════════════════════ */
const CLASSES_PALAVRAS = [
  "Substantivo","Adjetivo","Artigo","Pronome","Verbo","Advérbio","Preposição","Conjunção","Interjeição","Numeral"
];

const DEFINICOES_CLASSES = [
  { funcao:"Substantivo",  descricao:"Palavra que nomeia seres, objetos, lugares, sentimentos ou ideias.",                    dicas:["Pode ser precedido de artigo","Varia em gênero e número","Ex: cidade, amor, livro"] },
  { funcao:"Adjetivo",     descricao:"Palavra que caracteriza ou qualifica o substantivo, atribuindo-lhe propriedade.",        dicas:["Concorda em gênero e número com o substantivo","Ex: belo, inteligente, pequeno"] },
  { funcao:"Artigo",       descricao:"Palavra que precede o substantivo, determinando-o ou indeterminando-o.",                 dicas:["Definidos: o, a, os, as","Indefinidos: um, uma, uns, umas"] },
  { funcao:"Pronome",      descricao:"Palavra que substitui ou acompanha o substantivo, indicando as pessoas do discurso.",    dicas:["Pessoais, possessivos, demonstrativos, relativos, indefinidos, interrogativos","Ex: eu, meu, este, que"] },
  { funcao:"Verbo",        descricao:"Palavra que expressa ação, estado, fenômeno ou processo, situado no tempo.",             dicas:["Varia em pessoa, número, tempo, modo e voz","Ex: correr, ser, chover"] },
  { funcao:"Advérbio",     descricao:"Palavra invariável que modifica o verbo, adjetivo ou outro advérbio.",                  dicas:["Indica circunstância (tempo, lugar, modo, intensidade)","Ex: ontem, aqui, rapidamente, muito"] },
  { funcao:"Preposição",   descricao:"Palavra invariável que relaciona dois termos, subordinando o segundo ao primeiro.",      dicas:["Ex: de, em, para, por, com, sobre","Forma locuções prepositivas: antes de, por causa de"] },
  { funcao:"Conjunção",    descricao:"Palavra invariável que liga orações ou termos de mesma função sintática.",               dicas:["Coordenativas: e, mas, ou, porém","Subordinativas: que, porque, embora, se"] },
  { funcao:"Interjeição",  descricao:"Palavra ou expressão que traduz emoções, sensações ou apelos de forma exclamativa.",     dicas:["Invariável","Ex: Ah!, Oba!, Puxa!, Ei!, Bravo!"] },
  { funcao:"Numeral",      descricao:"Palavra que indica quantidade, ordem, múltiplo ou fração de seres.",                    dicas:["Cardinal: um, dois","Ordinal: primeiro, segundo","Multiplicativo: dobro, triplo"] },
];

const MORFOLOGIA_EXERCICIOS = [
  { id:1,  frase:"O <b>candidato</b> estudou por meses para o concurso público.", palavra:"candidato",  resposta:"Substantivo",  categoria:"Morfologia" },
  { id:2,  frase:"A prova foi considerada <b>difícil</b> por grande parte dos candidatos.", palavra:"difícil", resposta:"Adjetivo", categoria:"Morfologia" },
  { id:3,  frase:"<b>Ela</b> revisou todos os artigos do edital antes da prova.", palavra:"Ela",       resposta:"Pronome",      categoria:"Morfologia" },
  { id:4,  frase:"Os candidatos <b>chegaram</b> cedo ao local de prova.", palavra:"chegaram",          resposta:"Verbo",        categoria:"Morfologia" },
  { id:5,  frase:"O gabarito foi divulgado <b>ontem</b> pela banca examinadora.", palavra:"ontem",      resposta:"Advérbio",    categoria:"Morfologia" },
  { id:6,  frase:"A inscrição deve ser realizada <b>por</b> meio do portal oficial.", palavra:"por",    resposta:"Preposição",   categoria:"Morfologia" },
  { id:7,  frase:"O candidato estudou muito, <b>mas</b> não foi aprovado na primeira fase.", palavra:"mas", resposta:"Conjunção", categoria:"Morfologia" },
  { id:8,  frase:"<b>Três</b> candidatos foram convocados para a fase de títulos.", palavra:"Três",     resposta:"Numeral",      categoria:"Morfologia" },
  { id:9,  frase:"<b>Um</b> edital foi publicado com as regras do concurso.", palavra:"Um",            resposta:"Artigo",       categoria:"Morfologia" },
  { id:10, frase:"<b>Ufa!</b> Finalmente o resultado foi divulgado após tanto tempo de espera.", palavra:"Ufa!", resposta:"Interjeição", categoria:"Morfologia" },
  { id:11, frase:"A banca <b>publicou</b> o resultado definitivo nesta semana.", palavra:"publicou",   resposta:"Verbo",        categoria:"Morfologia" },
  { id:12, frase:"O concurso exige conhecimentos <b>sólidos</b> de língua portuguesa.", palavra:"sólidos", resposta:"Adjetivo", categoria:"Morfologia" },
  { id:13, frase:"<b>Muitos</b> candidatos desistiram antes mesmo da prova objetiva.", palavra:"Muitos", resposta:"Pronome",    categoria:"Morfologia" },
  { id:14, frase:"O candidato chegou ao local <b>calmamente</b> e esperou a abertura dos portões.", palavra:"calmamente", resposta:"Advérbio", categoria:"Morfologia" },
  { id:15, frase:"A prova será aplicada <b>em</b> todo o território nacional.", palavra:"em",          resposta:"Preposição",   categoria:"Morfologia" },
  { id:16, frase:"Estudou <b>e</b> praticou questões durante todo o mês anterior à prova.", palavra:"e", resposta:"Conjunção", categoria:"Morfologia" },
  { id:17, frase:"<b>O</b> candidato aprovado foi convocado para a posse.", palavra:"O",               resposta:"Artigo",       categoria:"Morfologia" },
  { id:18, frase:"A <b>aprovação</b> no concurso representou o início de uma nova etapa profissional.", palavra:"aprovação", resposta:"Substantivo", categoria:"Morfologia" },
  { id:19, frase:"<b>Segundo</b> a lista de classificação, apenas dez vagas foram preenchidas.", palavra:"Segundo", resposta:"Numeral", categoria:"Morfologia" },
  { id:20, frase:"<b>Parabéns!</b> Você foi aprovado no concurso que tanto almejava.", palavra:"Parabéns!", resposta:"Interjeição", categoria:"Morfologia" },
];

const FORMACAO_EXERCICIOS = [
  { id:1,  palavra:"deslealdade",    resposta:"Derivação prefixal e sufixal", opcoes:["Derivação prefixal e sufixal","Derivação prefixal","Derivação sufixal","Composição por justaposição"], explicacao:"Prefixo 'des-' + radical 'leal' + sufixo '-dade'." },
  { id:2,  palavra:"guarda-chuva",   resposta:"Composição por justaposição", opcoes:["Composição por justaposição","Composição por aglutinação","Derivação parassintética","Derivação sufixal"], explicacao:"Dois radicais justapostos com hífen, sem alteração fonética." },
  { id:3,  palavra:"planalto",       resposta:"Composição por aglutinação",  opcoes:["Composição por aglutinação","Composição por justaposição","Derivação prefixal","Derivação sufixal"], explicacao:"'Plano' + 'alto' → 'planalto', com fusão fonética." },
  { id:4,  palavra:"anoitecer",      resposta:"Derivação parassintética",    opcoes:["Derivação parassintética","Derivação prefixal","Derivação sufixal","Composição por aglutinação"], explicacao:"Prefixo 'a-' e sufixo '-ecer' adicionados simultaneamente ao radical 'noite'." },
  { id:5,  palavra:"livraria",       resposta:"Derivação sufixal",           opcoes:["Derivação sufixal","Derivação prefixal","Derivação regressiva","Composição por justaposição"], explicacao:"'Livro' + sufixo '-aria' → lugar onde se vendem livros." },
  { id:6,  palavra:"infeliz",        resposta:"Derivação prefixal",          opcoes:["Derivação prefixal","Derivação sufixal","Derivação parassintética","Composição por aglutinação"], explicacao:"Prefixo 'in-' + radical 'feliz'." },
  { id:7,  palavra:"amor",           resposta:"Derivação regressiva",        opcoes:["Derivação regressiva","Derivação sufixal","Composição por justaposição","Derivação prefixal"], explicacao:"Derivado do verbo 'amar' por subtração de morfema." },
  { id:8,  palavra:"petróleo",       resposta:"Hibridismo",                  opcoes:["Hibridismo","Composição por aglutinação","Derivação sufixal","Empréstimo linguístico"], explicacao:"'Petra' (grego: pedra) + 'oleum' (latim: óleo) — radicais de línguas diferentes." },
  { id:9,  palavra:"onomatopeia",    resposta:"Onomatopeia",                 opcoes:["Onomatopeia","Derivação sufixal","Composição por justaposição","Hibridismo"], explicacao:"Palavra formada pela imitação de sons da natureza ou do ambiente." },
  { id:10, palavra:"aguardente",     resposta:"Composição por aglutinação",  opcoes:["Composição por aglutinação","Composição por justaposição","Derivação parassintética","Derivação prefixal"], explicacao:"'Água' + 'ardente' → 'aguardente', com fusão fonética." },
];

function MorfClassificarMode() {
  const [exs]   = useState(() => shuffle([...MORFOLOGIA_EXERCICIOS]));
  const [idx, setIdx]               = useState(0);
  const [selecionado, setSelecionado] = useState(null);
  const [concluidos, setConcluidos]  = useState(new Set());

  const ex    = exs[idx];
  const total = exs.length;
  const ok    = selecionado === ex.resposta;

  const opcoes = useMemo(() => {
    const erradas = shuffle(CLASSES_PALAVRAS.filter(c => c !== ex.resposta)).slice(0,3);
    return shuffle([ex.resposta, ...erradas]);
  }, [ex.id]);

  const handleSelect = (op) => {
    if (selecionado) return;
    setSelecionado(op);
    const correto = op === ex.resposta;
    if (correto) setConcluidos(prev => new Set([...prev, ex.id]));
    recordResult(ex.categoria, correto);
  };

  const avancar = () => { setSelecionado(null); setIdx((idx+1) % total); };

  return (
    <div className="sint-content">
      <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--M)",fontSize:".7rem",color:"var(--t3)",marginBottom:"1rem"}}>
        <span>{idx+1}/{total}</span>
        <span>{concluidos.size} corretas</span>
      </div>
      <div style={{background:"var(--ca)",borderRadius:"1rem",padding:"1.25rem",marginBottom:"1rem",lineHeight:1.7,fontSize:".95rem"}}
        dangerouslySetInnerHTML={{__html: ex.frase}} />
      <div style={{fontFamily:"var(--M)",fontSize:".75rem",color:"var(--t3)",marginBottom:".75rem"}}>
        Qual a classe gramatical de <b style={{color:"var(--tx)"}}>{ex.palavra}</b>?
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:".5rem",marginBottom:"1rem"}}>
        {opcoes.map(op => {
          let cls = "def-opt";
          if (selecionado) {
            if (op === ex.resposta) cls += " def-opt-ok";
            else if (op === selecionado) cls += " def-opt-err";
            else cls += " def-opt-dim";
          }
          return <button key={op} className={cls} onClick={() => handleSelect(op)}>{op}</button>;
        })}
      </div>
      {selecionado && (
        <button className="sint-btn-pri" style={{width:"100%"}} onClick={avancar}>Próximo →</button>
      )}
    </div>
  );
}

function MorfFormacaoMode() {
  const [exs]   = useState(() => shuffle([...FORMACAO_EXERCICIOS]));
  const [idx, setIdx]                 = useState(0);
  const [selecionado, setSelecionado] = useState(null);
  const [mostrarExp, setMostrarExp]   = useState(false);
  const [concluidos, setConcluidos]   = useState(new Set());

  const ex    = exs[idx];
  const total = exs.length;

  const handleSelect = (op) => {
    if (selecionado) return;
    setSelecionado(op);
    const correto = op === ex.resposta;
    if (correto) setConcluidos(prev => new Set([...prev, ex.id]));
    recordResult("Formação de Palavras", correto);
  };

  const avancar = () => { setSelecionado(null); setMostrarExp(false); setIdx((idx+1) % total); };

  return (
    <div className="sint-content">
      <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--M)",fontSize:".7rem",color:"var(--t3)",marginBottom:"1rem"}}>
        <span>{idx+1}/{total}</span>
        <span>{concluidos.size} corretas</span>
      </div>
      <div style={{background:"var(--ca)",borderRadius:"1rem",padding:"1.5rem",textAlign:"center",marginBottom:"1rem"}}>
        <div style={{fontFamily:"var(--M)",fontSize:".7rem",color:"var(--t3)",marginBottom:".5rem"}}>PROCESSO DE FORMAÇÃO</div>
        <div style={{fontSize:"2rem",fontWeight:700,letterSpacing:".04em"}}>{ex.palavra}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:".5rem",marginBottom:"1rem"}}>
        {ex.opcoes.map(op => {
          let cls = "def-opt";
          if (selecionado) {
            if (op === ex.resposta) cls += " def-opt-ok";
            else if (op === selecionado) cls += " def-opt-err";
            else cls += " def-opt-dim";
          }
          return <button key={op} className={cls} onClick={() => handleSelect(op)}>{op}</button>;
        })}
      </div>
      {selecionado && !mostrarExp && (
        <button className="sint-exp-btn" style={{width:"100%",marginBottom:".5rem"}} onClick={() => setMostrarExp(true)}>Ver explicação</button>
      )}
      {mostrarExp && (
        <div className="sint-explicacao" style={{marginBottom:".75rem",borderLeft:"2px solid var(--ac)",paddingLeft:"1rem"}}>{ex.explicacao}</div>
      )}
      {selecionado && (
        <button className="sint-btn-pri" style={{width:"100%"}} onClick={avancar}>Próximo →</button>
      )}
    </div>
  );
}

function MorfDefinicaoMode() {
  const [shuffled] = useState(() => shuffle([...DEFINICOES_CLASSES]));
  const [idx, setIdx]                 = useState(0);
  const [selecionado, setSelecionado] = useState(null);
  const [inverso, setInverso]         = useState(false);
  const [concluidos, setConcluidos]   = useState(new Set());

  const ex    = shuffled[idx];
  const total = shuffled.length;

  const opcoes = useMemo(() => {
    const erradas = shuffle(DEFINICOES_CLASSES.filter(d => d.funcao !== ex.funcao)).slice(0,3);
    return shuffle([ex, ...erradas]);
  }, [ex.funcao]);

  const handleSelect = (op) => {
    if (selecionado) return;
    const correto = inverso ? op.funcao === ex.funcao : op.funcao === ex.funcao;
    setSelecionado(op.funcao);
    if (correto) setConcluidos(prev => new Set([...prev, ex.funcao]));
    recordResult("Classes de Palavras", correto);
  };

  const avancar = () => { setSelecionado(null); setIdx((idx+1) % total); };

  return (
    <div className="sint-content">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
        <span style={{fontFamily:"var(--M)",fontSize:".7rem",color:"var(--t3)"}}>{idx+1}/{total} — {concluidos.size} certas</span>
        <button className="sint-exp-btn" onClick={() => { setSelecionado(null); setInverso(v => !v); }}>
          {inverso ? "Modo: Nome → Def." : "Modo: Def. → Nome"}
        </button>
      </div>
      <div style={{background:"var(--ca)",borderRadius:"1rem",padding:"1.25rem",marginBottom:"1rem",lineHeight:1.6,fontSize:".9rem"}}>
        {inverso
          ? <><div style={{fontFamily:"var(--M)",fontSize:".7rem",color:"var(--t3)",marginBottom:".5rem"}}>QUAL A DEFINIÇÃO DE</div><div style={{fontSize:"1.4rem",fontWeight:700}}>{ex.funcao}</div></>
          : <><div style={{fontFamily:"var(--M)",fontSize:".7rem",color:"var(--t3)",marginBottom:".5rem"}}>IDENTIFIQUE A CLASSE</div><div>{ex.descricao}</div><ul style={{marginTop:".5rem",paddingLeft:"1.2rem",color:"var(--t3)",fontSize:".8rem"}}>{ex.dicas.map((d,i) => <li key={i}>{d}</li>)}</ul></>
        }
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:".5rem",marginBottom:"1rem"}}>
        {opcoes.map(op => {
          let cls = "def-opt";
          if (selecionado) {
            if (op.funcao === ex.funcao) cls += " def-opt-ok";
            else if (op.funcao === selecionado) cls += " def-opt-err";
            else cls += " def-opt-dim";
          }
          return (
            <button key={op.funcao} className={cls} onClick={() => handleSelect(op)}>
              {inverso ? op.descricao : op.funcao}
            </button>
          );
        })}
      </div>
      {selecionado && (
        <button className="sint-btn-pri" style={{width:"100%"}} onClick={avancar}>Próximo →</button>
      )}
    </div>
  );
}

function MorfologiaPanel() {
  const [modo, setModo] = useState("classificar");
  return (
    <>
      <div className="sint-tabs">
        <button className={`sint-tab${modo==="classificar"?" active":""}`}  onClick={() => setModo("classificar")}>Classificar</button>
        <button className={`sint-tab${modo==="formacao"?" active":""}`}     onClick={() => setModo("formacao")}>Formação</button>
        <button className={`sint-tab${modo==="definicoes"?" active":""}`}   onClick={() => setModo("definicoes")}>Definições</button>
        <button className={`sint-tab${modo==="stats"?" active":""}`}        onClick={() => setModo("stats")}>Estatísticas</button>
      </div>
      {modo === "classificar" && <MorfClassificarMode />}
      {modo === "formacao"    && <MorfFormacaoMode />}
      {modo === "definicoes"  && <MorfDefinicaoMode />}
      {modo === "stats"       && <EstatisticasMode />}
    </>
  );
}

/* ══════════════════════════════════════════════
   GLOSSÁRIO
══════════════════════════════════════════════ */
const GLOSSARIO = [
  /* ── MORFOLOGIA ── */
  { termo:"Substantivo",    cat:"Morfologia",
    def:"Palavra que nomeia seres, objetos, lugares, sentimentos ou ideias.",
    ex:"A aprovação no concurso mudou sua vida.",
    sin:[] },
  { termo:"Adjetivo",       cat:"Morfologia",
    def:"Palavra que qualifica ou caracteriza o substantivo.",
    ex:"O candidato dedicado foi aprovado na primeira fase.",
    sin:[] },
  { termo:"Artigo",         cat:"Morfologia",
    def:"Palavra que precede o substantivo, determinando-o (definido) ou indeterminando-o (indefinido).",
    ex:"O edital foi publicado. Um candidato foi convocado.",
    sin:["Definidos: o, a, os, as","Indefinidos: um, uma, uns, umas"] },
  { termo:"Pronome",        cat:"Morfologia",
    def:"Palavra que substitui ou acompanha o substantivo, representando as pessoas do discurso.",
    ex:"Ela revisou todo o material antes da prova.",
    sin:["Pessoal: eu, tu, ele","Possessivo: meu, seu","Demonstrativo: este, esse, aquele","Relativo: que, o qual","Indefinido: alguém, ninguém"] },
  { termo:"Verbo",          cat:"Morfologia",
    def:"Palavra que expressa ação, estado, fenômeno ou processo, situado no tempo.",
    ex:"O candidato estudou por meses e foi aprovado.",
    sin:[] },
  { termo:"Advérbio",       cat:"Morfologia",
    def:"Palavra invariável que modifica verbo, adjetivo ou outro advérbio, indicando circunstância.",
    ex:"Ele chegou cedo e respondeu rapidamente as questões.",
    sin:["Tempo: ontem, hoje, sempre, nunca","Lugar: aqui, lá, aonde","Modo: rapidamente, bem, mal","Intensidade: muito, pouco, bastante","Negação: não, jamais","Afirmação: sim, certamente"] },
  { termo:"Preposição",     cat:"Morfologia",
    def:"Palavra invariável que relaciona dois termos, subordinando o segundo ao primeiro.",
    ex:"O candidato inscreveu-se por meio do portal.",
    sin:["Simples: a, de, em, para, por, com, sobre, sob, ante, após","Locuções: antes de, depois de, por causa de, a fim de, em frente a"] },
  { termo:"Conjunção",      cat:"Morfologia",
    def:"Palavra invariável que liga orações ou termos de mesma função sintática.",
    ex:"Estudou muito, mas não foi aprovado.",
    sin:["Coordenativas: e, mas, ou, porém, logo","Subordinativas: que, porque, embora, se, quando"] },
  { termo:"Interjeição",    cat:"Morfologia",
    def:"Palavra ou expressão que traduz emoção, sensação ou apelo de forma exclamativa.",
    ex:"Ufa! Finalmente o resultado saiu.",
    sin:["Alegria: Eba!, Ótimo!, Bravo!","Alívio: Ufa!, Ainda bem!","Espanto: Nossa!, Puxa!, Caramba!","Chamamento: Ei!, Olha!, Psiu!"] },
  { termo:"Numeral",        cat:"Morfologia",
    def:"Palavra que indica quantidade, ordem, múltiplo ou fração.",
    ex:"Três candidatos foram convocados na segunda chamada.",
    sin:["Cardinal: um, dois, cem","Ordinal: primeiro, segundo","Multiplicativo: dobro, triplo","Fracionário: metade, terço"] },

  /* ── FORMAÇÃO DE PALAVRAS ── */
  { termo:"Derivação Prefixal",     cat:"Formação",
    def:"Formação de palavra nova pela adição de prefixo ao radical.",
    ex:"in + feliz = infeliz",
    sin:["Prefixos comuns: des-, in-, re-, sub-, super-, anti-"] },
  { termo:"Derivação Sufixal",      cat:"Formação",
    def:"Formação de palavra nova pela adição de sufixo ao radical.",
    ex:"livro + -aria = livraria",
    sin:["Sufixos comuns: -ção, -ismo, -dade, -eiro, -mente, -aria"] },
  { termo:"Derivação Parassintética", cat:"Formação",
    def:"Adição simultânea de prefixo e sufixo ao radical — se retirar um dos dois, a palavra deixa de existir.",
    ex:"a- + noite + -ecer = anoitecer",
    sin:["Outros exemplos: entristecer, emudecer, encarecer"] },
  { termo:"Derivação Regressiva",   cat:"Formação",
    def:"Formação por subtração de morfema verbal, gerando substantivo.",
    ex:"amar → amor / combater → combate",
    sin:["Sempre gera substantivo a partir de verbo"] },
  { termo:"Composição por Justaposição", cat:"Formação",
    def:"União de dois ou mais radicais sem alteração fonética. Geralmente mantém hífen.",
    ex:"guarda + chuva = guarda-chuva",
    sin:["Outros: bem-estar, segunda-feira, couve-flor"] },
  { termo:"Composição por Aglutinação", cat:"Formação",
    def:"União de dois ou mais radicais com alteração ou supressão fonética.",
    ex:"plano + alto = planalto / água + ardente = aguardente",
    sin:["Outros: embora (em + boa + hora), vinagre (vinho + acre)"] },
  { termo:"Hibridismo",             cat:"Formação",
    def:"Palavra formada por radicais de línguas diferentes.",
    ex:"petróleo (grego: petra + latim: oleum)",
    sin:["Outros: automóvel (grego + latim), televisão (grego + latim)"] },
  { termo:"Onomatopeia",            cat:"Formação",
    def:"Palavra formada pela imitação de sons da natureza ou do ambiente.",
    ex:"o zumbido do mosquito incomodava o candidato",
    sin:["Outros: miau, au-au, tique-taque, pingue-pongue"] },

  /* ── SINTAXE ── */
  { termo:"Sujeito",                cat:"Sintaxe",
    def:"Ser sobre o qual o predicado declara algo. Concorda com o verbo em pessoa e número.",
    ex:"Os candidatos aprovados foram convocados para a posse.",
    sin:["Simples: um núcleo","Composto: dois ou mais núcleos","Oculto/elíptico: identificado pela desinência verbal","Indeterminado: não identificável","Inexistente/orações sem sujeito: verbos impessoais"] },
  { termo:"Predicado",              cat:"Sintaxe",
    def:"Tudo que se declara sobre o sujeito.",
    ex:"O candidato estudou por meses.",
    sin:["Verbal: verbo de ação","Nominal: verbo de ligação + predicativo","Verbo-nominal: verbo de ação + predicativo"] },
  { termo:"Objeto Direto",          cat:"Sintaxe",
    def:"Complemento verbal sem preposição obrigatória.",
    ex:"A banca divulgou o gabarito ontem.",
    sin:["Pergunta-chave: verbo + o quê? / verbo + quem?"] },
  { termo:"Objeto Indireto",        cat:"Sintaxe",
    def:"Complemento verbal introduzido por preposição obrigatória.",
    ex:"O candidato precisava de mais tempo para revisar.",
    sin:["Pregunta-chave: verbo + a quê? / verbo + de quê?","Preposições: a, de, em, para, por, com"] },
  { termo:"Adjunto Adnominal",      cat:"Sintaxe",
    def:"Termo que modifica ou determina o substantivo, sem ser predicativo.",
    ex:"O jovem candidato dedicado passou na prova difícil.",
    sin:["Artigos, adjetivos, pronomes e locuções adjetivas que acompanham o substantivo"] },
  { termo:"Adjunto Adverbial",      cat:"Sintaxe",
    def:"Termo que modifica o verbo, adjetivo ou advérbio, indicando circunstância.",
    ex:"Ele estudou intensamente durante três meses.",
    sin:["Tempo, lugar, modo, causa, instrumento, companhia, intensidade"] },
  { termo:"Complemento Nominal",    cat:"Sintaxe",
    def:"Termo que completa o sentido de um nome (substantivo, adjetivo ou advérbio abstrato), introduzido por preposição.",
    ex:"O candidato tinha necessidade de aprovação.",
    sin:["Completa substantivos, adjetivos ou advérbios abstratos","Sempre vem com preposição"] },
  { termo:"Aposto",                 cat:"Sintaxe",
    def:"Termo que explica, especifica ou resume um substantivo ou pronome anterior.",
    ex:"Brasília, capital federal, sedia os principais concursos.",
    sin:["Explicativo, especificativo, enumerativo, resumidor (este/isto/aquilo)"] },
  { termo:"Vocativo",               cat:"Sintaxe",
    def:"Termo independente usado para chamar ou interpelar o interlocutor. Isolado por vírgulas.",
    ex:"Candidatos, prestem atenção às instruções da prova.",
    sin:["Não pertence nem ao sujeito nem ao predicado","Sempre separado por vírgula"] },
  { termo:"Predicativo do Sujeito", cat:"Sintaxe",
    def:"Termo que atribui qualidade ao sujeito por meio de verbo de ligação.",
    ex:"O candidato ficou nervoso durante a prova oral.",
    sin:["Verbos de ligação: ser, estar, ficar, parecer, tornar-se, permanecer, continuar"] },
  { termo:"Predicativo do Objeto",  cat:"Sintaxe",
    def:"Termo que atribui qualidade ao objeto (direto ou indireto).",
    ex:"A banca considerou a prova difícil demais.",
    sin:["Recai sobre objeto direto ou indireto","Pode ser adjetivo ou substantivo"] },
  { termo:"Agente da Passiva",      cat:"Sintaxe",
    def:"Termo introduzido por preposição (por/de) que indica quem pratica a ação na voz passiva.",
    ex:"O gabarito foi divulgado pela banca examinadora.",
    sin:["Sempre introduzido por 'por' ou 'de'","Só existe na voz passiva analítica"] },

  /* ── ORAÇÕES COORDENADAS ── */
  { termo:"Oração Coord. Assindética", cat:"Orações",
    def:"Oração coordenada sem conjunção, ligada por vírgula ou ponto e vírgula.",
    ex:"Estudou, treinou questões, revisou os erros.",
    sin:["Sem conjunção coordenativa"] },
  { termo:"Oração Coord. Aditiva",     cat:"Orações",
    def:"Liga orações somando ideias.",
    ex:"Estudou muito e foi aprovado.",
    sin:["e, nem, não só...mas também, tanto...como, bem como"] },
  { termo:"Oração Coord. Adversativa", cat:"Orações",
    def:"Indica oposição, contraste ou restrição entre as orações.",
    ex:"Estudou bastante, mas não foi aprovado.",
    sin:["mas, porém, contudo, todavia, entretanto, no entanto, não obstante"] },
  { termo:"Oração Coord. Alternativa", cat:"Orações",
    def:"Indica alternância ou exclusão entre as ideias.",
    ex:"Ou você estuda agora, ou reprova novamente.",
    sin:["ou...ou, ora...ora, quer...quer, seja...seja, já...já"] },
  { termo:"Oração Coord. Conclusiva",  cat:"Orações",
    def:"Indica conclusão ou consequência lógica da oração anterior.",
    ex:"Dedicou-se por meses, portanto foi aprovado.",
    sin:["portanto, logo, então, por isso, por conseguinte, assim, consequentemente"] },
  { termo:"Oração Coord. Explicativa", cat:"Orações",
    def:"Justifica ou explica a oração anterior.",
    ex:"Não foi aprovado, pois não estudou o suficiente.",
    sin:["pois, porque, que, porquanto"] },

  /* ── ORAÇÕES SUBORDINADAS SUBSTANTIVAS ── */
  { termo:"Sub. Substantiva Subjetiva",       cat:"Orações",
    def:"Exerce a função de sujeito do verbo da oração principal.",
    ex:"É necessário que os candidatos cheguem cedo.",
    sin:["que, se, quem, o que — após verbos impessoais ou na estrutura 'é + adjetivo'"] },
  { termo:"Sub. Substantiva Objetiva Direta", cat:"Orações",
    def:"Exerce a função de objeto direto do verbo da oração principal (sem preposição).",
    ex:"A banca confirmou que o gabarito seria divulgado.",
    sin:["que, se, quem, o que — após verbos transitivos diretos como dizer, afirmar, confirmar, querer"] },
  { termo:"Sub. Substantiva Objetiva Indireta", cat:"Orações",
    def:"Exerce a função de objeto indireto (com preposição).",
    ex:"O candidato precisava de que o edital fosse publicado.",
    sin:["de que, em que, a que, para que — após verbos transitivos indiretos"] },
  { termo:"Sub. Substantiva Predicativa",    cat:"Orações",
    def:"Exerce a função de predicativo do sujeito, após verbo de ligação.",
    ex:"O problema é que as vagas são poucas.",
    sin:["que, se — após verbo 'ser' como verbo de ligação"] },
  { termo:"Sub. Substantiva Apositiva",      cat:"Orações",
    def:"Exerce a função de aposto de um substantivo da oração principal.",
    ex:"Tinha um único desejo: que fosse aprovado no concurso.",
    sin:["Geralmente após dois pontos","que, se"] },

  /* ── ORAÇÕES SUBORDINADAS ADJETIVAS ── */
  { termo:"Sub. Adjetiva Restritiva",   cat:"Orações",
    def:"Restringe o sentido do substantivo antecedente — essencial ao sentido. Sem vírgulas.",
    ex:"Os candidatos que estudaram foram aprovados.",
    sin:["que, o qual, cujo, onde — sem vírgula"] },
  { termo:"Sub. Adjetiva Explicativa",  cat:"Orações",
    def:"Acrescenta informação acessória ao substantivo antecedente. Entre vírgulas.",
    ex:"Os candidatos, que estudaram muito, foram aprovados.",
    sin:["que, o qual, cujo, onde — entre vírgulas"] },

  /* ── ORAÇÕES SUBORDINADAS ADVERBIAIS ── */
  { termo:"Sub. Adverbial Causal",        cat:"Orações",
    def:"Indica a causa da ação da oração principal.",
    ex:"Passou no concurso porque estudou todos os dias.",
    sin:["porque, pois, visto que, já que, uma vez que, como (= porque), dado que, porquanto"] },
  { termo:"Sub. Adverbial Temporal",      cat:"Orações",
    def:"Indica o tempo em que ocorre a ação da oração principal.",
    ex:"Quando o gabarito foi divulgado, ele comemorou.",
    sin:["quando, enquanto, assim que, logo que, depois que, antes que, desde que, mal"] },
  { termo:"Sub. Adverbial Condicional",   cat:"Orações",
    def:"Indica condição necessária para que ocorra a ação principal.",
    ex:"Se você estudar todos os dias, será aprovado.",
    sin:["se, caso, desde que, contanto que, salvo se, a não ser que, a menos que"] },
  { termo:"Sub. Adverbial Concessiva",    cat:"Orações",
    def:"Indica concessão — algo ocorre apesar de uma condição contrária.",
    ex:"Embora estivesse atrasado, ele não se apressou.",
    sin:["embora, ainda que, mesmo que, posto que, se bem que, conquanto, por mais que, por muito que, apesar de que, nem que"] },
  { termo:"Sub. Adverbial Consecutiva",   cat:"Orações",
    def:"Indica a consequência ou resultado da ação da oração principal.",
    ex:"Estudou tanto que não aguentou mais e dormiu.",
    sin:["tanto que, tão...que, tamanho...que, de modo que, de forma que, de maneira que"] },
  { termo:"Sub. Adverbial Comparativa",   cat:"Orações",
    def:"Estabelece comparação entre as orações.",
    ex:"Ele se preparou mais do que imaginava ser necessário.",
    sin:["como, assim como, tal como, mais...do que, menos...do que, tanto...quanto"] },
  { termo:"Sub. Adverbial Conformativa",  cat:"Orações",
    def:"Indica conformidade, modo de acordo com o que foi dito.",
    ex:"Conforme o edital previa, a prova durou quatro horas.",
    sin:["conforme, como, segundo, consoante"] },
  { termo:"Sub. Adverbial Final",         cat:"Orações",
    def:"Indica a finalidade ou objetivo da ação da oração principal.",
    ex:"Estudou muito para que pudesse passar na primeira fase.",
    sin:["para que, a fim de que, que (= para que)"] },
  { termo:"Sub. Adverbial Proporcional",  cat:"Orações",
    def:"Indica que as ações das duas orações crescem ou decrescem proporcionalmente.",
    ex:"À medida que estudava, sentia mais confiança.",
    sin:["à medida que, ao passo que, quanto mais...mais, quanto menos...menos, à proporção que"] },
];

const CAT_CORES = {
  Morfologia: "#7c3aed",
  Formação:   "#0891b2",
  Sintaxe:    "#059669",
  Orações:    "#d97706",
};

function GlossarioPanel() {
  const [busca,  setBusca]  = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [aberto, setAberto] = useState(null);

  const cats = ["Todos","Morfologia","Formação","Sintaxe","Orações"];

  const lista = useMemo(() => {
    const q = busca.toLowerCase().trim();
    return GLOSSARIO.filter(g =>
      (filtro === "Todos" || g.cat === filtro) &&
      (!q || g.termo.toLowerCase().includes(q) || g.def.toLowerCase().includes(q) || g.sin.some(s => s.toLowerCase().includes(q)))
    );
  }, [busca, filtro]);

  return (
    <div className="sint-content">
      {/* busca */}
      <input
        type="text"
        placeholder="Buscar termo..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        style={{width:"100%",boxSizing:"border-box",padding:".65rem 1rem",borderRadius:".75rem",border:"1.5px solid var(--b1)",background:"var(--ca)",color:"var(--tx)",fontFamily:"var(--S)",fontSize:".9rem",marginBottom:".75rem",outline:"none"}}
      />
      {/* filtros */}
      <div style={{display:"flex",gap:".4rem",flexWrap:"wrap",marginBottom:"1rem"}}>
        {cats.map(c => (
          <button key={c} onClick={() => setFiltro(c)} style={{
            fontFamily:"var(--M)",fontSize:".65rem",letterSpacing:".06em",padding:".3rem .75rem",
            borderRadius:"2rem",border:"1.5px solid",cursor:"pointer",
            borderColor: filtro===c ? "var(--ac)" : "var(--b1)",
            background:  filtro===c ? "var(--ac)" : "transparent",
            color:       filtro===c ? "#000"      : "var(--t3)",
          }}>{c}</button>
        ))}
      </div>
      {/* contagem */}
      <div style={{fontFamily:"var(--M)",fontSize:".65rem",color:"var(--t3)",marginBottom:".75rem"}}>{lista.length} termos</div>
      {/* lista */}
      <div style={{display:"flex",flexDirection:"column",gap:".5rem"}}>
        {lista.map(g => {
          const open = aberto === g.termo;
          const cor  = CAT_CORES[g.cat] || "var(--ac)";
          return (
            <div key={g.termo}
              style={{background:"var(--ca)",borderRadius:"1rem",border:`1.5px solid ${open ? cor : "var(--b1)"}`,overflow:"hidden",cursor:"pointer",transition:"border-color .15s"}}
              onClick={() => setAberto(open ? null : g.termo)}
            >
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".85rem 1rem"}}>
                <div>
                  <span style={{fontWeight:700,fontSize:".9rem"}}>{g.termo}</span>
                  <span style={{marginLeft:".6rem",fontFamily:"var(--M)",fontSize:".6rem",letterSpacing:".06em",padding:".15rem .55rem",borderRadius:"2rem",background:cor+"22",color:cor}}>{g.cat}</span>
                </div>
                <span style={{color:"var(--t3)",fontSize:".8rem"}}>{open ? "▲" : "▼"}</span>
              </div>
              {open && (
                <div style={{padding:"0 1rem 1rem",borderTop:"1px solid var(--b1)"}}>
                  {/* definição */}
                  <div style={{marginTop:".75rem",fontSize:".88rem",lineHeight:1.55}}>{g.def}</div>
                  {/* exemplo */}
                  <div style={{marginTop:".6rem",background:"var(--bg)",borderRadius:".6rem",padding:".6rem .85rem",fontStyle:"italic",fontSize:".85rem",color:"var(--t3)",borderLeft:`3px solid ${cor}`}}>
                    "{g.ex}"
                  </div>
                  {/* sinônimos / variantes */}
                  {g.sin.length > 0 && (
                    <div style={{marginTop:".75rem"}}>
                      <div style={{fontFamily:"var(--M)",fontSize:".65rem",letterSpacing:".06em",color:"var(--t3)",marginBottom:".4rem"}}>SINÔNIMOS / VARIANTES</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:".35rem"}}>
                        {g.sin.map((s,i) => (
                          <span key={i} style={{fontFamily:"var(--M)",fontSize:".7rem",padding:".25rem .65rem",borderRadius:"2rem",background:cor+"18",color:cor,border:`1px solid ${cor}44`}}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {lista.length === 0 && (
          <div style={{textAlign:"center",color:"var(--t3)",fontFamily:"var(--M)",fontSize:".75rem",padding:"2rem"}}>Nenhum termo encontrado.</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PORTUGUÊS — aba unificada
══════════════════════════════════════════════ */
function PortuguesScreen({ onBack }) {
  const [topico, setTopico] = useState("sintaxe");
  return (
    <div className="sint-screen screen">
      <div className="sint-header">
        <button className="sint-back" onClick={onBack}>← Voltar</button>
        <div className="sint-title">Português</div>
        <div style={{width:"80px"}} />
      </div>
      <div style={{display:"flex",gap:".5rem",padding:".75rem 1rem",borderBottom:"1px solid var(--b1)",overflowX:"auto",scrollbarWidth:"none"}}>
        {[["sintaxe","Sintaxe"],["oracoes","Orações"],["morfologia","Morfologia"],["glossario","Glossário"]].map(([k,l]) => (
          <button key={k}
            onClick={() => setTopico(k)}
            style={{
              fontFamily:"var(--M)",fontSize:".7rem",letterSpacing:".06em",padding:".35rem .9rem",
              borderRadius:"2rem",border:"1.5px solid",cursor:"pointer",whiteSpace:"nowrap",
              borderColor: topico===k ? "var(--ac)" : "var(--b1)",
              background:  topico===k ? "var(--ac)" : "transparent",
              color:       topico===k ? "#000"      : "var(--t3)",
            }}
          >{l}</button>
        ))}
      </div>
      {topico === "sintaxe"    && <SintaxePanel />}
      {topico === "oracoes"    && <OracoesPanel />}
      {topico === "morfologia" && <MorfologiaPanel />}
      {topico === "glossario"  && <GlossarioPanel />}
    </div>
  );
}

export default function App() {
  const [screen,    setScreen]    = useState("welcome");
  const [user,      setUser]      = useState(loadUser);
  const [data,      setData]      = useState(null);
  const [answers,   setAnswers]   = useState({});
  const [xp,        setXp]        = useState(() => loadUser()?.xp || 0);
  const [streak,    setStreak]    = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const handleStart  = u  => { const f={...u,xp:loadUser()?.xp||0}; setUser(f); saveUser(f); setScreen("howto"); };
  const handleLoad   = d  => { setData(d); setAnswers({}); setStreak(0); setMaxStreak(0); setScreen("quiz"); };
  const handleFinish = () => { const u={...user,xp}; saveUser(u); setUser(u); setScreen("analysis"); };
  const handleRestart= () => { setData(null); setAnswers({}); setStreak(0); setMaxStreak(0); setScreen("drop"); };

  return (
    <>
      <style>{FONTS}{S}</style>
      {screen==="welcome"   && <WelcomeScreen onStart={handleStart} onPortugues={()=>setScreen("portugues")} savedUser={user} />}
      {screen==="portugues" && <PortuguesScreen onBack={()=>setScreen("welcome")} />}
      {screen==="howto"    && <HowToScreen onNext={()=>setScreen("drop")} onBack={()=>setScreen("welcome")} user={user} />}
      {screen==="drop"     && <DropScreen onLoad={handleLoad} onHowTo={()=>setScreen("howto")} user={user} />}
      {screen==="quiz"     && data && <QuizScreen data={data} user={user} answers={answers} setAnswers={setAnswers} xp={xp} setXp={setXp} streak={streak} setStreak={setStreak} maxStreak={maxStreak} setMaxStreak={setMaxStreak} onFinish={handleFinish} onBack={handleRestart} />}
      {screen==="analysis" && data && <AnalysisScreen data={data} answers={answers} user={user} xp={xp} maxStreak={maxStreak} onRestart={handleRestart} />}
    </>
  );
}''