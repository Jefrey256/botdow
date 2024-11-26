"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDataFromMessage = extractDataFromMessage;
exports.splitByCharacters = splitByCharacters;
exports.formatCommand = formatCommand;
exports.baileysIs = baileysIs;
exports.getContent = getContent;
exports.removeAccentsAndSpecialCharacters = removeAccentsAndSpecialCharacters;
exports.onlyLettersAndNumbers = onlyLettersAndNumbers;
exports.download = download;
const baileys_1 = require("baileys");
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const promises_1 = require("fs/promises");
// Função para extrair dados da mensagem
function extractDataFromMessage(messageDetails) {
    const textMessage = messageDetails.message?.conversation;
    const extendedTextMessage = messageDetails.message?.extendedTextMessage;
    const extendedTextMessageText = extendedTextMessage?.text;
    const imageTextMessage = messageDetails.message?.imageMessage?.caption;
    const videoTextMessage = messageDetails.message?.videoMessage?.caption;
    const fullMessage = textMessage ||
        extendedTextMessageText ||
        imageTextMessage ||
        videoTextMessage;
    if (!fullMessage) {
        return {
            args: [],
            commandName: null,
            fullArgs: null,
            fullMessage: null,
            isReply: false,
            prefix: null,
            remoteJid: null,
            replyJid: null,
            userJid: null,
        };
    }
    const isReply = !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;
    const replyJid = extendedTextMessage?.contextInfo?.participant || null;
    const userJid = messageDetails?.key?.participant?.replace(/:[0-9][0-9]|:[0-9]/g, "");
    const [command, ...args] = fullMessage.split(" ");
    const prefix = command.charAt(0);
    const commandWithoutPrefix = command.replace(new RegExp(`^[${config_1.PREFIX}]+`), "");
    return {
        args: splitByCharacters(args.join(" "), ["\\", "|", "/"]),
        commandName: formatCommand(commandWithoutPrefix),
        fullArgs: args.join(" "),
        fullMessage,
        isReply,
        prefix,
        remoteJid: messageDetails?.key?.remoteJid,
        replyJid,
        userJid,
    };
}
// Função para dividir strings por caracteres
function splitByCharacters(str, characters) {
    characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
    const regex = new RegExp(`[${characters.join("")}]`);
    return str
        .split(regex)
        .map((str) => str.trim())
        .filter(Boolean);
}
// Função para formatar comandos
function formatCommand(text) {
    return onlyLettersAndNumbers(removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim()));
}
// Função para verificar mensagens do Baileys
function baileysIs(messageDetails, context) {
    return !!getContent(messageDetails, context);
}
// Função para obter o conteúdo de mensagens
function getContent(messageDetails, context) {
    return (messageDetails.message?.[`${context}Message`] ||
        messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[`${context}Message`]);
}
// Função para remover acentos e caracteres especiais
function removeAccentsAndSpecialCharacters(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "");
}
// Função para verificar apenas letras e números
function onlyLettersAndNumbers(text) {
    return text.replace(/[^a-zA-Z0-9]/g, "");
}
// Função para baixar arquivos de mensagens
async function download(messageDetails, fileName, context, // Usando o tipo restrito para context
extension) {
    const content = getContent(messageDetails, context);
    if (!content) {
        return null;
    }
    const stream = await (0, baileys_1.downloadContentFromMessage)(content, context);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const filePath = path_1.default.resolve(config_1.TEMP_DIR, `${fileName}.${extension}`);
    await (0, promises_1.writeFile)(filePath, buffer);
    return filePath;
}
