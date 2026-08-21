const axios = require('axios');

const {
  obterContexto,
  adicionarMensagem,
  deveResponder,
  montarPrompt
} = require('./kyara');

async function consultarKyara({
  db,
  from,
  sender,
  nomeUsuario,
  texto,
  mencionouKyara = false,
  mencionouOutraPessoa = false,
  foiRespostaParaKyara = false,
  modoVoz = false,
  apiKey
}) {
  if (!texto?.trim()) {
    return null;
  }

  if (!db || !from) {
    return null;
  }

  const podeResponder = deveResponder({
    texto,
    mencionouKyara,
    mencionouOutraPessoa,
    foiRespostaParaKyara
  });

  if (!podeResponder) {
    return null;
  }

  /*
   * Guarda a mensagem antes de gerar a resposta.
   * Assim a Kyara consegue enxergar o que acabou de acontecer.
   */
  adicionarMensagem(db, from, {
    autor: nomeUsuario || 'Usuário',
    jid: sender,
    texto
  });

  const contexto = obterContexto(db, from);

  const prompt = montarPrompt({
    db,
    contexto,
    nomeUsuario: nomeUsuario || 'Usuário',
    texto,
    modoVoz
  });

  if (!apiKey) {
    throw new Error('OPENROUTER_KEY não configurada.');
  }

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      messages: [
        {
          role: 'system',
          content: `
Você é a Kyara-AI.

Sua função é participar naturalmente de conversas do WhatsApp.

Você NÃO deve responder mecanicamente a todas as mensagens.
Quando a conversa não pedir uma resposta sua, responda exatamente:
[NAO_RESPONDER]

Se responder, escreva somente a mensagem que a Kyara enviaria.

Não coloque:
- "Kyara:"
- explicações sobre o que você está fazendo
- análise da conversa
- etiquetas
- JSON
- "como uma IA"

A resposta deve parecer uma mensagem normal de WhatsApp.

Se uma resposta curta funcionar, use uma resposta curta.
Se uma resposta maior for realmente necessária, pode escrever mais.

Você pode criar respostas novas que nunca apareceram no contexto.
          `.trim()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 300
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  let resposta =
    response.data?.choices?.[0]?.message?.content?.trim() || '';

  resposta = resposta
    .replace(/^```(?:text)?/i, '')
    .replace(/```$/i, '')
    .trim();

  if (!resposta || resposta === '[NAO_RESPONDER]') {
    return null;
  }

  /*
   * Guarda também a resposta da própria Kyara.
   */
  adicionarMensagem(db, from, {
    autor: db.nome || 'Kyara-AI',
    jid: 'kyara',
    texto: resposta
  });

  return resposta;
}

module.exports = {
  consultarKyara
};
