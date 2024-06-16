import { GameEntityType, TypedMapCell } from "../../Core"
import { Entity } from "../ABSModels/Entity"
import { Player } from "./Player"

export class Rock extends Entity {
    isAttack: boolean
    
    constructor(x: number, y: number) {
        super(x, y)
        this.texture = "^"
        this.type = GameEntityType.Spike
        this.isAttack = false
    }

    collision(x: number, y: number, mapCell: TypedMapCell[][], player: Player): void  {
        if (this.isAttack === false) {
           player.hp -= 5 
           this.isAttack = true
           setTimeout(() => {this.isAttack = false}, 1000)
        }
    }
}