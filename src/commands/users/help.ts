import { setupMessagingServices } from "../../exports/message";
import { menuCaption } from "../caption";

export async function executeHelpCommand(chico, from, userName) {
  const { enviarImagem, enviarAudioGravacao } = setupMessagingServices(chico, from, userName);
  try {
    // Envia áudio utilizando o método correto
    await enviarAudioGravacao("assets/music/iphone.ogg");

    // Envia a imagem com o texto da legenda
    await enviarImagem("assets/img/lol.png", menuCaption(userName));
  } catch (error) {
    console.log("Erro ao executar o comando 'help':", error);
  }
}
