import { fs, path } from "."
import floors from "../../content/floors/FloorTemplate.json"
import { GameSavesLoader, SavesLoader } from "./SavesLoader"


interface MapLoaderCurrentMap {
    map: string[][]
    name: string,
    isChanged: boolean
}

export class MapLoader {
    currentMap: MapLoaderCurrentMap
    saveLoader: SavesLoader

    constructor() {
        this.currentMap = {
            map: [],
            name: 'floor1',
            isChanged: false
        }

        this.saveLoader = GameSavesLoader

        this.updateCurrentMap()
    }

    updateCurrentMap(): void {
        // Обновляем текущую карту

        this.currentMap.name = this.saveLoader.getCurrentMap().name

        this.currentMap.isChanged = false

        this.currentMap.map = this.getCurrentMapByProgress()
    }

    getCurrentMapByProgress(): string[][] {
        // Возвращаем карту из названия

        const currentMapName = this.saveLoader.getCurrentMap().name,
            tempFloors: any = floors,
            result: any = []

        Object.keys(floors).some((floorName: string) => {
            if (floorName == currentMapName) {
                return result.push(tempFloors[floorName])
            }
        })

        return result[0]
    }

    setCurrentMap(mapName: string): void {
        // Устанавливаем текущую карту и сохраняем

        this.currentMap.name = mapName
        this.currentMap.isChanged = true

        this.saveLoader.setProgressMap(this.currentMap)

        this.updateCurrentMap()
    }

    getCurrentMapName(): string {
        // Возвращаем текущее имя карты

        this.updateCurrentMap() 

        return this.currentMap.name
    }

    getCurrentMap(): string[][] {
        // Возвращаем текущую карту

        this.updateCurrentMap()

        return this.currentMap.map
    }
}

export const GameMapLoader = new MapLoader()