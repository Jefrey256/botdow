const media =
    messageDetails.message?.imageMessage ??
    messageDetails.message?.extendedTextMessage?.contextmessageDetails?.quotedMessage
      ?.imageMessage ??
    messageDetails.message?.videoMessage ??
    messageDetails.message?.extendedTextMessage?.contextmessageDetails?.quotedMessage
      ?.videoMessage ??
    messageDetails.message?.audioMessage ??
    messageDetails.message?.extendedTextMessage?.contextmessageDetails?.quotedMessage
      ?.audioMessage ??
    messageDetails.message?.stickerMessage ??
    messageDetails.message?.extendedTextMessage?.contextmessageDetails?.quotedMessage
      ?.stickerMessage ??
    messageDetails.message?.documentMessage ??
    messageDetails.message?.extendedTextMessage?.contextmessageDetails?.quotedMessage
      ?.documentMessage ??
    undefined;


/**
     * downloadContentFromMessage based in interaction.media
     * Use getMediaContent(true) for return buffer of action
     * alternative getMediaContent(buffer,media)
     */
    getMediaContent: async <AllowBuffer extends boolean = false>(
      buffer: AllowBuffer = false as AllowBuffer,
      media?: typeof message.media
    ): Promise<AllowBuffer extends true ? Buffer : internal.Transform> => {
      let transform: internal.Transform;
      if (!media) media = message.media;
      if (media instanceof proto.Message.ImageMessage) {
        transform = await downloadContentFromMessage(media, "image");
      } else if (media instanceof proto.Message.VideoMessage) {
        transform = await downloadContentFromMessage(media, "video");
      } else if (media instanceof proto.Message.AudioMessage) {
        transform = await downloadContentFromMessage(media, "audio");
      } else if (media instanceof proto.Message.StickerMessage) {
        transform = await downloadContentFromMessage(media, "sticker");
      } else if (media instanceof proto.Message.DocumentMessage) {
        transform = await downloadContentFromMessage(media, "document");
      }
      //@ts-ignore unnecessary types declares
      if (!buffer) return transform;
      else {
        let content = Buffer.from([]);
        for await (const chunk of transform) {
          content = Buffer.concat([content, chunk]);
        }
        //@ts-ignore unnecessary types declares
        return content;
      }
    },
    
    
    