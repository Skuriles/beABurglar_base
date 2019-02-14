import * as PIXI from "pixi.js";
import { PixiKeyboard } from "./PixiKeyboard/PixiKeyboard";
import Key from "./PixiKeyboard/Key";
import Direction from "./Directions/directionBase";
import { http } from "./http/http";
import { Level } from "./levels/level";
import { HitTestPosition } from "./Directions/hitTestPosition";

export class Main {
  pixiLoader: PIXI.Loader;
  pixiKeyboard: PixiKeyboard;
  counter: number;
  direction: Direction;
  moveX: number = 0;
  moveY: number = 0;
  http: http;
  walls: PIXI.Sprite[] = [];
  private baseChar!: PIXI.AnimatedSprite;
  private app!: PIXI.Application;

  constructor() {
    this.pixiLoader = PIXI.Loader.shared;
    this.http = new http();
    this.direction = new Direction(this);
    this.CreateMainContainer();
    this.pixiKeyboard = new PixiKeyboard();
    this.counter = 0;

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
    this.http.requestJson("level1.json", (responseData: any) =>
      this.getLevelData(responseData)
    );
  }

  private getLevelData(responseData: any) {
    this.pixiLoader.add("baseCharJson", "tiles/character/BODY_male.json");
    let levelData: Level = new Level(JSON.parse(responseData));

    levelData.tilingSprites.forEach(tilesSprite => {
      let resource = this.pixiLoader.resources[tilesSprite.fileName];
      if (!resource) {
        this.pixiLoader.add(
          tilesSprite.fileName,
          "tiles/wall_and_floor/" + tilesSprite.fileName
        );
      }
    });
    this.pixiLoader.load(() => this.loadLevel(levelData));
  }

  private loadLevel(level: Level) {
    let id: any;
    level.tilingSprites.forEach(tilesSprite => {
      let resource = this.pixiLoader.resources[tilesSprite.fileName];
      if (resource) {
        id = this.pixiLoader.resources[tilesSprite.fileName].textures;
        if (id) {
          tilesSprite.tiles.forEach(tile => {
            let floorTiles = new PIXI.TilingSprite(
              id[tile.tile],
              tile.width,
              tile.height
            );
            floorTiles.position.set(tile.position_x, tile.position_y);
            if (tile.collision) {
              this.walls.push(floorTiles);
            }
            this.app.stage.addChild(floorTiles);
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
      this.baseChar = new PIXI.AnimatedSprite([id["front_walk0.png"]]);
      this.baseChar.position.set(300, 100);
      this.baseChar.hitArea = new PIXI.Rectangle(5, 0, 30, 64);
      this.assignKeyboardToSprite(this.baseChar);
      this.app.stage.addChild(this.baseChar);
      this.app.ticker.add((delta: number) => this.gameLoop(delta));
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
          this.hitTestRectangle(this.baseChar, wall, this.moveX, this.moveY)
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

  private hitTestRectangle(
    r1: PIXI.AnimatedSprite,
    r2: PIXI.Sprite,
    offsetX: number,
    offsetY: number
  ) {
    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    let rec = r1.hitArea as PIXI.Rectangle;
    //hit will determine whether there's a collision
    hit = false;
    let positionsR1 = new HitTestPosition();
    let positionsR2 = new HitTestPosition();
    //Find the center points of each sprite
    positionsR1.centerX = r1.x + offsetX + r1.width / 2;
    positionsR1.centerY = r1.y + offsetY + r1.height / 2;
    positionsR2.centerX = r2.x + r2.width / 2;
    positionsR2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    positionsR1.halfWidth = rec.width / 2;
    positionsR1.halfHeight = rec.height / 2;
    positionsR2.halfWidth = r2.width / 2;
    positionsR2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = positionsR1.centerX - positionsR2.centerX;
    vy = positionsR1.centerY - positionsR2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = positionsR1.halfWidth + positionsR2.halfWidth;
    combinedHalfHeights = positionsR1.halfHeight + positionsR2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        //There's definitely a collision happening
        hit = true;
      } else {
        //There's no collision on the y axis
        hit = false;
      }
    } else {
      //There's no collision on the x axis
      hit = false;
    }
    //`hit` will be either `true` or `false`
    return hit;
  }
}
//main entry point
const MainInstance: Main = new Main();
