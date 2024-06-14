import { Player } from "../Models/ContentModels/Player.js"
import { GameUI } from "../UI/index.js"
import { Controls, GameKey } from "./GameControls.js"

export enum GameEntityType {
    Air,
    Player,
    Border,
    Undefined
}

interface TypedMapCell {
    texture: string
    type: GameEntityType
}

export class Core {
    renderer: Renderer | null
    controls: Controls

    player: Player

    RawMap: string[][]
    TypedMap: TypedMapCell[][]

    constructor(renderer: Renderer | null = null) {
        this.renderer = renderer
        this.controls = new Controls()

        this.player = new Player(3, 2)

        this.RawMap = new GameUI().getMap()
        this.TypedMap = this.getTypedMap()
    }

    MapElementsHandler(): void {
        this.controls.keypressF()

        switch (this.controls.getActiveControls()) {
            case GameKey.Up:
                this.updateTypedMap(this.player.x, this.player.y, " ")
                this.player.y -= 1
                break
            case GameKey.Down:
                this.updateTypedMap(this.player.x, this.player.y, " ")
                this.player.y += 1
                break
            case GameKey.Left:
                this.updateTypedMap(this.player.x, this.player.y, " ")
                this.player.x -= 1
                break
            case GameKey.Right:
                this.updateTypedMap(this.player.x, this.player.y, " ")
                this.player.x += 1
                break
            default: 
                this.player.x += 0
                this.player.y += 0
                break
        }

        this.controls.clearKeyActiveKey()
        this.updateTypedMap(this.player.x, this.player.y, this.player.texture)
    }

    getEntityType(texture: string): GameEntityType {
        switch (texture) {
            case " ":
                return GameEntityType.Air
            
            case "/": 
                return GameEntityType.Border
            
            case "\\": 
                return GameEntityType.Border

            case "|": 
                return GameEntityType.Border
            
            case "-": 
                return GameEntityType.Border
            
            case "@": 
                return GameEntityType.Player
        
            default: return GameEntityType.Undefined
        } 
    }

    getTypedMap(): TypedMapCell[][] {
        const TypedMap: TypedMapCell[][] = [[]]

        this.RawMap.forEach((y, i1) => {
            y.forEach((x, i2) => {
                const cell: TypedMapCell = { texture: x, type: this.getEntityType(x) }

                TypedMap[i1][i2] = cell
            })

            TypedMap.push([])
        })

        return TypedMap
    }

    getCurrentTypedMap(): TypedMapCell[][] {
        return this.TypedMap
    }

    updateTypedMap(x: number, y: number, texture: string): void {
        const newTypedMap = this.getCurrentTypedMap()

        newTypedMap[y][x] = { texture: texture, type: this.getEntityType(texture) }

        this.TypedMap = newTypedMap
    }

    getMap(): string[][] {
        const simpleMap: string[][] = [[]]

        this.TypedMap.forEach((y, i1) => {
            y.forEach((x, i2) => {
                const cell: string = x.texture

                simpleMap[i1][i2] = cell
            })

            simpleMap.push([])
        })

        return simpleMap
    }

    start(): void {
        if (this.renderer) this.renderer.render()
    }
}

type GameLoop = {
    timeout: number
    interval: NodeJS.Timeout | null
}

export class Renderer extends Core {
    windowWidth: Number
    windowHeight: Number

    gameLoop: GameLoop

    UIMap: string[][]

    constructor(w: Number = 640, h: Number = 480) {
        super()
        this.windowWidth = w
        this.windowHeight = h

        this.gameLoop = {
            interval: null,
            timeout: 16.6
        }

        this.UIMap = []
    }

    render(): void {
        this.gameLoop.interval = setInterval(() => {
            this.MapElementsHandler()

            this.UIMap = this.getMap()

            // this.controls.keypressF()

            const temp = {
                UI: {
                    Map: ""
                }
            }

            this.UIMap.forEach(y => {
                y.forEach(x => {
                    temp.UI.Map += x
                })
                temp.UI.Map += "\n"
            })

            console.clear()
            console.log('Deep Shadows Dungeon \n')
            console.log('  Level 1')
            console.log(temp.UI.Map)
            console.log(`hello world!`)
            console.log(` `, this.getCurrentTypedMap()[1][2])
        }, this.gameLoop.timeout)
    }

    getUI() {
        return {
            map: this.UIMap
        }
    }
}