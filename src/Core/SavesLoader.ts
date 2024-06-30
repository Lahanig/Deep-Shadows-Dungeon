import { fs, path } from "."
import { Entity } from "../Models/ABSModels/Entity"
import { Player } from "../Models/ContentModels/Player"
import config from "../config.json"

// import progress from "../progress.json"
// const progress = require('../progress.json')

const progress: Progress = config.isDev === true ? require('../progress.json') : JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), 'progress.json'), 'utf8'))

// const progress = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'progress.json'), 'utf8'))

interface Progress {
    currentMap: any
    currentPlayerStats: any
    currentLoadedEntites: any[] 
}

export class SavesLoader {
    progress: Progress
    progressPath: string

    constructor() {
        this.progress = progress
        this.progressPath = config.isDev === true ? path.join(__dirname, "../progress.json") : path.join(path.dirname(process.execPath), 'progress.json')
    }

    writeProgressFile(): void {
        // console.log(path.dirname(process.execPath), progress.currentMap.name)
        fs.writeFile(this.progressPath, JSON.stringify(this.progress), (err) => {
            if (err) {
                console.log('Error writing file:', err)
            } else {
                // console.log('Successfully wrote file')
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

    setProgressCurrentPlayerStats(player: Player) {
        this.updateProgress()

        this.progress.currentPlayerStats = {
            x: player.x,
            y: player.y,
            hp: player.hp,
            money: player.money,
            diraction: player.diraction,
            lifeState: player.lifeState
        }

        this.writeProgressFile()
    }

    getProgressCurrentPlayerStats(): Progress["currentPlayerStats"] {
        this.updateProgress()

        return this.progress.currentPlayerStats
    }

    saveGameProgress() {
        this.updateProgress()

        fs.writeFile(this.progressPath, JSON.stringify(this.progress), (err) => {
            if (err) {
                console.log('Error writing file:', err)
            } else {
                process.exit()
            }
        })
    }
}

export const GameSavesLoader = new SavesLoader()