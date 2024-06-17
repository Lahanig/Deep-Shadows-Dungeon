import { path, fs } from "."
import { floor1 } from "../../content/floors/FloorTemplate.json"
import { Constructable, Entity } from "../Models/ABSModels/Entity"
import { Border } from "../Models/ContentModels/Border"

export class EntityLoader {
    rawMap: string[][]
    entityModels: Constructable<Entity>[]

    constructor() {
        this.rawMap = floor1
        this.entityModels = []
    }

    loadEnitityModels(): void {
        this.entityModels = []

        const foldersPath = path.join(__dirname, '../Models/ContentModels')
        const entityModelFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'))

        for (const file of entityModelFiles) {
            const filePath = path.join(foldersPath, file)
            const rawEntityModel = require(filePath)
            const entityModel: any = Object["values"](rawEntityModel)[0]

            this.entityModels.push(entityModel)
        }
    }

    getFloorEntites(): Entity[] {
        this.loadEnitityModels()

        const Entites: Entity[] = []

        floor1.some((y, i1) => {
            y.some((x, i2) => {
                this.entityModels.some(entityModel => {
                    if (new entityModel(i2, i1).texture === x) {
                        return Entites.push(new entityModel(i2, i1)) 
                    }

                    if (x === "\\" || x === "/" || x === "|" || x === "-") {
                        return Entites.push(new Border(i2, i1, x)) 
                    }
                })
            })
        })

        // console.log(Entites)
        return Entites
    }
}

export const entityLoader = new EntityLoader()