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
        this.damage = 5
    }

    collision(x: number, y: number, mapCell: TypedMapCell[][], loadedEntites: null, player: Player): void  {
        // При столкновении с игроком наносим ему урон, раз в секунду

        if (this.isAttack === false) {
           player.hp -= this.damage
           this.isAttack = true
           setTimeout(() => {this.isAttack = false}, 1000)
        }
    }
}