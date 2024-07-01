import UITemplate from "../../content/UI/UITemplate.json"

type GameUITemplates = {
    Map: Array<string[]>
}

export class GameUI {
    GameUITemplates: GameUITemplates

    constructor() {
        this.GameUITemplates = {
            Map: UITemplate.Map
        }
    }

    getMap(): string[][] {
        // Возвращаем Элемент интерфейса Map

        return this.GameUITemplates.Map
    }
}