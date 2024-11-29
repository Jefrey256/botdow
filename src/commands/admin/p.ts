import { teste } from "../../exports/teste";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import fs from "fs";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { pico } from "../../bot"; // Supondo que pico seja o seu bot/instância de WhatsApp
import { exec } from "child_process"; // Para executar o ffmpeg

// Função para criar um sticker a partir de uma imagem
export async function createSticker(messageDetails, sender) {
  try {
    const { messageKey, quotedMessage } = teste(messageDetails);

    // Baixando a mídia da mensagem citada
    const buffer = await downloadMediaMessage(
      {
        key: messageKey,  // A chave da mensagem correta
        message: quotedMessage, // Mensagem que foi citada
      },
      "buffer",
      {},
      {
        logger: console,  // Logando no console (você pode personalizar o logger)
        reuploadRequest: pico.updateMediaMessage,  // Atualizar o media message
      }
    );

    // Criar diretório para salvar o arquivo
    const savePath = path.resolve(__dirname, "..", "downloads", `${Date.now()}`);
    await mkdir(savePath, { recursive: true });

    // Salva a imagem no diretório criado
    const filePath = path.join(savePath, "imagem.jpeg");
    await writeFile(filePath, buffer);

    console.log(`Imagem salva com sucesso em: ${filePath}`);

    // Enviar confirmação para o usuário
    await pico.sendMessage(sender, { text: `Imagem salva com sucesso no diretório: ${filePath}` });

    // Chama a função para criar o sticker
    await createStickerFromImage(filePath, sender);

  } catch (error) {
    console.error("Erro ao baixar imagem:", error);
    await pico.sendMessage(sender, { text: "Erro ao baixar a imagem. Tente novamente." });
  }
}

// Função para criar o sticker a partir da imagem usando ffmpeg
async function createStickerFromImage(filePath: string, sender: string) {
  try {
    // Caminho para o sticker em formato WebP
    const stickerPath = path.join(path.dirname(filePath), "sticker.webp");

    // Comando ffmpeg para converter a imagem para o formato WebP
    const command = `ffmpeg -i ${filePath} -vcodec libwebp -lossless 1 -q:v 50 -preset default -an -vsync 0 -s 512x512 ${stickerPath}`;

    // Executando o comando ffmpeg usando exec
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao criar o sticker: ${stderr}`);
        pico.sendMessage(sender, { text: "Erro ao criar o sticker. Tente novamente." });
        return;
      }

      console.log("Sticker criado com sucesso em:", stickerPath);

      // Envia o sticker para o usuário
      pico.sendMessage(sender, { sticker: fs.readFileSync(stickerPath) });

      console.log("Sticker enviado com sucesso.");
    });
  } catch (error) {
    console.error("Erro ao criar o sticker:", error);
    await pico.sendMessage(sender, { text: "Erro ao criar o sticker. Tente novamente." });
  }
}

// Função para exibir o menu de opções
async function showMenu(sender: string) {
  try {
    await pico.sendMessage(sender, {
      text: "Escolha uma opção do menu:\n1. Criar Sticker a partir de uma imagem\n2. Outro comando",
    });
  } catch (error) {
    console.error("Erro ao exibir o menu:", error);
  }
}

// Função para lidar com comandos

// Exemplo de como você pode chamar as funções no seu fluxo de mensagens
// Quando uma mensagem for recebida, o comando é identificado e a ação é realizada
