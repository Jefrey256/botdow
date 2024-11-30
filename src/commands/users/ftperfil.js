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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alterarP = void 0;
var path_1 = require("path");
var promises_1 = require("fs/promises");
var baileys_1 = require("@whiskeysockets/baileys");
/**
 * Função para baixar uma imagem e salvar como `banner.png` na pasta `assets/img`.
 */
function alterarP(pico, from, messageDetails) {
    var _a, e_1, _b, _c;
    var _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function () {
        var imageMessage, outputFolder, filePath, stream, chunks, _j, stream_1, stream_1_1, chunk, e_1_1, error_1;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    imageMessage = ((_d = messageDetails.message) === null || _d === void 0 ? void 0 : _d.imageMessage) ||
                        ((_h = (_g = (_f = (_e = messageDetails.message) === null || _e === void 0 ? void 0 : _e.extendedTextMessage) === null || _f === void 0 ? void 0 : _f.contextInfo) === null || _g === void 0 ? void 0 : _g.quotedMessage) === null || _h === void 0 ? void 0 : _h.imageMessage);
                    if (!!imageMessage) return [3 /*break*/, 2];
                    console.log("Nenhuma imagem encontrada.");
                    return [4 /*yield*/, pico.sendMessage(from, { text: "Envie ou marque uma imagem para substituir o banner." })];
                case 1:
                    _k.sent();
                    return [2 /*return*/];
                case 2:
                    _k.trys.push([2, 19, , 21]);
                    outputFolder = (0, path_1.join)(__dirname, "../../../assets/img");
                    return [4 /*yield*/, (0, promises_1.mkdir)(outputFolder, { recursive: true })];
                case 3:
                    _k.sent();
                    filePath = (0, path_1.join)(outputFolder, "banner.png");
                    return [4 /*yield*/, (0, baileys_1.downloadContentFromMessage)(imageMessage, "image")];
                case 4:
                    stream = _k.sent();
                    chunks = [];
                    _k.label = 5;
                case 5:
                    _k.trys.push([5, 10, 11, 16]);
                    _j = true, stream_1 = __asyncValues(stream);
                    _k.label = 6;
                case 6: return [4 /*yield*/, stream_1.next()];
                case 7:
                    if (!(stream_1_1 = _k.sent(), _a = stream_1_1.done, !_a)) return [3 /*break*/, 9];
                    _c = stream_1_1.value;
                    _j = false;
                    try {
                        chunk = _c;
                        chunks.push(chunk);
                    }
                    finally {
                        _j = true;
                    }
                    _k.label = 8;
                case 8: return [3 /*break*/, 6];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_1_1 = _k.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _k.trys.push([11, , 14, 15]);
                    if (!(!_j && !_a && (_b = stream_1.return))) return [3 /*break*/, 13];
                    return [4 /*yield*/, _b.call(stream_1)];
                case 12:
                    _k.sent();
                    _k.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16: 
                // Salvar a imagem com o nome fixo "banner.png" substituindo a imagem existente
                return [4 /*yield*/, (0, promises_1.writeFile)(filePath, Buffer.concat(chunks))];
                case 17:
                    // Salvar a imagem com o nome fixo "banner.png" substituindo a imagem existente
                    _k.sent();
                    console.log("Imagem substitu\u00EDda por banner.png em: ".concat(filePath));
                    // Confirmação ao usuário
                    return [4 /*yield*/, pico.sendMessage(from, { text: "Banner substituído com sucesso." })];
                case 18:
                    // Confirmação ao usuário
                    _k.sent();
                    return [3 /*break*/, 21];
                case 19:
                    error_1 = _k.sent();
                    console.error("Erro ao substituir o banner:", error_1);
                    return [4 /*yield*/, pico.sendMessage(from, { text: "Erro ao substituir o banner. Tente novamente." })];
                case 20:
                    _k.sent();
                    return [3 /*break*/, 21];
                case 21: return [2 /*return*/];
            }
        });
    });
}
exports.alterarP = alterarP;
