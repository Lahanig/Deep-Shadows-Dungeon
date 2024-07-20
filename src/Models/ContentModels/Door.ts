import { GameEntityLifeState, GameEntityType, TypedMapCell } from "../../Core"
import { GameMapLoader } from "../../Core/GameMapLoader"
import { Entity } from "../ABSModels/Entity"
import { Player } from "./Player"

export class Door extends Entity {
    constructor(x: number, y: number) {
        super(x, y)
        this.texture = "#"
        this.type = GameEntityType.Door
    }

    collision(x: number, y: number, mapCell: TypedMapCell[][], loadedEntites: null, player: Player): void {
        // При столкновении игрока с дверью меняем этаж на следующий

        if (this.lifeState === GameEntityLifeState.Alive) {
            this.lifeState = GameEntityLifeState.Death
            
            const mapName = GameMapLoader.getCurrentMapName()

            GameMapLoader.setCurrentMap("floor" + `${parseInt(mapName.slice(-1, mapName.length)) + 1}`)

            player.isNextFloor = true
        }
    }
}