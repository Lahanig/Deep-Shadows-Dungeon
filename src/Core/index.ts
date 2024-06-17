import fs from "node:fs"
import path from "node:path"
import { randomInt } from "crypto"
import { Player } from "../Models/ContentModels/Player.js"
import { GameUI } from "../UI/index.js"
import { Controls, GameKey } from "./GameControls.js"
import { texture } from "../../content/models/Player.json"
import { Renderer } from "./Renderer.js"
import { GameEntityType } from "./Types/GameEntityType.js"
import { GameEntityDiraction } from "./Types/GameEntityDiraction.js"
import { entityLoader, EntityLoader } from "./EntityLoader.js"
import { Entity } from "../Models/ABSModels/Entity.js"
import { GameEntityLifeState } from "./Types/GameEntityLifeState.js"
import { Air } from "../Models/ContentModels/Air.js"

export interface TypedMapCell {
    texture: string
    entityType: GameEntityType
    originalEntityType: GameEntityType
    entity: Entity
}

export class Core {
    renderer: Renderer | null
    entityLoader: EntityLoader
    controls: Controls

    loadedEntites: Entity[]

    player: Player

    RawMap: string[][]
    TypedMap: TypedMapCell[][]

    constructor(renderer: Renderer | null = null) {
        this.renderer = renderer
        this.controls = new Controls()
        this.entityLoader = entityLoader

        this.player = new Player(3, 2)

        this.loadedEntites = entityLoader.getFloorEntites()

        this.RawMap = new GameUI().getMap()
        this.TypedMap = this.getTypedMap()
    }

    MapElementsHandler(): void {
        this.controls.keypressF()

        this.updateTypedMap(this.player.x, this.player.y, this.getEntityByType(this.TypedMap[this.player.y][this.player.x].originalEntityType))
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
        this.updateTypedMap(this.player.x, this.player.y, this.player)
    }

    getEntityByType(entityType: GameEntityType): Entity {
        // this.loadedEntites = entityLoader.getFloorEntites()

        const result: Entity[] = []

        this.loadedEntites.some(entity => {
            if (entity.type === entityType) return result.push(entity)
        })

        // console.log(result)
        return result[0]
    }

    getTypedMap(): TypedMapCell[][] {
        const TypedMap: TypedMapCell[][] = [[]]

        this.RawMap.some((y, i1) => {
            y.some((x, i2) => {
                this.loadedEntites.some(entity => {
                    if (entity.x === i2 && entity.y === i1) {
                        const cell: TypedMapCell = { 
                            texture: entity.texture, 
                            entityType: entity.type, 
                            originalEntityType: entity.lifeState !== GameEntityLifeState.Death ? entity.type : GameEntityType.Air, 
                            entity: entity 
                        }

                        return TypedMap[i1][i2] = cell
                    }
                })
            })

            TypedMap.push([])
        })

        return TypedMap
    }

    getCurrentTypedMap(): TypedMapCell[][] {
        this.checkDeathEntity()

        return this.TypedMap 
    }

    checkDeathEntity(): void {
        this.TypedMap.some((y, i1) => {
            y.some((x, i2) => {
                if (x.entity.lifeState === GameEntityLifeState.Death) {
                    x.entity = new Air(x.entity.x, x.entity.y)
                    x.originalEntityType = GameEntityType.Air
                    x.entityType = x.entity.type
                    x.texture = x.entity.texture
                }
            })
        })
    }

    updateTypedMap(x: number, y: number, entity?: Entity, texture?: string, newOriginalEntityType?: GameEntityType): void {
        const newTypedMap = this.getCurrentTypedMap()

        const Entity = !entity ? newTypedMap[y][x].entity : entity

        // if (Entity.lifeState === GameEntityLifeState.Death) newOriginalEntityType = GameEntityType.Air

        newTypedMap[y][x] = { 
            texture: !texture ? Entity.texture : texture, 
            entityType: Entity.type, 
            originalEntityType: !newOriginalEntityType ? newTypedMap[y][x].originalEntityType : newOriginalEntityType, 
            entity: Entity
        }

        this.TypedMap = newTypedMap
    }

    getMap(): string[][] {
        const simpleMap: string[][] = [[]]

        this.TypedMap.some((y, i1) => {
            y.some((x, i2) => {
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

export { GameEntityType, GameEntityDiraction, randomInt, fs, path }
