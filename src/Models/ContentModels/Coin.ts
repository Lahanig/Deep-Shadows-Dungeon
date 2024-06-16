import { GameEntityType, TypedMapCell } from "../../Core"
import { GameEntityLifeState } from "../../Core/Types/GameEntityLifeState"
import { Entity } from "../ABSModels/Entity"
import { Player } from "./Player"

export class Coin extends Entity {
    constructor(x: number, y: number) {
        super(x, y) 
        this.texture = "¥"
        this.type = GameEntityType.Money
    }

    collision(x: number, y: number, mapCell: TypedMapCell[][], player: Player): void {
        player.money += this.money
        this.lifeState = GameEntityLifeState.Death
    }
}