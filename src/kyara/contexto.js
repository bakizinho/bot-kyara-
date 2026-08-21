function limparTexto(texto) {
  return String(texto || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1000);
}

function adicionarContexto(contexto, autor, jid, texto) {

  if (!texto?.trim()) {
    return contexto;
  }

  contexto.push({
    autor: autor || 'Usuário',
    jid: jid || '',
    texto: limparTexto(texto),
    hora: Date.now()
  });

  if (contexto.length > 20) {
    contexto.splice(
      0,
      contexto.length - 20
    );
  }

  return contexto;
}

function transformarContexto(contexto) {
  return (contexto || [])
    .map(item =>
      `${item.autor}: ${item.texto}`
    )
    .join('\n');
}

module.exports = {
  adicionarContexto,
  transformarContexto,
  limparTexto
};
