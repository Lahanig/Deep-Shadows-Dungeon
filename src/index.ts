import { Core } from "./Core"
import { Renderer } from "./Core/Renderer"

const Game = new Core(new Renderer())

Game.start()