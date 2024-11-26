import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadMediaMessage, proto } from "@whiskeysockets/baileys";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import P from "pino";
import { question } from "./exports/index";

export async function chico(): Promise<void> {
  const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, P.destination('./wa-logs.txt'));
  logger.level = 'trace';

  // Configuração de autenticação
  const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, "..", "databass", "dr-code"));
  const { version } = await fetchLatestBaileysVersion();

  // Configuração do socket
  const pico = makeWASocket({
    printQRInTerminal: false,
    version,
    logger,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true,
  });

  // Evento de atualização de conexão
  pico.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error as any)?.statusCode !== DisconnectReason.loggedOut;

      console.log("Conexão fechada devido ao erro:", lastDisconnect?.error, "Tentando reconectar...", shouldReconnect);

      if (shouldReconnect) {
        chico(); // Reconecta
      }
    } else if (connection === "open") {
      console.log("Conexão aberta com sucesso!");
    }
  });

  pico.ev.on("creds.update", saveCreds);

  // Ouvinte para mensagens recebidas
  pico.ev.on("messages.upsert", async ({ messages }) => {
    const messageDetails = messages[0];

    if (!messageDetails.message) return; // Ignora mensagens vazias

    const sender = messageDetails.key.remoteJid; // ID do remetente
    const messageType = Object.keys(messageDetails.message)[0]; // Tipo de mensagem (texto, imagem, etc.)

    // Verifica se a mensagem é um comando de texto
    if (messageType === "conversation" || messageType === "extendedTextMessage") {
      const text = messageDetails.message.conversation || messageDetails.message.extendedTextMessage.text;

      // Verifica se é o comando ,Dow
      if (text === ",Dow") {
        console.log(`Comando ",Dow" recebido de ${sender}.`);

        // Verifica se a mensagem citada contém uma imagem
        const quotedMessage = messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage;
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
  });
}
