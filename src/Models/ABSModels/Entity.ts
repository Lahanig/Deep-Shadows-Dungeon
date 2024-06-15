import { GameEntityType, TypedMapCell } from "../../Core"

export abstract class Entity {
    x: number
    y: number
    texture: string

    constructor(x: number, y: number, texture: string = "U") {
        this.x = x
        this.y = y
        this.texture = texture
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