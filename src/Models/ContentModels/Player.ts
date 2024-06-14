import { Entity } from "../ABSModels/Entity"

export class Player extends Entity {
    constructor(x: number, y: number, texture: string) {
        super(x, y, texture)
    }
}