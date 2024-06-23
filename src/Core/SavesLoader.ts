import { fs, path } from "."
import { Entity } from "../Models/ABSModels/Entity"
import progress from "../progress.json"

interface Progress {
    currentMap: any
    currentPlayerStats: any
    currentLoadedEntites: any[]
}

export class SavesLoader {
    progress: Progress

    constructor() {
        this.progress = progress
    }

    writeProgressFile(): void {
        fs.writeFile(path.join(__dirname, '../progress.json'), JSON.stringify(this.progress), (err) => {
            if (err) {
                console.log('Error writing file:', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    }

    updateProgress(): void {
        this.progress = progress
    }

    setProgressMap(progressMapName: Progress["currentMap"]["name"]): void {
        this.updateProgress()

        this.progress.currentMap.name = progressMapName

        this.writeProgressFile()
    }

    setProgressEntitesLoaded(loadedEntites: Entity[]): void {
        this.updateProgress()

        this.progress.currentLoadedEntites = loadedEntites

        this.writeProgressFile()
    }

    getProgressEntitesLoaded(): Progress["currentLoadedEntites"] {
        this.updateProgress()

        return this.progress.currentLoadedEntites
    }
}

export const GameSavesLoader = new SavesLoader()