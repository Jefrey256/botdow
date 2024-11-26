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
exports.executeHelpCommand = executeHelpCommand;
const message_1 = require("../../exports/message");
const caption_1 = require("../caption");
function executeHelpCommand(chico, from, userName) {
    return __awaiter(this, void 0, void 0, function* () {
        const { enviarImagem, enviarAudioGravacao } = (0, message_1.setupMessagingServices)(chico, from, userName);
        try {
            // Envia áudio utilizando o método correto
            yield enviarAudioGravacao("assets/music/iphone.ogg");
            // Envia a imagem com o texto da legenda
            yield enviarImagem("assets/img/lol.png", (0, caption_1.menuCaption)(userName));
        }
        catch (error) {
            console.log("Erro ao executar o comando 'help':", error);
        }
    });
}
