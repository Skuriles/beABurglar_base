import * as PIXI from "pixi.js";
import { PixiKeyboard } from "./PixiKeyboard/PixiKeyboard";
import Key from "./PixiKeyboard/Key";
import Direction from "./Directions/directionBase";
import { http } from "./http/http";

export class Main {
  pixiKeyboard: PixiKeyboard;
  counter: number;
  direction: Direction;
  moveX: number = 0;
  moveY: number = 0;
  http: http;
  private baseChar: any;
  private app: any;

  constructor() {
    this.direction = new Direction(this);
    this.CreateMainContainer();
    this.pixiKeyboard = new PixiKeyboard();
    this.counter = 0;
    this.http = new http();
    this.pixiKeyboard.keyboardManager.on("pressed", (key: number) => {
      this.direction.press(key);
      this.direction.startAnimation();
    });
    this.pixiKeyboard.keyboardManager.on("released", (key: number) => {
      if (
        key != Key.LEFT &&
        key != Key.UP &&
        key != Key.DOWN &&
        key != Key.RIGHT
      ) {
        return;
      }
      this.direction.release();
      this.direction.stopAnimation();
    });
    this.pixiKeyboard.keyboardManager.on("down", (key: number) => {
      this.direction.checkDownEvent(key);
    });
  }

  private CreateMainContainer() {
    //Create a Pixi Application
    this.app = new PIXI.Application({
      width: 1600, // default: 800
      height: 800, // default: 600
      antialias: true, // default: false
      resolution: 1
    });

    // this.appKeyboard.unsubscribe();
    this.addBaseChar();
  }

  private addBaseChar() {
    document.body.appendChild(this.app.view);
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoResize = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    PIXI.Loader.shared
      .add("baseCharJson", "tiles/character/BODY_male.json")
      //.add("baseFloorJson", "tiles/wall_and_floor/Tile.json")
      .load(() => this.initLevel());
  }

  private setup() {
    let id = PIXI.Loader.shared.resources.baseCharJson.textures;
    if (id) {
      this.baseChar = new PIXI.AnimatedSprite([id["front_walk0.png"]]);
      this.baseChar.position.set(100, 100);
      this.baseChar.vx = 0;
      this.baseChar.vy = 0;
      this.assignKeyboardToSprite(this.baseChar);
      this.app.stage.addChild(this.baseChar);
      this.app.renderer.render(this.app.stage);

      this.app.ticker.add((delta: number) => this.gameLoop(delta));
    }
  }
  private initLevel() {
    this.http.requestJson("level1.json");
    let id = PIXI.Loader.shared.resources.baseFloorJson.textures;
    if (id) {
      let baseFloor = new PIXI.TilingSprite(id["floor_2_4.png"], 200, 200);
      baseFloor.position.set(200, 100);
      this.app.stage.addChild(baseFloor);
      this.app.renderer.render(this.app.stage);
      this.setup();
    }
  }

  private gameLoop(delta: number) {
    //Move the cat 1 pixel
    this.play(delta);
  }

  private assignKeyboardToSprite(sprite: PIXI.AnimatedSprite) {
    this.direction.setSprite(sprite);
    this.direction.leftTextures = this.addSpritesToDirection("left");
    this.direction.rightTextures = this.addSpritesToDirection("right");
    this.direction.upTextures = this.addSpritesToDirection("back");
    this.direction.downTextures = this.addSpritesToDirection("front");
  }

  private addSpritesToDirection(direction: string): any[] {
    var textures = [];
    for (let i = 0; i < 8; i++) {
      var key = direction + "_walk" + i + ".png";
      let id = PIXI.Loader.shared.resources.baseCharJson.textures;
      if (id != null) {
        textures.push(id[key]);
      }
    }
    return textures;
  }

  public play(delta: number) {
    // do all the automized stuff here!!
    if (this.baseChar !== null) {
      this.baseChar.x += this.moveX;
      this.baseChar.y += this.moveY;
    }
    this.pixiKeyboard.keyboardManager.update();
  }
}
//main entry point
const MainInstance: Main = new Main();
