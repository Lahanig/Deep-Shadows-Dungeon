import { GameEntityType } from "../../Core"
import { Entity } from "../ABSModels/Entity"

export class Air extends Entity {
    constructor(x: number, y: number) {
        super(x, y) 
        this.texture = " "
        this.type = GameEntityType.Air
    }
}