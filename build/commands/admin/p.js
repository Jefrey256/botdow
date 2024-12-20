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
exports.handleMessage = handleMessage;
const downloadImg_1 = require("../../exports/downloadImg"); // Importe a função de download de imagem
const baileys_1 = require("@whiskeysockets/baileys"); // Importando os tipos necessários
const message_1 = require("../../exports/message");
/**
 * Função que lida com a mensagem e verifica se contém mídia
 * @param pico Instância do cliente Baileys
 * @param from Número do remetente
 * @param messageDetails Detalhes da mensagem recebida
 */
function handleMessage(pico, from, messageDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputFolder = './downloads'; // Caminho onde as mídias serão salvas
        // Verifica se a mensagem contém mídia
        const { media } = (0, message_1.extractMessage)(messageDetails); // Usando a função extractMessage para verificar a mídia na mensagem
        if (media) {
            // Se for uma imagem, chama a função para fazer o download da imagem
            if (media instanceof baileys_1.proto.Message.ImageMessage) {
                yield (0, downloadImg_1.downloadImage)(pico, from, messageDetails, outputFolder);
            }
            // Caso contrário, trate outros tipos de mídia ou mensagens de texto
            else {
                console.log("Tipo de mídia não suportado ou não é uma imagem.");
                yield pico.sendMessage(from, { text: "Somente videos podem ser baixadas." });
            }
        }
        else {
            console.log("Nenhuma mídia encontrada na mensagem.");
            yield pico.sendMessage(from, { text: "Nenhuma mídia foi enviada." });
        }
    });
}
