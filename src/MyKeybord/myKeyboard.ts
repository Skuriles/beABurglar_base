import Key from "./PixiKeyboard/Key";
import { GameLoader } from "../GameApp/GameLoader";
import { Collision } from "./Collision/collision";
import { Tile } from "../levels/level";

export default class MyKeyboard {
  sprite!: PIXI.AnimatedSprite;
  leftTextures: PIXI.Texture[] = [];
  rightTextures: PIXI.Texture[] = [];
  upTextures: PIXI.Texture[] = [];
  downTextures: PIXI.Texture[] = [];
  gameLoaderInstance: GameLoader;
  currentKey: number;
  keyPressed = false;

  constructor(main: GameLoader) {
    this.gameLoaderInstance = main;
    this.currentKey = -1;
  }

  setSprite(sprite: any) {
    this.sprite = sprite;
  }

  startAnimation() {
    switch (this.currentKey) {
      case Key.DOWN:
        this.sprite.textures = this.downTextures;
        break;
      case Key.UP:
        this.sprite.textures = this.upTextures;
        break;
      case Key.LEFT:
        this.sprite.textures = this.leftTextures;
        break;
      case Key.RIGHT:
        this.sprite.textures = this.rightTextures;
        break;
      default:
        break;
    }
    this.sprite.animationSpeed = 0.2;
    this.sprite.play();
  }

  stopAnimation() {
    this.sprite.stop();
  }

  release() {
    this.keyPressed = false;
    this.currentKey = -1;
    this.gameLoaderInstance.moveY = 0;
    this.gameLoaderInstance.moveX = 0;
  }

  public press(key: number) {
    this.keyPressed = true;
    this.currentKey = key;
    switch (key) {
      case Key.LEFT:
        this.gameLoaderInstance.moveX = -4;
        this.gameLoaderInstance.moveY = 0;
        break;
      case Key.RIGHT:
        this.gameLoaderInstance.moveX = 4;
        this.gameLoaderInstance.moveY = 0;
        break;
      case Key.UP:
        this.gameLoaderInstance.moveX = 0;
        this.gameLoaderInstance.moveY = -4;
        break;
      case Key.DOWN:
        this.gameLoaderInstance.moveX = 0;
        this.gameLoaderInstance.moveY = 4;
        break;
      case Key.ENTER:
        this.checkInteractionContainers();
    }
  }
  private checkInteractionContainers(): any {
    this.gameLoaderInstance.interactObjects.forEach((tile: Tile) => {
      if (Collision.hitTestInteraction(this.sprite, tile, 0, 0)) {
        console.log(tile.interact.name);
      }
    });
    this.gameLoaderInstance.basicText.text = "textchange";
  }

  public checkDownEvent(key: number): any {
    if (!this.keyPressed) {
      this.release();
      this.press(key);
      this.startAnimation();
    }
  }
}
