export abstract class Entity {
    x: number
    y: number
    texture: string

    constructor(x: number, y: number, texture: string = "U") {
        this.x = x
        this.y = y
        this.texture = texture
    }

    setPos(x: number, y: number) {
        this.x = x
        this.y = y
    }
}