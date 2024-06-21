import fs from "node:fs"
import path from "node:path"
import { randomInt } from "crypto"
import { Player } from "../Models/ContentModels/Player.js"
import { GameUI } from "../UI/index.js"
import { Controls, GameControls, GameKey } from "./GameControls.js"
import { texture } from "../../content/models/Player.json"
import { Renderer } from "./Renderer.js"
import { GameEntityType } from "./Types/GameEntityType.js"
import { GameEntityDiraction } from "./Types/GameEntityDiraction.js"
import { entityLoader, EntityLoader } from "./EntityLoader.js"
import { Entity } from "../Models/ABSModels/Entity.js"
import { GameEntityLifeState } from "./Types/GameEntityLifeState.js"
import { Air } from "../Models/ContentModels/Air.js"
import config from "../config.json"

export interface TypedMapCell {
    texture: string
    entityType: GameEntityType
    originalEntityType: GameEntityType
    // entity: Entity
}

export interface GameConfig {
    Debug: boolean
    MapRender: boolean
}

export class Core {
    renderer: Renderer | null
    entityLoader: EntityLoader
    controls: Controls

    loadedEntites: Entity[]

    config: GameConfig

    player: Player

    RawMap: string[][]
    TypedMap: TypedMapCell[][]

    constructor(renderer: Renderer | null = null) {
        this.renderer = renderer
        this.controls = GameControls
        this.entityLoader = entityLoader

        this.player = new Player(3, 2)

        this.loadedEntites = entityLoader.getFloorEntites()

        this.config = config

        this.RawMap = new GameUI().getMap()
        this.TypedMap = this.getTypedMap()
    }

    MapElementsHandler(): void {
        this.updateTypedMap(this.player.x, this.player.y, this.getEntityByType(this.TypedMap[this.player.y][this.player.x].originalEntityType))
        // this.updateTypedMap(this.player.x, this.player.y, new Air(this.player.x, this.player.y))
        switch (this.controls.getActiveControls()) {
            case GameKey.Up:
                this.player.moveToPos(this.player.x, this.player.y-1, this.TypedMap, this.loadedEntites, GameEntityDiraction.Top)
                break
            case GameKey.Down:
                this.player.moveToPos(this.player.x, this.player.y+1, this.TypedMap, this.loadedEntites, GameEntityDiraction.Bottom)
                break
            case GameKey.Left:
                this.player.moveToPos(this.player.x-1, this.player.y, this.TypedMap, this.loadedEntites, GameEntityDiraction.Left, texture[0])
                break
            case GameKey.Right:
                this.player.moveToPos(this.player.x+1, this.player.y, this.TypedMap, this.loadedEntites, GameEntityDiraction.Right, texture[1])
                break
            default: 
                this.player.moveToPos(this.player.x, this.player.y, this.TypedMap, this.loadedEntites)
                break
        }

        this.controls.clearKeyActiveKey()
        this.updateTypedMap(this.player.x, this.player.y, this.player)
    }

    getMapEntityByCoord(x: number, y: number): Entity {
        const result: Entity[] = []

        this.loadedEntites.some((loadedEntity, i) => {
            if (loadedEntity.x === x && loadedEntity.y === y) return result.push(this.loadedEntites[i])
        })

        return result[0]
    }

    getEntityByType(entityType: GameEntityType): Entity {
        // this.loadedEntites = entityLoader.getFloorEntites()

        const result: Entity[] = []

        this.loadedEntites.some((entity, i) => {
            if (entity.type === entityType) return result.push(this.loadedEntites[i])
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
        this.TypedMap .some((y, i1) => {
            y.some((x, i2) => {
                let mapEntity = this.getMapEntityByCoord(i2, i1)
                if (mapEntity.lifeState === GameEntityLifeState.Death) { 
                    this.loadedEntites.some((loadedEntity, i) => {
                        if (loadedEntity.id === mapEntity.id) {
                            this.loadedEntites[i] = new Air(mapEntity.x, mapEntity.y, mapEntity.id)
                            return mapEntity = this.loadedEntites[i]
                        }
                    })

                    this.TypedMap[i1][i2].originalEntityType = GameEntityType.Air
                    this.TypedMap[i1][i2].entityType = mapEntity.type
                    this.TypedMap[i1][i2].texture = mapEntity.texture
                }
            })
        })
    }

    updateTypedMap(x: number, y: number, entity?: Entity, texture?: string, newOriginalEntityType?: GameEntityType): void {
        const mapEntity = this.getMapEntityByCoord(x, y)
        const Entity = !entity ? mapEntity : entity

        // if (Entity.lifeState === GameEntityLifeState.Death) newOriginalEntityType = GameEntityType.Air

        this.TypedMap[y][x] = { 
            texture: !texture ? Entity.texture : texture, 
            entityType: Entity.type, 
            originalEntityType: !newOriginalEntityType ? this.TypedMap[y][x].originalEntityType : newOriginalEntityType, 
        }
    }

    getMap(): string[][] {
        const simpleMap: string[][] = [[]]

        this.getCurrentTypedMap().some((y, i1) => {
            y.some((x, i2) => {
                const cell: string = x.texture

                simpleMap[i1][i2] = cell
            })

            simpleMap.push([])
        })

        return simpleMap
    }

    start(): void {
        this.controls.setKeypressListener()

        if (this.renderer) this.renderer.render()
    }
}

export { GameEntityType, GameEntityDiraction, randomInt, fs, path }
