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
    frase: "A construção do engenheiro impressionou a todos.",
    blocos: [
      { id: "b1", texto: "A", funcao: "Artigo definido", cor: "#6b9fff" },
      { id: "b2", texto: "construção", funcao: "Núcleo do sujeito", cor: "#a78bfa" },
      { id: "b3", texto: "do engenheiro", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b4", texto: "impressionou", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b5", texto: "a todos", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b3",
    explicacao: 'O sintagma "do engenheiro" é preposicionado e qualifica o substantivo "construção" (indica autoria). Termos preposicionados que modificam um nome — sem serem exigidos por ele — são adjuntos adnominais.',
  },
  // ── ADJUNTO ADNOMINAL 2-5 ──
  {
    id: 2, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "viatura"',
    frase: "A viatura da PRF abordou o veículo suspeito.",
    blocos: [
      { id: "b1", texto: "A viatura", funcao: "Sujeito (art. + núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "da PRF", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b3", texto: "abordou", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b4", texto: "o veículo suspeito", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b2",
    explicacao: '"Da PRF" especifica a qual instituição pertence a viatura — relação de pertencimento. Sintagmas preposicionados que qualificam um substantivo sem serem exigidos por ele são adjuntos adnominais.',
  },
  {
    id: 3, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "agentes"',
    frase: "Os agentes federais realizaram a busca no local.",
    blocos: [
      { id: "b1", texto: "Os agentes", funcao: "Núcleo do sujeito + art.", cor: "#a78bfa" },
      { id: "b2", texto: "federais", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b3", texto: "realizaram", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b4", texto: "a busca", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b5", texto: "no local", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b2",
    explicacao: '"Federais" é adjetivo que qualifica diretamente "agentes". Adjetivos que modificam um nome sem a mediação de verbo de ligação são adjuntos adnominais — diferem do predicativo por não dependerem de VL.',
  },
  {
    id: 4, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "advogado"',
    frase: "O advogado do réu apresentou os documentos ao juiz.",
    blocos: [
      { id: "b1", texto: "O advogado", funcao: "Núcleo do sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "do réu", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b3", texto: "apresentou", funcao: "Verbo (VTDI)", cor: "#f97316" },
      { id: "b4", texto: "os documentos", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b5", texto: "ao juiz", funcao: "Objeto Indireto", cor: "#6b9fff" },
    ],
    resposta: "b2",
    explicacao: '"Do réu" indica de quem é o advogado — posse. Não confunda com complemento nominal: o CN é exigido por nomes que expressam ação/sentimento; o adj. adnominal é acessório e pode ser retirado sem tornar o nome incompleto.',
  },
  {
    id: 5, categoria: "Adjunto Adnominal",
    instrucao: 'Encontre o <em>adjunto adnominal</em> de "candidatos"',
    frase: "Os candidatos aprovados receberam a convocação oficial.",
    blocos: [
      { id: "b1", texto: "Os candidatos", funcao: "Núcleo do sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "aprovados", funcao: "Adjunto Adnominal", cor: "#c8f000" },
      { id: "b3", texto: "receberam", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b4", texto: "a convocação oficial", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b2",
    explicacao: '"Aprovados" é particípio com valor adjetival que qualifica "candidatos". Mesmo sendo forma verbal, funciona como adjetivo aqui — portanto, adjunto adnominal. "Oficial" faz o mesmo papel em relação a "convocação".',
  },
  // ── COMPLEMENTO NOMINAL (5) ──
  {
    id: 6, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "favorável"',
    frase: "O candidato era favorável à proposta da banca.",
    blocos: [
      { id: "b1", texto: "O candidato", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "era", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "favorável", funcao: "Predicativo do sujeito", cor: "#6b9fff" },
      { id: "b4", texto: "à proposta da banca", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"À proposta da banca" completa o adjetivo "favorável": favorável *a quê*? CNs são exigidos por nomes (subst., adj., adv.) e sempre vêm com preposição. Diferem do adj. adnominal por serem obrigatórios para completar o sentido.',
  },
  {
    id: 7, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "necessidade"',
    frase: "A sociedade tem necessidade de novos policiais.",
    blocos: [
      { id: "b1", texto: "A sociedade", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "tem", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "necessidade", funcao: "Objeto Direto (núcleo)", cor: "#6b9fff" },
      { id: "b4", texto: "de novos policiais", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"De novos policiais" completa o substantivo "necessidade" (necessidade *de quê*?). Substantivos que expressam ação, sentimento ou estado frequentemente exigem CN com preposição. Estrutura "necessidade de" é padrão típico de CN.',
  },
  {
    id: 8, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "apto"',
    frase: "O servidor mostrou-se apto ao cargo efetivado.",
    blocos: [
      { id: "b1", texto: "O servidor", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "mostrou-se", funcao: "Verbo de ligação (pronominal)", cor: "#f97316" },
      { id: "b3", texto: "apto", funcao: "Predicativo do sujeito", cor: "#6b9fff" },
      { id: "b4", texto: "ao cargo efetivado", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Ao cargo efetivado" completa o adjetivo "apto": apto *a quê*? Adjetivos como apto, contrário, favorável, propício, ávido exigem CN com preposição. Padrão altamente cobrado no CESPE/CEBRASPE.',
  },
  {
    id: 9, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "certo"',
    frase: "O candidato estava certo de sua aprovação.",
    blocos: [
      { id: "b1", texto: "O candidato", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "estava", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "certo", funcao: "Predicativo do sujeito", cor: "#6b9fff" },
      { id: "b4", texto: "de sua aprovação", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"De sua aprovação" completa "certo" no sentido de "convicto/seguro" — certo *de quê*? O adjetivo "certo" nessa acepção exige CN com "de". CN é exigido; adj. adnominal é facultativo — essa é a distinção-chave.',
  },
  {
    id: 10, categoria: "Complemento Nominal",
    instrucao: 'Encontre o <em>complemento nominal</em> de "contrário"',
    frase: "O agente era contrário à resolução administrativa.",
    blocos: [
      { id: "b1", texto: "O agente", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "era", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "contrário", funcao: "Predicativo do sujeito", cor: "#6b9fff" },
      { id: "b4", texto: "à resolução administrativa", funcao: "Complemento Nominal", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"À resolução administrativa" completa "contrário": contrário *a quê*? Sem o CN a frase ficaria semanticamente incompleta. Adjetivos "contrário", "favorável", "apto", "propenso" sempre exigem CN com preposição.',
  },
  // ── SUJEITO (5) ──
  {
    id: 11, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração",
    frase: "Os policiais federais cumpriram as ordens.",
    blocos: [
      { id: "b1", texto: "Os policiais federais", funcao: "Sujeito", cor: "#c8f000" },
      { id: "b2", texto: "cumpriram", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b3", texto: "as ordens", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b1",
    explicacao: '"Os policiais federais" é o sujeito: ser sobre o qual se declara algo, com o qual o verbo concorda. Núcleo "policiais" + adj. adnominal "federais" + artigo "Os".',
  },
  {
    id: 12, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração (atenção: voz passiva)",
    frase: "O edital do concurso foi publicado no Diário Oficial.",
    blocos: [
      { id: "b1", texto: "O edital do concurso", funcao: "Sujeito paciente", cor: "#c8f000" },
      { id: "b2", texto: "foi publicado", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "no Diário Oficial", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b1",
    explicacao: 'Na voz passiva o sujeito é o ser que sofre a ação (sujeito paciente). "O edital do concurso" sofre a ação de ser publicado — é o sujeito. O verbo "foi publicado" concorda com ele. "Do concurso" é adj. adnominal.',
  },
  {
    id: 13, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração",
    frase: "A banca examinadora divulgou o resultado preliminar.",
    blocos: [
      { id: "b1", texto: "A banca examinadora", funcao: "Sujeito", cor: "#c8f000" },
      { id: "b2", texto: "divulgou", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b3", texto: "o resultado preliminar", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b1",
    explicacao: '"A banca examinadora" é o sujeito simples: único núcleo "banca" + determinante "A" + adj. adnominal "examinadora". O sujeito inclui todos os seus modificadores — eles não são o sujeito em si, apenas o expandem.',
  },
  {
    id: 14, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração",
    frase: "O delegado de polícia instaurou o inquérito policial.",
    blocos: [
      { id: "b1", texto: "O delegado de polícia", funcao: "Sujeito", cor: "#c8f000" },
      { id: "b2", texto: "instaurou", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b3", texto: "o inquérito policial", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b1",
    explicacao: '"O delegado de polícia" é o sujeito. "De polícia" é adj. adnominal de "delegado". O sujeito simples tem um único núcleo nominal — aqui "delegado" — podendo ter modificadores sem mudar a classificação.',
  },
  {
    id: 15, categoria: "Sujeito",
    instrucao: "Encontre o <em>sujeito</em> da oração",
    frase: "Os candidatos aprovados aguardavam a convocação ansiosamente.",
    blocos: [
      { id: "b1", texto: "Os candidatos aprovados", funcao: "Sujeito", cor: "#c8f000" },
      { id: "b2", texto: "aguardavam", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b3", texto: "a convocação", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "ansiosamente", funcao: "Adjunto Adverbial de Modo", cor: "#6b9fff" },
    ],
    resposta: "b1",
    explicacao: '"Os candidatos aprovados" é o sujeito. "Aprovados" é adj. adnominal de "candidatos". A concordância verbal se dá com o núcleo: "candidatos aguardavam". Adj. adverbial "ansiosamente" é acessório — não integra o sujeito.',
  },
  // ── OBJETO DIRETO (5) ──
  {
    id: 16, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "multar"',
    frase: "O fiscal multou o motorista imprudente.",
    blocos: [
      { id: "b1", texto: "O fiscal", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "multou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "o motorista imprudente", funcao: "Objeto Direto", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"O motorista imprudente" completa "multar" sem preposição. VTD pede complemento sem preposição = OD. Pergunte: o fiscal multou *quem*? "Imprudente" é adj. adnominal dentro do OD.',
  },
  {
    id: 17, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "apreender"',
    frase: "O agente apreendeu o veículo irregular na rodovia.",
    blocos: [
      { id: "b1", texto: "O agente", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "apreendeu", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "o veículo irregular", funcao: "Objeto Direto", cor: "#c8f000" },
      { id: "b4", texto: "na rodovia", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"O veículo irregular" é o OD — responde *o quê* foi apreendido, sem preposição. "Na rodovia" é adj. adverbial de lugar (acessório — pode ser retirado sem destruir a estrutura).',
  },
  {
    id: 18, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "analisar"',
    frase: "O auditor analisou os documentos fiscais com atenção.",
    blocos: [
      { id: "b1", texto: "O auditor", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "analisou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "os documentos fiscais", funcao: "Objeto Direto", cor: "#c8f000" },
      { id: "b4", texto: "com atenção", funcao: "Adjunto Adverbial de Modo", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Os documentos fiscais" é o OD — complemento verbal sem preposição. "Com atenção" é adj. adv. de modo, acessório. Pergunte: o auditor analisou *o quê*? → os documentos.',
  },
  {
    id: 19, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "deflagrar"',
    frase: "A PRF deflagrou a operação de combate ao tráfico.",
    blocos: [
      { id: "b1", texto: "A PRF", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "deflagrou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "a operação", funcao: "Objeto Direto", cor: "#c8f000" },
      { id: "b4", texto: "de combate ao tráfico", funcao: "Adjunto Adnominal", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"A operação" é o OD de "deflagrar". "De combate ao tráfico" é adj. adnominal de "operação" — especifica o tipo, mas não é o OD em si. O OD é apenas o núcleo do sintagma complemento.',
  },
  {
    id: 20, categoria: "Objeto Direto",
    instrucao: 'Encontre o <em>objeto direto</em> do verbo "divulgar"',
    frase: "A banca divulgou o resultado preliminar do concurso.",
    blocos: [
      { id: "b1", texto: "A banca", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "divulgou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "o resultado preliminar", funcao: "Objeto Direto", cor: "#c8f000" },
      { id: "b4", texto: "do concurso", funcao: "Adjunto Adnominal", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"O resultado preliminar" é o OD. "Do concurso" é adj. adnominal de "resultado". Pergunte: a banca divulgou *o quê*? → o resultado. Sem preposição antes = OD.',
  },
  // ── PREDICATIVO DO SUJEITO (5) ──
  {
    id: 21, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "O concurseiro ficou animado com o resultado.",
    blocos: [
      { id: "b1", texto: "O concurseiro", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "ficou", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "animado", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "b4", texto: "com o resultado", funcao: "Adjunto Adverbial de Causa", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Animado" é adjetivo ligado ao sujeito pelo VL "ficou". Pred. do sujeito ocorre com VL (ser, estar, ficar, parecer, tornar-se, continuar). Concorda em gênero e número com o sujeito.',
  },
  {
    id: 22, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "A apresentação dos documentos é obrigatória.",
    blocos: [
      { id: "b1", texto: "A apresentação dos documentos", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "é", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "obrigatória", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"Obrigatória" atribui qualidade ao sujeito "apresentação" por meio do VL "é". A concordância confirma: "apresentação" [fem. sing.] → "obrigatória" [fem. sing.]. Pred. do sujeito = estado/qualidade atribuída ao sujeito via VL.',
  },
  {
    id: 23, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "O policial se mostrou eficiente na abordagem.",
    blocos: [
      { id: "b1", texto: "O policial", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "se mostrou", funcao: "Verbo de ligação (pronominal)", cor: "#f97316" },
      { id: "b3", texto: "eficiente", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "b4", texto: "na abordagem", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Eficiente" é pred. do sujeito. "Mostrar-se" é VL pronominal — equivale a "revelar-se/parecer". Verbos como mostrar-se, revelar-se, tornar-se também funcionam como VL, exigindo predicativo.',
  },
  {
    id: 24, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "O processo seletivo se tornou rigoroso naquela edição.",
    blocos: [
      { id: "b1", texto: "O processo seletivo", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "se tornou", funcao: "Verbo de ligação (pronominal)", cor: "#f97316" },
      { id: "b3", texto: "rigoroso", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "b4", texto: "naquela edição", funcao: "Adjunto Adverbial de Tempo", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Rigoroso" é pred. do sujeito — estado atribuído ao sujeito pelo VL "se tornou". Predicativos do sujeito podem ser adjetivos, substantivos ou locuções. Distinguem-se do adj. adnominal por dependerem do VL.',
  },
  {
    id: 25, categoria: "Predicativo do Sujeito",
    instrucao: "Encontre o <em>predicativo do sujeito</em>",
    frase: "O edital pareceu claro aos candidatos.",
    blocos: [
      { id: "b1", texto: "O edital", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "pareceu", funcao: "Verbo de ligação", cor: "#f97316" },
      { id: "b3", texto: "claro", funcao: "Predicativo do Sujeito", cor: "#c8f000" },
      { id: "b4", texto: "aos candidatos", funcao: "Objeto Indireto", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Claro" é pred. do sujeito — atribui qualidade ao sujeito "edital" via VL "pareceu". "Aos candidatos" é OI do verbo "parecer" nessa construção (para quem pareceu). Não confunda OI com adj. adverbial.',
  },
  // ── PREDICATIVO DO OBJETO (5) ──
  {
    id: 26, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "O inspetor considerou o relatório inconsistente.",
    blocos: [
      { id: "b1", texto: "O inspetor", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "considerou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "o relatório", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "inconsistente", funcao: "Predicativo do Objeto", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Inconsistente" é pred. do objeto: adjetivo que se refere ao OD ("relatório") exigido por "considerar". Estrutura: VTD + OD + adj. = pred. do objeto. Verbos: considerar, julgar, eleger, nomear, achar, declarar.',
  },
  {
    id: 27, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "O júri julgou o réu culpado de todos os crimes.",
    blocos: [
      { id: "b1", texto: "O júri", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "julgou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "o réu", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "culpado", funcao: "Predicativo do Objeto", cor: "#c8f000" },
      { id: "b5", texto: "de todos os crimes", funcao: "Complemento Nominal de 'culpado'", cor: "#6b9fff" },
    ],
    resposta: "b4",
    explicacao: '"Culpado" é pred. do objeto — qualifica o OD "réu" e é requerido por "julgar". "De todos os crimes" é CN de "culpado" (culpado *de quê*?). Dupla estrutura: pred. do objeto + CN — frequente em questões CESPE.',
  },
  {
    id: 28, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "A banca declarou o candidato inapto na prova física.",
    blocos: [
      { id: "b1", texto: "A banca", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "declarou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "o candidato", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "inapto", funcao: "Predicativo do Objeto", cor: "#c8f000" },
      { id: "b5", texto: "na prova física", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b4",
    explicacao: '"Inapto" é pred. do objeto: refere-se ao OD "candidato" e é exigido por "declarar". Na voz passiva — "O candidato foi declarado inapto" — "inapto" vira pred. do sujeito paciente. Fique atento à conversão!',
  },
  {
    id: 29, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "O agente considerou o veículo irregular para circular.",
    blocos: [
      { id: "b1", texto: "O agente", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "considerou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "o veículo", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "irregular", funcao: "Predicativo do Objeto", cor: "#c8f000" },
      { id: "b5", texto: "para circular", funcao: "Adjunto Adverbial de Finalidade", cor: "#6b9fff" },
    ],
    resposta: "b4",
    explicacao: '"Irregular" é pred. do objeto. Teste: substitua por "O agente achou o veículo [como?] irregular" — a estrutura pred. do objeto fica clara. "Para circular" é adj. adverbial de finalidade (acessório).',
  },
  {
    id: 30, categoria: "Predicativo do Objeto",
    instrucao: "Encontre o <em>predicativo do objeto</em>",
    frase: "O auditor julgou a documentação incompleta.",
    blocos: [
      { id: "b1", texto: "O auditor", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "julgou", funcao: "VTD (predicação incompleta)", cor: "#f97316" },
      { id: "b3", texto: "a documentação", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "incompleta", funcao: "Predicativo do Objeto", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Incompleta" é pred. do objeto — concorda com o OD "documentação" [fem. sing.]. Distinção: "A documentação foi julgada incompleta" (voz passiva) → "incompleta" vira pred. do sujeito paciente. A função muda com a voz verbal.',
  },
  // ── ADJUNTO ADVERBIAL (5) ──
  {
    id: 31, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de finalidade</em>",
    frase: "O candidato estudou muito para a prova.",
    blocos: [
      { id: "b1", texto: "O candidato", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "estudou", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b3", texto: "muito", funcao: "Adjunto Adverbial de Intensidade", cor: "#6b9fff" },
      { id: "b4", texto: "para a prova", funcao: "Adjunto Adverbial de Finalidade", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Para a prova" indica *para quê* o candidato estudou. Sintagmas com "para" + substantivo frequentemente expressam finalidade. Adj. adverbiais são acessórios — a frase é gramaticalmente completa sem eles.',
  },
  {
    id: 32, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de modo</em>",
    frase: "O fiscal atuou com rigor nas fiscalizações de trânsito.",
    blocos: [
      { id: "b1", texto: "O fiscal", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "atuou", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b3", texto: "com rigor", funcao: "Adjunto Adverbial de Modo", cor: "#c8f000" },
      { id: "b4", texto: "nas fiscalizações de trânsito", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Com rigor" indica *como* o fiscal atuou. Sintagmas "com" + subst. abstrato frequentemente expressam modo. Podem ser substituídos por advérbio em -mente: "rigorosamente".',
  },
  {
    id: 33, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de tempo</em>",
    frase: "O agente abordou vinte veículos durante a blitz.",
    blocos: [
      { id: "b1", texto: "O agente", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "abordou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "vinte veículos", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "durante a blitz", funcao: "Adjunto Adverbial de Tempo", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Durante a blitz" indica *quando* os veículos foram abordados. Preposições "durante", "após", "antes de", "em" + valor temporal = adj. adverbial de tempo. Acessório: pode ser retirado sem tornar a frase agramatical.',
  },
  {
    id: 34, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de lugar</em>",
    frase: "A PRF intensificou as operações na fronteira.",
    blocos: [
      { id: "b1", texto: "A PRF", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "intensificou", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "as operações", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "na fronteira", funcao: "Adjunto Adverbial de Lugar", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Na fronteira" indica *onde* as operações foram intensificadas. Sintagmas "em/na/no" + lugar = valor locativo. Adj. adverbiais de lugar respondem à pergunta "onde?".',
  },
  {
    id: 35, categoria: "Adjunto Adverbial",
    instrucao: "Encontre o <em>adjunto adverbial de tempo</em>",
    frase: "O candidato aguardava a nomeação desde a aprovação.",
    blocos: [
      { id: "b1", texto: "O candidato", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "aguardava", funcao: "Verbo transitivo direto", cor: "#f97316" },
      { id: "b3", texto: "a nomeação", funcao: "Objeto Direto", cor: "#ff6b6b" },
      { id: "b4", texto: "desde a aprovação", funcao: "Adjunto Adverbial de Tempo", cor: "#c8f000" },
    ],
    resposta: "b4",
    explicacao: '"Desde a aprovação" indica o ponto de partida temporal da espera. A preposição "desde" marca origem no tempo. Adj. adverbiais são acessórios — podem ser retirados sem tornar a frase agramatical.',
  },
  // ── AGENTE DA PASSIVA (5) ──
  {
    id: 36, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "O suspeito foi detido pelos agentes federais.",
    blocos: [
      { id: "b1", texto: "O suspeito", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi detido", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pelos agentes federais", funcao: "Agente da Passiva", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"Pelos agentes federais" é o agente da passiva: quem pratica a ação. Sempre introduzido por "por" (pelo/pela/pelos). Na voz ativa: "Os agentes federais detiveram o suspeito" — o agente vira sujeito.',
  },
  {
    id: 37, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "A sentença foi proferida pelo juiz federal.",
    blocos: [
      { id: "b1", texto: "A sentença", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi proferida", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pelo juiz federal", funcao: "Agente da Passiva", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"Pelo juiz federal" é o agente da passiva. Voz passiva analítica = auxiliar "ser" + particípio. Na ativa: "O juiz federal proferiu a sentença." O agente é facultativo — a frase é gramatical sem ele.',
  },
  {
    id: 38, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "O veículo foi apreendido pela PRF na rodovia.",
    blocos: [
      { id: "b1", texto: "O veículo", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi apreendido", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pela PRF", funcao: "Agente da Passiva", cor: "#c8f000" },
      { id: "b4", texto: "na rodovia", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Pela PRF" é o agente da passiva. "Na rodovia" é adj. adv. de lugar. Distinção: *por quem?* → pela PRF (agente) vs *onde?* → na rodovia (adj. adv.). Não confunda os dois sintagmas preposicionados.',
  },
  {
    id: 39, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "O inquérito foi instaurado pelo delegado de plantão.",
    blocos: [
      { id: "b1", texto: "O inquérito", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi instaurado", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pelo delegado de plantão", funcao: "Agente da Passiva", cor: "#c8f000" },
    ],
    resposta: "b3",
    explicacao: '"Pelo delegado de plantão" é o agente da passiva. "De plantão" é adj. adnominal de "delegado" dentro do sintagma. Na ativa: "O delegado de plantão instaurou o inquérito."',
  },
  {
    id: 40, categoria: "Agente da Passiva",
    instrucao: "Encontre o <em>agente da passiva</em>",
    frase: "O gabarito foi divulgado pela banca no prazo legal.",
    blocos: [
      { id: "b1", texto: "O gabarito", funcao: "Sujeito paciente", cor: "#a78bfa" },
      { id: "b2", texto: "foi divulgado", funcao: "Verbo (voz passiva analítica)", cor: "#f97316" },
      { id: "b3", texto: "pela banca", funcao: "Agente da Passiva", cor: "#c8f000" },
      { id: "b4", texto: "no prazo legal", funcao: "Adjunto Adverbial de Tempo", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Pela banca" é o agente da passiva. "No prazo legal" é adj. adv. de tempo. Pergunte: *por quem?* → pela banca; *quando?* → no prazo. Distinguir os dois sintagmas é ponto frequente em provas.',
  },
  // ── OBJETO INDIRETO (5) ──
  {
    id: 41, categoria: "Objeto Indireto",
    instrucao: "Encontre o <em>objeto indireto</em>",
    frase: "O candidato obedeceu às instruções do edital.",
    blocos: [
      { id: "b1", texto: "O candidato", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "obedeceu", funcao: "Verbo transitivo indireto", cor: "#f97316" },
      { id: "b3", texto: "às instruções", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "do edital", funcao: "Adjunto Adnominal", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Às instruções" é OI de "obedecer" — VTI que exige preposição. "Obedecer" não admite OD — erro clássico em provas. "Do edital" é adj. adnominal de "instruções".',
  },
  {
    id: 42, categoria: "Objeto Indireto",
    instrucao: 'Encontre o <em>objeto indireto</em> do verbo "assistir" (presenciar)',
    frase: "O advogado assistiu ao processo com atenção.",
    blocos: [
      { id: "b1", texto: "O advogado", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "assistiu", funcao: "Verbo transitivo indireto", cor: "#f97316" },
      { id: "b3", texto: "ao processo", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "com atenção", funcao: "Adjunto Adverbial de Modo", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Ao processo" é OI de "assistir" no sentido de "presenciar" — VTI. "Com atenção" é adj. adv. de modo. Outros VTI comuns: gostar de, precisar de, depender de, lembrar-se de, obedecer a.',
  },
  {
    id: 43, categoria: "Objeto Indireto",
    instrucao: "Encontre o <em>objeto indireto</em> (a quem se concedeu)",
    frase: "O juiz concedeu ao réu o direito de recurso.",
    blocos: [
      { id: "b1", texto: "O juiz", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "concedeu", funcao: "Verbo transitivo direto e indireto", cor: "#f97316" },
      { id: "b3", texto: "ao réu", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "o direito de recurso", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b3",
    explicacao: '"Ao réu" é OI (concedeu *a quem*?). "O direito de recurso" é OD (concedeu *o quê*?). "Conceder" é VTDI. A ordem OI/OD pode variar, mas a distinção permanece: OI tem preposição; OD, não.',
  },
  {
    id: 44, categoria: "Objeto Indireto",
    instrucao: 'Encontre o <em>objeto indireto</em> do verbo "duvidar"',
    frase: "Ninguém duvida da honestidade do servidor público.",
    blocos: [
      { id: "b1", texto: "Ninguém", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "duvida", funcao: "Verbo transitivo indireto", cor: "#f97316" },
      { id: "b3", texto: "da honestidade", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "do servidor público", funcao: "Adjunto Adnominal", cor: "#6b9fff" },
    ],
    resposta: "b3",
    explicacao: '"Da honestidade" é OI de "duvidar" — VTI com "de". "Do servidor público" é adj. adnominal de "honestidade". Outros VTI com "de": gostar, precisar, depender, lembrar-se.',
  },
  {
    id: 45, categoria: "Objeto Indireto",
    instrucao: 'Encontre o <em>objeto indireto</em> do verbo "comunicar"',
    frase: "O agente comunicou ao superior a ocorrência grave.",
    blocos: [
      { id: "b1", texto: "O agente", funcao: "Sujeito", cor: "#a78bfa" },
      { id: "b2", texto: "comunicou", funcao: "Verbo transitivo direto e indireto", cor: "#f97316" },
      { id: "b3", texto: "ao superior", funcao: "Objeto Indireto", cor: "#c8f000" },
      { id: "b4", texto: "a ocorrência grave", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b3",
    explicacao: '"Ao superior" é OI (comunicou *a quem*?). "A ocorrência grave" é OD (comunicou *o quê*?). "Comunicar" é VTDI. Regra geral: OI sempre tem preposição; OD não tem preposição.',
  },
  // ── APOSTO (5) ──
  {
    id: 46, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "O CESPE, banca organizadora do concurso, divulgou o gabarito.",
    blocos: [
      { id: "b1", texto: "O CESPE", funcao: "Sujeito (núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "banca organizadora do concurso", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "divulgou", funcao: "Verbo (núcleo do predicado)", cor: "#f97316" },
      { id: "b4", texto: "o gabarito", funcao: "Objeto Direto", cor: "#ff6b6b" },
    ],
    resposta: "b2",
    explicacao: '"Banca organizadora do concurso" é aposto de "CESPE": explica/detalha o termo anterior. Apostos entre vírgulas são denominativos. Diferem do adj. adnominal por serem locuções substantivas — não adjetivos.',
  },
  {
    id: 47, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "A PRF, órgão de segurança pública federal, atua nas rodovias.",
    blocos: [
      { id: "b1", texto: "A PRF", funcao: "Sujeito (núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "órgão de segurança pública federal", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "atua", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b4", texto: "nas rodovias", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b2",
    explicacao: '"Órgão de segurança pública federal" é aposto de "PRF": esclarece a natureza institucional. Sua remoção não afeta a estrutura: "A PRF atua nas rodovias." Apostos são sempre termos explicativos e acessórios.',
  },
  {
    id: 48, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "Em Brasília, capital federal, fica a sede da PRF.",
    blocos: [
      { id: "b1", texto: "Em Brasília", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
      { id: "b2", texto: "capital federal", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "fica", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b4", texto: "a sede da PRF", funcao: "Sujeito", cor: "#a78bfa" },
    ],
    resposta: "b2",
    explicacao: '"Capital federal" é aposto de "Brasília": define o status político. Apostos podem se referir a qualquer termo da oração — aqui ao adj. adverbial de lugar. Atenção: o sujeito está posposto — "a sede da PRF fica".',
  },
  {
    id: 49, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "O réu, principal investigado do caso, compareceu ao tribunal.",
    blocos: [
      { id: "b1", texto: "O réu", funcao: "Sujeito (núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "principal investigado do caso", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "compareceu", funcao: "Verbo intransitivo", cor: "#f97316" },
      { id: "b4", texto: "ao tribunal", funcao: "Adjunto Adverbial de Lugar", cor: "#6b9fff" },
    ],
    resposta: "b2",
    explicacao: '"Principal investigado do caso" é aposto de "réu": acrescenta informação descritiva. Apostos descritivos são comuns em linguagem jornalística e jurídica — exatamente o estilo das questões de concurso.',
  },
  {
    id: 50, categoria: "Aposto",
    instrucao: "Encontre o <em>aposto</em>",
    frase: "O edital, documento obrigatório do processo seletivo, foi publicado.",
    blocos: [
      { id: "b1", texto: "O edital", funcao: "Sujeito (núcleo)", cor: "#a78bfa" },
      { id: "b2", texto: "documento obrigatório do processo seletivo", funcao: "Aposto", cor: "#c8f000" },
      { id: "b3", texto: "foi publicado", funcao: "Verbo (voz passiva)", cor: "#f97316" },
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
      { id: "b1", texto: "O policial rodoviário" },
      { id: "b2", texto: "multou" },
      { id: "b3", texto: "o motorista" },
      { id: "b4", texto: "imprudente" },
      { id: "b5", texto: "na rodovia" },
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
      { id: "b1", texto: "Os agentes federais" },
      { id: "b2", texto: "consideraram" },
      { id: "b3", texto: "o suspeito" },
      { id: "b4", texto: "culpado" },
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
      { id: "b1", texto: "O servidor" },
      { id: "b2", texto: "entregou" },
      { id: "b3", texto: "o requerimento" },
      { id: "b4", texto: "à chefia imediata" },
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
      { id: "b1", texto: "O inquérito" },
      { id: "b2", texto: "foi instaurado" },
      { id: "b3", texto: "pelo delegado federal" },
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
      { id: "b1", texto: "O auditor fiscal" },
      { id: "b2", texto: "ficou" },
      { id: "b3", texto: "satisfeito" },
      { id: "b4", texto: "com o resultado da perícia" },
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
.sint-tabs{display:flex;border-bottom:1px solid var(--b1)}
.sint-tab{font-family:var(--M);font-size:.65rem;padding:.85rem 2rem;background:none;border:none;cursor:pointer;color:var(--t3);letter-spacing:.12em;text-transform:uppercase;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .15s}
.sint-tab.active{color:var(--ac);border-bottom-color:var(--ac)}
.sint-tab:hover:not(.active){color:var(--t2)}
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
`;

function WelcomeScreen({ onStart, onSintaxe, savedUser }) {
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
          <button className="sint-link" onClick={onSintaxe}>Treinar sintaxe →</button>
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

function IdentificarMode({ exercicios }) {
  const [exIdx, setExIdx] = useState(0);
  const [zona, setZona] = useState(null);
  const [mostrarExp, setMostrarExp] = useState(false);
  const [concluidos, setConcluidos] = useState(new Set());
  const [shuffledBlocos, setShuffledBlocos] = useState([]);

  const total = exercicios.length;
  const ex = exercicios[exIdx];
  const isCorreto = zona?.id === ex.resposta;
  const pool = shuffledBlocos.filter(b => b.id !== zona?.id);

  useEffect(() => { setShuffledBlocos(shuffle(ex.blocos)); }, [ex.id]);

  const colocarNaZona = (bloco) => {
    setZona(bloco);
    setMostrarExp(false);
    if (bloco.id === ex.resposta) setConcluidos(prev => new Set([...prev, ex.id]));
  };
  const removerDaZona = () => { setZona(null); setMostrarExp(false); };
  const goTo = (idx) => { setExIdx(idx); setZona(null); setMostrarExp(false); };

  const onDragStart = (e, bloco) => e.dataTransfer.setData("bid", bloco.id);
  const onDragOver  = (e) => e.preventDefault();
  const onDropZona  = (e) => { e.preventDefault(); const id = e.dataTransfer.getData("bid"); const bloco = ex.blocos.find(b => b.id === id); if (bloco) colocarNaZona(bloco); };
  const onDropPool  = (e) => { e.preventDefault(); if (zona && e.dataTransfer.getData("bid") === zona.id) removerDaZona(); };

  return (
    <div className="sint-body">
      <div className="sint-ex-nav">
        <button className="sint-nav-btn" onClick={() => goTo((exIdx - 1 + total) % total)}>‹</button>
        <span className="sint-ex-num">{exIdx + 1} / {total} · {concluidos.size} acertos</span>
        <button className="sint-nav-btn" onClick={() => goTo((exIdx + 1) % total)}>›</button>
      </div>
      <div className="sint-instrucao" dangerouslySetInnerHTML={{ __html: ex.instrucao }} />
      <div className="sint-frase">{ex.frase}</div>
      <div className="sint-pool" onDrop={onDropPool} onDragOver={onDragOver}>
        <div className="sint-section-label">Blocos — arraste ou clique</div>
        <div className="sint-blocos">
          {pool.map(b => (
            <div key={b.id} className="sint-bloco" draggable onDragStart={e => onDragStart(e, b)} onClick={() => colocarNaZona(b)}>{b.texto}</div>
          ))}
          {pool.length === 0 && <span className="sint-pool-empty">Clique no bloco abaixo para devolvê-lo</span>}
        </div>
      </div>
      <div className={`sint-zona${zona ? (isCorreto ? " zona-ok" : " zona-err") : ""}`} onDrop={onDropZona} onDragOver={onDragOver}>
        {zona ? (
          <div className="sint-zona-inner">
            <div className="sint-bloco-zona" style={{ borderColor: zona.cor }} draggable onDragStart={e => onDragStart(e, zona)} onClick={removerDaZona} title="Clique para devolver">
              {zona.texto}
            </div>
            <div className="sint-funcao" style={{ color: zona.cor }}>
              {zona.funcao}
              {isCorreto && <span className="sint-badge-ok">✓ correto</span>}
            </div>
            {!isCorreto && <div className="sint-dica">Esta não é a função pedida. Clique no bloco para tentar outro.</div>}
            {isCorreto && !mostrarExp && <button className="sint-exp-btn" onClick={() => setMostrarExp(true)}>Ver explicação</button>}
            {mostrarExp && <div className="sint-explicacao">{ex.explicacao}</div>}
          </div>
        ) : (
          <div className="sint-zona-vazia">Arraste um bloco aqui ou clique nele</div>
        )}
      </div>
      {isCorreto && (
        <div className="sint-actions">
          <button className="sint-btn-pri" onClick={() => goTo((exIdx + 1) % total)}>Próximo →</button>
        </div>
      )}
    </div>
  );
}

function ConstruirMode({ exercicios }) {
  const [exIdx, setExIdx] = useState(0);
  const [slots, setSlots] = useState({});
  const [mostrarExp, setMostrarExp] = useState(false);
  const [concluidos, setConcluidos] = useState(new Set());
  const [shuffledBlocos, setShuffledBlocos] = useState([]);

  const ex = exercicios[exIdx];
  const total = exercicios.length;
  const blocosEmSlots = new Set(Object.values(slots));

  useEffect(() => { setShuffledBlocos(shuffle(ex.blocos)); }, [ex.id]);
  const pool = shuffledBlocos.filter(b => !blocosEmSlots.has(b.id));
  const slotCorreto = (slotId) => slots[slotId] === ex.slots.find(s => s.id === slotId)?.resposta;
  const tudoCorreto = ex.slots.every(s => slots[s.id] === s.resposta);
  const getBlocoById = (id) => ex.blocos.find(b => b.id === id);

  const placeInSlot = (slotId, blocoId) => {
    setSlots(prev => {
      const next = { ...prev };
      for (const sid in next) { if (next[sid] === blocoId) delete next[sid]; }
      next[slotId] = blocoId;
      return next;
    });
  };
  const removeFromSlot = (slotId) => setSlots(prev => { const n = { ...prev }; delete n[slotId]; return n; });
  const clickBlock = (blocoId) => { const empty = ex.slots.find(s => !slots[s.id]); if (empty) placeInSlot(empty.id, blocoId); };
  const goTo = (idx) => { setExIdx(idx); setSlots({}); setMostrarExp(false); };

  useEffect(() => { if (tudoCorreto) setConcluidos(prev => new Set([...prev, ex.id])); }, [tudoCorreto, ex.id]);

  const onDragStart = (e, id) => e.dataTransfer.setData("bid", id);
  const onDragOver  = (e) => e.preventDefault();
  const onDropSlot  = (e, slotId) => { e.preventDefault(); const id = e.dataTransfer.getData("bid"); if (id) placeInSlot(slotId, id); };
  const onDropPool  = (e) => { e.preventDefault(); const id = e.dataTransfer.getData("bid"); if (id) setSlots(prev => { const n={...prev}; for(const s in n){if(n[s]===id)delete n[s];} return n; }); };

  return (
    <div className="sint-body">
      <div className="sint-ex-nav">
        <button className="sint-nav-btn" onClick={() => goTo((exIdx - 1 + total) % total)}>‹</button>
        <span className="sint-ex-num">{exIdx + 1} / {total} · {concluidos.size} acertos</span>
        <button className="sint-nav-btn" onClick={() => goTo((exIdx + 1) % total)}>›</button>
      </div>
      <div className="sint-instrucao">{ex.descricao}</div>
      <div className="sint-pool" onDrop={onDropPool} onDragOver={onDragOver}>
        <div className="sint-section-label">Blocos disponíveis — arraste para os slots ou clique</div>
        <div className="sint-blocos">
          {pool.map(b => (
            <div key={b.id} className="sint-bloco" draggable onDragStart={e => onDragStart(e, b.id)} onClick={() => clickBlock(b.id)}>{b.texto}</div>
          ))}
          {pool.length === 0 && <span className="sint-pool-empty">Todos posicionados — clique em um slot para remover</span>}
        </div>
      </div>
      <div className="sint-section-label" style={{marginBottom:'.75rem'}}>Estrutura da oração</div>
      <div className="sint-slots">
        {ex.slots.map(slot => {
          const blocoId = slots[slot.id];
          const bloco = blocoId ? getBlocoById(blocoId) : null;
          const ok = blocoId !== undefined ? slotCorreto(slot.id) : null;
          return (
            <div
              key={slot.id}
              className={`sint-slot${ok===true?" slot-ok":ok===false?" slot-err":""}`}
              style={{ borderColor: ok===true ? "var(--ok)" : ok===false ? "var(--er)" : slot.cor+"66" }}
              onDrop={e => onDropSlot(e, slot.id)}
              onDragOver={onDragOver}
            >
              <div className="sint-slot-label" style={{ color: slot.cor }}>{slot.funcao}</div>
              {bloco ? (
                <div className="sint-slot-content" draggable onDragStart={e => onDragStart(e, bloco.id)} onClick={() => removeFromSlot(slot.id)} title="Clique para remover">
                  {bloco.texto}
                </div>
              ) : (
                <div className="sint-slot-empty">drop</div>
              )}
            </div>
          );
        })}
      </div>
      {tudoCorreto && (
        <>
          <div className="sint-result">
            <div className="sint-result-label">Oração montada ✓</div>
            <div className="sint-result-frase">{ex.frase_resultado}</div>
            {mostrarExp && <div className="sint-explicacao" style={{marginTop:'.75rem',borderLeft:'2px solid var(--ac)',paddingLeft:'1rem',background:'transparent'}}>{ex.explicacao}</div>}
          </div>
          <div className="sint-actions">
            {!mostrarExp && <button className="sint-exp-btn" onClick={() => setMostrarExp(true)}>Ver análise</button>}
            <button className="sint-btn-pri" onClick={() => goTo((exIdx + 1) % total)}>Próximo →</button>
          </div>
        </>
      )}
    </div>
  );
}

function GerarIAMode({ onAddIdentificar, onAddConstruir }) {
  const [provIdx, setProvIdx] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [modelId, setModelId] = useState(PROVIDERS[0].models[0].id);
  const [tipoEx, setTipoEx] = useState("identificar");
  const [categoria, setCategoria] = useState(SINT_CATS[0]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [preview, setPreview] = useState(null);

  const prov = PROVIDERS[provIdx];

  const handleProvChange = (i) => {
    setProvIdx(i);
    setModelId(PROVIDERS[i].models[0].id);
    setPreview(null);
    setErro("");
  };

  const buildSintPrompt = () => {
    if (tipoEx === "identificar") {
      return `Gere 1 exercício de análise sintática do português brasileiro sobre "${categoria}" no formato JSON exato abaixo. Use uma frase simples e didática de nível concurso público. Retorne APENAS o JSON, sem markdown, sem explicações extras.\n\n{\n  "id": 9999,\n  "categoria": "${categoria}",\n  "instrucao": "Encontre o <em>${categoria.toLowerCase()}</em> na frase",\n  "frase": "...",\n  "blocos": [\n    { "id": "b1", "texto": "...", "funcao": "Sujeito", "cor": "#a78bfa" },\n    { "id": "b2", "texto": "...", "funcao": "${categoria}", "cor": "#c8f000" }\n  ],\n  "resposta": ["b2"],\n  "explicacao": "..."\n}\n\nAs cores dos blocos devem ser: Sujeito=#a78bfa, Predicado=#60a5fa, ${categoria}=#c8f000, outros=#f472b6. Cada bloco deve ter texto com 1-4 palavras. Mínimo 3 blocos. A resposta deve conter apenas os ids dos blocos com função "${categoria}".`;
    } else {
      return `Gere 1 exercício de construção sintática do português brasileiro no formato JSON exato abaixo. O exercício deve ter slots que o usuário preenche com blocos de palavras para montar uma frase. Use "${categoria}" como um dos slots. Retorne APENAS o JSON, sem markdown, sem explicações extras.\n\n{\n  "id": 9999,\n  "descricao": "Monte a frase colocando cada termo no slot correto",\n  "frase_resultado": "...",\n  "blocos": [\n    { "id": "b1", "texto": "..." },\n    { "id": "b2", "texto": "..." }\n  ],\n  "slots": [\n    { "id": "s1", "funcao": "Sujeito", "resposta": "b1", "cor": "#a78bfa" },\n    { "id": "s2", "funcao": "${categoria}", "resposta": "b2", "cor": "#c8f000" }\n  ],\n  "explicacao": "..."\n}\n\nMínimo 3 blocos e 3 slots. Cada bloco deve ter 1-4 palavras. Certifique-se que cada slot.resposta é um id de bloco válido.`;
    }
  };

  const gerar = async () => {
    if (!apiKey.trim()) { setErro("Insira a chave de API."); return; }
    setLoading(true);
    setErro("");
    setPreview(null);
    try {
      const raw = await prov.call(buildSintPrompt(), apiKey.trim(), modelId, 900);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Resposta não contém JSON válido.");
      const obj = JSON.parse(jsonMatch[0]);
      obj.id = Date.now();
      setPreview(obj);
    } catch (e) {
      setErro("Erro: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const adicionar = () => {
    if (!preview) return;
    if (tipoEx === "identificar") onAddIdentificar(preview);
    else onAddConstruir(preview);
    setPreview(null);
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
          <div className="sint-gerar-label">Chave de API</div>
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
      </div>

      <button className="sint-gerar-btn" onClick={gerar} disabled={loading}>
        {loading ? "Gerando..." : "Gerar exercício com IA →"}
      </button>

      {erro && <div className="sint-gerar-erro">{erro}</div>}

      {preview && (
        <div className="sint-gerar-preview">
          <div className="sint-gerar-preview-label">Prévia do exercício</div>
          {tipoEx === "identificar" ? (
            <>
              <div className="sint-gerar-preview-frase" dangerouslySetInnerHTML={{__html: preview.instrucao}} />
              <div className="sint-gerar-preview-frase" style={{color:"var(--t2)"}}>{preview.frase}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:".5rem",marginTop:".75rem"}}>
                {(preview.blocos||[]).map(b => (
                  <span key={b.id} style={{background:b.cor+"22",border:`1px solid ${b.cor}55`,color:b.cor,padding:".25rem .75rem",borderRadius:"4px",fontSize:".8rem"}}>{b.texto}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="sint-gerar-preview-frase">{preview.descricao}</div>
              <div className="sint-gerar-preview-frase" style={{color:"var(--t2)"}}>{preview.frase_resultado}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:".5rem",marginTop:".75rem"}}>
                {(preview.slots||[]).map(s => (
                  <span key={s.id} style={{background:s.cor+"22",border:`1px solid ${s.cor}55`,color:s.cor,padding:".25rem .75rem",borderRadius:"4px",fontSize:".8rem"}}>{s.funcao}</span>
                ))}
              </div>
            </>
          )}
          <div className="sint-gerar-preview-exp">{preview.explicacao}</div>
          <button className="sint-gerar-add" onClick={adicionar}>+ Adicionar aos exercícios</button>
        </div>
      )}
    </div>
  );
}

function SintaxeScreen({ onBack }) {
  const [modo, setModo] = useState("identificar");
  const [extraIdentificar, setExtraIdentificar] = useState([]);
  const [extraConstruir, setExtraConstruir] = useState([]);

  const todosIdentificar = useMemo(() => shuffle([...SINTAXE_EXERCICIOS, ...extraIdentificar]), [extraIdentificar.length]);
  const todosConstruir = useMemo(() => shuffle([...CONSTRUCAO_EXERCICIOS, ...extraConstruir]), [extraConstruir.length]);

  return (
    <div className="sint-screen screen">
      <div className="sint-header">
        <button className="sint-back" onClick={onBack}>← Voltar</button>
        <div className="sint-title">Análise Sintática</div>
        <div style={{width:"80px"}} />
      </div>
      <div className="sint-tabs">
        <button className={`sint-tab${modo==="identificar"?" active":""}`} onClick={() => setModo("identificar")}>Identificar</button>
        <button className={`sint-tab${modo==="construir"?" active":""}`} onClick={() => setModo("construir")}>Construir</button>
        <button className={`sint-tab${modo==="ia"?" active":""}`} onClick={() => setModo("ia")}>Gerar com IA</button>
      </div>
      {modo === "identificar" && <IdentificarMode exercicios={todosIdentificar} />}
      {modo === "construir" && <ConstruirMode exercicios={todosConstruir} />}
      {modo === "ia" && <GerarIAMode onAddIdentificar={ex => setExtraIdentificar(p => [...p, ex])} onAddConstruir={ex => setExtraConstruir(p => [...p, ex])} />}
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
      {screen==="welcome"  && <WelcomeScreen onStart={handleStart} onSintaxe={()=>setScreen("sintaxe")} savedUser={user} />}
      {screen==="sintaxe"  && <SintaxeScreen onBack={()=>setScreen("welcome")} />}
      {screen==="howto"    && <HowToScreen onNext={()=>setScreen("drop")} onBack={()=>setScreen("welcome")} user={user} />}
      {screen==="drop"     && <DropScreen onLoad={handleLoad} onHowTo={()=>setScreen("howto")} user={user} />}
      {screen==="quiz"     && data && <QuizScreen data={data} user={user} answers={answers} setAnswers={setAnswers} xp={xp} setXp={setXp} streak={streak} setStreak={setStreak} maxStreak={maxStreak} setMaxStreak={setMaxStreak} onFinish={handleFinish} onBack={handleRestart} />}
      {screen==="analysis" && data && <AnalysisScreen data={data} answers={answers} user={user} xp={xp} maxStreak={maxStreak} onRestart={handleRestart} />}
    </>
  );
}''