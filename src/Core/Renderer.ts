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
            timeout: this.controls.freshRate
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

            this.UIMap.some(y => {
                y.some(x => {
                    temp.UI.Map += x
                })

                temp.UI.Map += "\n"
            })

            if (this.config.MapRender === true) {
                console.clear()
                // process.stdout.write("\u001b[2J\u001b[0;0H")
                // process.stdout.write('\x1Bc')
                console.log(`Deep Shadows Dungeon ${this.controls.getPlayerLocale()} \n`,
                    `\n`,
                    `  Level 1            HP:${this.player.hp}           Coins:${this.player.money}\n${temp.UI.Map.slice(0, -3)}`,
                    `\n`,
                    `  Floor 1${this.config.Debug === true ? ", Debug" : " "}`
                )
                
                if (this.config.Debug === true)
                    console.log(this.TypedMap[4][11].texture, 
                        this.TypedMap[4][11].originalEntityType, 
                        this.controls.getActiveControls(),
                        this.getMapEntityByCoord(11, 4),
                        this.player,
                        // this.player.x, 
                        // this.player.y, 
                        // this.player.diraction,
                        this.loadedEntites.length
                    )
            }
            
        }, this.gameLoop.timeout)
    }

    getUI() {
        return {
            map: this.UIMap
        }
    }
}