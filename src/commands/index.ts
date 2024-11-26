import { executeHelpCommand } from "./users/help";
import { executeMenuCommand } from "./users/menu";
import { executePingCommand } from "./users/ping";
import {handleDowCommand} from "./users/dow"
//import { alt } from "./admin/alt";
import { perfil } from "./users/perfil";
import { setupMessagingServices } from "../exports/message";
import { extractMessage } from "../exports/message";

// Função para tratar os comandos
export async function handleMenuCommand(pico, from, messageDetails) {
  const { enviarTexto } = setupMessagingServices(pico, from, messageDetails);
  const { finalMessageText, commandName } = extractMessage(messageDetails);

  // Mapeamento de comandos
  const commands = {
    p: perfil,
    menu: executeMenuCommand,
    help: executeHelpCommand,
    ping: executePingCommand,
    dow: handleDowCommand,
  };

  // Verifica se o comando existe
  if (commands[commandName]) {
    try {
      await commands[commandName](pico, from, messageDetails);  // Executa o comando
    } catch (error) {
      //await enviarTexto(`Erro ao executar o comando '${commandName}': ${error.message}`);
      console.log(`Erro ao executar o comando '${commandName}':`, error);
    }
  } else {
    // Caso o comando não seja encontrado
    const validCommands = Object.keys(commands).join(", "); // Lista de comandos válidos
   // await enviarTexto(`Comando '${commandName}' não encontrado. Comandos válidos: ${validCommands}`);
    console.log(`Comando '${commandName}' não encontrado.`);
  }
}