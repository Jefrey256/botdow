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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDowCommand = handleDowCommand;
//import { Logger } from 'some-package';  // Substitua se necessário.
/**
 * Função para baixar a mídia de uma mensagem citada.
 * @param socket - Instância do WASocket.
 * @param messageDetails - Detalhes da mensagem recebida.
 * @param logger - Logger para depuração.
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const baileys_1 = require("@whiskeysockets/baileys");
const message_1 = require("../../exports/message");
function handleDowCommand(socket, messageDetails, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extraindo as informações da mensagem
        const { from, imageMessage, commandName } = (0, message_1.extractMessage)(messageDetails);
        // Verificando o comando
        console.log('Comando recebido:', commandName);
        // Verificando se o comando é 'dow'
        if (commandName !== 'dow') {
            console.log('Comando não é "dow", retornando sem ação');
            return;
        }
        // Verificando se existe uma imagem na mensagem
        if (imageMessage) {
            console.log('Imagem encontrada, processando o download...');
            try {
                const message = {
                    key: messageDetails.key,
                    message: { imageMessage } // Convertendo explicitamente para IMessage
                };
                // Faz o download da imagem
                const buffer = yield (0, baileys_1.downloadMediaMessage)(message, "buffer", {}, { logger, reuploadRequest: socket.updateMediaMessage });
                // Criação de diretório para salvar o arquivo
                const savePath = path.resolve(__dirname, "..", "downloads", `${Date.now()}`);
                yield fs.promises.mkdir(savePath, { recursive: true });
                // Salva a imagem no diretório criado
                const filePath = path.join(savePath, "imagem.jpeg");
                yield fs.promises.writeFile(filePath, buffer);
                console.log(`Imagem salva com sucesso em: ${filePath}`);
                yield socket.sendMessage(from, { text: `Imagem salva com sucesso no diretório: ${filePath}` });
            }
            catch (error) {
                console.error("Erro ao baixar imagem:", error);
                yield socket.sendMessage(from, { text: "Erro ao baixar a imagem. Tente novamente." });
            }
        }
        else {
            console.log('Nenhuma imagem encontrada na resposta');
            if (from) {
                yield socket.sendMessage(from, { text: "Por favor, responda a uma mensagem com imagem para usar o comando 'dow'." });
            }
        }
    });
}
