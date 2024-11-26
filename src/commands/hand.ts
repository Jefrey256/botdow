import { pico } from './pico';  // Ajuste para o local correto do pico
import { handleDowCommand } from './commands/handleDowCommand'; // Importe a função

pico.ev.on("messages.upsert", async ({ messages }) => {
  const messageDetails = messages[0];
  if (!messageDetails.message) return; // Ignora mensagens vazias

  const { sender, messageType, quotedMessage } = teste(messageDetails);

  // Verifica se a mensagem é um comando de texto
  if (messageType === "conversation" || messageType === "extendedTextMessage") {
    const text = messageDetails.message.conversation || messageDetails.message.extendedTextMessage.text;

    // Verifica se é o comando ,Dow
    if (text === ",Dow") {
      console.log(`Comando ",Dow" recebido de ${sender}.`);

      // Chama a função handleDowCommand para tratar o download
      await handleDowCommand(messageDetails, pico.logger);
    }
  }
});
 