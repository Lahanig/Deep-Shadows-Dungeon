import { GameEntityType } from "../../Core"
import { Entity } from "../ABSModels/Entity"

export class Border extends Entity {
    constructor(x: number, y: number, texture = "#") {
        super(x, y, texture) 
        this.type = GameEntityType.Border
    }
}