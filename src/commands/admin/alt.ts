import { isAudio, isImage, isVideo,isDocument, isSticker } from '../../exports/is';
import { proto } from '@whiskeysockets/baileys';

export async function handleIncomingMessage(messageDetails: proto.IWebMessageInfo) {
    if (isImage(messageDetails)) {
        console.log('A mensagem  contém uma imagem.');
    } else if (isVideo(messageDetails)) {
        console.log('A mensagem contém um vídeo.');
    } else if (isAudio(messageDetails)) {
        console.log('A mensagem contém um áudio.');
    } else if (isDocument(messageDetails)) {
        console.log('A mensagem contém um documento.');
    } else if (isSticker(messageDetails)) {
        console.log('A mensagem contém um sticker.');
    }else {
        console.log('Nenhuma mídia detectada.');
    }
  
}
