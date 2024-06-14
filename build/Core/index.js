"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = exports.Core = exports.GameEntityType = void 0;
const Player_js_1 = require("../Models/ContentModels/Player.js");
const index_js_1 = require("../UI/index.js");
const GameControls_js_1 = require("./GameControls.js");
var GameEntityType;
(function (GameEntityType) {
    GameEntityType[GameEntityType["Air"] = 0] = "Air";
    GameEntityType[GameEntityType["Player"] = 1] = "Player";
    GameEntityType[GameEntityType["Border"] = 2] = "Border";
    GameEntityType[GameEntityType["Undefined"] = 3] = "Undefined";
})(GameEntityType || (exports.GameEntityType = GameEntityType = {}));
class Core {
    constructor(renderer = null) {
        this.renderer = renderer;
        this.controls = new GameControls_js_1.Controls();
        this.player = new Player_js_1.Player(3, 2, "@");
        this.RawMap = new index_js_1.GameUI().getMap();
        this.TypedMap = this.getTypedMap();
    }
    MapElementsHandler() {
        this.controls.keypressF();
        switch (this.controls.getActiveControls()) {
            case GameControls_js_1.GameKey.Up:
                this.updateTypedMap(this.player.x, this.player.y, " ");
                this.player.y -= 1;
                break;
            case GameControls_js_1.GameKey.Down:
                this.updateTypedMap(this.player.x, this.player.y, " ");
                this.player.y += 1;
                break;
            case GameControls_js_1.GameKey.Left:
                this.updateTypedMap(this.player.x, this.player.y, " ");
                this.player.x -= 1;
                break;
            case GameControls_js_1.GameKey.Right:
                this.updateTypedMap(this.player.x, this.player.y, " ");
                this.player.x += 1;
                break;
            default:
                this.player.x += 0;
                this.player.y += 0;
                break;
        }
        this.controls.clearKeyActiveKey();
        this.updateTypedMap(this.player.x, this.player.y, this.player.texture);
    }
    getEntityType(texture) {
        switch (texture) {
            case " ":
                return GameEntityType.Air;
            case "/":
                return GameEntityType.Border;
            case "\\":
                return GameEntityType.Border;
            case "|":
                return GameEntityType.Border;
            case "-":
                return GameEntityType.Border;
            case "@":
                return GameEntityType.Player;
            default: return GameEntityType.Undefined;
        }
    }
    getTypedMap() {
        const TypedMap = [[]];
        this.RawMap.forEach((y, i1) => {
            y.forEach((x, i2) => {
                const cell = { texture: x, type: this.getEntityType(x) };
                TypedMap[i1][i2] = cell;
            });
            TypedMap.push([]);
        });
        return TypedMap;
    }
    getCurrentTypedMap() {
        return this.TypedMap;
    }
    updateTypedMap(x, y, texture) {
        const newTypedMap = this.getCurrentTypedMap();
        newTypedMap[y][x] = { texture: texture, type: this.getEntityType(texture) };
        this.TypedMap = newTypedMap;
    }
    getMap() {
        const simpleMap = [[]];
        this.TypedMap.forEach((y, i1) => {
            y.forEach((x, i2) => {
                const cell = x.texture;
                simpleMap[i1][i2] = cell;
            });
            simpleMap.push([]);
        });
        return simpleMap;
    }
    start() {
        if (this.renderer)
            this.renderer.render();
    }
}
exports.Core = Core;
class Renderer extends Core {
    constructor(w = 640, h = 480) {
        super();
        this.windowWidth = w;
        this.windowHeight = h;
        this.gameLoop = {
            interval: null,
            timeout: 16.6
        };
        this.UIMap = [];
    }
    render() {
        this.gameLoop.interval = setInterval(() => {
            this.MapElementsHandler();
            this.UIMap = this.getMap();
            const temp = {
                UI: {
                    Map: ""
                }
            };
            this.UIMap.forEach(y => {
                y.forEach(x => {
                    temp.UI.Map += x;
                });
                temp.UI.Map += "\n";
            });
            console.clear();
            console.log('Deep Shadows Dungeon \n');
            console.log('  Level 1');
            console.log(temp.UI.Map);
            console.log(`hello world!`);
            console.log(` `, this.getCurrentTypedMap()[1][2]);
        }, this.gameLoop.timeout);
    }
    getUI() {
        return {
            map: this.UIMap
        };
    }
}
exports.Renderer = Renderer;
//# sourceMappingURL=index.js.map