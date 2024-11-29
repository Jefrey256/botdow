// exports/message.ts
import { PREFIX } from "../config";
import { proto } from '@whiskeysockets/baileys';
import { BaileysEventMap, downloadMediaMessage } from '@whiskeysockets/baileys';
import fs from "fs"

// Função para extrair dados de uma mensagem
export const extractMessage = (messageDetails: any) => {
  // Verificação de que messageDetails está definido e possui uma estrutura válida
  if (!messageDetails || !messageDetails.message) {
    console.error("Detalhes da mensagem não encontrados ou estão mal formatados");
    return {
      media: undefined,
      mentions: [],
      finalMessageText: "",
      from: "Desconhecido",
      fromUser: "Desconhecido",
      isCommand: false,
      commandName: "",
      args: [],
      userName: "Desconhecido",
      participant: "Desconhecido"
    };
  }

  const mentions = messageDetails.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const finalMessageText = messageDetails.message?.conversation ||
                         messageDetails.message?.extendedTextMessage?.text ||
                         "";
  const fromUser = messageDetails.key?.participant?.split('@')[0] || messageDetails.key?.remoteJid?.split('@')[0];
  const from = messageDetails.key?.remoteJid || "Remetente desconhecido";
  const userName = messageDetails?.pushName || "Usuário Desconhecido";
  const isCommand = finalMessageText.startsWith(PREFIX);
  const participant = messageDetails.key?.participant || messageDetails.key?.remoteJid;

  // Verificação de mídia
  const media = messageDetails.message?.imageMessage ||
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

  

  const commandName = isCommand ? finalMessageText.slice(PREFIX.length).split(" ")[0] : "";
  const args = finalMessageText.split(" ").slice(1);

  return {
    media,
    mentions,
    finalMessageText,
    from,
    fromUser,
    isCommand,
    commandName,
    args,
    userName,
    participant,
  };
};








// Função para verificar se a mensagem contém uma imagem




export function setupMessagingServices(pico, from, messageDetails) {
  
  const enviarTexto = async (texto) => {
    try {
      await pico.sendMessage(from, { text: texto }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar texto:', error);
    }
  };

  const enviarAudioGravacao = async (arquivo) => {
    try {
      await pico.sendMessage(from, {
        audio: fs.readFileSync(arquivo),
        mimetype: "audio/mp4",
        ptt: true,
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
    }
  };




const enviarImagem = async (arquivo, text) => {
  try {
    // Verifica se 'arquivo' é uma URL (string que começa com 'http')
    if (typeof arquivo === 'string' && arquivo.startsWith('http')) {
      // Envia a imagem diretamente pela URL
      await pico.sendMessage(from, {
        image: { url: arquivo }, // Envia a imagem pela URL
        caption: text
      }, { quoted: messageDetails });
    } else if (Buffer.isBuffer(arquivo)) {
      // Se 'arquivo' for um Buffer (dados binários da imagem)
      await pico.sendMessage(from, {
        image: arquivo,  // Envia a imagem a partir do Buffer
        caption: text
      }, { quoted: messageDetails });
    } else if (typeof arquivo === 'string') {
      // Se 'arquivo' for um caminho local, lê o arquivo diretamente
      if (fs.existsSync(arquivo)) {
        // Lê o arquivo de imagem como Buffer
        const imageBuffer = fs.readFileSync(arquivo);

        // Envia a imagem a partir do Buffer
        await pico.sendMessage(from, {
          image: imageBuffer,  // Envia a imagem a partir do Buffer
          caption: text
        }, { quoted: messageDetails });
      } else {
        console.error('Arquivo não encontrado:', arquivo);
      }
    } else {
      console.error('O arquivo ou URL não é válido:', arquivo);
    }
  } catch (error) {
    console.error('Erro ao enviar imagem:', error);
  }
};

  


  const enviarVideo = async (arquivo, text) => {
    try {
      await pico.sendMessage(from, {
        video: fs.readFileSync(arquivo),
        caption: text,
        mimetype: "video/mp4"
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar vídeo:', error);
    }
  };

  const enviarDocumento = async (arquivo, text) => {
    try {
      await pico.sendMessage(from, {
        document: fs.readFileSync(arquivo),
        caption: text
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
    }
  };

  const enviarSticker = async (arquivo) => {
    try {
      await pico.sendMessage(from, {
        sticker: fs.readFileSync(arquivo)
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar sticker:', error);
    }
  };

  const enviarLocalizacao = async (latitude, longitude, text) => {
    try {
      await pico.sendMessage(from, {
        location: { latitude, longitude, caption: text }
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar localização:', error);
    }
  };

  const enviarContato = async (numero, nome) => {
    try {
      await pico.sendMessage(from, {
        contact: {
          phone: numero,
          name: { formattedName: nome }
        }
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
    }
  };

  //console.log('from:', from);
  //console.log('messageDetails:', messageDetails);

  return {
    enviarTexto,
    enviarAudioGravacao,
    enviarImagem,
    enviarVideo,
    enviarDocumento,
    enviarSticker,
    enviarLocalizacao,
    enviarContato
  };
}

 // Import necessário

// Função para verificar o tipo de mídia na mensagem
export function baileysIs(messageDetails, mediaType: 'image' | 'video' | 'sticker') {
  return messageDetails.message && messageDetails.message[mediaType] !== undefined;
}

// Função para fazer o download da mídia
export async function mediaDow(messageDetails) {
  const isImage = baileysIs(messageDetails, "image");
  const isVideo = baileysIs(messageDetails, "video");
  const isSticker = baileysIs(messageDetails, "sticker");

  // Função de download genérica para qualquer tipo de mídia
  const download = async (webMessage, fileName, mediaType, extension) => {
    try {
      const mediaMessage = webMessage.message[mediaType];
      const buffer = await downloadMediaMessage(webMessage, mediaMessage, mediaType); // Baileys já tem essa função
      const fs = require('fs');
      const path = `./${fileName}.${extension}`;
      
      // Salva o arquivo
      fs.writeFileSync(path, buffer);
      console.log(`${mediaType} baixado com sucesso em: ${path}`);
    } catch (error) {
      console.error(`Erro ao baixar ${mediaType}:`, error);
    }
  };

  // Condições para fazer o download de cada tipo de mídia
  if (isImage) {
    const fileName = 'imageFile'; // Personalize o nome do arquivo
    await download(messageDetails, fileName, "image", "png"); // Baixar imagem
  } else if (isVideo) {
    const fileName = 'videoFile'; // Personalize o nome do arquivo
    await download(messageDetails, fileName, "video", "mp4"); // Baixar vídeo
  } else if (isSticker) {
    const fileName = 'stickerFile'; // Personalize o nome do arquivo
    await download(messageDetails, fileName, "sticker", "webp"); // Baixar sticker
  } else {
    console.log("Mensagem não contém mídia suportada.");
  }
}
