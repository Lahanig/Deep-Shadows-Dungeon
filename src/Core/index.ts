import { Player } from "../Models/ContentModels/Player.js"
import { GameUI } from "../UI/index.js"
import { Controls, GameKey } from "./GameControls.js"
import { texture } from "../../content/models/Player.json"
import { Renderer } from "./Renderer.js"
import { GameEntityType } from "./Types/GameEntityType.js"
import { GameEntityDiraction } from "./Types/GameEntityDiraction.js"

export interface TypedMapCell {
    texture: string
    entityType: GameEntityType
    originalEntityType: GameEntityType
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

        this.updateTypedMap(this.player.x, this.player.y, this.getEntityTexture(this.TypedMap[this.player.y][this.player.x].originalEntityType)[0])
        switch (this.controls.getActiveControls()) {
            case GameKey.Up:
                this.player.moveToPos(this.player.x, this.player.y-1, this.TypedMap, GameEntityDiraction.Top)
                break
            case GameKey.Down:
                this.player.moveToPos(this.player.x, this.player.y+1, this.TypedMap, GameEntityDiraction.Bottom)
                break
            case GameKey.Left:
                this.player.moveToPos(this.player.x-1, this.player.y, this.TypedMap, GameEntityDiraction.Left, texture[0])
                break
            case GameKey.Right:
                this.player.moveToPos(this.player.x+1, this.player.y, this.TypedMap, GameEntityDiraction.Right, texture[1])
                break
            default: 
                this.player.moveToPos(this.player.x, this.player.y, this.TypedMap)
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
            
            case this.player.texture: 
                return GameEntityType.Player
        
            default: return GameEntityType.Undefined
        } 
    }

    getEntityTexture(entityType: GameEntityType): string[] {
        switch (entityType) {
            case GameEntityType.Air:
                return [" "]
            
            case GameEntityType.Border:
                return ["/", "\\", "|", "-"]
                
            case GameEntityType.Player:
                return [this.player.texture]

            default: return ["U"]
        }
    }

    getTypedMap(): TypedMapCell[][] {
        const TypedMap: TypedMapCell[][] = [[]]

        this.RawMap.forEach((y, i1) => {
            y.forEach((x, i2) => {
                const cell: TypedMapCell = { texture: x, entityType: this.getEntityType(x), originalEntityType: this.getEntityType(x) }

                TypedMap[i1][i2] = cell
            })

            TypedMap.push([])
        })

        return TypedMap
    }

    getCurrentTypedMap(): TypedMapCell[][] {
        return this.TypedMap
    }

    updateTypedMap(x: number, y: number, texture: string, newOriginalEntityType?: GameEntityType): void {
        const newTypedMap = this.getCurrentTypedMap()

        newTypedMap[y][x] = { texture: texture, entityType: this.getEntityType(texture), originalEntityType: !newOriginalEntityType ? newTypedMap[y][x].originalEntityType : newOriginalEntityType }

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

export { GameEntityType, GameEntityDiraction }
