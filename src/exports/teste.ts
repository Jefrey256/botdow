import { proto } from "@whiskeysockets/baileys";

export function teste(messageDetails){
  const sender = messageDetails.key.remoteJid
  const from = messageDetails.key.remoteJid
  const messageType = Object.keys(messageDetails.message)[0];
  const quotedMessage = messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const messageKey: proto.IMessageKey = {
              remoteJid: messageDetails.key.remoteJid, // JID do remetente
              fromMe: messageDetails.key.fromMe,       // Se a mensagem é do próprio bot
              id: messageDetails.key.id,               // ID da mensagem
            };
  

  
  return{
    from,
    sender,
    messageType,
    quotedMessage,
    messageKey
}
}
