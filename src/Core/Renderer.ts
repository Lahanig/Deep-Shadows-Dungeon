import { Core } from "."

type GameLoop = {
    timeout: number
    interval: NodeJS.Timeout | null
}

export class Renderer extends Core {
    windowWidth: Number
    windowHeight: Number

    gameLoop: GameLoop

    UIMap: string[][]

    constructor(w: Number = 640, h: Number = 480) {
        super()
        this.windowWidth = w
        this.windowHeight = h

        this.gameLoop = {
            interval: null,
            timeout: 16.6
        }

        this.UIMap = []
    }

    render(): void {
        this.gameLoop.interval = setInterval(() => {
            this.MapElementsHandler()

            this.UIMap = this.getMap()

            // this.controls.keypressF()

            const temp = {
                UI: {
                    Map: ""
                }
            }

            this.UIMap.forEach(y => {
                y.forEach(x => {
                    temp.UI.Map += x
                })

                temp.UI.Map += "\n"
            })

            console.clear()
            //process.stdout.write("\u001b[2J\u001b[0;0H")
            //process.stdout.write('\x1Bc')
            console.log(`Deep Shadows Dungeon ${this.controls.getPlayerLocale()} \n`,
                `\n`,
                `  Level 1            HP:${this.player.hp}           Coins:${this.player.money}\n${temp.UI.Map.slice(0, -3)}`,
                `\n`,
                `  Debug`
            )
            console.log(this.getCurrentTypedMap()[1][2], this.player.x, this.player.y, this.player.diraction)
        }, this.gameLoop.timeout)
    }

    getUI() {
        return {
            map: this.UIMap
        }
    }
}