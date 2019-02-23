import * as PIXI from "pixi.js";
import { http } from "../FileTransfer/http/http";
import { Level, Tile } from "../levels/level";
import { PixiKeyboard } from "../MyKeybord/PixiKeyboard/PixiKeyboard";
import MyKeyboard from "../MyKeybord/myKeyboard";
import Key from "../MyKeybord/PixiKeyboard/Key";
import { Collision } from "../MyKeybord/Collision/collision";
import { BasicTextRect } from "../GuiElements/basicText";
import { GameStates } from "./GameState";

export class GameLoader {
  pixiLoader: PIXI.Loader;
  pixiKeyboard!: PixiKeyboard;
  counter!: number;
  myKeyboard!: MyKeyboard;
  http: http;
  moveX: number = 0;
  moveY: number = 0;
  walls: PIXI.Sprite[] = [];
  private baseChar!: PIXI.AnimatedSprite;
  public app!: PIXI.Application;
  mainTextRect!: BasicTextRect;
  interactObjects: Tile[] = [];
  listOfAllSprites: PIXI.DisplayObject[] = [];
  level!: Level;
  gameMode: GameStates = GameStates.Unknown;

  constructor() {
    this.pixiLoader = PIXI.Loader.shared;
    this.http = new http();
    this.init();
  }

  private init() {
    this.myKeyboard = new MyKeyboard(this);
    this.createMainContainer();
    this.createBasicText();
    this.createKeyboard();
    this.addBaseChar();
    this.loadLevelDataFromServer();
    this.gameMode = GameStates.Walking;
  }

  private createKeyboard() {
    this.pixiKeyboard = new PixiKeyboard();
    this.counter = 0;
    this.pixiKeyboard.keyboardManager.on("pressed", (key: number) => {
      switch (this.gameMode) {
        case GameStates.Unknown:
          return;
        case GameStates.Walking:
          this.myKeyboard.press(key);
          if (this.isDirectionKey(key)) {
            this.myKeyboard.startAnimation();
          }
          break;
        case GameStates.Menu:
          this.myKeyboard.handleMenu(key);
          break;
      }
    });

    this.pixiKeyboard.keyboardManager.on("released", (key: number) => {
      switch (this.gameMode) {
        case GameStates.Unknown:
          return;
        case GameStates.Walking:
          if (this.isDirectionKey(key)) {
            this.myKeyboard.release();
            this.myKeyboard.stopAnimation();
          }
          break;
        case GameStates.Menu:
          //this.myKeyboard.handleMenu(key);
          break;
      }
    });

    this.pixiKeyboard.keyboardManager.on("down", (key: number) => {
      this.myKeyboard.checkDownEvent(key);
    });
  }

  private isDirectionKey(key: number) {
    return (
      key === Key.LEFT ||
      key === Key.UP ||
      key === Key.DOWN ||
      key === Key.RIGHT
    );
  }

  private createBasicText(): any {
    this.mainTextRect = new BasicTextRect();
    this.app.stage.addChild(this.mainTextRect.rect);
    this.app.stage.addChild(this.mainTextRect.textContainer);
    this.mainTextRect.show();
    setTimeout(() => {
      //this.mainTextRect.hide();
      this.mainTextRect.setTexts(["test1", "test2", "test3", "test4", "test5"]);
      this.gameMode = GameStates.Menu;
    }, 1000);
  }

  private createMainContainer() {
    //Create a Pixi Application
    this.app = new PIXI.Application({
      width: 1201, // default: 800
      height: 800, // default: 600
      antialias: true, // default: false
      resolution: 1
    });
    this.app.stage.sortableChildren = true;
  }

  private getLevelData(responseData: any) {
    this.pixiLoader.add(
      "baseCharJson",
      "assets/tiles/character/main_char.json"
    );
    let levelData: Level = new Level(JSON.parse(responseData));

    levelData.tilingSprites.forEach(tilesSprite => {
      let resource = this.pixiLoader.resources[tilesSprite.fileName];
      if (!resource) {
        this.pixiLoader.add(
          tilesSprite.fileName,
          "assets/tiles/tileset/" + tilesSprite.fileName
        );
      }
    });
    this.pixiLoader.load(() => this.loadLevel(levelData));
  }

