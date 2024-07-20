import { fs, path } from "."
import { Entity } from "../Models/ABSModels/Entity"
import { Player } from "../Models/ContentModels/Player"
import config from "../config.json"
import progressTemplate from '../progressTemplate.json'

// import progress from "../progress.json"
// const progress = require('../progress.json')

const writeProgressTemplateFile = (toggle: boolean = true) => {
    if (toggle == true) {
        fs.writeFileSync(path.join(__dirname, '../progress.json'), JSON.stringify(progressTemplate))
        return progressTemplate
    } else {
        fs.writeFileSync(path.join(path.dirname(process.execPath), 'progress.json'), JSON.stringify(progressTemplate))
        return progressTemplate
    }   
}

const getProgressData = () => {
    if (config.isDev === true) {
        try {
            fs.readFileSync(path.join(__dirname, '../progress.json'), "utf8")
        } catch (error) {
            writeProgressTemplateFile()
        }

        if (fs.readFileSync(path.join(__dirname, '../progress.json'), "utf8") === "") {
            return writeProgressTemplateFile()
        } else {
            return JSON.parse(fs.readFileSync(path.join(__dirname, '../progress.json'), 'utf8'))
        }
    } else {
        try {
            fs.readFileSync(path.join(path.dirname(process.execPath), 'progress.json'), 'utf8')
        } catch (error) {
            writeProgressTemplateFile(false)
        }

        if (fs.readFileSync(path.join(path.dirname(process.execPath), 'progress.json'), 'utf8') === "") {
            return writeProgressTemplateFile(false)
        } else {
            return JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), 'progress.json'), 'utf8'))
        }
    }
}

// Получаем данные из файла сохранения, если он пустой, то создаем новый по шаблону
const progress: Progress = getProgressData()

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

    setProgressMap(progressMap: Progress["currentMap"]): void {
        // Перезаписываем поле CurrentMap в файле сохранения 

        this.updateProgress()

        this.progress.currentMap.name = progressMap.name
        this.progress.currentMap.isChanged = progressMap.isChanged

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

    getCurrentMap(): Progress["currentMap"] {
        // Возвращаем данные текущей карты из сохранения

        this.updateProgress()

        return this.progress.currentMap
    }

    saveGameProgress(): void {
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