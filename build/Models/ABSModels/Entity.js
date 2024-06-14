"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
class Entity {
    constructor(x, y, texture = "U") {
        this.x = x;
        this.y = y;
        this.texture = texture;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map