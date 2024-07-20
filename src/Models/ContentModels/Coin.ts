import { GameEntityType, TypedMapCell, GameEntityLifeState } from "../../Core"
import { Entity } from "../ABSModels/Entity"
import { Player } from "./Player"

export class Coin extends Entity {
    constructor(x: number, y: number) {
        super(x, y) 
        this.texture = "¥"
        this.type = GameEntityType.Money
    }

    collision(x: number, y: number, mapCell: TypedMapCell[][], loadedEntites: null, player: Player): void {
        // При столкновении игрока с монеткой начисляем ему деньги и убиваем монетку

        if (this.lifeState === GameEntityLifeState.Alive) player.money += this.money
        this.lifeState = GameEntityLifeState.Death
    }
}