import { WASocket } from '@whiskeysockets/baileys';
import { proto } from '@whiskeysockets/baileys';
//import { Logger } from 'some-package';  // Substitua se necessário.
/**
 * Função para baixar a mídia de uma mensagem citada.
 * @param socket - Instância do WASocket.
 * @param messageDetails - Detalhes da mensagem recebida.
 * @param logger - Logger para depuração.
 */
import * as fs from 'fs';
import * as path from 'path';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { extractMessage } from "../../exports/message";

export async function handleDowCommand(
  socket: WASocket,
  messageDetails: proto.IWebMessageInfo,
  logger,
): Promise<void> {
  // Extraindo as informações da mensagem
  const { from, imageMessage, commandName } = extractMessage(messageDetails);

  // Verificando o comando
  console.log('Comando recebido:', commandName);

  // Verificando se o comando é 'dow'
  if (commandName !== 'dow') {
    console.log('Comando não é "dow", retornando sem ação');
    return;
  }

  // Verificando se existe uma imagem na mensagem
  if (imageMessage) {
    console.log('Imagem encontrada, processando o download...');
    try {
      const message = { 
        key: messageDetails.key,
        message: { imageMessage } as proto.IMessage // Convertendo explicitamente para IMessage
      };

      // Faz o download da imagem
      const buffer = await downloadMediaMessage(
        message,
        "buffer",
        {},
        { logger, reuploadRequest: socket.updateMediaMessage }
      );

      // Criação de diretório para salvar o arquivo
      const savePath = path.resolve(__dirname, "..", "downloads", `${Date.now()}`);
      await fs.promises.mkdir(savePath, { recursive: true });

      // Salva a imagem no diretório criado
      const filePath = path.join(savePath, "imagem.jpeg");
      await fs.promises.writeFile(filePath, buffer);

      console.log(`Imagem salva com sucesso em: ${filePath}`);
      await socket.sendMessage(from, { text: `Imagem salva com sucesso no diretório: ${filePath}` });
    } catch (error) {
      console.error("Erro ao baixar imagem:", error);
      await socket.sendMessage(from, { text: "Erro ao baixar a imagem. Tente novamente." });
    }
  } else {
    console.log('Nenhuma imagem encontrada na resposta');
    if (from) {
      await socket.sendMessage(from, { text: "Por favor, responda a uma mensagem com imagem para usar o comando 'dow'." });
    }
  }
}
