import { GameEntityType } from "../../Core"
import { Entity } from "../ABSModels/Entity"

export class Air extends Entity {
    constructor(x: number, y: number, id: number = 0) {
        super(x, y, " ", id) 
        this.texture = " "
        this.type = GameEntityType.Air
    }
}