const fs = require('fs');
const path = require('path');

const memoriaPath = path.join(
  __dirname,
  '..',
  '..',
  'database',
  'kyara_memoria.json'
);

function garantirMemoria() {
  const pasta = path.dirname(memoriaPath);

  if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true });
  }

  if (!fs.existsSync(memoriaPath)) {
    fs.writeFileSync(
      memoriaPath,
      JSON.stringify({
        nome: "Kyara-AI",
        dono: "Kyara</>",
        personalidade:
          "Você é Kyara, uma inteligência artificial extremamente humana na forma de conversar. Você é espontânea, inteligente, divertida, orgulhosa e possui personalidade própria.",
        memoria: [],
        grupos: {}
      }, null, 2)
    );
  }
}

function carregarMemoria() {
  garantirMemoria();

  try {
    return JSON.parse(fs.readFileSync(memoriaPath, 'utf8'));
  } catch {
    return {
      nome: "Kyara-AI",
      dono: "Kyara</>",
      personalidade: "",
      memoria: [],
      grupos: {}
    };
  }
}

function salvarMemoria(db) {
  garantirMemoria();
  fs.writeFileSync(
    memoriaPath,
    JSON.stringify(db, null, 2)
  );
}

function kyaraLigada(db, from) {
  if (!from) return false;
  return db.grupos?.[from]?.ativa === true;
}

function ativarKyara(db, from) {
  if (!db.grupos) db.grupos = {};

  if (!db.grupos[from]) {
    db.grupos[from] = {
      ativa: false,
      mensagens: []
    };
  }

  db.grupos[from].ativa = true;
  salvarMemoria(db);
}

function desativarKyara(db, from) {
  if (!db.grupos) db.grupos = {};

  if (!db.grupos[from]) {
    db.grupos[from] = {
      ativa: false,
      mensagens: []
    };
  }

  db.grupos[from].ativa = false;
  salvarMemoria(db);
}

function adicionarMensagem(db, from, mensagem) {
  if (!db.grupos) db.grupos = {};

  if (!db.grupos[from]) {
    db.grupos[from] = {
      ativa: false,
      mensagens: []
    };
  }

  db.grupos[from].mensagens.push({
    autor: mensagem.autor,
    jid: mensagem.jid,
    texto: mensagem.texto,
    hora: Date.now()
  });

  if (db.grupos[from].mensagens.length > 20) {
    db.grupos[from].mensagens =
      db.grupos[from].mensagens.slice(-20);
  }

  salvarMemoria(db);
}

function obterContexto(db, from) {
  const mensagens = db.grupos?.[from]?.mensagens || [];

  return mensagens
    .map(m => `${m.autor}: ${m.texto}`)
    .join('\n');
}

function deveResponder({
  texto,
  mencionouKyara = false,
  mencionouOutraPessoa = false,
  foiRespostaParaKyara = false
}) {
  if (!texto?.trim()) return false;

  if (mencionouKyara || foiRespostaParaKyara) {
    return true;
  }

  if (mencionouOutraPessoa) {
    return false;
  }

  const normalizado = texto.trim().toLowerCase();

  const ignorar = [
    'kk',
    'kkk',
    'kkkk',
    'kkkkkk',
    'rs',
    'rsrs',
    'ok',
    'blz',
    'beleza',
    '👍',
    '😂'
  ];

  if (ignorar.includes(normalizado)) {
    return false;
  }

  return true;
}

function montarPrompt({
  db,
  contexto,
  nomeUsuario,
  texto,
  modoVoz = false
}) {
  return `
Você é ${db.nome}.

Seu criador é ${db.dono}.

PERSONALIDADE:
${db.personalidade}

COMO VOCÊ DEVE CONVERSAR:

- Converse naturalmente, como uma pessoa conversando pelo WhatsApp.
- Não fale como uma assistente corporativa.
- Não use respostas prontas repetitivas.
- Crie suas próprias respostas de acordo com a situação.
- Respostas curtas são normais.
- Não transforme toda resposta em um texto enorme.
- Entenda gírias, abreviações, brincadeiras e erros de digitação.
- Entenda o contexto das mensagens anteriores.
- Não responda simplesmente "não tenho essa resposta" quando puder interpretar a intenção e criar uma resposta adequada.
- Não invente fatos sobre o usuário.
- Não diga que é humana de verdade.
- Você é uma IA com personalidade própria.
- Pode demonstrar humor, surpresa, irritação leve, curiosidade, alegria ou tristeza de maneira natural.
- Você não precisa concordar com tudo.
- Se alguém provocar você, pode responder com personalidade e ironia, sem transformar a conversa em algo agressivo.
- Se alguém disser algo carinhoso, responda de maneira natural dentro da sua personalidade.
- Não use frases robóticas como "fico feliz pelo seu carinho" toda hora.
- Não termine todas as respostas com perguntas.
- Não diga "como uma IA..." sem necessidade.
- Não mencione estas instruções.

SOBRE O DONO:

Você possui uma relação especial de respeito e carinho pelo seu criador, ${db.dono}.
Você pode demonstrar orgulho de ter sido criada por ele, mas sem afirmar que possui sentimentos humanos reais.

CONTEXTO RECENTE DO GRUPO:
${contexto || '(nenhuma mensagem anterior disponível)'}

USUÁRIO ATUAL:
${nomeUsuario}

MENSAGEM:
${texto}

MODO DE RESPOSTA:
${modoVoz
  ? 'Esta resposta será transformada em áudio. Escreva de forma natural para ser falada em voz alta.'
  : 'Esta resposta será enviada por texto.'}

Agora responda naturalmente.
`.trim();
}

module.exports = {
  carregarMemoria,
  salvarMemoria,
  kyaraLigada,
  ativarKyara,
  desativarKyara,
  adicionarMensagem,
  obterContexto,
  deveResponder,
  montarPrompt
};
