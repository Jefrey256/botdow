// exports/message.ts
import { PREFIX } from "../config";
import { proto } from '@whiskeysockets/baileys';
import fs from "fs"

// Função para extrair dados de uma mensagem
export const extractMessage = (messageDetails) => {
  const mentions = messageDetails.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  
  const finalMessageText = messageDetails.message?.conversation || "";
  
  // O 'from' já existe, então apenas pegamos o número sem o sufixo '@s.whatsapp.net' (se for de grupo)
  const fromUser = messageDetails.key?.participant?.split('@')[0] || messageDetails.key?.remoteJid?.split('@')[0];

  const from = messageDetails.key?.remoteJid || "Remetente desconhecido";
  const userName = messageDetails?.pushName || "Usuário Desconhecido";
  const isCommand = finalMessageText.startsWith(PREFIX);
  const participant = messageDetails.key?.participant || messageDetails.key?.remoteJid;
  
  
  
  
  const commandName = isCommand ? finalMessageText.slice(PREFIX.length).split(" ")[0] : "";
  const args = finalMessageText.split(" ").slice(1);

  // Extração das mídias
  const imageMessage = messageDetails.message?.imageMessage || null;
  const videoMessage = messageDetails.message?.videoMessage || null;
  const audioMessage = messageDetails.message?.audioMessage || null;

  return { 
    mentions,
    finalMessageText,  // Texto completo da mensagem
    from,              // ID do remetente (pode ser do grupo)
    fromUser,          // Número do usuário sem o sufixo
    isCommand,         // Se é ou não um comando
    commandName,       // Nome do comando (se aplicável)
    args,              // Lista de argumentos do comando
    userName,          // Nome do usuário
    participant,       // ID do participante (se for de grupo ou privado)
    imageMessage,      // Imagem enviada (se houver)
    videoMessage,      // Vídeo enviado (se houver)
    audioMessage,      // Áudio enviado (se houver)
    
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

