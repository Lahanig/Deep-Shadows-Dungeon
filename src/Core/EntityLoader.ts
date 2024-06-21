import { path, fs } from "."
import { floor1 } from "../../content/floors/FloorTemplate.json"
import { Constructable, Entity } from "../Models/ABSModels/Entity"
import Models from "../Models/Requirement"

export class EntityLoader {
    rawMap: string[][]
    entityModels: Constructable<Entity>[]

    constructor() {
        this.rawMap = floor1
        this.entityModels = []
    }

    loadEnitityModels(): void {
        this.entityModels = []

        // No build code...

        // const foldersPath = path.join(__dirname, '../Models/ContentModels')
        // const entityModelFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'))

        // for (const file of entityModelFiles) {
        //     const filePath = path.join(foldersPath, file)

        //     const rawEntityModel = require(filePath)
        //     const entityModel: any = Object["values"](rawEntityModel)[0]

        //     this.entityModels.push(entityModel)
        // }
        
        for (const model of Object["values"](Models)) {
            const entityModel: any = model

            this.entityModels.push(entityModel)
        }
    }

    _getEntityModel(rawEntity: string, rawEntityX: number, rawEntityY: number): Entity {
        const result: Entity[] = []

        this.entityModels.some(entityModel => {
            if (rawEntity === "\\" || rawEntity === "/" || rawEntity === "|" || rawEntity === "-") {
                return result.push(new Models.Border(rawEntityX, rawEntityY, rawEntity)) 
            }

            if (new entityModel(rawEntityY, rawEntityX).texture === rawEntity) {
                return result.push(new entityModel(rawEntityX, rawEntityY))
            }
        })

        return result[0]
    }

    getFloorEntites(): Entity[] {
        this.loadEnitityModels()

        const Entites: Entity[] = []

        floor1.some((y, i1) => {
            y.some((x, i2) => {
                const newEntity = this._getEntityModel(x, i2, i1)
                newEntity.id = Entites.length
                Entites.push(newEntity)
            })
        })

        // console.log(Entites.length)
        return Entites
    }
}

export const entityLoader = new EntityLoader()