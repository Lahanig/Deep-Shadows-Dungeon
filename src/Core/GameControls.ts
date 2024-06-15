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

    constructor() {
        this.currentKeyPressed = GameKey.Undefined
        this.currentKeyReleased = GameKey.Undefined
        this.playerLocale = ""
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

    async keypressF(): Promise<void> {
        try {
            keypress(process.stdin)
            process.stdin.on('keypress', async  (ch: any, key: any) => {
                this.playerLocale = "              Please change locale to en, for move character"
                if (key === undefined) return
                this.playerLocale = ""

                this.currentKeyPressed = this.getActiveControlsType(key.name)

                // setTimeout(() => {this.currentKeyPressed = this.getActiveControlsType("hh")}, 16.6)
                if (key && key.ctrl && key.name == 'c') {
                    process.exit()
                }
            })
            
            process.stdin.setRawMode(true)
            process.stdin.resume()
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
        
            default: return GameKey.Undefined
        }
    }
}
