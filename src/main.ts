import { GameLoader } from "./GameApp/GameLoader";

export class Main {
  gameLoader: GameLoader;
  constructor() {
    this.gameLoader = new GameLoader();
  }
}
//main entry point
const MainInstance: Main = new Main();
