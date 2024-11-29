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
const path_1 = __importDefault(require("path"));
const pino_1 = __importDefault(require("pino"));
const message_1 = require("./exports/message");
const index_1 = require("./commands/index");
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
        pico.ev.on("messages.upsert", (_a) => __awaiter(this, [_a], void 0, function* ({ messages }) {
            const messageDetails = messages[0];
            if (!messageDetails.message)
                return; // Ignora mensagens vazias
            // Verifica se a mensagem foi enviada pelo próprio bot
            //
            //
            const { commandName } = (0, message_1.extractMessage)(messageDetails);
            const from = messageDetails.key.remoteJid;
            // Chama o comando de menu com os dados necessários
            yield (0, index_1.handleMenuCommand)(pico, from, messageDetails);
        }));
    });
}
