// exports/message.ts
import { PREFIX } from "../config";
import { proto } from '@whiskeysockets/baileys';
import fs from "fs"

// Função para extrair dados de uma mensagem
export const extractMessage = (messageDetails: proto.IWebMessageInfo) => {
  const mentions = messageDetails.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const finalMessageText = messageDetails.message?.conversation || messageDetails.message?.extendedTextMessage?.text || "";

  // Extraindo o número sem o sufixo '@s.whatsapp.net' (se for de grupo)
  const fromUser = messageDetails.key?.participant?.split('@')[0] || messageDetails.key?.remoteJid?.split('@')[0] || "Desconhecido";

  const from = messageDetails.key?.remoteJid || "Remetente desconhecido";
  const userName = messageDetails?.pushName || "Usuário Desconhecido";

  const PREFIX = ","; // Prefixo do comando
  const isCommand = finalMessageText.startsWith(PREFIX); // Verifica se a mensagem começa com o prefixo
  const participant = messageDetails.key?.participant || messageDetails.key?.remoteJid;
  
  const messageKey: proto.IMessageKey = {
  remoteJid: messageDetails.key.remoteJid,  // ID do remetente ou grupo
  fromMe: messageDetails.key.fromMe,        // Se a mensagem foi enviada pelo bot
  id: messageDetails.key.id,                // ID único da mensagem
};


  // Extração de comando e seus argumentos
  let commandName = "";
  let args: string[] = [];

  if (isCommand) {
    const messageWithoutPrefix = finalMessageText.slice(PREFIX.length).trim();
    commandName = messageWithoutPrefix.split(" ")[0]?.toLowerCase() || ""; // Comando em minúsculo
    args = messageWithoutPrefix.split(" ").slice(1);
  }

  // Extração de mídias
  const imageMessage = messageDetails.message?.imageMessage || null;
  const videoMessage = messageDetails.message?.videoMessage || null;
  const audioMessage = messageDetails.message?.audioMessage || null;

  // Tipo de mensagem
  const messageType1 = Object.keys(messageDetails.message || {})[0];

  // Chave da mensagem
  const messageKey1: proto.IMessageKey = {
    remoteJid: messageDetails.key.remoteJid || "",
    fromMe: messageDetails.key.fromMe || false,
    id: messageDetails.key.id || "",
  };
  

  // Retorno do objeto final
  return { 
    messageKey,
    messageKey1,
    messageType1,
    mentions,
    finalMessageText,
    from,
    fromUser,
    isCommand,
    commandName,
    args,
    userName,
    participant,
    imageMessage,
    videoMessage,
    audioMessage,
  };
};




// Função para verificar se a mensagem contém uma imagem




export function setupMessagingServices(chico, from, messageDetails) {
  
  const enviarTexto = async (texto) => {
    try {
      await chico.sendMessage(from, { text: texto }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar texto:', error);
    }
  };

  const enviarAudioGravacao = async (arquivo) => {
    try {
      await chico.sendMessage(from, {
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
      await chico.sendMessage(from, {
        image: { url: arquivo }, // Envia a imagem pela URL
        caption: text
      }, { quoted: messageDetails });
    } else if (Buffer.isBuffer(arquivo)) {
      // Se 'arquivo' for um Buffer (dados binários da imagem)
      await chico.sendMessage(from, {
        image: arquivo,  // Envia a imagem a partir do Buffer
        caption: text
      }, { quoted: messageDetails });
    } else if (typeof arquivo === 'string') {
      // Se 'arquivo' for um caminho local, lê o arquivo diretamente
      if (fs.existsSync(arquivo)) {
        // Lê o arquivo de imagem como Buffer
        const imageBuffer = fs.readFileSync(arquivo);

        // Envia a imagem a partir do Buffer
        await chico.sendMessage(from, {
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
      await chico.sendMessage(from, {
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
      await chico.sendMessage(from, {
        document: fs.readFileSync(arquivo),
        caption: text
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
    }
  };

  const enviarSticker = async (arquivo) => {
    try {
      await chico.sendMessage(from, {
        sticker: fs.readFileSync(arquivo)
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar sticker:', error);
    }
  };

  const enviarLocalizacao = async (latitude, longitude, text) => {
    try {
      await chico.sendMessage(from, {
        location: { latitude, longitude, caption: text }
      }, { quoted: messageDetails });
    } catch (error) {
      console.error('Erro ao enviar localização:', error);
    }
  };

  const enviarContato = async (numero, nome) => {
    try {
      await chico.sendMessage(from, {
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

