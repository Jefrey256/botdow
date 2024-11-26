"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImage = isImage;
exports.isVideo = isVideo;
exports.isAudio = isAudio;
exports.isDocument = isDocument;
exports.isSticker = isSticker;
function isImage(messageDetails) {
    var _a;
    return !!((_a = messageDetails.message) === null || _a === void 0 ? void 0 : _a.imageMessage);
}
// Função para verificar se a mensagem contém um vídeo
function isVideo(messageDetails) {
    var _a;
    return !!((_a = messageDetails.message) === null || _a === void 0 ? void 0 : _a.videoMessage);
}
// Função para verificar se a mensagem contém um áudio
function isAudio(messageDetails) {
    var _a;
    return !!((_a = messageDetails.message) === null || _a === void 0 ? void 0 : _a.audioMessage);
}
// Função para verificar se a mensagem contém um documento
function isDocument(messageDetails) {
    var _a;
    return !!((_a = messageDetails.message) === null || _a === void 0 ? void 0 : _a.documentMessage);
}
// Função para verificar se a mensagem contém um sticker
function isSticker(messageDetails) {
    var _a;
    return !!((_a = messageDetails.message) === null || _a === void 0 ? void 0 : _a.stickerMessage);
}
