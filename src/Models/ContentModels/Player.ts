import { Entity } from "../ABSModels/Entity"
import { texture } from "../../../content/models/Player.json"

const model = { texture: texture}

export class Player extends Entity {
    constructor(x: number, y: number, texture: string = model.texture[1]) {
        super(x, y, texture)
    }
}