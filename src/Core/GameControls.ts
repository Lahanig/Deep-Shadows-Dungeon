var ks = require('node-key-sender')
var keypress = require('keypress')

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

    constructor() {
        this.currentKeyPressed = GameKey.Undefined
        this.currentKeyReleased = GameKey.Undefined
        this.playerLocale = ""
        this.keyReleaseTimeout = undefined
    }

    getPlayerLocale(): string {
        return this.playerLocale
    }

    getActiveControls(): GameKey | any {
        return this.currentKeyPressed
    }

    clearKeyActiveKey(): void {
        this.currentKeyPressed = this.getActiveControlsType("none")
    }

    setLocale(flag: boolean = false): void {
        if (flag === true) this.playerLocale = "              Please change locale to en, for move character"
        else this.playerLocale = ""
    }

    setActiveKey(key: string): void {
        this.currentKeyPressed = this.getActiveControlsType(key)
    }

    async setKeypressListener(): Promise<void> {
        var readline = require('readline')

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
                }, 6.94)
            }

            if (key && key.ctrl && key.name == 'c') {
                process.exit()
            }
        })
    }

    async keypressF(): Promise<void> {
        try {
            keypress(process.stdin)
            process.stdin.on('keypress', async (ch: any, key: any) => {
                this.playerLocale = "              Please change locale to en, for move character"
                if (key === undefined) return
                this.playerLocale = ""

                this.currentKeyPressed = this.getActiveControlsType(key.name)

                // setTimeout(() => {this.currentKeyPressed = this.getActiveControlsType("hh")}, 16.6)
                if (key && key.ctrl && key.name == 'c') {
                    console.log(1)
                    process.exit()
                }
            })

            process.stdin.setRawMode(true)
            // process.stdin.resume()
        } catch(e) {
            console.log(e)
        }
    }

    getActiveControlsType(key: string): GameKey {
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