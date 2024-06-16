import { GameEntityType, TypedMapCell, GameEntityDiraction } from "../../Core"
import { randomInt } from "crypto"

export abstract class Entity {
    hp: number
    x: number
    y: number
    texture: string
    diraction: GameEntityDiraction
    money: number

    constructor(x: number, y: number, texture: string = "U") {
        this.x = x
        this.y = y
        this.texture = texture
        this.diraction = GameEntityDiraction.Left
        this.hp = 1
        this.money = randomInt(0, 5)
    }

    setDiraction(diraction: GameEntityDiraction): void {
        this.diraction = diraction
    }

    setPos(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    isCollision(mapCell: TypedMapCell): boolean {
        if (mapCell.entityType === GameEntityType.Air) return false
        return true
    }

    getCollisionEntityType(mapCell: TypedMapCell): TypedMapCell["entityType"] {
        return mapCell.entityType
    }

    setTexture(texture: string): void {
        this.texture = texture
    }
}
