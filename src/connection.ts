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
  const messageDetails = messages[0];

  if (!messageDetails.message) return; // Ignora mensagens vazias

  // Verifica se a mensagem foi enviada pelo próprio bot
  
  //
  //

  const { commandName } = extractMessage(messageDetails);
  const from = messageDetails.key.remoteJid;

  // Chama o comando de menu com os dados necessários
  
  await handleMenuCommand(pico, from, messageDetails);
});




}
