"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teste = teste;
function teste(messageDetails) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const mediaq = ((_a = messageDetails.message) === null || _a === void 0 ? void 0 : _a.imageMessage) ||
        ((_e = (_d = (_c = (_b = messageDetails.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.contextInfo) === null || _d === void 0 ? void 0 : _d.quotedMessage) === null || _e === void 0 ? void 0 : _e.imageMessage) ||
        ((_f = messageDetails.message) === null || _f === void 0 ? void 0 : _f.videoMessage) ||
        ((_k = (_j = (_h = (_g = messageDetails.message) === null || _g === void 0 ? void 0 : _g.extendedTextMessage) === null || _h === void 0 ? void 0 : _h.contextInfo) === null || _j === void 0 ? void 0 : _j.quotedMessage) === null || _k === void 0 ? void 0 : _k.videoMessage) ||
        ((_l = messageDetails.message) === null || _l === void 0 ? void 0 : _l.audioMessage) ||
        ((_q = (_p = (_o = (_m = messageDetails.message) === null || _m === void 0 ? void 0 : _m.extendedTextMessage) === null || _o === void 0 ? void 0 : _o.contextInfo) === null || _p === void 0 ? void 0 : _p.quotedMessage) === null || _q === void 0 ? void 0 : _q.audioMessage) ||
        ((_r = messageDetails.message) === null || _r === void 0 ? void 0 : _r.stickerMessage) ||
        ((_v = (_u = (_t = (_s = messageDetails.message) === null || _s === void 0 ? void 0 : _s.extendedTextMessage) === null || _t === void 0 ? void 0 : _t.contextInfo) === null || _u === void 0 ? void 0 : _u.quotedMessage) === null || _v === void 0 ? void 0 : _v.stickerMessage) ||
        ((_w = messageDetails.message) === null || _w === void 0 ? void 0 : _w.documentMessage) ||
        ((_0 = (_z = (_y = (_x = messageDetails.message) === null || _x === void 0 ? void 0 : _x.extendedTextMessage) === null || _y === void 0 ? void 0 : _y.contextInfo) === null || _z === void 0 ? void 0 : _z.quotedMessage) === null || _0 === void 0 ? void 0 : _0.documentMessage) ||
        undefined;
    if (!mediaq) {
        console.warn("Nenhuma mídia encontrada em messageDetails.");
    }
    return {
        mediaq
    };
}
