import Key from "./PixiKeyboard/Key";
import { GameLoader } from "../GameApp/GameLoader";
import { Collision } from "./Collision/collision";
import { Tile, TilingSprite, InteractTypes } from "../levels/level";
import { GameStates } from "../GameApp/GameState";

export default class MyKeyboard {
  sprite!: PIXI.AnimatedSprite;
  leftTextures: PIXI.Texture[] = [];
  rightTextures: PIXI.Texture[] = [];
  upTextures: PIXI.Texture[] = [];
  downTextures: PIXI.Texture[] = [];
  gameLoaderInstance: GameLoader;
  currentKey: number;
  keyPressed = false;
  direction: number = Key.DOWN;

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
        this.direction = Key.DOWN;
        this.sprite.textures = this.downTextures;
        break;
      case Key.UP:
        this.direction = Key.UP;
        this.sprite.textures = this.upTextures;
        break;
      case Key.LEFT:
        this.direction = Key.LEFT;
        this.sprite.textures = this.leftTextures;
        break;
      case Key.RIGHT:
        this.direction = Key.RIGHT;
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

  public handleMenu(key: number): any {
    this.keyPressed = true;
    this.currentKey = key;
    switch (key) {
      case Key.UP:
        this.gameLoaderInstance.mainTextRect.moveTextMarker(0);
        break;
      case Key.DOWN:
        this.gameLoaderInstance.mainTextRect.moveTextMarker(1);
        break;
      case Key.ENTER:
        this.gameLoaderInstance.handleTextSelection();
        this.gameLoaderInstance.gameMode = GameStates.Walking;
    }
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
  private checkInteractionContainers() {
    this.gameLoaderInstance.checkInteractionContainers(this.direction);
  }

  public checkDownEvent(key: number): any {
    if (!this.keyPressed) {
      this.release();
      this.press(key);
      this.startAnimation();
    }
  }
}
