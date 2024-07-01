import { fs, path } from "."
import { floor1 } from "../../content/floors/FloorTemplate.json"
import { GameSavesLoader, SavesLoader } from "./SavesLoader"


interface MapLoaderCurrentMap {
    map: string[][]
    name: string
}

export class MapLoader {
    currentMap: MapLoaderCurrentMap
    saveLoader: SavesLoader

    constructor() {
        this.currentMap = {
            map: [],
            name: ''
        }

        this.saveLoader = GameSavesLoader

        this.setCurrentMap()
    }

    updateCurrentMap(): void {
        // Обновляем текущую карту

        this.currentMap.map = floor1
    }

    setCurrentMap(): void {
        // Устанавливаем текущую карту и сохраняем

        this.currentMap.name = "floor1"

        this.saveLoader.setProgressMap(this.currentMap.name)

        this.updateCurrentMap()
    }

    getCurrentMap(): string[][] {
        // Возвращаем текущую карту

        this.updateCurrentMap()

        return this.currentMap.map
    }
}

export const GameMapLoader = new MapLoader()