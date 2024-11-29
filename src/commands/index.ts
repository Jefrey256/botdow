import { executeHelpCommand } from "./users/help";
import { executeMenuCommand } from "./users/menu";
import { executePingCommand } from "./users/ping";
//import {dow} from "./users/dow"
//import { alt } from "./admin/alt";
import { perfil } from "./users/perfil";
import { setupMessagingServices } from "../exports/message";
import { extractMessage } from "../exports/message";
import {processMedia} from "./users/dow"

import {createSticker} from "./admin/p"


// Função que trata o comando e a mídia
export async function handleMenuCommand(pico, from, messageDetails) {
  const { enviarTexto } = setupMessagingServices(pico, from, messageDetails);
  const {
    finalMessageText,
    commandName,
    fromUser,
    media,
    isCommand,
    from: messageFrom,
  } = extractMessage(messageDetails);

  // Se a mensagem for do próprio bot, não responde
  if (messageFrom === pico) {
    console.log("Mensagem do próprio bot, ignorando...");
    return;
  }

  const commands = {
    p: perfil,
    menu: executeMenuCommand,
    help: executeHelpCommand,
    ping: executePingCommand,
    t: processMedia, // O comando t agora chama processMedia
    // outros comandos...
  };

  console.log(`Comando recebido: '${commandName}' de '${fromUser}'`);

  // Se for um comando e existir no mapeamento, execute
  if (isCommand) {
    if (commands[commandName]) {
      try {
        await commands[commandName](pico, from, messageDetails); // Execute o comando
      } catch (error) {
        await enviarTexto(`Erro ao executar o comando '${commandName}': ${error.message}`);
        console.error(`Erro ao executar o comando '${commandName}':`, error);
      }
    } else {
      // Comando não encontrado
      await enviarTexto(`Comando '${commandName}' não encontrado. Comandos válidos: ${Object.keys(commands).join(", ")}`);
      console.log(`Comando '${commandName}' não encontrado. Comandos válidos: ${Object.keys(commands).join(", ")}`);
    }
  } else if (media) {
    // Processa a mídia diretamente
    console.log("Processando mídia...");
    await processMedia(pico, from, messageDetails);
  } else {
    console.log("Mensagem não é um comando nem contém mídia.");
  }
}
