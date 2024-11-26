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
exports.handleIncomingMessage = handleIncomingMessage;
const is_1 = require("../../exports/is");
function handleIncomingMessage(messageDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, is_1.isImage)(messageDetails)) {
            console.log('A mensagem  contém uma imagem.');
        }
        else if ((0, is_1.isVideo)(messageDetails)) {
            console.log('A mensagem contém um vídeo.');
        }
        else if ((0, is_1.isAudio)(messageDetails)) {
            console.log('A mensagem contém um áudio.');
        }
        else if ((0, is_1.isDocument)(messageDetails)) {
            console.log('A mensagem contém um documento.');
        }
        else if ((0, is_1.isSticker)(messageDetails)) {
            console.log('A mensagem contém um sticker.');
        }
        else {
            console.log('Nenhuma mídia detectada.');
        }
    });
}
