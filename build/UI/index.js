"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUI = void 0;
const UITemplate_json_1 = __importDefault(require("../../content/UI/UITemplate.json"));
class GameUI {
    constructor() {
        this.GameUITemplates = {
            Map: UITemplate_json_1.default.Map
        };
    }
    getMap() {
        return this.GameUITemplates.Map;
    }
}
exports.GameUI = GameUI;
//# sourceMappingURL=index.js.map