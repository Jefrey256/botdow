import {proto} from "@whiskeysockets/baileys";


export function isImage(messageDetails: proto.IWebMessageInfo): boolean {
    return !!messageDetails.message?.imageMessage;
}

// Função para verificar se a mensagem contém um vídeo
export function isVideo(messageDetails: proto.IWebMessageInfo): boolean {
    return !!messageDetails.message?.videoMessage;
}

// Função para verificar se a mensagem contém um áudio
export function isAudio(messageDetails: proto.IWebMessageInfo): boolean {
    return !!messageDetails.message?.audioMessage;
}

// Função para verificar se a mensagem contém um documento
export function isDocument(messageDetails: proto.IWebMessageInfo): boolean {
    return !!messageDetails.message?.documentMessage;
}

// Função para verificar se a mensagem contém um sticker
export function isSticker(messageDetails: proto.IWebMessageInfo): boolean {
    return !!messageDetails.message?.stickerMessage;
}
