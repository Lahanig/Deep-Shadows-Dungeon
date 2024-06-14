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
exports.Controls = exports.GameKey = void 0;
var keypress = require('keypress');
var GameKey;
(function (GameKey) {
    GameKey[GameKey["Up"] = 0] = "Up";
    GameKey[GameKey["Down"] = 1] = "Down";
    GameKey[GameKey["Left"] = 2] = "Left";
    GameKey[GameKey["Right"] = 3] = "Right";
    GameKey[GameKey["Undefined"] = 4] = "Undefined";
})(GameKey || (exports.GameKey = GameKey = {}));
class Controls {
    constructor() {
        this.currentKeyPressed = GameKey.Undefined;
        this.currentKeyReleased = GameKey.Undefined;
    }
    getActiveControls() {
        return this.currentKeyPressed;
    }
    clearKeyActiveKey() {
        this.currentKeyPressed = this.getActiveControlsType("hh");
    }
    keypressF() {
        return __awaiter(this, void 0, void 0, function* () {
            keypress(process.stdin);
            process.stdin.on('keypress', (ch, key) => __awaiter(this, void 0, void 0, function* () {
                this.currentKeyPressed = this.getActiveControlsType(key.name);
                if (key && key.ctrl && key.name == 'c') {
                    process.exit();
                }
            }));
            process.stdin.on('keyrelease', (ch, key) => __awaiter(this, void 0, void 0, function* () {
                console.log("got key", key);
                this.currentKeyPressed = this.getActiveControlsType("");
            }));
            process.stdin.setRawMode(true);
            process.stdin.resume();
        });
    }
    getActiveControlsType(key) {
        switch (key) {
            case "w":
                return GameKey.Up;
            case "s":
                return GameKey.Down;
            case "a":
                return GameKey.Left;
            case "d":
                return GameKey.Right;
            default: return GameKey.Undefined;
        }
    }
}
exports.Controls = Controls;
//# sourceMappingURL=GameControls.js.map