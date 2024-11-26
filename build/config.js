"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMANDS_DIR = exports.OWNER_NUMBER = exports.BOT_NUMBER = exports.TEMP_DIR = exports.TIMMEOUTP = exports.BOT_EMOJI = exports.BOT_NAME = exports.PREFIX = void 0;
const path_1 = __importDefault(require("path"));
exports.PREFIX = ",";
exports.BOT_NAME = "chico";
exports.BOT_EMOJI = "";
exports.TIMMEOUTP = 500;
exports.TEMP_DIR = path_1.default.resolve(__dirname, "..", "assets", "temp");
exports.BOT_NUMBER = "5511920202020";
// Número do dono do bot. Coloque o número do dono do bot (apenas números).
exports.OWNER_NUMBER = "5511999999999";
// Diretório dos comandos
exports.COMMANDS_DIR = path_1.default.join(__dirname, "commands");
