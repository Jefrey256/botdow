"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.perfil = perfil;
const message_1 = require("../../exports/message");
const message_2 = require("../../exports/message");
function perfil(chico, from, messageDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        function geraNumero() {
            return Math.floor(Math.random() * 100) + 1;
        }
        // Corrigir: A extração correta do nome de usuário e número
        const { userName, fromUser } = (0, message_2.extractMessage)(messageDetails);
        const { enviarTexto, enviarImagem } = (0, message_1.setupMessagingServices)(chico, from, messageDetails);
        const imageUrl = "https://cdn.discordapp.com/attachments/1230010137721307183/1310027117429526639/IMG-20241123-WA0001.jpg?ex=6743b953&is=674267d3&hm=87e41c10e8b72d5e6e8757ac5dcca85b6d05b1ef7016a79a9414ffe8ac3c05a8&";
        try {
            const perfilMenuText = `
    ==== *Menu de Perfil* ====
    👤 Nome: ${userName}
    📱 Número: ${fromUser}
    🤖 Inteligência: ${geraNumero()}%
    🙃 Burrice: ${geraNumero()}%

    🔽 *Escolha uma opção:*
    1️⃣ Atualizar Foto de Perfil
    2️⃣ Ver Estatísticas
    3️⃣ Alterar Nome
    4️⃣ Sair do Menu

    Digite o número da opção para continuar.
    `;
            // Envia a imagem com a legenda, incluindo o nome de usuário
            yield chico.sendMessage(from, {
                image: { url: imageUrl },
                caption: perfilMenuText, // Texto com nome de usuário incluído
            }, { quoted: messageDetails });
        }
        catch (error) {
            console.log("Erro ao executar o comando 'perfil':", error);
        }
    });
}
