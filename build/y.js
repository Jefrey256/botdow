"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.chico = chico;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const pino_1 = __importDefault(require("pino"));
function chico() {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = (0, pino_1.default)({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, pino_1.default.destination('./wa-logs.txt'));
        logger.level = 'trace';
        // Configuração de autenticação
        const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(path_1.default.resolve(__dirname, "..", "databass", "dr-code"));
        const { version } = yield (0, baileys_1.fetchLatestBaileysVersion)();
        // Configuração do socket
        const pico = (0, baileys_1.default)({
            printQRInTerminal: false,
            version,
            logger,
            auth: state,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            markOnlineOnConnect: true,
        });
        // Evento de atualização de conexão
        pico.ev.on("connection.update", (update) => {
            var _a;
            const { connection, lastDisconnect } = update;
            if (connection === "close") {
                const shouldReconnect = ((_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                console.log("Conexão fechada devido ao erro:", lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, "Tentando reconectar...", shouldReconnect);
                if (shouldReconnect) {
                    chico(); // Reconecta
                }
            }
            else if (connection === "open") {
                console.log("Conexão aberta com sucesso!");
            }
        });
        pico.ev.on("creds.update", saveCreds);
        // Ouvinte para mensagens recebidas
        pico.ev.on("messages.upsert", (_a) => __awaiter(this, [_a], void 0, function* ({ messages }) {
            var _b, _c, _d;
            const messageDetails = messages[0];
            if (!messageDetails.message)
                return; // Ignora mensagens vazias
            const sender = messageDetails.key.remoteJid; // ID do remetente
            const messageType = Object.keys(messageDetails.message)[0]; // Tipo de mensagem (texto, imagem, etc.)
            // Verifica se a mensagem é um comando de texto
            if (messageType === "conversation" || messageType === "extendedTextMessage") {
                const text = messageDetails.message.conversation || messageDetails.message.extendedTextMessage.text;
                // Verifica se é o comando ,Dow
                if (text === ",Dow") {
                    console.log(`Comando ",Dow" recebido de ${sender}.`);
                    // Verifica se a mensagem citada contém uma imagem
                    const quotedMessage = (_d = (_c = (_b = messageDetails.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.contextInfo) === null || _d === void 0 ? void 0 : _d.quotedMessage;
                    if (quotedMessage && quotedMessage.imageMessage) {
                        try {
                            // Cria o objeto IMessageKey com os dados corretos
                            const messageKey = {
                                remoteJid: messageDetails.key.remoteJid, // JID do remetente
                                fromMe: messageDetails.key.fromMe, // Se a mensagem é do próprio bot
                                id: messageDetails.key.id, // ID da mensagem
                            };
                            // Faz o download da mídia citada
                            const buffer = yield (0, baileys_1.downloadMediaMessage)({
                                key: messageKey, // A chave da mensagem correta
                                message: quotedMessage // Mensagem que foi citada
                            }, "buffer", {}, {
                                logger,
                                reuploadRequest: pico.updateMediaMessage
                            });
                            // Criação de diretório para salvar o arquivo
                            const savePath = path_1.default.resolve(__dirname, "..", "downloads", `${Date.now()}`);
                            yield (0, promises_1.mkdir)(savePath, { recursive: true });
                            // Salva a imagem no diretório criado
                            const filePath = path_1.default.join(savePath, "imagem.jpeg");
                            yield (0, promises_1.writeFile)(filePath, buffer);
                            console.log(`Imagem salva com sucesso em: ${filePath}`);
                            yield pico.sendMessage(sender, { text: `Imagem salva com sucesso no diretório: ${filePath}` });
                        }
                        catch (error) {
                            console.error("Erro ao baixar imagem:", error);
                            yield pico.sendMessage(sender, { text: "Erro ao baixar a imagem. Tente novamente." });
                        }
                    }
                    else {
                        yield pico.sendMessage(sender, { text: "Por favor, responda a uma mensagem com imagem para usar o comando ,Dow." });
                    }
                }
            }
        }));
    });
}
