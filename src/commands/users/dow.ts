import { downloadMediaMessage } from '@whiskeysockets/baileys'; // Certifique-se de importar a função correta
import path from 'path';
import { mkdir, writeFile } from 'fs/promises'; // Asegure-se de usar fs.promises para usar await
import { pico } from '../../connection'; // Ajuste para o local correto do seu pico
import { proto } from '@whiskeysockets/baileys'; // Certifique-se de ter a biblioteca importada corretamente

export const handleDowCommand = async (
  messageDetails: proto.IWebMessageInfo, 
  logger: P.Logger
) => {
  if (!messageDetails.message) return; // Ignora mensagens vazias

  const { sender, messageType, quotedMessage } = teste(messageDetails);

  // Verifica se a mensagem é um comando de texto
  if (messageType === "conversation" || messageType === "extendedTextMessage") {
    const text = messageDetails.message.conversation || messageDetails.message.extendedTextMessage.text;

    // Verifica se é o comando ,Dow
    if (text === ",Dow") {
      console.log(`Comando ",Dow" recebido de ${sender}.`);

      // Verifica se a mensagem citada contém uma imagem
      if (quotedMessage && quotedMessage.imageMessage) {
        try {
          // Cria o objeto IMessageKey com os dados corretos
          const messageKey: proto.IMessageKey = {
            remoteJid: messageDetails.key.remoteJid, // JID do remetente
            fromMe: messageDetails.key.fromMe,       // Se a mensagem é do próprio bot
            id: messageDetails.key.id,               // ID da mensagem
          };

          // Faz o download da mídia citada
          const buffer = await downloadMediaMessage(
            { 
              key: messageKey,  // A chave da mensagem correta
              message: quotedMessage // Mensagem que foi citada
            },
            "buffer",
            {},
            { 
              logger,
              reuploadRequest: pico.updateMediaMessage
            }
          );

          // Criação de diretório para salvar o arquivo
          const savePath = path.resolve(__dirname, "..", "downloads", `${Date.now()}`);
          await mkdir(savePath, { recursive: true });

          // Salva a imagem no diretório criado
          const filePath = path.join(savePath, "imagem.jpeg");
          await writeFile(filePath, buffer);

          console.log(`Imagem salva com sucesso em: ${filePath}`);
          await pico.sendMessage(sender, { text: `Imagem salva com sucesso no diretório: ${filePath}` });
        } catch (error) {
          console.error("Erro ao baixar imagem:", error);
          await pico.sendMessage(sender, { text: "Erro ao baixar a imagem. Tente novamente." });
        }
      } else {
        await pico.sendMessage(sender, { text: "Por favor, responda a uma mensagem com imagem para usar o comando ,Dow." });
      }
    }
  }
};

