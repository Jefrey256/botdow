"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMessage = void 0;
exports.setupMessagingServices = setupMessagingServices;
exports.baileysIs = baileysIs;
exports.mediaDow = mediaDow;
// exports/message.ts
const config_1 = require("../config");
const baileys_1 = require("@whiskeysockets/baileys");
const fs_1 = __importDefault(require("fs"));
// Função para extrair dados de uma mensagem
const extractMessage = (messageDetails) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
    // Verificação de que messageDetails está definido e possui uma estrutura válida
    if (!messageDetails || !messageDetails.message) {
        console.error("Detalhes da mensagem não encontrados ou estão mal formatados");
        return {
            media: undefined,
            mentions: [],
            finalMessageText: "",
            from: "Desconhecido",
            fromUser: "Desconhecido",
            isCommand: false,
            commandName: "",
            args: [],
            userName: "Desconhecido",
            participant: "Desconhecido"
        };
    }
    // Extrai as menções de pessoas mencionadas na mensagem
    const mentions = ((_c = (_b = (_a = messageDetails.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.contextInfo) === null || _c === void 0 ? void 0 : _c.mentionedJid) || [];
    // Extrai o texto da mensagem, seja de texto simples ou texto estendido
    const finalMessageText = ((_d = messageDetails.message) === null || _d === void 0 ? void 0 : _d.conversation) ||
        ((_f = (_e = messageDetails.message) === null || _e === void 0 ? void 0 : _e.extendedTextMessage) === null || _f === void 0 ? void 0 : _f.text) ||
        "";
    // Extrai o nome do usuário ou identificador
    const fromUser = ((_h = (_g = messageDetails.key) === null || _g === void 0 ? void 0 : _g.participant) === null || _h === void 0 ? void 0 : _h.split('@')[0]) || ((_k = (_j = messageDetails.key) === null || _j === void 0 ? void 0 : _j.remoteJid) === null || _k === void 0 ? void 0 : _k.split('@')[0]);
    // Extrai o identificador do remetente
    const from = ((_l = messageDetails.key) === null || _l === void 0 ? void 0 : _l.remoteJid) || "Remetente desconhecido";
    // Extrai o nome de exibição do usuário
    const userName = (messageDetails === null || messageDetails === void 0 ? void 0 : messageDetails.pushName) || "Usuário Desconhecido";
    // Verifica se a mensagem é um comando (com base no prefixo)
    const isCommand = finalMessageText.startsWith(config_1.PREFIX);
    // Extrai o participante ou remetente
    const participant = ((_m = messageDetails.key) === null || _m === void 0 ? void 0 : _m.participant) || ((_o = messageDetails.key) === null || _o === void 0 ? void 0 : _o.remoteJid);
    // Verificação de mídia (direta ou marcada)
    const media = ((_p = messageDetails.message) === null || _p === void 0 ? void 0 : _p.imageMessage) ||
        ((_q = messageDetails.message) === null || _q === void 0 ? void 0 : _q.videoMessage) ||
        ((_r = messageDetails.message) === null || _r === void 0 ? void 0 : _r.audioMessage) ||
        ((_s = messageDetails.message) === null || _s === void 0 ? void 0 : _s.stickerMessage) ||
        ((_t = messageDetails.message) === null || _t === void 0 ? void 0 : _t.documentMessage) ||
        (
        // Verificando se a mídia é citada ou marcada em mensagens de texto estendidas
        (_x = (_w = (_v = (_u = messageDetails.message) === null || _u === void 0 ? void 0 : _u.extendedTextMessage) === null || _v === void 0 ? void 0 : _v.contextInfo) === null || _w === void 0 ? void 0 : _w.quotedMessage) === null || _x === void 0 ? void 0 : _x.imageMessage) ||
        ((_1 = (_0 = (_z = (_y = messageDetails.message) === null || _y === void 0 ? void 0 : _y.extendedTextMessage) === null || _z === void 0 ? void 0 : _z.contextInfo) === null || _0 === void 0 ? void 0 : _0.quotedMessage) === null || _1 === void 0 ? void 0 : _1.videoMessage) ||
        ((_5 = (_4 = (_3 = (_2 = messageDetails.message) === null || _2 === void 0 ? void 0 : _2.extendedTextMessage) === null || _3 === void 0 ? void 0 : _3.contextInfo) === null || _4 === void 0 ? void 0 : _4.quotedMessage) === null || _5 === void 0 ? void 0 : _5.audioMessage) ||
        ((_9 = (_8 = (_7 = (_6 = messageDetails.message) === null || _6 === void 0 ? void 0 : _6.extendedTextMessage) === null || _7 === void 0 ? void 0 : _7.contextInfo) === null || _8 === void 0 ? void 0 : _8.quotedMessage) === null || _9 === void 0 ? void 0 : _9.stickerMessage) ||
        ((_13 = (_12 = (_11 = (_10 = messageDetails.message) === null || _10 === void 0 ? void 0 : _10.extendedTextMessage) === null || _11 === void 0 ? void 0 : _11.contextInfo) === null || _12 === void 0 ? void 0 : _12.quotedMessage) === null || _13 === void 0 ? void 0 : _13.documentMessage) ||
        undefined;
    // Identificando o nome do comando, caso a mensagem seja um comando
    const commandName = isCommand ? finalMessageText.slice(config_1.PREFIX.length).split(" ")[0] : "";
    // Extração de argumentos do comando
    const args = finalMessageText.split(" ").slice(1);
    return {
        media,
        mentions,
        finalMessageText,
        from,
        fromUser,
        isCommand,
        commandName,
        args,
        userName,
        participant,
    };
};
exports.extractMessage = extractMessage;
// Função para verificar se a mensagem contém uma imagem
function setupMessagingServices(pico, from, messageDetails) {
    const enviarTexto = (texto) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield pico.sendMessage(from, { text: texto }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar texto:', error);
        }
    });
    const enviarAudioGravacao = (arquivo) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield pico.sendMessage(from, {
                audio: fs_1.default.readFileSync(arquivo),
                mimetype: "audio/mp4",
                ptt: true,
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar áudio:', error);
        }
    });
    const enviarImagem = (arquivo, text) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Verifica se 'arquivo' é uma URL (string que começa com 'http')
            if (typeof arquivo === 'string' && arquivo.startsWith('http')) {
                // Envia a imagem diretamente pela URL
                yield pico.sendMessage(from, {
                    image: { url: arquivo }, // Envia a imagem pela URL
                    caption: text
                }, { quoted: messageDetails });
            }
            else if (Buffer.isBuffer(arquivo)) {
                // Se 'arquivo' for um Buffer (dados binários da imagem)
                yield pico.sendMessage(from, {
                    image: arquivo, // Envia a imagem a partir do Buffer
                    caption: text
                }, { quoted: messageDetails });
            }
            else if (typeof arquivo === 'string') {
                // Se 'arquivo' for um caminho local, lê o arquivo diretamente
                if (fs_1.default.existsSync(arquivo)) {
                    // Lê o arquivo de imagem como Buffer
                    const imageBuffer = fs_1.default.readFileSync(arquivo);
                    // Envia a imagem a partir do Buffer
                    yield pico.sendMessage(from, {
                        image: imageBuffer, // Envia a imagem a partir do Buffer
                        caption: text
                    }, { quoted: messageDetails });
                }
                else {
                    console.error('Arquivo não encontrado:', arquivo);
                }
            }
            else {
                console.error('O arquivo ou URL não é válido:', arquivo);
            }
        }
        catch (error) {
            console.error('Erro ao enviar imagem:', error);
        }
    });
    const enviarVideo = (arquivo, text) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield pico.sendMessage(from, {
                video: fs_1.default.readFileSync(arquivo),
                caption: text,
                mimetype: "video/mp4"
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar vídeo:', error);
        }
    });
    const enviarDocumento = (arquivo, text) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield pico.sendMessage(from, {
                document: fs_1.default.readFileSync(arquivo),
                caption: text
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar documento:', error);
        }
    });
    const enviarSticker = (arquivo) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield pico.sendMessage(from, {
                sticker: fs_1.default.readFileSync(arquivo)
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar sticker:', error);
        }
    });
    const enviarLocalizacao = (latitude, longitude, text) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield pico.sendMessage(from, {
                location: { latitude, longitude, caption: text }
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar localização:', error);
        }
    });
    const enviarContato = (numero, nome) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield pico.sendMessage(from, {
                contact: {
                    phone: numero,
                    name: { formattedName: nome }
                }
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar contato:', error);
        }
    });
    //console.log('from:', from);
    //console.log('messageDetails:', messageDetails);
    return {
        enviarTexto,
        enviarAudioGravacao,
        enviarImagem,
        enviarVideo,
        enviarDocumento,
        enviarSticker,
        enviarLocalizacao,
        enviarContato
    };
}
// Import necessário
// Função para verificar o tipo de mídia na mensagem
function baileysIs(messageDetails, mediaType) {
    return messageDetails.message && messageDetails.message[mediaType] !== undefined;
}
// Função para fazer o download da mídia
function mediaDow(messageDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const isImage = baileysIs(messageDetails, "image");
        const isVideo = baileysIs(messageDetails, "video");
        const isSticker = baileysIs(messageDetails, "sticker");
        // Função de download genérica para qualquer tipo de mídia
        const download = (webMessage, fileName, mediaType, extension) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mediaMessage = webMessage.message[mediaType];
                const buffer = yield (0, baileys_1.downloadMediaMessage)(webMessage, mediaMessage, mediaType); // Baileys já tem essa função
                const fs = require('fs');
                const path = `./${fileName}.${extension}`;
                // Salva o arquivo
                fs.writeFileSync(path, buffer);
                console.log(`${mediaType} baixado com sucesso em: ${path}`);
            }
            catch (error) {
                console.error(`Erro ao baixar ${mediaType}:`, error);
            }
        });
        // Condições para fazer o download de cada tipo de mídia
        if (isImage) {
            const fileName = 'imageFile'; // Personalize o nome do arquivo
            yield download(messageDetails, fileName, "image", "png"); // Baixar imagem
        }
        else if (isVideo) {
            const fileName = 'videoFile'; // Personalize o nome do arquivo
            yield download(messageDetails, fileName, "video", "mp4"); // Baixar vídeo
        }
        else if (isSticker) {
            const fileName = 'stickerFile'; // Personalize o nome do arquivo
            yield download(messageDetails, fileName, "sticker", "webp"); // Baixar sticker
        }
        else {
            console.log("Mensagem não contém mídia suportada.");
        }
    });
}
