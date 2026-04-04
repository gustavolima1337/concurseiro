import { useState, useEffect, useRef } from "react";

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
`;

function WelcomeScreen({ onStart, savedUser }) {
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
        <span style={{fontFamily:"var(--M)",fontSize:".6rem",color:"var(--t3)",letterSpacing:".08em"}}>feito por Gustavo C L</span>
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

function TopBar({ xp, streak, acertos, erros, progress, meta }) {
  const { level, progress: xpPct, xpIn } = calcLevel(xp);
  const items = [...MARQUEE, ...MARQUEE];
  const metaLabel = { diaria: "/ dia", semanal: "/ sem", mensal: "/ mês" };
  const totalDone = acertos + erros;
  return (
    <div className="topbar">
      <div className="topbar-row">
        <div className="tb-brand">Concurseiro<b>.</b></div>
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

function QuizScreen({ data, user, answers, setAnswers, xp, setXp, streak, setStreak, maxStreak, setMaxStreak, onFinish }) {
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
      <TopBar xp={xp} streak={streak} acertos={acertos} erros={erros} progress={cur/questoes.length} meta={user?.meta} />
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
      {screen==="welcome"  && <WelcomeScreen onStart={handleStart} savedUser={user} />}
      {screen==="howto"    && <HowToScreen onNext={()=>setScreen("drop")} onBack={()=>setScreen("welcome")} user={user} />}
      {screen==="drop"     && <DropScreen onLoad={handleLoad} onHowTo={()=>setScreen("howto")} user={user} />}
      {screen==="quiz"     && data && <QuizScreen data={data} user={user} answers={answers} setAnswers={setAnswers} xp={xp} setXp={setXp} streak={streak} setStreak={setStreak} maxStreak={maxStreak} setMaxStreak={setMaxStreak} onFinish={handleFinish} />}
      {screen==="analysis" && data && <AnalysisScreen data={data} answers={answers} user={user} xp={xp} maxStreak={maxStreak} onRestart={handleRestart} />}
    </>
  );
}''