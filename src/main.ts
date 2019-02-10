import { Left, Up, Right, Down } from "./Keyboard/directions";

class Main {
  constructor() {
    this.CreateMainContainer();
    this.left = new Left("ArrowLeft");
    this.up = new Up("ArrowUp");
    this.right = new Right("ArrowRight");
    this.down = new Down("ArrowDown");
  }

  private baseChar: any;
  private app: any;
  private left: Left;
  private up: Up;
  private right: Right;
  private down: Down;

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

    PIXI.loader
      .add("baseFloorJson", "tiles/wall_and_floor/Tile.json")
      .add("baseCharJson", "tiles/character/BODY_male.json")
      .load(() => this.initFloor());
  }

  private setup() {
    let id = PIXI.loader.resources.baseCharJson.textures;
    if (id) {
      this.baseChar = new PIXI.Sprite(id["back_stand.png"]);
      this.baseChar.position.set(100, 100);
      this.baseChar.vx = 0;
      this.baseChar.vy = 0;
      this.assignKeyboardToSprite(this.baseChar);
      this.app.stage.addChild(this.baseChar);
      this.app.renderer.render(this.app.stage);

      this.app.ticker.add((delta: number) => this.gameLoop(delta));
    }
  }
  private initFloor() {
    let id = PIXI.loader.resources.baseFloorJson.textures;
    if (id) {
      let baseFloor = new PIXI.Sprite(id["floor_2_4.png"]);
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

  private assignKeyboardToSprite(sprite: any) {
    this.left.sprite = this.baseChar;
    this.left.textures = this.addSpritesToDirection("left");
    this.right.sprite = this.baseChar;
    this.right.textures = this.addSpritesToDirection("right");
    this.up.sprite = this.baseChar;
    this.up.textures = this.addSpritesToDirection("back");
    this.down.sprite = this.baseChar;
    this.down.textures = this.addSpritesToDirection("front");
  }

  private addSpritesToDirection(direction: string): any[] {
    var textures = [];
    for (let i = 0; i < 8; i++) {
      var key = direction + "_walk" + i + ".png";
      let id = PIXI.loader.resources.baseCharJson.textures;
      if (id != null) {
        textures.push(id[key]);
      }
    }
    return textures;
  }

  public play(delta: number) {
    // do all the automized stuff here!!
    if (this.baseChar !== null) {
      this.baseChar.x += this.baseChar.vx;
      this.baseChar.y += this.baseChar.vy;
    }
  }
}
//main entry point
const MainInstance: Main = new Main();
