import { path, fs } from "."
import progress from "../progress.json"
import { Constructable, Entity } from "../Models/ABSModels/Entity"
import Models from "../Models/Requirement"
import { GameMapLoader } from "./GameMapLoader"

export class EntityLoader {
    rawMap: string[][]
    entityModels: Constructable<Entity>[]

    constructor() {
        this.rawMap = GameMapLoader.getCurrentMap()
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

        console.log(progress.currentLoadedEntites.length)

        if (progress.currentLoadedEntites.length <= 1) {
            const Entites: Entity[] = []

            this.rawMap.some((y, i1) => {
                y.some((x, i2) => {
                    const newEntity = this._getEntityModel(x, i2, i1)
                    newEntity.id = Entites.length
                    Entites.push(newEntity)
                })
            })

            const Progress: any = Entites

            progress.currentLoadedEntites = Progress

            const UpdateProgress = JSON.stringify(progress)

            fs.writeFile(path.join(__dirname, '../progress.json'), UpdateProgress, (err) => {
                if (err) {
                    console.log('Error writing file:', err)
                } else {
                    console.log('Successfully wrote file')
                }
            })
        }

        progress.currentLoadedEntites.some((entity: Entity, i) => {
            const newEntity = this._getEntityModel(entity.texture, entity.x, entity.y)

            newEntity.id = Entites.length
            newEntity.diraction = entity.diraction
            newEntity.hp = entity.hp
            newEntity.money = entity.money
            newEntity.lifeState = entity.lifeState
            
            Entites.push(newEntity)
        })

        const Progress: any = Entites

        progress.currentLoadedEntites = Progress

        // console.log(Entites.length)

        return progress.currentLoadedEntites
    }
}

export const entityLoader = new EntityLoader()