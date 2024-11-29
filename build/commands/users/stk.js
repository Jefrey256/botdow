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
exports.dimg = dimg;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dowMedia_1 = require("../../exports/dowMedia"); // Certifique-se de importar sua função getMediaContent
/**
 * Função para baixar e salvar uma imagem ou outro tipo de mídia.
 * @param pico Instância do cliente Baileys
 * @param from Número do remetente
 * @param messageDetails Detalhes da mensagem recebida
 * @param outputFolder Diretório de saída para salvar o arquivo
 */
function dimg(pico, from, messageDetails, outputFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Usando a função getMediaContent para obter a mídia (passando buffer como true para obter o conteúdo completo em Buffer)
            const buffer = yield (0, dowMedia_1.getMediaContent)(true, messageDetails); // Baixando como Buffer
            // Crie o diretório de saída, caso não exista
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder, { recursive: true });
            }
            // Gerar um nome para o arquivo (usando timestamp para garantir que o nome seja único)
            const fileName = `${Date.now()}.jpg`; // Você pode usar outras extensões dependendo do tipo de mídia
            const outputFilePath = path.join(outputFolder, fileName);
            // Escrevendo o Buffer no arquivo
            fs.writeFileSync(outputFilePath, buffer);
            // Confirmar que o arquivo foi salvo
            console.log(`Mídia salva em: ${outputFilePath}`);
            yield pico.sendMessage(from, { text: `Mídia salva em: ${outputFilePath}` });
        }
        catch (error) {
            console.error("Erro ao baixar a mídia:", error);
            yield pico.sendMessage(from, { text: "Erro ao processar a mídia." });
        }
    });
}
