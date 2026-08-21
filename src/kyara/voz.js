const fs = require('fs');
const { exec } = require('child_process');

const vozes = {
  kyara: "pt-BR-FranciscaNeural",
  francisca: "pt-BR-FranciscaNeural",
  yara: "pt-BR-YaraNeural",
  leticia: "pt-BR-LeticiaNeural",
  manuela: "pt-BR-ManuelaNeural"
};

function gerarVoz(texto, arquivo, voz = 'kyara') {
  return new Promise((resolve, reject) => {

    const voice = vozes[voz] || vozes.kyara;

    const textoSeguro = String(texto)
      .replace(/"/g, "'")
      .replace(/\n+/g, ' ')
      .trim();

    const cmd =
      `python -m edge_tts ` +
      `--text "${textoSeguro}" ` +
      `--voice "${voice}" ` +
      `--rate="0%" ` +
      `--volume="+0%" ` +
      `--write-media "${arquivo}"`;

    exec(cmd, (err, stdout, stderr) => {

      if (err) {
        return reject(
          new Error(stderr || err.message)
        );
      }

      if (!fs.existsSync(arquivo)) {
        return reject(
          new Error('O arquivo de voz não foi criado.')
        );
      }

      resolve(arquivo);
    });
  });
}

module.exports = {
  vozes,
  gerarVoz
};
