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
const dow_1 = require("./users/dow");
//import { alt } from "./admin/alt";
const perfil_1 = require("./users/perfil");
const message_1 = require("../exports/message");
const message_2 = require("../exports/message");
// Função para tratar os comandos
function handleMenuCommand(pico, from, messageDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const { enviarTexto } = (0, message_1.setupMessagingServices)(pico, from, messageDetails);
        const { finalMessageText, commandName } = (0, message_2.extractMessage)(messageDetails);
        // Mapeamento de comandos
        const commands = {
            p: perfil_1.perfil,
            menu: menu_1.executeMenuCommand,
            help: help_1.executeHelpCommand,
            ping: ping_1.executePingCommand,
            dow: dow_1.handleDowCommand,
        };
        // Verifica se o comando existe
        if (commands[commandName]) {
            try {
                yield commands[commandName](pico, from, messageDetails); // Executa o comando
            }
            catch (error) {
                //await enviarTexto(`Erro ao executar o comando '${commandName}': ${error.message}`);
                console.log(`Erro ao executar o comando '${commandName}':`, error);
            }
        }
        else {
            // Caso o comando não seja encontrado
            const validCommands = Object.keys(commands).join(", "); // Lista de comandos válidos
            // await enviarTexto(`Comando '${commandName}' não encontrado. Comandos válidos: ${validCommands}`);
            console.log(`Comando '${commandName}' não encontrado.`);
        }
    });
}
