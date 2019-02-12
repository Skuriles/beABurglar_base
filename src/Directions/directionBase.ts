import Key from "../PixiKeyboard/Key";
import { Main } from "../Main";

export default class Direction {
  sprite: any;
  leftTextures: any[] = [];
  rightTextures: any[] = [];
  upTextures: any[] = [];
  downTextures: any[] = [];
  mainInstance: Main;
  currentKey: number;
  keyPressed = false;

  constructor(main: Main) {
    this.mainInstance = main;
    this.sprite = null;
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
    this.sprite.animationSpeed = 0.5;
    this.sprite.play();
  }

  stopAnimation() {
    this.sprite.stop();
  }

  release() {
    this.keyPressed = false;
    this.currentKey = -1;
    this.mainInstance.moveY = 0;
    this.mainInstance.moveX = 0;
  }

  public press(key: number) {
    this.keyPressed = true;
    this.currentKey = key;
    switch (key) {
      case Key.LEFT:
        this.mainInstance.moveX = -5;
        this.mainInstance.moveY = 0;
        break;
      case Key.RIGHT:
        this.mainInstance.moveX = 5;
        this.mainInstance.moveY = 0;
        break;
      case Key.UP:
        this.mainInstance.moveX = 0;
        this.mainInstance.moveY = -5;
        break;
      case Key.DOWN:
        this.mainInstance.moveX = 0;
        this.mainInstance.moveY = 5;
        break;
    }
  }

  public checkDownEvent(key: number): any {
    if (!this.keyPressed) {
      this.release();
      this.press(key);
      this.startAnimation();
    }
  }
}
