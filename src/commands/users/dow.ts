import { proto, downloadContentFromMessage } from '@whiskeysockets/baileys';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Função para processar e baixar a mídia, criando um diretório para armazená-la.
 * @param pico A instância do bot (para envio de mensagens).
 * @param from Número do remetente.
 * @param messageDetails Detalhes da mensagem que contém a mídia.
 */
export async function processMedia(pico, from, messageDetails) {
  // Extrai a mídia
  const media = messageDetails.message?.imageMessage || 
               messageDetails.message?.videoMessage || 
               messageDetails.message?.audioMessage;

  if (!media) {
    console.error("Mídia não fornecida.");
    await pico.sendMessage(from, "Nenhuma mídia foi enviada.");
    return;
  }

  console.log("Mídia encontrada:", media);

  // Faz o download da mídia
  try {
    const mediaType = media.mimetype; // Tipo completo da mídia, como image/png, video/mp4
    const transform = await downloadContentFromMessage(media, mediaType.split("/")[0]);

    // Caminho para o diretório pathdow
    const path = join(__dirname, 'pathdow');
    
    // Verifica se o diretório existe, caso contrário, cria
    await mkdir(path, { recursive: true });

    // Obtém a extensão do arquivo (ex: .png, .mp4, etc.)
    const ext = mediaType.split("/")[1];

    // Gera um nome único para o arquivo usando timestamp
    const timestamp = Date.now(); // Usa o timestamp atual como identificador único
    const filePath = join(path, `media_${timestamp}.${ext}`); // Renomeia o arquivo com o timestamp

    // Baixa e salva o conteúdo da mídia
    const fileStream = writeFile(filePath, '');

    for await (const chunk of transform) {
      await writeFile(filePath, chunk, { flag: 'a' }); // Escreve o conteúdo no arquivo
    }

    // Envia mensagem com o arquivo salvo
    await pico.sendMessage(from, {
      text: `Mídia salva com sucesso em ${filePath}`,
    });

    console.log(`Mídia salva em: ${filePath}`);
    
  } catch (error) {
    console.error("Erro ao processar a mídia:", error);
    await pico.sendMessage(from, "Erro ao processar a mídia.");
  }
}
