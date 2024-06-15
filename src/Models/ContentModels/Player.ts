import { Entity } from "../ABSModels/Entity"
import { texture } from "../../../content/models/Player.json"
import { TypedMapCell } from "../../Core"

const model = { texture: texture }

export class Player extends Entity {
    constructor(x: number, y: number, texture: string = model.texture[1]) {
        super(x, y, texture)
    }

    moveToPos(x: number, y: number, typedMap: TypedMapCell[][], texture?: string): void {
        if (this.isCollision(typedMap[y][x]) === true) return

        this.setPos(x, y)

        if (texture) this.setTexture(texture)
    }
}