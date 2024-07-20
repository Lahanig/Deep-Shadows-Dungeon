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
import { GameSavesLoader, SavesLoader } from "./SavesLoader.js"

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
    savesLoader: SavesLoader

    loadedEntites: Entity[]

    config: GameConfig

    player: Player

    RawMap: string[][]
    TypedMap: TypedMapCell[][]

    constructor(renderer: Renderer | null = null) {
        this.renderer = renderer
        this.controls = GameControls
        this.entityLoader = entityLoader
        this.savesLoader = GameSavesLoader

        this.player = new Player(0, 0)
        this.setPlayerStat()

        this.loadedEntites = entityLoader.getFloorEntites()

        this.config = config

        this.RawMap = new GameUI().getMap()
        this.TypedMap = this.getTypedMap()
    }

    // setPause(toggle: boolean = true) {
    //     this.pause = toggle
    // }

    setPlayerStat() {
        // Устанавливаем данные игрока из файла сохранения

        const CurrentPlayerStats = this.savesLoader.getProgressCurrentPlayerStats(),
            tempPlayer: any = this.player

        Object["keys"](this.player).some((stat) => {
            Object["keys"](CurrentPlayerStats).some((newStat: string, i: number) => {
                if (stat === newStat) {
                    tempPlayer[stat] = Object["values"](CurrentPlayerStats)[i]
                }
            })
        })

        this.player = tempPlayer
    }

    getPlayerTexture(): string {
        // Возвращаем текстуру игрока в зависимости от его направления

        switch (this.player.diraction) {
            case GameEntityDiraction.Left:
                return texture[0]
            
            case GameEntityDiraction.Right:
                return texture[1]

            default: return this.player.texture
        }
    }

    MapElementsHandler(): void {
        // Обновляем элементы на карте

        if (this.player.hp <= 0) {
            this.player.lifeState = GameEntityLifeState.Death
            return this.savesLoader.setProgressCurrentPlayerStats(this.player)
        } 

        this.updateTypedMap(this.player.x, this.player.y, this.getEntityByType(this.TypedMap[this.player.y][this.player.x].originalEntityType))
        // this.updateTypedMap(this.player.x, this.player.y, new Air(this.player.x, this.player.y))

        this.player.setTexture(this.getPlayerTexture())

        switch (this.controls.getActiveControls()) {
            case GameKey.Up:
                this.player.moveToPos(this.player.x, this.player.y-1, this.TypedMap, this.loadedEntites, this.player.texture, GameEntityDiraction.Top)
                break
            case GameKey.Down:
                this.player.moveToPos(this.player.x, this.player.y+1, this.TypedMap, this.loadedEntites, this.player.texture, GameEntityDiraction.Bottom)
                break
            case GameKey.Left:
                this.player.moveToPos(this.player.x-1, this.player.y, this.TypedMap, this.loadedEntites, this.player.texture, GameEntityDiraction.Left)
                break
            case GameKey.Right:
                this.player.moveToPos(this.player.x+1, this.player.y, this.TypedMap, this.loadedEntites, this.player.texture, GameEntityDiraction.Right)
                break
            default: 
                this.player.moveToPos(this.player.x, this.player.y, this.TypedMap, this.loadedEntites, this.player.texture)
                break
        }

        // this.controls.clearKeyActiveKey()
        this.updateTypedMap(this.player.x, this.player.y, this.player)
        if (this.controls.getActiveControls() !== GameKey.Undefined) this.savesLoader.setProgressCurrentPlayerStats(this.player)
        //if (this.TypedMap[this.player.y][this.player.x].originalEntityType == GameEntityType.Door) this.loadedEntites = entityLoader.getFloorEntites()
        if (this.player.isNextFloor === true) {
            this.updateTypedMap(this.player.x, this.player.y, this.getEntityByType(this.TypedMap[this.player.y][this.player.x].originalEntityType))
            this.player.setTexture(this.getPlayerTexture())
            this.player.moveToPos(1, 7, this.TypedMap, this.loadedEntites, this.player.texture)
            this.updateTypedMap(this.player.x, this.player.y, this.player)

            setTimeout(() => {
                this.player.isNextFloor = false

                this.savesLoader.setProgressCurrentPlayerStats(this.player)

                this.loadedEntites = entityLoader.getFloorEntites()   
                
                setTimeout(() => this.TypedMap = this.getTypedMap(), 100)
            }, 100)
        }
    }

    getMapEntityByCoord(x: number, y: number): Entity {
        // Возвращаем сущность используя ее координаты на карте

        const result: Entity[] = []

        this.loadedEntites.some((loadedEntity, i) => {
            if (loadedEntity.x === x && loadedEntity.y === y) return result.push(this.loadedEntites[i])
        })

        return result[0]
    }

    getEntityByType(entityType: GameEntityType): Entity {
        // Возвращаем сущность по типу

        // this.loadedEntites = entityLoader.getFloorEntites()

        const result: Entity[] = []

        this.loadedEntites.some((entity, i) => {
            if (entity.type === entityType) return result.push(this.loadedEntites[i])
        })

        // console.log(result)
        return result[0]
    }

    getTypedMap(): TypedMapCell[][] {
        // Возвращаем типизированную карту

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
        // Возвращаем текущую типизированную карту

        this.checkDeathEntity()

        return this.TypedMap 
    }

    checkDeathEntity(): void {
        // Проверяем LifeState сущностей

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

                    this.savesLoader.setProgressEntitesLoaded(this.loadedEntites)
                }
            })
        })
    }

    updateTypedMap(x: number, y: number, entity?: Entity, texture?: string, newOriginalEntityType?: GameEntityType): void {
        // Обновляем типизированную карту

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
        // Возвращаем карту игры пригодную к отрисовке

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
        // Запускаем игру

        this.controls.setKeypressListener()

        if (this.renderer) this.renderer.render()
    }
}

export { GameEntityType, GameEntityDiraction, GameEntityLifeState, randomInt, fs, path }
