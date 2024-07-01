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

    collision(x: number, y: number, mapCell: TypedMapCell[][], loadedEntites: Entity[]): void {
        // Если игрок столкнулся с сущностью вызываем её метод collision

        loadedEntites.some(loadedEntity => {
            if (loadedEntity.x === x && loadedEntity.y === y) return loadedEntity.collision(x, y, mapCell, null, this)
        })
    }

    moveToPos(x: number, y: number, typedMap: TypedMapCell[][], loadedEntites: Entity[], texture: string = this.texture, diraction: GameEntityDiraction = this.diraction): void {
        // Перемещаем игрока на заданные координаты и проверяем столкновения

        if (this.isCollision(typedMap[y][x]) === true) return

        this.collision(x, y, typedMap, loadedEntites)
        this.setDiraction(diraction)
        this.setPos(x, y)
        this.setTexture(texture)
    }
}