  private loadLevel(level: Level) {
    let id: any;
    this.level = level;
    level.tilingSprites.forEach(tilesSprite => {
      let resource = this.pixiLoader.resources[tilesSprite.fileName];
      if (resource) {
        id = this.pixiLoader.resources[tilesSprite.fileName].textures;
        if (id) {
          tilesSprite.tiles.forEach((tile: Tile) => {
            let floorTiles = new PIXI.TilingSprite(
              id[tile.tile],
              tile.width,
              tile.height
            );
            floorTiles.position.set(tile.position_x, tile.position_y);
            if (tile.collision) {
              this.walls.push(floorTiles);
            }
            if (tile.scale && tile.scale != 1) {
              floorTiles.scale.x = tile.scale;
              floorTiles.scale.y = tile.scale;
            }
            if (tile.interact) {
              tile.parentFileName = tilesSprite.fileName;
              tile.sprite = floorTiles;
              this.interactObjects.push(tile);
            }
            this.app.stage.addChild(floorTiles);
            this.listOfAllSprites.push(floorTiles);
            // sprites done!
          });
        }
      }
    });
    this.setup();
  }

  private addBaseChar() {
    document.body.appendChild(this.app.view);
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoDensity = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  private setup() {
    let id = this.pixiLoader.resources.baseCharJson.textures;
    if (id) {
      this.baseChar = new PIXI.AnimatedSprite([id["char_0_0.png"]]);
      this.baseChar.position.set(320, 192);
      this.baseChar.hitArea = new PIXI.Rectangle(0, 0, 32, 32);
      this.assignKeyboardToSprite(this.baseChar);
      this.app.stage.addChild(this.baseChar);
      this.app.ticker.add((delta: number) => this.gameLoop(delta));
    }
  }
  private gameLoop(delta: number) {
    this.play(delta);
  }

  private assignKeyboardToSprite(sprite: PIXI.AnimatedSprite) {
    this.myKeyboard.setSprite(sprite);
    this.myKeyboard.leftTextures = this.addSpritesToDirection(3);
    this.myKeyboard.rightTextures = this.addSpritesToDirection(1);
    this.myKeyboard.upTextures = this.addSpritesToDirection(0);
    this.myKeyboard.downTextures = this.addSpritesToDirection(2);
  }

  private addSpritesToDirection(direction: number): any[] {
    var textures = [];
    for (let i = 0; i < 3; i++) {
      var key = "char_" + direction + "_" + i + ".png";
      let id = this.pixiLoader.resources.baseCharJson.textures;
      if (id != null) {
        textures.push(id[key]);
      }
    }
    return textures;
  }

  public play(delta: number) {
    if (this.baseChar !== null) {
      let moveAllowed = true;
      for (let i = 0; i < this.walls.length; i++) {
        const wall = this.walls[i];
        if (
          Collision.hitTestRectangle(
            this.baseChar,
            wall,
            this.moveX,
            this.moveY
          )
        ) {
          //if there's a collision, change the message text
          //and tint the box red
          this.moveX = 0;
          this.moveY = 0;
          moveAllowed = false;
          break;
        }
      }
      // do all the automized stuff here!!
      if (moveAllowed) {
        this.baseChar.x += this.moveX;
        this.baseChar.y += this.moveY;
        this.pixiKeyboard.keyboardManager.update();
      }
      let collision = this.contain(
        this.baseChar,
        new PIXI.Rectangle(0, 0, 1600, 800)
      );
      switch (collision) {
        case "top":
        case "down":
        case "left":
        case "right":
          this.moveX = 0;
          this.moveY = 0;
          break;
        default:
          break;
      }
    }
  }

  private contain(sprite: PIXI.AnimatedSprite, container: PIXI.Rectangle) {
    let collision = undefined;
    let i = 0;
    //Left
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }

    //Return the `collision` value
    return collision;
  }

  public loadLevelDataFromServer() {
    this.http.requestJson("level1.json", (responseData: any) =>
      this.getLevelData(responseData)
    );
  }
}
