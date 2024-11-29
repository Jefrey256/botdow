export async function processMedia (pico, from, messageDetails) {
  // Extrai a mídia
  const media = messageDetails.message?.imageMessage || messageDetails.message?.videoMessage || messageDetails.message?.audioMessage;
  
  if (!media) {
    console.error("Mídia não fornecida.");
    await pico.sendMessage(from, "Nenhuma mídia foi enviada.");
    return;
  }

  console.log("Mídia encontrada:", media);

  // Aqui, você pode processar a mídia conforme necessário.
  // No caso de imagem, por exemplo, você pode enviar um link para o arquivo
  try {
    const mediaUrl = media.url; // Obtendo URL da mídia
    if (mediaUrl) {
      await pico.sendMessage(from, { 
        text: "Aqui está sua imagem:", 
        mediaUrl: mediaUrl, // Envia o link da mídia
        caption: media.caption || "Mídia recebida!" // Se houver uma legenda, envie-a
      });
    } else {
      // Se a mídia não tiver URL, você pode responder com uma mensagem de erro
      await pico.sendMessage(from, "Erro ao acessar a mídia.");
    }
  } catch (error) {
    console.error("Erro ao processar a mídia:", error);
    await pico.sendMessage(from, "Erro ao processar a mídia.");
  }
};
