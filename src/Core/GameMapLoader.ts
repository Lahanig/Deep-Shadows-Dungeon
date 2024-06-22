import { fs, path } from "."
import { floor1 } from "../../content/floors/FloorTemplate.json"
import progress from "../progress.json"

export class MapLoader {
    currentMap: string[][]

    constructor() {
        this.currentMap = []

        this.setCurrentMap()
    }

    updateCurrentMap(): void {
        this.currentMap = floor1
    }

    setCurrentMap(): void {
        progress.currentMap.name = "floor1"

        const UpdateProgress = JSON.stringify(progress)

        fs.writeFile(path.join(__dirname, '../progress.json'), UpdateProgress, (err) => {
            if (err) {
                console.log('Error writing file:', err)
            } else {
                console.log('Successfully wrote file')
            }
        })

        this.updateCurrentMap()
    }

    getCurrentMap(): string[][] {
        this.updateCurrentMap()

        return this.currentMap
    }
}

export const GameMapLoader = new MapLoader()