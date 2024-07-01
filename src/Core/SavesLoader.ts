import { fs, path } from "."
import { Entity } from "../Models/ABSModels/Entity"
import { Player } from "../Models/ContentModels/Player"
import config from "../config.json"
import progressTemplate from '../progressTemplate.json'

// import progress from "../progress.json"
// const progress = require('../progress.json')

// Получаем данные из файла сохранения, если он пустой, то создаем новый по шаблону
const progress: Progress = config.isDev === true ? fs.readFileSync(path.join(__dirname, '../progress.json'), "utf8") === "" ? progressTemplate : JSON.parse(fs.readFileSync(path.join(__dirname, '../progress.json', 'utf8'), 'utf8')) : JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), 'progress.json'), 'utf8'))

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
        // Перезаписываем файл сохранения

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
        // Обновляем данные в поле progress из файла сохранения

        this.progress = progress
    }

    setProgressMap(progressMapName: Progress["currentMap"]["name"]): void {
        // Перезаписываем поле CurrentMap в файле сохранения 

        this.updateProgress()

        this.progress.currentMap.name = progressMapName

        this.writeProgressFile()
    }

    setProgressEntitesLoaded(loadedEntites: Entity[]): void {
        // Перезаписываем загруженные сущности в файле сохранения 

        this.updateProgress()

        this.progress.currentLoadedEntites = loadedEntites

        this.writeProgressFile()
    }

    getProgressEntitesLoaded(): Progress["currentLoadedEntites"] {
        // Возвращаем загруженные сущности из файла сохранения
        
        this.updateProgress()

        return this.progress.currentLoadedEntites
    }

    setProgressCurrentPlayerStats(player: Player) {
        // Перезаписываем даннные игрока в файле сохранения 

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
        // Возвращаем данные игрока из файла сохранения

        this.updateProgress()

        return this.progress.currentPlayerStats
    }

    saveGameProgress() {
        // Сохраняем игру и выходим

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