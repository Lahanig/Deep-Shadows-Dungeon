import { Entity } from "../ABSModels/Entity"
import { texture } from "../../../content/models/Player.json"
import { GameEntityDiraction, GameEntityType, TypedMapCell } from "../../Core"

const model = { texture: texture }

export class Player extends Entity {
    constructor(x: number, y: number, texture: string = model.texture[1]) {
        super(x, y, texture)
        this.hp = 100
        this.money = 0
        this.type = GameEntityType.Player
    }

    collision(x: number, y: number, mapCell: TypedMapCell[][]): void {
        switch (mapCell[y][x].entityType) {
            case GameEntityType.Air:
                // this.money += randomInt(0, 5)
                break
        }
    }

    moveToPos(x: number, y: number, typedMap: TypedMapCell[][], diraction: GameEntityDiraction = this.diraction, texture: string = this.texture): void {
        if (this.isCollision(typedMap[y][x]) === true) return

        this.collision(x, y, typedMap)
        this.setDiraction(diraction)
        this.setPos(x, y)
        this.setTexture(texture)
    }
}