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
            console.log(`Deep Shadows Dungeon`)
            console.log(` `)
            console.log('  Level 1')
            console.log(temp.UI.Map)
            console.log(` `)
            console.log(this.getCurrentTypedMap()[1][2], this.player.x, this.player.y)
        }, this.gameLoop.timeout)
    }

    getUI() {
        return {
            map: this.UIMap
        }
    }
}