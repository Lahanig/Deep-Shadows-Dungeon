import { GameEntityType, TypedMapCell, GameEntityDiraction, randomInt } from "../../Core"
import { GameEntityLifeState } from "../../Core/Types/GameEntityLifeState"
import { Player } from "../ContentModels/Player"

export abstract class Entity {
    hp: number
    x: number
    y: number
    texture: string
    diraction: GameEntityDiraction
    money: number
    type: GameEntityType
    lifeState: GameEntityLifeState

    constructor(x: number, y: number, texture: string = "U") {
        this.x = x
        this.y = y
        this.texture = texture
        this.diraction = GameEntityDiraction.Left
        this.hp = 1
        this.money = randomInt(0, 5)
        this.type = GameEntityType.Undefined
        this.lifeState = GameEntityLifeState.Alive
    }

    collision(x: number, y: number, mapCell: TypedMapCell[][], player: Player | null = null): void | null {
        return null
    }

    setDiraction(diraction: GameEntityDiraction): void {
        this.diraction = diraction
    }

    setPos(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    isCollision(mapCell: TypedMapCell): boolean {
        if (mapCell.entityType === GameEntityType.Spike || 
            mapCell.entityType === GameEntityType.Money || 
            mapCell.entityType === GameEntityType.Air
            ) 
            return false
        return true
    }

    getCollisionEntityType(mapCell: TypedMapCell): TypedMapCell["entityType"] {
        return mapCell.entityType
    }

    setTexture(texture: string): void {
        this.texture = texture
    }
}
