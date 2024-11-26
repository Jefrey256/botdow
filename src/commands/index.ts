import { executeHelpCommand } from "./users/help";
import { executeMenuCommand } from "./users/menu";
import { executePingCommand } from "./users/ping";
//mport {handleDowCommand} from "./users/dow"
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
    //dow: handleDowCommand,
  };

  // Verifica se o comando existe
  console.log(`Comando recebido: '${commandName}' de '${from}'`);

if (commands[commandName]) {
  try {
    await commands[commandName](pico, from, messageDetails);
  } catch (error) {
    await enviarTexto(`Erro ao executar o comando '${commandName}': ${error.message}`);
    console.error(`Erro ao executar o comando '${commandName}':`, error);
  }
} else {
  await enviarTexto(`Comando '${commandName}' não encontrado. Comandos válidos: ${Object.keys(commands).join(", ")}`);
  
  console.log(`Comando '${commandName}' não encontrado. Comandos válidos: ${Object.keys(commands).join(", ")}`);
}

}