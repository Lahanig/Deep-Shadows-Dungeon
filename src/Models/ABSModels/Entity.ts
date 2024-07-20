import { GameEntityType, TypedMapCell, GameEntityDiraction, GameEntityLifeState, randomInt } from "../../Core"
import { Player } from "../ContentModels/Player"

export interface Constructable<T> {
    new(x: number, y: number) : T
}

export abstract class Entity {
    hp: number
    x: number
    y: number
    id: number
    texture: string
    diraction: GameEntityDiraction
    money: number
    type: GameEntityType
    lifeState: GameEntityLifeState
    damage: number
    isNextFloor: boolean

    constructor(x: number, y: number, texture: string = "U", id: number = 0) {
        this.x = x
        this.y = y
        this.texture = texture
        this.diraction = GameEntityDiraction.Left
        this.hp = 1
        this.id = id
        this.money = randomInt(0, 5)
        this.type = GameEntityType.Undefined
        this.lifeState = GameEntityLifeState.Alive
        this.damage = 0
        this.isNextFloor = false
    }

    // Зачастую переопределяемый метод
    collision(x: number, y: number, mapCell: TypedMapCell[][], loadedEntites: Entity[] | null = null, player: Player | null = null): void | null {
        return null
    }

    setDiraction(diraction: GameEntityDiraction): void { 
        this.diraction = diraction
    }

    setPos(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    isCollision(mapCell: TypedMapCell): boolean {
        // Возвращаем проходимая сущность или нет

        switch (mapCell.entityType) {
            case GameEntityType.Air:
                return false
            case GameEntityType.Money:
                return false
            case GameEntityType.Spike:
                return false
            case GameEntityType.Door:
                return false        

            default: return true
        }
    }

    getCollisionEntityType(mapCell: TypedMapCell): TypedMapCell["entityType"] {
        return mapCell.entityType
    }

    setTexture(texture: string): void {
        this.texture = texture
    }
}
