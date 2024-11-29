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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMedia = processMedia;
const baileys_1 = require("@whiskeysockets/baileys");
const promises_1 = require("fs/promises");
const path_1 = require("path");
/**
 * Função para processar e baixar a mídia, criando um diretório para armazená-la.
 * @param pico A instância do bot (para envio de mensagens).
 * @param from Número do remetente.
 * @param messageDetails Detalhes da mensagem que contém a mídia.
 */
function processMedia(pico, from, messageDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d, _e, _f;
        // Extrai a mídia
        const media = ((_d = messageDetails.message) === null || _d === void 0 ? void 0 : _d.imageMessage) ||
            ((_e = messageDetails.message) === null || _e === void 0 ? void 0 : _e.videoMessage) ||
            ((_f = messageDetails.message) === null || _f === void 0 ? void 0 : _f.audioMessage);
        if (!media) {
            console.error("Mídia não fornecida.");
            yield pico.sendMessage(from, "Nenhuma mídia foi enviada.");
            return;
        }
        console.log("Mídia encontrada:", media);
        // Faz o download da mídia
        try {
            const mediaType = media.mimetype; // Tipo completo da mídia, como image/png, video/mp4
            const transform = yield (0, baileys_1.downloadContentFromMessage)(media, mediaType.split("/")[0]);
            // Caminho para o diretório pathdow
            const path = (0, path_1.join)(__dirname, 'pathdow');
            // Verifica se o diretório existe, caso contrário, cria
            yield (0, promises_1.mkdir)(path, { recursive: true });
            // Obtém a extensão do arquivo (ex: .png, .mp4, etc.)
            const ext = mediaType.split("/")[1];
            // Define o caminho do arquivo, usando a extensão do tipo MIME
            const filePath = (0, path_1.join)(path, `media.${ext}`);
            // Baixa e salva o conteúdo da mídia
            const fileStream = (0, promises_1.writeFile)(filePath, '');
            try {
                for (var _g = true, transform_1 = __asyncValues(transform), transform_1_1; transform_1_1 = yield transform_1.next(), _a = transform_1_1.done, !_a; _g = true) {
                    _c = transform_1_1.value;
                    _g = false;
                    const chunk = _c;
                    yield (0, promises_1.writeFile)(filePath, chunk, { flag: 'a' }); // Escreve o conteúdo no arquivo
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = transform_1.return)) yield _b.call(transform_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // Envia mensagem com o arquivo salvo
            yield pico.sendMessage(from, {
                text: `Mídia salva com sucesso em ${filePath}`,
            });
            console.log(`Mídia salva em: ${filePath}`);
        }
        catch (error) {
            console.error("Erro ao processar a mídia:", error);
            yield pico.sendMessage(from, "Erro ao processar a mídia.");
        }
    });
}
