import { proto } from "@whiskeysockets/baileys";

export function teste(messageDetails){
  const mediaq = messageDetails.message?.imageMessage ||
                messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
                messageDetails.message?.videoMessage ||
                messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage ||
                messageDetails.message?.audioMessage ||
                messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage ||
                messageDetails.message?.stickerMessage ||
                messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage ||
                messageDetails.message?.documentMessage ||
                messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage ||
                undefined;

  if (!mediaq) {
    console.warn("Nenhuma mídia encontrada em messageDetails.");
  }

  

  
  return{
    mediaq
}
}
