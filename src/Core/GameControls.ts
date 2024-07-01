import { GameSavesLoader, SavesLoader } from "./SavesLoader"

var ks = require('node-key-sender')
var keypress = require('keypress')
var readline = require('readline')

export enum GameKey {
    Up,
    Down,
    Left,
    Right,
    Undefined
}

export class Controls {
    currentKeyPressed: GameKey
    currentKeyReleased: GameKey
    playerLocale: string
    keyReleaseTimeout: NodeJS.Timeout | undefined
    freshRate: number
    savesLoader: SavesLoader

    constructor() {
        this.currentKeyPressed = GameKey.Undefined
        this.currentKeyReleased = GameKey.Undefined
        this.playerLocale = ""
        this.keyReleaseTimeout = undefined
        this.freshRate = 4.16
        this.savesLoader = GameSavesLoader
    }

    getPlayerLocale(): string {
        // Возвращаем сообщение о локали

        return this.playerLocale
    }

    getActiveControls(): GameKey | any {
        // Возвращаем текущую нажататую клавишу

        return this.currentKeyPressed
    }

    clearKeyActiveKey(): void {
        // Очищаем нажатую клавишу

        this.currentKeyPressed = this.getActiveControlsType("none")
    }

    setLocale(flag: boolean = false): void {
        // Если у игрока локаль не en, то просим ее поменять

        if (flag === true) this.playerLocale = "              Please change locale to en, for move character"
        else this.playerLocale = ""
    }

    setActiveKey(key: string): void {
        // Устанавливаем нажатую клавишу
        
        this.currentKeyPressed = this.getActiveControlsType(key)
    }

    async setKeypressListener(): Promise<void> {
        // Устанавливаем прослушку на управление

        readline.emitKeypressEvents(process.stdin)

        if (process.stdin.isTTY)
            process.stdin.setRawMode(true)

        process.stdin.on('keypress', (chunk, key) => {
            this.clearKeyActiveKey()

            if (key.name !== undefined) this.setLocale()
            else this.setLocale(true)

            if (key) {
                this.setActiveKey(key.name)

                clearInterval(this.keyReleaseTimeout)

                this.keyReleaseTimeout = setTimeout(() => {
                    this.clearKeyActiveKey()
                }, this.freshRate)
            }

            if (key && key.ctrl && key.name == 'c') {
                this.savesLoader.saveGameProgress()
            }
        })
    }

    // async keypressF(): Promise<void> {
    //     try {
    //         keypress(process.stdin)
    //         process.stdin.on('keypress', async (ch: any, key: any) => {
    //             this.playerLocale = "              Please change locale to en, for move character"
    //             if (key === undefined) return
    //             this.playerLocale = ""

    //             this.currentKeyPressed = this.getActiveControlsType(key.name)

    //             if (key && key.ctrl && key.name == 'c') {
    //                 console.log(1)
    //                 process.exit()
    //             }
    //         })

    //         process.stdin.setRawMode(true)
    //         process.stdin.resume()
    //     } catch(e) {
    //         console.log(e)
    //     }
    // }

    getActiveControlsType(key: string): GameKey {
        // Возвращаем тип в зависимости от нажатой клавиши
        
        switch (key) {
            case "w":
                return GameKey.Up
            case "s":
                return GameKey.Down
            case "a":
                return GameKey.Left
            case "d":
                return GameKey.Right 

            case "ц":
                return GameKey.Up
            case "ы":
                return GameKey.Down     
            case "ф":
                return GameKey.Left 
            case "в":
                return GameKey.Right
        
            default: return GameKey.Undefined
        }
    }
}

export const GameControls = new Controls()