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
//mport { createSticker } from "./admin/p";
//import {dow} from "./users/dow"
//import { alt } from "./admin/alt";
const perfil_1 = require("./users/perfil");
const message_1 = require("../exports/message");
const message_2 = require("../exports/message");
const dow_1 = require("./users/dow");
const stk_1 = require("./users/stk");
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
            p: perfil_1.perfil,
            menu: menu_1.executeMenuCommand,
            d: stk_1.dimg,
            help: help_1.executeHelpCommand,
            ping: ping_1.executePingCommand,
            //s: createSticker,
            t: dow_1.processMedia, // O comando t agora chama processMedia
            // outros comandos...
        };
        console.log(`Comando recebido: '${commandName}' de '${fromUser}'`);
        // Se for um comando e existir no mapeamento, execute
        if (isCommand) {
            if (commands[commandName]) {
                try {
                    yield commands[commandName](pico, from, messageDetails); // Execute o comando
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
        else {
            console.log("Mensagem não é um comando nem contém mídia.");
        }
    });
}
