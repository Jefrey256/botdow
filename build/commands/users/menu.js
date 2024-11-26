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
exports.executeMenuCommand = executeMenuCommand;
const axios_1 = __importDefault(require("axios"));
const message_1 = require("../../exports/message");
const caption_1 = require("../caption");
function executeMenuCommand(chico, from, userName) {
    return __awaiter(this, void 0, void 0, function* () {
        const { enviarImagem, enviarAudioGravacao } = (0, message_1.setupMessagingServices)(chico, from, userName);
        try {
            // Envia áudio utilizando o método correto
            yield enviarAudioGravacao("assets/music/iphone.ogg");
            // URL da imagem
            const imageUrl = "https://api.telegram.org/file/bot7893516891:AAEzMszRACX92hdaRXwxzAtLL9QfHOXeiTI/photos/file_3.jpg";
            // Baixar a imagem usando axios
            const response = yield axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');
            // Envia a imagem com o texto da legenda
            yield enviarImagem(imageBuffer, (0, caption_1.menuCaption)(userName)); // Passando o buffer da imagem diretamente
        }
        catch (error) {
            console.log("Erro ao executar o comando 'help':", error);
        }
    });
}
