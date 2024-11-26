// src/commands/ping.ts
import { CommandData } from "../../interface";
import {setupMessagingServices} from "../../exports/message"

export async function executePingCommand( chico, from, messageDetails ) {
  const {enviarTexto} = setupMessagingServices(chico, from,messageDetails)
  try {
    enviarTexto("Pong!!")
  } catch (error) {
    console.log("Erro ao executar o comando 'ping':", error);
  }
}
