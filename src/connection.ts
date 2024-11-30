import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadMediaMessage, proto } from "@whiskeysockets/baileys";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import P from "pino";
import { question } from "./exports/index"
import { teste } from "./exports/teste";
import {extractMessage} from "./exports/message"
import {handleMenuCommand} from "./commands/index"
import {mediaDow} from "./exports/message"




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

  
pico.ev.on("messages.upsert", async ({ messages }) => {
  const messageDetails = messages[0]; // Obtém a primeira mensagem do array
  
  if (!messageDetails.message) return; // Ignora mensagens vazias

  const from = messageDetails.key.remoteJid; // Obtém o número de telefone do remetente

  // Verificar se a mensagem é uma resposta (citação)
  let originalMessage = null;
  if (messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
    originalMessage = messageDetails.message.extendedTextMessage.contextInfo.quotedMessage;
    console.log("Mensagem citada: ", originalMessage);
  }

  // Verifica se a mensagem contém uma mídia (imagem ou vídeo) e lê a legenda (se houver)
  const mediaMessage =
    messageDetails.message?.imageMessage ||
    messageDetails.message?.videoMessage ||
    messageDetails.message?.documentMessage;

  let caption = "";
  if (mediaMessage && messageDetails.message?.extendedTextMessage?.text) {
    caption = messageDetails.message.extendedTextMessage.text; // A legenda da mídia
    console.log("Legenda da mídia:", caption);
  }

  // Verifica se o comando está presente na mensagem
  const { commandName } = extractMessage(messageDetails);

  // Se a mensagem contiver um comando, chama o handler para o menu
  if (commandName) {
    await handleMenuCommand(pico, from, messageDetails);
  } else {
    // Caso não haja comando, pode tratar a mensagem normalmente
    console.log("Mensagem recebida:", messageDetails);
    // Aqui você pode adicionar lógica adicional para interagir com o usuário
  }

  // Se houver um conteúdo marcado ou legenda, você pode processá-lo de acordo
  if (originalMessage) {
    console.log("Conteúdo da mensagem original (citado):", originalMessage);
  }

  if (caption) {
    console.log("Legendas ou texto associado à mídia:", caption);
  }
});




}
