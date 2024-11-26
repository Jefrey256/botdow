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
const fs_1 = __importDefault(require("fs"));
// Função para extrair dados de uma mensagem
const extractMessage = (messageDetails) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const mentions = ((_c = (_b = (_a = messageDetails.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.contextInfo) === null || _c === void 0 ? void 0 : _c.mentionedJid) || [];
    const finalMessageText = ((_d = messageDetails.message) === null || _d === void 0 ? void 0 : _d.conversation) || ((_f = (_e = messageDetails.message) === null || _e === void 0 ? void 0 : _e.extendedTextMessage) === null || _f === void 0 ? void 0 : _f.text) || "";
    // Extraindo o número sem o sufixo '@s.whatsapp.net' (se for de grupo)
    const fromUser = ((_h = (_g = messageDetails.key) === null || _g === void 0 ? void 0 : _g.participant) === null || _h === void 0 ? void 0 : _h.split('@')[0]) || ((_k = (_j = messageDetails.key) === null || _j === void 0 ? void 0 : _j.remoteJid) === null || _k === void 0 ? void 0 : _k.split('@')[0]) || "Desconhecido";
    const from = ((_l = messageDetails.key) === null || _l === void 0 ? void 0 : _l.remoteJid) || "Remetente desconhecido";
    const userName = (messageDetails === null || messageDetails === void 0 ? void 0 : messageDetails.pushName) || "Usuário Desconhecido";
    const PREFIX = ","; // Prefixo do comando
    const isCommand = finalMessageText.startsWith(PREFIX); // Verifica se a mensagem começa com o prefixo
    const participant = ((_m = messageDetails.key) === null || _m === void 0 ? void 0 : _m.participant) || ((_o = messageDetails.key) === null || _o === void 0 ? void 0 : _o.remoteJid);
    const messageKey = {
        remoteJid: messageDetails.key.remoteJid, // ID do remetente ou grupo
        fromMe: messageDetails.key.fromMe, // Se a mensagem foi enviada pelo bot
        id: messageDetails.key.id, // ID único da mensagem
    };
    // Extração de comando e seus argumentos
    let commandName = "";
    let args = [];
    if (isCommand) {
        const messageWithoutPrefix = finalMessageText.slice(PREFIX.length).trim();
        commandName = ((_p = messageWithoutPrefix.split(" ")[0]) === null || _p === void 0 ? void 0 : _p.toLowerCase()) || ""; // Comando em minúsculo
        args = messageWithoutPrefix.split(" ").slice(1);
    }
    // Extração de mídias
    const imageMessage = ((_q = messageDetails.message) === null || _q === void 0 ? void 0 : _q.imageMessage) || null;
    const videoMessage = ((_r = messageDetails.message) === null || _r === void 0 ? void 0 : _r.videoMessage) || null;
    const audioMessage = ((_s = messageDetails.message) === null || _s === void 0 ? void 0 : _s.audioMessage) || null;
    // Tipo de mensagem
    const messageType1 = Object.keys(messageDetails.message || {})[0];
    // Chave da mensagem
    const messageKey1 = {
        remoteJid: messageDetails.key.remoteJid || "",
        fromMe: messageDetails.key.fromMe || false,
        id: messageDetails.key.id || "",
    };
    // Retorno do objeto final
    return {
        messageKey,
        messageKey1,
        messageType1,
        mentions,
        finalMessageText,
        from,
        fromUser,
        isCommand,
        commandName,
        args,
        userName,
        participant,
        imageMessage,
        videoMessage,
        audioMessage,
    };
};
exports.extractMessage = extractMessage;
// Função para verificar se a mensagem contém uma imagem
function setupMessagingServices(chico, from, messageDetails) {
    const enviarTexto = (texto) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield chico.sendMessage(from, { text: texto }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar texto:', error);
        }
    });
    const enviarAudioGravacao = (arquivo) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield chico.sendMessage(from, {
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
                yield chico.sendMessage(from, {
                    image: { url: arquivo }, // Envia a imagem pela URL
                    caption: text
                }, { quoted: messageDetails });
            }
            else if (Buffer.isBuffer(arquivo)) {
                // Se 'arquivo' for um Buffer (dados binários da imagem)
                yield chico.sendMessage(from, {
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
                    yield chico.sendMessage(from, {
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
            yield chico.sendMessage(from, {
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
            yield chico.sendMessage(from, {
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
            yield chico.sendMessage(from, {
                sticker: fs_1.default.readFileSync(arquivo)
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar sticker:', error);
        }
    });
    const enviarLocalizacao = (latitude, longitude, text) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield chico.sendMessage(from, {
                location: { latitude, longitude, caption: text }
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.error('Erro ao enviar localização:', error);
        }
    });
    const enviarContato = (numero, nome) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield chico.sendMessage(from, {
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
