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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMenuCommand = handleMenuCommand;
const help_1 = require("./users/help");
const menu_1 = require("./users/menu");
const ping_1 = require("./users/ping");
const perfil_1 = require("./users/perfil");
const message_1 = require("../exports/message");
const message_2 = require("../exports/message");
const dow_1 = require("./users/dow");
const p_1 = require("./admin/p");
const alt_1 = require("./admin/alt");
const sticker_1 = require("./admin/sticker");
const ftperfil_1 = require("./users/ftperfil");
// Função que trata o comando e a mídia
function handleMenuCommand(pico, from, messageDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const { enviarTexto } = (0, message_1.setupMessagingServices)(pico, from, messageDetails);
        const { finalMessageText, commandName, fromUser, media, isCommand, from: messageFrom, } = (0, message_2.extractMessage)(messageDetails);
        // Se a mensagem for do próprio bot, não responde
        if (messageFrom === pico) {
            console.log("Mensagem do próprio bot, ignorando...");
            return;
        }
        const commands = {
            alt: ftperfil_1.alterarP,
            p: perfil_1.perfil,
            a: alt_1.videoDow,
            s: p_1.handleMessage, // Adiciona o comando que lida com o download de imagens
            menu: menu_1.executeMenuCommand,
            help: help_1.executeHelpCommand,
            ping: ping_1.executePingCommand,
            k: sticker_1.createSticker,
            t: dow_1.processMedia, // O comando 't' chama processMedia para processar mídia
            // outros comandos...
        };
        console.log(`Comando recebido: '${commandName}' de '${fromUser}'`);
        // Se for um comando e existir no mapeamento, execute
        if (isCommand) {
            if (commands[commandName]) {
                try {
                    yield commands[commandName](pico, from, messageDetails); // Execute o comando
                    console.log(`Comando '${commandName}' executado com sucesso.`);
                }
                catch (error) {
                    yield enviarTexto(`Erro ao executar o comando '${commandName}': ${error.message}`);
                    console.error(`Erro ao executar o comando '${commandName}':`, error);
                }
            }
            else {
                // Comando não encontrado
                yield enviarTexto(`Comando '${commandName}' não encontrado. Comandos válidos: ${Object.keys(commands).join(", ")}`);
                console.log(`Comando '${commandName}' não encontrado. Comandos válidos: ${Object.keys(commands).join(", ")}`);
            }
        }
        else if (media && commandName === 't') { // Só processa a mídia se o comando 't' for enviado
            console.log("Processando mídia...");
            yield (0, dow_1.processMedia)(pico, from, messageDetails); // Chama a função de processamento de mídia
        }
        else {
            console.log("Mensagem não é um comando nem contém mídia.");
        }
    });
}
