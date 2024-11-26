import readline from "readline"
//import pino from "pino"



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const question = (text: string): Promise<string> => {
  return new Promise<string>((resolve) => rl.question(text, resolve));
};


//xport const logger = pino({level: "silent"})