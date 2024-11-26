import axios from "axios";
import { setupMessagingServices } from "../../exports/message";
import { menuCaption } from "../caption";

export async function executeMenuCommand(chico, from, userName) {
  const { enviarImagem, enviarAudioGravacao } = setupMessagingServices(chico, from, userName);
  try {
    // Envia áudio utilizando o método correto
    await enviarAudioGravacao("assets/music/iphone.ogg");

    // URL da imagem
    const imageUrl = "https://api.telegram.org/file/bot7893516891:AAEzMszRACX92hdaRXwxzAtLL9QfHOXeiTI/photos/file_3.jpg";

    // Baixar a imagem usando axios
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Envia a imagem com o texto da legenda
    await enviarImagem(imageBuffer, menuCaption(userName));  // Passando o buffer da imagem diretamente
  } catch (error) {
    console.log("Erro ao executar o comando 'help':", error);
  }
}
