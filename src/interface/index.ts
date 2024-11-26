// src/interfaces/CommandData.ts

export interface CommandData {
  chico: any; // Este é o cliente Baileys (ou outro cliente que você esteja utilizando para enviar mensagens)
  from: string; // O número de telefone do remetente ou ID do chat
  userName: string; // O nome de usuário ou texto associado à mensagem
}
