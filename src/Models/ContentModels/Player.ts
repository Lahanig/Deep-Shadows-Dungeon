import { Entity } from "../ABSModels/Entity"
import { texture } from "../../../content/models/player.json"

const model = { texture: texture}

export class Player extends Entity {
    constructor(x: number, y: number, texture: string = model.texture) {
        super(x, y, texture)
    }
}