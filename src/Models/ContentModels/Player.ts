import { Entity } from "../ABSModels/Entity"
import { texture } from "../../../content/models/Player.json"
import { GameEntityType, TypedMapCell } from "../../Core"

const model = { texture: texture }

export class Player extends Entity {
    constructor(x: number, y: number, texture: string = model.texture[1]) {
        super(x, y, texture)
    }

    isCollision(mapCell: TypedMapCell): boolean {
        if (mapCell.type === GameEntityType.Air) return false
        return true
    }
}