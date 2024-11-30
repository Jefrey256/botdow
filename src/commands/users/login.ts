import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export async function Login(pico, searchUserLogin, enviarTexto, args, from, participant, messageDetails) {
  const date = new Date();

  try {
    console.log("Início do Login");
    console.log({ searchUserLogin, args, from, participant });

    // Validação de `from` e `participant` antes de prosseguir
    if (!from || !participant) {
      console.error("Informações do grupo ou usuário estão ausentes.");
      await pico.sendMessage(
        "120363332436182011@g.us", // Enviar para o grupo onde o comando foi recebido
        "Erro interno: informações do grupo ou usuário estão ausentes. Tente novamente mais tarde."
      );
      return;
    }

    // Inspecionando a estrutura de `args` para depuração
    console.log("Mensagem recebida:", JSON.stringify(args, null, 2));

    const filePath = path.resolve(__dirname, "../../../databass/data/login.json");

    // Verificando se o arquivo login.json existe e criando-o caso não exista
    if (!existsSync(filePath)) {
      console.log("Arquivo login.json não encontrado. Criando um novo arquivo...");
      writeFileSync(filePath, "[]");
    }

    // Lendo o arquivo JSON com os logins
    const login = JSON.parse(readFileSync(filePath, "utf-8"));
    console.log("Arquivo JSON carregado com sucesso:", login);

    // Verificando se o usuário já está registrado
    if (searchUserLogin) {
      console.log("Usuário já registrado:", searchUserLogin);
      await pico.sendMessage(from, "Você já está registrado.");
      return;
    }

    // Validando o apelido (args) enviado
    if (!args || !args.trim()) {
      console.log("Apelido inválido:", args);
      await pico.sendMessage(from, "Por favor, digite seu apelido ou nome.");
      return;
    }

    // Criando o objeto de login
    const objectLogin = {
      grupo: from,
      user: participant,
      info: [
        {
          apelido: args.trim(),
          totalMensagens: 0,
          saldo: 0,
          data: date.toLocaleDateString("pt-BR"),
        },
      ],
    };

    console.log("Novo objeto de login:", objectLogin);

    // Adicionando o novo login ao arquivo JSON
    login.push(objectLogin);
    writeFileSync(filePath, JSON.stringify(login, null, 3));
    console.log("Arquivo JSON atualizado com sucesso.");

    // Enviando mensagem de sucesso
    await pico.sendMessage(from, "Você foi registrado com sucesso e já pode usar meus comandos!");

  } catch (error) {
    // Tratamento de erros com logs detalhados
    console.error("Erro no processo de login:", error);

    // Enviando mensagem de erro ao usuário
    try {
      await pico.sendMessage(from, "Ocorreu um erro ao registrar. Tente novamente mais tarde.");
    } catch (sendError) {
      console.error("Erro ao tentar enviar mensagem de erro:", sendError);
    }
  }
}
