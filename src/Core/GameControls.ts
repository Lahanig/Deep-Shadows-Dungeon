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

    constructor() {
        this.currentKeyPressed = GameKey.Undefined
        this.currentKeyReleased = GameKey.Undefined
    }

    getActiveControls(): GameKey | any {
        return this.currentKeyPressed
    }

    clearKeyActiveKey() {
        this.currentKeyPressed = this.getActiveControlsType("hh")
    }

    async keypressF() {
        keypress(process.stdin)
        process.stdin.on('keypress', async  (ch: any, key: any) => {
            // console.log("got key", key)
            this.currentKeyPressed = this.getActiveControlsType(key.name)

            // setTimeout(() => {this.currentKeyPressed = this.getActiveControlsType("hh")}, 16.6)
            if (key && key.ctrl && key.name == 'c') {
                process.exit()
            }
        })

        process.stdin.on('keyrelease', async  (ch: any, key: any) => {
            console.log("got key", key)
            this.currentKeyPressed = this.getActiveControlsType("")
        })
    
        process.stdin.setRawMode(true)
        process.stdin.resume()
    }

    getActiveControlsType(key: string) {
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
